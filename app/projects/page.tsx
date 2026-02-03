'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderGit2, ExternalLink, Github, Star, Calendar } from 'lucide-react';
import Image from 'next/image';

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

const projects: Project[] = [
  {
    id: '1',
    title: '个人博客系统',
    description: '基于 Next.js 和 Tailwind CSS 构建的现代化个人博客系统，支持 Markdown 文章、评论系统、管理员后台等功能。',
    image: 'https://picsum.photos/seed/blog/800/400',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    githubUrl: 'https://github.com/imanwxx/personal_blog_website',
    stars: 42,
    date: '2026-01-15',
    featured: true,
  },
  {
    id: '2',
    title: '机器人控制系统',
    description: '使用 ROS2 和 Python 开发的机器人控制系统，支持路径规划、SLAM 建图和自主导航功能。',
    image: 'https://picsum.photos/seed/robot/800/400',
    tags: ['ROS2', 'Python', 'C++', 'SLAM'],
    githubUrl: 'https://github.com/imanwxx/robot-control',
    stars: 28,
    date: '2025-11-20',
  },
  {
    id: '3',
    title: '强化学习仿真环境',
    description: '基于 Isaac Gym 和 PyTorch 的强化学习训练环境，用于四足机器人的运动控制学习。',
    image: 'https://picsum.photos/seed/rl/800/400',
    tags: ['PyTorch', 'Isaac Gym', 'RL', 'MuJoCo'],
    githubUrl: 'https://github.com/imanwxx/rl-sim',
    stars: 35,
    date: '2025-09-10',
    featured: true,
  },
  {
    id: '4',
    title: '3D CAD 设计工具',
    description: '基于 WebGL 的在线 3D CAD 设计工具，支持基础建模、装配和渲染功能。',
    image: 'https://picsum.photos/seed/cad/800/400',
    tags: ['Three.js', 'WebGL', 'TypeScript', 'CAD'],
    demoUrl: 'https://cad-demo.example.com',
    date: '2025-07-05',
  },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.tags.includes(filter));

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
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
              <FolderGit2 className="h-6 w-6" />
            </div>
            项目展示
          </h1>

          <p className="text-lg text-gray-300">
            探索我的开源项目和技术实践
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              精选项目
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'featured'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              精选
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tag
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
            <div className="mb-4 text-6xl">📁</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              暂无项目
            </h3>
            <p className="text-gray-400">
              该分类下暂无项目
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 hover:border-blue-500/50 transition-all ${featured ? 'ring-2 ring-yellow-500/30' : ''}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        {project.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/90 text-white text-sm font-medium">
            <Star className="h-4 w-4" />
            精选
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          {project.stars && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{project.stars}</span>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="h-4 w-4" />
            {new Date(project.date).toLocaleDateString('zh-CN')}
          </div>
          
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}