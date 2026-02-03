import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  return decoded.startsWith('imanwxx:');
}

export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    await mkdir(uploadDir, { recursive: true });

    // 生成文件名
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const fileName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    await writeFile(filePath, buffer);

    // 返回文件URL
    const url = `/uploads/${type}/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
