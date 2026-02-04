import { NextRequest, NextResponse } from 'next/server';
import { incrementView, getViewCount, getAllViews, getPopularPosts, getTotalViews } from '@/lib/views';

// POST /api/views - 增加阅读量
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: '缺少文章slug' },
        { status: 400 }
      );
    }
    
    // 获取访客信息
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // 生成访客ID
    const crypto = require('crypto');
    const visitorId = crypto.createHash('md5').update(`${ip}-${userAgent}-${Date.now().toString().slice(0, -4)}`).digest('hex').substring(0, 16);
    
    const count = await incrementView(slug, visitorId);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('增加阅读量失败:', error);
    return NextResponse.json(
      { error: '增加阅读量失败' },
      { status: 500 }
    );
  }
}

// GET /api/views?slug=xxx - 获取阅读量
// GET /api/views?popular=true - 获取热门文章
// GET /api/views?total=true - 获取总阅读量
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const popular = searchParams.get('popular');
    const total = searchParams.get('total');
    
    if (total === 'true') {
      const count = await getTotalViews();
      return NextResponse.json({ total: count });
    }
    
    if (popular === 'true') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const posts = await getPopularPosts(limit);
      return NextResponse.json(posts);
    }
    
    if (slug) {
      const count = await getViewCount(slug);
      return NextResponse.json({ slug, count });
    }
    
    // 获取所有阅读量
    const views = await getAllViews();
    return NextResponse.json(views);
  } catch (error) {
    console.error('获取阅读量失败:', error);
    return NextResponse.json(
      { error: '获取阅读量失败' },
      { status: 500 }
    );
  }
}
