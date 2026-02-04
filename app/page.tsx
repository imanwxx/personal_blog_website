import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import Comments from '@/components/blog/Comments';
import { Star, Rocket, TrendingUp, BookOpen, Tag, Folder, Sparkles } from 'lucide-react';
import ImageCarousel from '@/components/blog/ImageCarousel';
import Link from 'next/link';
import { readCarouselConfigSync, CarouselItem } from '@/lib/carousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allPosts = await getAllPosts();
  const featuredPosts = allPosts.filter((post) => post.featured === true);
  const categories = getAllCategories(allPosts);
  const tags = getAllTags(allPosts);
  const carouselItems: CarouselItem[] = readCarouselConfigSync();

  // 统计数据
  const stats = {
    totalPosts: allPosts.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    featuredCount: featuredPosts.length,
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section with Space Theme */}
        <div className="mb-16 text-center relative z-10">
          <div className="mb-8 float-animation">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 backdrop-blur-lg">
              <Rocket className="h-16 w-16 text-blue-400" />
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold sm:text-6xl relative z-10 text-white">
            欢迎来到我的博客
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 relative z-10">
            探索技术宇宙的无限可能，分享创新与灵感
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen className="h-6 w-6" />} value={stats.totalPosts} label="文章总数" color="blue" />
            <StatCard icon={<Folder className="h-6 w-6" />} value={stats.totalCategories} label="分类数量" color="purple" />
            <StatCard icon={<Tag className="h-6 w-6" />} value={stats.totalTags} label="标签数量" color="pink" />
            <StatCard icon={<Sparkles className="h-6 w-6" />} value={stats.featuredCount} label="精选文章" color="yellow" />
          </div>
        </div>

        {/* Hero Image Carousel */}
        <div className="mb-16">
          <div className="relative h-[400px] rounded-3xl overflow-hidden">
            <ImageCarousel items={carouselItems} />
          </div>
        </div>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                  <Star className="h-5 w-5 text-white" />
                </span>
                精选文章
              </h2>
              <Link href="/categories" className="text-blue-400 hover:text-blue-300 transition-colors">
                查看全部 →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.slice(0, 4).map((post) => (
                <div key={post.slug} className="glass-effect card-hover rounded-2xl">
                  <PostCard
                    slug={post.slug}
                    title={post.title}
                    date={post.date}
                    excerpt={post.excerpt}
                    tags={post.tags}
                    category={post.category}
                    coverImage={post.coverImage}
                    featured
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </span>
              最新文章
            </h2>
            <Link href="/timeline" className="text-blue-400 hover:text-blue-300 transition-colors">
              时间线视图 →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.slice(0, 6).map((post) => (
              <div key={post.slug} className="glass-effect card-hover rounded-2xl">
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  tags={post.tags}
                  category={post.category}
                  coverImage={post.coverImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* All Posts Section */}
        {allPosts.length > 6 && (
          <div className="mb-16">
            <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 shadow-lg">
                <span className="text-xl">📚</span>
              </span>
              所有文章
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allPosts.slice(6).map((post) => (
                <div key={post.slug} className="glass-effect card-hover rounded-2xl">
                  <PostCard
                    slug={post.slug}
                    title={post.title}
                    date={post.date}
                    excerpt={post.excerpt}
                    tags={post.tags}
                    category={post.category}
                    coverImage={post.coverImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {allPosts.length === 0 && (
          <div className="glass-effect flex min-h-[400px] flex-col items-center justify-center rounded-2xl p-12 text-center">
            <div className="mb-4 float-animation">
              <div className="text-6xl">🌌</div>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              等待发射
            </h3>
            <p className="text-gray-400">
              快去 posts/ 目录下创建您的第一篇星际文章吧！
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 relative z-10">
          <Comments postId="home" />
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    yellow: 'from-yellow-500 to-orange-500',
  };

  return (
    <div className="glass-effect card-hover rounded-2xl p-6 text-center">
      <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} p-3 mb-3`}>
        <span className="text-white">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
