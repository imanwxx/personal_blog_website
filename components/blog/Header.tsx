'use client';

import Link from 'next/link';
import { Search, Home, Folder, Rocket, Settings, Clock, FolderGit2, PenTool } from 'lucide-react';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/30 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="text-white relative z-10">
              imanwxx
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden gap-1 md:flex">
            <NavLink href="/" icon={<Home className="h-4 w-4" />}>
              首页
            </NavLink>
            <NavLink href="/about" icon={<Folder className="h-4 w-4" />}>
              关于我
            </NavLink>
            <NavLink href="/timeline" icon={<Clock className="h-4 w-4" />}>
              时间线
            </NavLink>
            <NavLink href="/projects" icon={<FolderGit2 className="h-4 w-4" />}>
              项目
            </NavLink>
            <NavLink href="/essays" icon={<PenTool className="h-4 w-4" />}>
              随笔
            </NavLink>
            <NavLink href="/categories" icon={<Folder className="h-4 w-4" />}>
              分类
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
              className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all hover:text-white"
              title={isLoggedIn ? "进入管理面板" : "管理员登录"}
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="glass-effect card-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}
