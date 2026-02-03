import { getAllPosts, getAllTags } from '@/lib/posts';
import Link from 'next/link';
import { Tag as TagIcon, ArrowLeft, Hash } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          <h1 className="mb-4 flex items-center gap-3 text-4xl font-bold text-gray-900 dark:text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <TagIcon className="h-6 w-6" />
            </div>
            所有标签
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            浏览所有标签，发现您感兴趣的内容
          </p>
        </div>

        {/* Tags Grid */}
        {tags.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => {
              const tagPosts = posts.filter((post) => post.tags.includes(tag));
              return (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
                >
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                        <Hash className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tag}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tagPosts.length} 篇文章
                    </p>
                  </div>

                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/50 dark:to-purple-950/50" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-6xl">🏷️</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              暂无标签
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              开始创建文章并添加标签吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
