'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare, User, Mail, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replyTo?: string;
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadComments();
    checkAuth();
  }, [postId]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.content) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          ...newComment,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment({ author: '', email: '', content: '' });
      }
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败，请重试');
    }
  };

  return (
    <div className="mt-12 relative z-10">
      {/* Header */}
      <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg glow-effect">
          <MessageSquare className="h-6 w-6" />
        </div>
        星际留言板 ({comments.length})
      </h2>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-effect card-hover rounded-2xl p-6 glow-effect"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-md">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      {comment.author}
                    </span>
                    <p className="text-sm text-gray-400">
                      {new Date(comment.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="glass-effect card-hover flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:text-red-400"
                    title="删除评论"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-effect flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-500/30 p-12 text-center">
          <div className="mb-4 float-animation text-6xl">💬</div>
          <h3 className="mb-2 text-xl font-bold text-white">
            暂无留言
          </h3>
          <p className="text-gray-400">
            成为第一个在太空中留言的人吧！
          </p>
        </div>
      )}

      {/* Comment Form */}
      <div className="mt-12 overflow-hidden rounded-3xl glass-effect glow-effect">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Send className="h-6 w-6" />
            发表留言
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="author"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
                >
                  <User className="h-4 w-4" />
                  昵称 *
                </label>
                <input
                  type="text"
                  id="author"
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500"
                  placeholder="请输入您的昵称"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
                >
                  <Mail className="h-4 w-4" />
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                  className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500"
                  placeholder="请输入您的邮箱"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
              >
                <MessageSquare className="h-4 w-4" />
                留言内容 *
              </label>
              <textarea
                id="content"
                rows={5}
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500"
                placeholder="分享您的想法..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 glow-effect"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  发送留言
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
