'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Star, Share2 } from 'lucide-react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  date: string;
  featured?: boolean;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const projects: Project[] = await response.json();
        console.log('Projects loaded:', projects);
        console.log('Looking for project with id:', params.id);
        const found = projects.find(p => p.id === params.id);
        console.log('Found project:', found);
        setProject(found || null);

        // 获取项目内容
        if (found) {
          const contentResponse = await fetch(`/api/projects/${params.id}/content`);
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            setContent(contentData.content || null);
          }
        }
      } else {
        console.error('API response not OK:', response.status);
      }
    } catch (error) {
      console.error('获取项目详情失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="mb-2 text-2xl font-bold text-white">项目未找到</h3>
          <p className="text-gray-400 mb-6">该项目可能已被删除或ID不存在</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-gray-600 bg-black/40 px-4 py-2 text-gray-300 transition-all hover:border-blue-500 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回项目列表
        </Link>

        {/* Project Header */}
        <div className="glass-effect rounded-3xl overflow-hidden border-2 border-gray-700">
          {/* Image */}
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
            {project.featured && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/90 text-white font-medium backdrop-blur-sm">
                <Star className="h-5 w-5 fill-current" />
                精选项目
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="mb-4 text-4xl font-bold text-white">{project.title}</h1>

            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(project.date).toLocaleDateString('zh-CN')}</span>
              </div>
              {project.stars && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{project.stars}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-bold text-white">项目简介</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-bold text-white flex items-center gap-2">
                <Tag className="h-5 w-5" />
                技术栈
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-700">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-3 text-white font-semibold transition-all hover:scale-105 hover:from-gray-600 hover:to-gray-700"
                >
                  <Github className="h-5 w-5" />
                  查看源码
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  <ExternalLink className="h-5 w-5" />
                  在线演示
                </a>
              )}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: project.title,
                      text: project.description,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('链接已复制到剪贴板！');
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3 text-gray-300 font-semibold transition-all hover:bg-gray-700 hover:text-white"
              >
                <Share2 className="h-5 w-5" />
                分享
              </button>
            </div>
          </div>
        </div>

        {/* Project Detail Content (Markdown) */}
        {content && (
          <div className="mt-12">
            <div className="glass-effect rounded-3xl p-8 border-2 border-gray-700">
              <h2 className="mb-8 text-3xl font-bold text-white">详细介绍</h2>
              <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-purple-400 prose-pre:bg-gray-800 prose-border:border-gray-700">
                <MDXRemote
                  source={content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeHighlight, rehypeSlug],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Related Projects */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">推荐项目</h2>
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="px-6 py-3 rounded-full bg-gray-800 text-gray-300 font-medium transition-all hover:bg-gray-700 hover:text-white"
            >
              查看全部项目
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
