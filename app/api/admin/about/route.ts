import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ABOUT_DIR = path.join(process.cwd(), 'data');
const ABOUT_FILE = path.join(ABOUT_DIR, 'about.json');

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
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    // 确保data目录存在
    try {
      await mkdir(ABOUT_DIR, { recursive: true });
    } catch (error) {
      // 目录已存在，忽略错误
    }

    // 尝试读取关于我信息
    let content = {
      name: 'imanwxx',
      bio: '分享生活，机器人，人工智能与智能驾驶技术。',
      avatarUrl: '',
      videoUrl: '',
    };

    try {
      const fileContent = await readFile(ABOUT_FILE, 'utf-8');
      content = JSON.parse(fileContent);
    } catch (error) {
      // 文件不存在，使用默认值
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('获取关于我信息失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // 确保data目录存在
    await mkdir(ABOUT_DIR, { recursive: true });

    // 保存关于我信息
    await writeFile(ABOUT_FILE, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: '保存成功'
    });
  } catch (error) {
    console.error('保存关于我信息失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}
