import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Tag, ArrowLeft, BookOpen, Share2, Clock } from 'lucide-react';
import Link from 'next/link';
import MDXContent from '@/components/blog/MDXContent';
import Comments from '@/components/blog/Comments';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import AutonomousVehicle3D from '@/components/blog/AutonomousVehicle3D';
import 'highlight.js/styles/github-dark.css';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <article className="lg:col-span-3 overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:border-gray-800 dark:from-gray-800/50 dark:to-purple-900/20 md:p-12">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                  <BookOpen className="h-4 w-4" />
                  {post.category}
                </span>
              </div>

              <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 分钟阅读</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-gray mx-auto max-w-none p-8 dark:prose-invert md:p-12">
              <MDXContent source={post.content} />
            </div>

            {/* 3D Autonomous Vehicle for autonomous-driving post */}
            {post.slug === 'autonomous-driving' && (
              <div className="border-t border-gray-200 p-8 dark:border-gray-800">
                <div className="mb-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    🚗 自动驾驶演示
                  </h3>
                  <p className="text-gray-400">
                    实时模拟自动驾驶车辆导航与避障
                  </p>
                </div>
                <div className="glass-effect overflow-hidden rounded-2xl">
                  <AutonomousVehicle3D />
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950">
              <ShareButtons title={post.title} url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://49.232.232.252:3000'}/posts/${post.slug}`} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <TableOfContents />
            </div>
          </aside>
        </div>

        {/* Comments */}
        <Comments postId={post.slug} />
      </div>
    </div>
  );
}
