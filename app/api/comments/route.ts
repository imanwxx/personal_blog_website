import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

const COMMENTS_DIR = path.join(process.cwd(), 'data', 'comments');

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  return decoded.startsWith('imanwxx:');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: '缺少postId' }, { status: 400 });
  }

  try {
    // 确保评论目录存在
    await mkdir(COMMENTS_DIR, { recursive: true });

    // 读取该文章的评论文件
    const commentFile = path.join(COMMENTS_DIR, `${postId}.json`);

    let comments = [];
    try {
      const fileContent = await readFile(commentFile, 'utf-8');
      comments = JSON.parse(fileContent);
    } catch (error) {
      // 文件不存在，返回空数组
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, author, email, content } = await request.json();

    if (!postId || !author || !content) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    // 确保评论目录存在
    await mkdir(COMMENTS_DIR, { recursive: true });

    // 读取现有评论
    const commentFile = path.join(COMMENTS_DIR, `${postId}.json`);
    let comments = [];

    try {
      const fileContent = await readFile(commentFile, 'utf-8');
      comments = JSON.parse(fileContent);
    } catch (error) {
      // 文件不存在，使用空数组
    }

    // 创建新评论
    const newComment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId,
      author,
      email: email || '',
      content,
      date: new Date().toISOString(),
    };

    // 保存评论
    comments.push(newComment);
    await writeFile(commentFile, JSON.stringify(comments, null, 2), 'utf-8');

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('保存评论失败:', error);
    return NextResponse.json({ error: '保存评论失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: '缺少commentId' }, { status: 400 });
    }

    // 查找包含该评论的所有文件
    const { readdir } = await import('fs/promises');
    const files = await readdir(COMMENTS_DIR);

    // 遍历所有评论文件
    for (const fileName of files) {
      const commentFile = path.join(COMMENTS_DIR, fileName);
      try {
        const fileContent = await readFile(commentFile, 'utf-8');
        const comments = JSON.parse(fileContent);
        const filteredComments = comments.filter((c: any) => c.id !== commentId);

        if (filteredComments.length !== comments.length) {
          // 找到并删除了评论
          if (filteredComments.length === 0) {
            // 如果文件为空，删除文件
            await unlink(commentFile);
          } else {
            // 否则更新文件
            await writeFile(commentFile, JSON.stringify(filteredComments, null, 2), 'utf-8');
          }
          return NextResponse.json({ success: true });
        }
      } catch (error) {
        // 文件可能不存在或其他错误，继续查找
        continue;
      }
    }

    return NextResponse.json({ error: '评论不存在' }, { status: 404 });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 });
  }
}
