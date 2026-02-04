'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PenTool, Calendar, Tag, Heart, MessageCircle, Loader2 } from 'lucide-react';

interface Essay {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
  mood?: string;
}

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  useEffect(() => {
    fetchEssays();
    fetchTags();
  }, []);

  const fetchEssays = async () => {
    try {
      const response = await fetch('/api/essays');
      if (response.ok) {
        const data = await response.json();
        setEssays(data);
      }
    } catch (error) {
      console.error('获取随笔失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setAllTags(data);
      }
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };

  const handleLike = async (essayId: string) => {
    try {
      const response = await fetch(`/api/essays?action=like&id=${essayId}`);
      if (response.ok) {
        const data = await response.json();
        setEssays(essays.map(e => 
          e.id === essayId ? { ...e, likes: data.likes } : e
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const filteredEssays = filter === 'all' 
    ? essays 
    : essays.filter(e => e.tags.includes(filter));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg">
              <PenTool className="h-6 w-6" />
            </div>
            随笔
          </h1>

          <p className="text-lg text-gray-300">
            记录生活、思考和灵感的点滴
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              全部
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

        {/* Essays List */}
        <div className="space-y-6">
          {filteredEssays.map((essay) => (
            <div
              key={essay.id}
              onClick={() => setSelectedEssay(essay)}
              className="group p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 hover:bg-gray-800 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{essay.mood}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                      {essay.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(essay.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-3">
                {essay.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {essay.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300 flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(essay.id);
                    }}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{essay.likes}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{essay.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEssays.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
            <div className="mb-4 text-6xl">📝</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              暂无随笔
            </h3>
            <p className="text-gray-400">
              该分类下暂无随笔
            </p>
          </div>
        )}

        {/* Essay Detail Modal */}
        {selectedEssay && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEssay(null)}
          >
            <div 
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-gray-900 border border-gray-700 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedEssay.mood}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedEssay.title}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedEssay.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEssay(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEssay.content}
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  （这里是文章的完整内容，实际应用中应该从后端获取完整的随笔内容。）
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  继续写更多的内容来展示随笔的完整形式。可以包含更多的段落、想法和感悟。
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEssay.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-pink-500/20 text-pink-300 flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>{selectedEssay.likes} 赞</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{selectedEssay.comments} 评论</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}