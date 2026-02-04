import Link from 'next/link';
import { Home as HomeIcon, User, Rocket, FileText, BookOpen, Clock, Tag, Folder, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800 bg-black/40 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">快速链接</h2>
          <p className="text-sm text-gray-400">快速访问博客的各个板块</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link href="/about" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-blue-400 transition-all">
            <User className="h-4 w-4" />
            关于我
          </Link>
          <Link href="/projects" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-purple-400 transition-all">
            <Rocket className="h-4 w-4" />
            项目
          </Link>
          <Link href="/essays" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-green-400 transition-all">
            <FileText className="h-4 w-4" />
            随笔
          </Link>
          <Link href="/posts" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-cyan-400 transition-all">
            <BookOpen className="h-4 w-4" />
            文章
          </Link>
          <Link href="/timeline" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-pink-400 transition-all">
            <Clock className="h-4 w-4" />
            时间线
          </Link>
          <Link href="/categories" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-yellow-400 transition-all">
            <Folder className="h-4 w-4" />
            分类
          </Link>
          <Link href="/tags" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-orange-400 transition-all">
            <Tag className="h-4 w-4" />
            标签
          </Link>
          <Link href="/rss.xml" target="_blank" className="glass-effect card-hover flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-red-400 transition-all">
            <Sparkles className="h-4 w-4" />
            RSS
          </Link>
        </div>

        {/* Back to Top */}
        <div className="flex justify-center mb-8">
          <a
            href="#"
            className="glass-effect card-hover flex items-center gap-2 px-6 py-3 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <HomeIcon className="h-4 w-4" />
            返回顶部
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2026 imanwxx. All rights reserved.</p>
          <p className="mt-2">
            Built with <span className="text-red-400">♥</span> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
