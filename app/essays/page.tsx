'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PenTool, Calendar, Tag, Heart, MessageCircle } from 'lucide-react';

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

const essays: Essay[] = [
  {
    id: '1',
    title: '关于深度学习的思考',
    content: '最近在学习深度学习的过程中，有一些感悟想记录下来。神经网络就像是我们大脑的一个缩影，每一层都在提取不同层次的特征...',
    date: '2026-02-01',
    tags: ['深度学习', 'AI', '思考'],
    likes: 23,
    comments: 5,
    mood: '🤔',
  },
  {
    id: '2',
    title: '周末的机器人实验',
    content: '这个周末花了整整两天时间在实验室调试机器人。虽然遇到了很多问题，但看到机器人终于能稳定行走的那一刻，所有的辛苦都值得了...',
    date: '2026-01-25',
    tags: ['机器人', '实验', '周末'],
    likes: 45,
    comments: 12,
    mood: '🤖',
  },
  {
    id: '3',
    title: '新项目的构想',
    content: '昨晚失眠，脑海中突然冒出一个新项目的想法。想要做一个结合强化学习和计算机视觉的智能系统，可以自动识别并操作物体...',
    date: '2026-01-18',
    tags: ['项目', '创意', 'RL'],
    likes: 38,
    comments: 8,
    mood: '💡',
  },
  {
    id: '4',
    title: '读《机器人学导论》有感',
    content: '终于读完了这本经典教材。书中对运动学和动力学的讲解非常清晰，特别是关于雅可比矩阵的部分，让我对机器人的控制有了更深的理解...',
    date: '2026-01-10',
    tags: ['读书', '机器人学', '学习'],
    likes: 52,
    comments: 15,
    mood: '📚',
  },
  {
    id: '5',
    title: '生活中的小确幸',
    content: '今天天气很好，下午在校园里散步，看到樱花开了。突然意识到，在忙碌的学习和研究之余，也要学会享受生活的美好...',
    date: '2026-01-05',
    tags: ['生活', '感悟', '樱花'],
    likes: 67,
    comments: 20,
    mood: '🌸',
  },
];

const allTags = Array.from(new Set(essays.flatMap(e => e.tags)));

export default function EssaysPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  const filteredEssays = filter === 'all' 
    ? essays 
    : essays.filter(e => e.tags.includes(filter));

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
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{essay.likes}</span>
                  </div>
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