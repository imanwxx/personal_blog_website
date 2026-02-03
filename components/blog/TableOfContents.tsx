'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const extractHeadings = () => {
      const headings = Array.from(
        document.querySelectorAll('article h1, article h2, article h3')
      );
      const items: TocItem[] = headings.map((heading) => {
        const id = heading.id || heading.textContent?.replace(/\s+/g, '-').toLowerCase() || '';
        if (!heading.id) {
          heading.id = id;
        }
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        };
      });
      setTocItems(items);
    };

    // 延迟执行以确保内容已渲染
    setTimeout(extractHeadings, 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('article h1, article h2, article h3');
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const offsetTop = heading.getBoundingClientRect().top + window.scrollY;
        if (offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <List className="h-4 w-4" />
          目录
        </h3>
        <p className="text-sm text-gray-400">暂无目录</p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-4 sticky top-20">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <List className="h-4 w-4" />
        目录
      </h3>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-left text-sm transition-all hover:text-blue-400 ${
              activeId === item.id
                ? 'text-blue-400 font-bold'
                : 'text-gray-400'
            } ${item.level === 2 ? 'ml-0' : item.level === 3 ? 'ml-4' : 'ml-8'}`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
