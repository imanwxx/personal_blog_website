'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    // 更新HTML元素的class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 更新body背景色
    document.body.style.background = newTheme === 'dark' ? '#0a0a1a' : '#ffffff';
    document.body.style.color = newTheme === 'dark' ? '#e0e0ff' : '#171717';
  };

  useEffect(() => {
    setMounted(true);
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light' | null);
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-effect" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all hover:text-white glow-effect"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
