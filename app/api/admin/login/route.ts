import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = 'imanwxx';
const ADMIN_PASSWORD = '666666';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // 生成简单的token（实际生产中应使用JWT）
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
      });
    }

    return NextResponse.json(
      { error: '用户名或密码错误' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
