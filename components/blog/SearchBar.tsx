'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2, Clock, TrendingUp, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SearchBarProps {
  onClose: () => void;
}

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
}

const HOT_SEARCHES = ['人工智能', '机器人', '深度学习', '强化学习', 'ROS'];
const SEARCH_HISTORY_KEY = 'blog_search_history';

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // 加载搜索历史和热门标签
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    fetchPopularTags();
  }, []);

  // 获取热门标签
  const fetchPopularTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setPopularTags(data.slice(0, 8));
      }
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };

  // 保存搜索历史
  const saveSearchHistory = useCallback((newQuery: string) => {
    if (!newQuery.trim()) return;
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    let newHistory: string[] = history ? JSON.parse(history) : [];
    // 去重并添加到开头
    newHistory = [newQuery, ...newHistory.filter(h => h !== newQuery)].slice(0, 10);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  }, []);

  // 清除搜索历史
  const clearHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setSearchHistory([]);
  };

  // 删除单个历史记录
  const removeHistoryItem = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  // 搜索功能
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowSuggestions(true);
      return;
    }

    setShowSuggestions(false);
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
        saveSearchHistory(query);
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, saveSearchHistory]);

  // 高亮匹配文本
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-1">{part}</mark> : part
    );
  };

  return (
    <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/95">
      <div className="container mx-auto py-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章标题、内容、标签..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="mt-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">搜索中...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                找到 {results.length} 个结果
              </div>
              {results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  onClick={onClose}
                  className="block rounded-2xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400"
                >
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {highlightText(post.title, query)}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 line-clamp-1 dark:text-gray-400">
                    {highlightText(post.excerpt, query)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{post.tags.slice(0, 2).join(', ')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-5xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                没有找到相关文章
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                试试搜索其他关键词，或浏览下方热门标签
              </p>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && query.length < 2 && (
            <div className="space-y-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      搜索历史
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="group flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                      >
                        {item}
                        <X
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(item);
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hot Searches */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <TrendingUp className="h-4 w-4" />
                  热门搜索
                </div>
                <div className="flex flex-wrap gap-2">
                  {HOT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-sm text-orange-700 hover:from-orange-200 hover:to-red-200 transition-all dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Tag className="h-4 w-4" />
                    热门标签
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm text-blue-700 hover:from-blue-200 hover:to-purple-200 transition-all dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
