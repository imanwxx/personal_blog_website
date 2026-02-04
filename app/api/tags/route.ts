import { NextResponse } from 'next/server';
import { getAllPosts, getAllTags } from '@/lib/posts';

export async function GET() {
  try {
    const posts = await getAllPosts();
    const tags = getAllTags(posts);
    
    // 计算每个标签的文章数量并排序
    const tagCounts = tags.map(tag => {
      const count = posts.filter(post => post.tags.includes(tag)).length;
      return { tag, count };
    });
    
    // 按文章数量排序
    tagCounts.sort((a, b) => b.count - a.count);
    
    // 返回排序后的标签列表
    const sortedTags = tagCounts.map(t => t.tag);
    
    return NextResponse.json(sortedTags);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json(
      { error: '获取标签失败' },
      { status: 500 }
    );
  }
}
