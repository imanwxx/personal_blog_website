'use client';

import Link from 'next/link';
import { Github, Mail, Heart, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('1064930364@qq.com');
      setCopied(true);
      alert('邮箱地址已复制到剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  };
  return (
    <footer className="mt-auto border-t border-blue-500/30 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white glow-effect">
                <Sparkles className="h-4 w-4" />
              </div>
              关于博客
            </h3>
            <p className="text-gray-400">
              分享生活，机器人，人工智能与智能驾驶技术。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              快速链接
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-400 transition-colors hover:text-blue-400 hover:neon-text"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-gray-400 transition-colors hover:text-purple-400 hover:neon-text"
                >
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 text-gray-400 transition-colors hover:text-pink-400 hover:neon-text"
                >
                  <div className="h-2 w-2 rounded-full bg-pink-500" />
                  分类
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              联系方式
            </h3>
            <p className="mb-4 text-gray-400">
              如有任何问题或建议，欢迎通过以下方式联系我。
            </p>
            <div className="flex gap-3">
              <button
                onClick={copyEmail}
                className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all hover:text-white glow-effect relative"
                title={copied ? "已复制邮箱" : "复制邮箱"}
              >
                <Mail className="h-5 w-5" />
                {copied && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                    ✓
                  </span>
                )}
              </button>
              <a
                href="https://github.com/imanwxx"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all hover:text-white glow-effect"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-blue-500/30 pt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-gray-400">
            Made with <Heart className="h-4 w-4 fill-purple-500 text-purple-500 pulse-animation" /> by imanwxx
          </p>
          <p className="mt-2 text-sm text-gray-500">
            © 2026 imanwxx. 探索无限可能.
          </p>
        </div>
      </div>
    </footer>
  );
}
