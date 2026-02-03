import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import Comments from '@/components/blog/Comments';
import { Star, Rocket } from 'lucide-react';
import ImageCarousel from '@/components/blog/ImageCarousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allPosts = await getAllPosts();
  const featuredPosts = allPosts.filter((post) => post.featured === true);

  return (
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

      {/* Hero Image Carousel */}
      <div className="mb-16">
        <div className="relative h-[400px] rounded-3xl overflow-hidden">
          <ImageCarousel
            items={[
              {
                id: '1',
                src: 'https://picsum.photos/seed/space/1200/400',
                alt: '太空探索',
                title: '探索宇宙的无限可能'
              },
              {
                id: '2',
                src: 'https://picsum.photos/seed/ai/1200/400',
                alt: '人工智能',
                title: '智能时代的未来'
              },
              {
                id: '3',
                src: 'https://picsum.photos/seed/robot/1200/400',
                alt: '机器人技术',
                title: '智能机器人的进化'
              }
            ]}
          />
        </div>
      </div>

      {/* All Posts Grid */}
      <div>
        <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
            <span className="text-xl">🚀</span>
          </span>
          所有文章
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
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
  );
}
