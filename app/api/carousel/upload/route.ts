import { NextRequest, NextResponse } from 'next/server';
import { saveCarouselImage } from '@/lib/carousel';
import { verifyToken } from '@/lib/auth';

// POST /api/carousel/upload - 上传轮播图片（需要认证）
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的图片' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '仅支持 JPG、PNG、WebP、GIF 格式的图片' },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `carousel_${timestamp}.${ext}`;

    // 保存图片
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imagePath = await saveCarouselImage(filename, buffer);

    return NextResponse.json({
      success: true,
      imagePath
    });
  } catch (error) {
    console.error('上传轮播图失败:', error);
    return NextResponse.json(
      { error: '上传轮播图失败' },
      { status: 500 }
    );
  }
}
