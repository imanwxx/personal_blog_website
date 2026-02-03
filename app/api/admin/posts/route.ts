import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  // 简单验证token是否包含用户名
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  return decoded.startsWith('imanwxx:');
}

async function getAllPosts() {
  const files = await readdir(POSTS_DIR);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  const posts = [];
  for (const file of markdownFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);

    posts.push({
      slug: file.replace('.md', ''),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      category: data.category,
      content: content, // 包含完整内容
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { title, excerpt, content, tags, category } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const date = new Date().toISOString().split('T')[0];

    const frontMatter = matter.stringify(content, {
      title,
      date,
      excerpt: excerpt || content.substring(0, 200),
      tags: tags || [],
      category: category || 'AI技术',
    });

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    await writeFile(filePath, frontMatter, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: '文章创建成功'
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}
