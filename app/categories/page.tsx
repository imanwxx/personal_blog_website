import { getAllPosts, getAllCategories } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, Folder } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const posts = await getAllPosts();
  const categories = getAllCategories(posts);

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

          <h1 className="mb-4 flex items-center gap-3 text-4xl font-bold text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Folder className="h-6 w-6" />
            </div>
            所有分类
          </h1>

          <p className="text-lg text-gray-300">
            按分类浏览文章，找到您感兴趣的内容
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryPosts = posts.filter((post) => post.category === category);
              return (
                <Link
                  key={category}
                  href={`/categories/${category}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
                >
                  <div className="relative z-10">
                    <div className="mb-3 flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                      <Folder className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {category}
                    </h3>
                    <p className="mt-2 text-sm text-gray-300">
                      {categoryPosts.length} 篇文章
                    </p>
                  </div>

                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/50 dark:to-purple-950/50" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
            <div className="mb-4 text-6xl">📂</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              暂无分类
            </h3>
            <p className="text-gray-400">
              开始创建文章并添加分类吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
