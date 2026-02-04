'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, Calendar, Heart, MessageCircle } from 'lucide-react';

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

const MOODS = ['📝', '🤔', '🤖', '💡', '📚', '🌸', '🎉', '💪', '😊', '🚀'];

export default function AdminEssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);

  useEffect(() => {
    fetchEssays();
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

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇随笔吗？')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/essays?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEssays(essays.filter(e => e.id !== id));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除随笔失败:', error);
      alert('删除失败');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEssay) return;

    try {
      const token = localStorage.getItem('admin_token');
      const isNew = !essays.find(e => e.id === editingEssay.id);
      
      const response = await fetch('/api/essays', {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingEssay),
      });

      if (response.ok) {
        const savedEssay = await response.json();
        if (isNew) {
          setEssays([savedEssay, ...essays]);
        } else {
          setEssays(essays.map(e => e.id === savedEssay.id ? savedEssay : e));
        }
        setIsEditing(false);
        setEditingEssay(null);
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存随笔失败:', error);
      alert('保存失败');
    }
  };

  const startEdit = (essay?: Essay) => {
    setEditingEssay(essay || {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      likes: 0,
      comments: 0,
      mood: '📝',
    });
    setIsEditing(true);
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              返回面板
            </Link>
            <h1 className="text-3xl font-bold text-white">随笔管理</h1>
          </div>
          <button
            onClick={() => startEdit()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
            新建随笔
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && editingEssay && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                {essays.find(e => e.id === editingEssay.id) ? '编辑随笔' : '新建随笔'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
                  <input
                    type="text"
                    value={editingEssay.title}
                    onChange={(e) => setEditingEssay({ ...editingEssay, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">内容</label>
                  <textarea
                    value={editingEssay.content}
                    onChange={(e) => setEditingEssay({ ...editingEssay, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-pink-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">日期</label>
                    <input
                      type="date"
                      value={editingEssay.date}
                      onChange={(e) => setEditingEssay({ ...editingEssay, date: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">心情</label>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setEditingEssay({ ...editingEssay, mood })}
                          className={`text-2xl p-2 rounded-lg transition-all ${
                            editingEssay.mood === mood
                              ? 'bg-pink-500/30 ring-2 ring-pink-500'
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={editingEssay.tags.join(', ')}
                    onChange={(e) => setEditingEssay({ ...editingEssay, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                    placeholder="生活, 感悟, 学习"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingEssay(null);
                    }}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Essays List */}
        <div className="space-y-4">
          {essays.map((essay) => (
            <div
              key={essay.id}
              className="glass-effect rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{essay.mood}</span>
                    <h3 className="text-xl font-bold text-white">{essay.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{essay.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(essay.date).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-pink-500" />
                      {essay.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      {essay.comments}
                    </span>
                    <div className="flex gap-2">
                      {essay.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => startEdit(essay)}
                    className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(essay.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {essays.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无随笔，点击"新建随笔"添加
          </div>
        )}
      </div>
    </div>
  );
}
