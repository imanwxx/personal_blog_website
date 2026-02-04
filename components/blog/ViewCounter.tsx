'use client';

import { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  showLabel?: boolean;
  className?: string;
}

export default function ViewCounter({ slug, showLabel = true, className = '' }: ViewCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取阅读量
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error('获取阅读量失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 增加阅读量（只在客户端执行一次）
    const incrementViews = async () => {
      try {
        // 检查是否已经记录过（使用sessionStorage）
        const viewedKey = `viewed_${slug}`;
        if (sessionStorage.getItem(viewedKey)) {
          return;
        }
        
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
          // 标记已阅读
          sessionStorage.setItem(viewedKey, 'true');
        }
      } catch (error) {
        console.error('增加阅读量失败:', error);
      }
    };

    fetchViews();
    incrementViews();
  }, [slug]);

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {showLabel && <span className="text-sm">...</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
      <Eye className="h-4 w-4" />
      {showLabel && <span className="text-sm">{formatNumber(count)} 阅读</span>}
      {!showLabel && <span className="text-sm">{formatNumber(count)}</span>}
    </div>
  );
}

// 阅读量显示组件（用于文章列表）
export function ViewCount({ slug, className = '' }: { slug: string; className?: string }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error('获取阅读量失败:', error);
      }
    };

    fetchViews();
  }, [slug]);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <Eye className="h-3 w-3" />
      {formatNumber(count)}
    </span>
  );
}
