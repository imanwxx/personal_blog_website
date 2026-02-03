'use client';

import { Share2, Link2, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareByEmail = () => {
    const subject = `推荐阅读：${title}`;
    const body = `我觉得这篇文章不错，推荐给你：\n\n${title}\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <Share2 className="h-4 w-4" />
        分享文章
      </h3>
      <div className="flex gap-2">
        <button
          onClick={shareByEmail}
          className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-green-400"
          title="通过邮件分享"
        >
          <Mail className="h-5 w-5" />
        </button>
        <button
          onClick={copyLink}
          className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-purple-400"
          title={copied ? "已复制" : "复制链接"}
        >
          {copied ? (
            <span className="text-xs font-bold text-green-400">✓</span>
          ) : (
            <Link2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
