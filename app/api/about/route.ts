import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import path from 'path';

const ABOUT_DIR = path.join(process.cwd(), 'data');
const ABOUT_FILE = path.join(ABOUT_DIR, 'about.json');

export async function GET(request: NextRequest) {
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
