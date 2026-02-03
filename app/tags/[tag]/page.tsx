import { getAllPosts, getPostsByTag } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, Tag as TagIcon, Hash } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return {
    title: `标签: ${tag}`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = await getAllPosts();
  const tagPosts = await getPostsByTag(decodeURIComponent(tag));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/tags"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            返回标签列表
          </Link>

          <h1 className="mb-4 flex items-center gap-3 text-4xl font-bold text-gray-900 dark:text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Hash className="h-6 w-6" />
            </div>
            {decodeURIComponent(tag)}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <TagIcon className="h-4 w-4" />
            共 {tagPosts.length} 篇文章
          </div>
        </div>

        {/* Posts Grid */}
        {tagPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {tagPosts.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-6xl">📭</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              该标签下还没有文章
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              探索其他标签吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
