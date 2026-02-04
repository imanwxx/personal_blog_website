import { NextRequest, NextResponse } from 'next/server';
import { getProjectContent } from '@/lib/projects';

// GET /api/projects/[id]/content - 获取项目内容
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const content = await getProjectContent(id);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('获取项目内容失败:', error);
    return NextResponse.json(
      { error: '获取项目内容失败' },
      { status: 500 }
    );
  }
}
