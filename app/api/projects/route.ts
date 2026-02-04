import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject, updateProject, deleteProject } from '@/lib/projects';
import { verifyToken } from '@/lib/auth';

// GET /api/projects - 获取所有项目
export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('获取项目失败:', error);
    return NextResponse.json(
      { error: '获取项目失败' },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建项目（需要认证）
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
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: '标题和描述为必填项' },
        { status: 400 }
      );
    }

    const project = await createProject({
      title: data.title,
      description: data.description,
      image: data.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
      tags: data.tags || [],
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      stars: data.stars || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      featured: data.featured || false,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}

// PUT /api/projects - 更新项目（需要认证）
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
        { error: '项目ID为必填项' },
        { status: 400 }
      );
    }

    const project = await updateProject(data.id, data);
    
    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - 删除项目（需要认证）
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
        { error: '项目ID为必填项' },
        { status: 400 }
      );
    }

    const success = await deleteProject(id);
    
    if (!success) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除项目失败:', error);
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    );
  }
}
