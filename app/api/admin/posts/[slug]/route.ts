import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  return decoded.startsWith('imanwxx:');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);

    return NextResponse.json({
      slug: slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      category: data.category,
      featured: data.featured || false,
      content: content,
    });
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json({ error: '文章不存在' }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { title, excerpt, content, tags, category, featured } = await request.json();
    const { slug } = await params;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const frontMatter = matter.stringify(content, {
      title,
      date: new Date().toISOString().split('T')[0], // 更新日期
      excerpt: excerpt || content.substring(0, 200),
      tags: tags || [],
      category: category || 'AI技术',
      featured: featured || false,
    });

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    await writeFile(filePath, frontMatter, 'utf-8');

    return NextResponse.json({
      success: true,
      message: '文章更新成功'
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}
