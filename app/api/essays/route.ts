import { NextRequest, NextResponse } from 'next/server';
import { getAllEssays, createEssay, updateEssay, deleteEssay, likeEssay } from '@/lib/essays';
import { verifyToken } from '@/lib/auth';

// GET /api/essays - 获取所有随笔
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    
    // 点赞操作
    if (action === 'like' && id) {
      const likes = await likeEssay(id);
      return NextResponse.json({ likes });
    }
    
    const essays = await getAllEssays();
    return NextResponse.json(essays);
  } catch (error) {
    console.error('获取随笔失败:', error);
    return NextResponse.json(
      { error: '获取随笔失败' },
      { status: 500 }
    );
  }
}

// POST /api/essays - 创建随笔（需要认证）
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
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: '标题和内容为必填项' },
        { status: 400 }
      );
    }

    const essay = await createEssay({
      title: data.title,
      content: data.content,
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      mood: data.mood || '📝',
    });

    return NextResponse.json(essay, { status: 201 });
  } catch (error) {
    console.error('创建随笔失败:', error);
    return NextResponse.json(
      { error: '创建随笔失败' },
      { status: 500 }
    );
  }
}

// PUT /api/essays - 更新随笔（需要认证）
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
        { error: '随笔ID为必填项' },
        { status: 400 }
      );
    }

    const essay = await updateEssay(data.id, data);
    
    if (!essay) {
      return NextResponse.json(
        { error: '随笔不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(essay);
  } catch (error) {
    console.error('更新随笔失败:', error);
    return NextResponse.json(
      { error: '更新随笔失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/essays - 删除随笔（需要认证）
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
        { error: '随笔ID为必填项' },
        { status: 400 }
      );
    }

    const success = await deleteEssay(id);
    
    if (!success) {
      return NextResponse.json(
        { error: '随笔不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除随笔失败:', error);
    return NextResponse.json(
      { error: '删除随笔失败' },
      { status: 500 }
    );
  }
}
