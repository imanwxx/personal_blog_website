import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Flag } from 'lucide-react';
import MilestoneMarker, { sampleMilestones } from '@/components/blog/MilestoneMarker';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const posts = await getAllPosts();
  
  // 按年份分组
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof posts>);

  // 按年份降序排序
  const sortedYears = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

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
              <Clock className="h-6 w-6" />
            </div>
            时间线
          </h1>

          <p className="text-lg text-gray-300">
            按时间顺序浏览所有文章，回顾成长历程
          </p>
        </div>

        {/* Milestones Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Flag className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">里程碑</h2>
          </div>
          <MilestoneMarker milestones={sampleMilestones} />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

          {sortedYears.map((year) => (
            <div key={year} className="mb-12">
              {/* Year Marker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl shadow-lg z-10">
                  {year}
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>

              {/* Posts for this year */}
              <div className="space-y-4 ml-8">
                {postsByYear[year].map((post) => {
                  const date = new Date(post.date);
                  const month = date.toLocaleDateString('zh-CN', { month: 'short' });
                  const day = date.getDate();

                  return (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 transition-all"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 shrink-0">
                        <span className="text-xs text-gray-400">{month}</span>
                        <span className="text-lg font-bold text-white">{day}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-blue-400">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {sortedYears.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                暂无文章
              </h3>
              <p className="text-gray-400">
                开始创建您的第一篇文章吧！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}