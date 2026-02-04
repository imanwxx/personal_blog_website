import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCarouselItems,
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem
} from '@/lib/carousel';
import { verifyToken } from '@/lib/auth';

// GET /api/carousel - 获取所有轮播图
export async function GET() {
  try {
    const items = await getAllCarouselItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('获取轮播图失败:', error);
    return NextResponse.json(
      { error: '获取轮播图失败' },
      { status: 500 }
    );
  }
}

// POST /api/carousel - 添加轮播图（需要认证）
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

    const data = await request.json();

    // 验证必填字段
    if (!data.title || !data.alt || !data.src) {
      return NextResponse.json(
        { error: '标题、描述和图片URL为必填项' },
        { status: 400 }
      );
    }

    const item = await addCarouselItem({
      src: data.src,
      alt: data.alt,
      title: data.title
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('添加轮播图失败:', error);
    return NextResponse.json(
      { error: '添加轮播图失败' },
      { status: 500 }
    );
  }
}

// PUT /api/carousel - 更新轮播图（需要认证）
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: '轮播图ID为必填项' },
        { status: 400 }
      );
    }

    const item = await updateCarouselItem(data.id, data);

    if (!item) {
      return NextResponse.json(
        { error: '轮播图不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('更新轮播图失败:', error);
    return NextResponse.json(
      { error: '更新轮播图失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/carousel - 删除轮播图（需要认证）
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '轮播图ID为必填项' },
        { status: 400 }
      );
    }

    const success = await deleteCarouselItem(id);

    if (!success) {
      return NextResponse.json(
        { error: '轮播图不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除轮播图失败:', error);
    return NextResponse.json(
      { error: '删除轮播图失败' },
      { status: 500 }
    );
  }
}
