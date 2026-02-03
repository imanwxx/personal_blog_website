'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, LogOut, Rocket, FileText, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  featured?: boolean;
  content?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/posts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const handleCreate = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      category: 'AI技术',
      featured: false,
    });
    setIsEditing(true);
  };

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        const data = await response.json();
        alert(data.error || '删除失败，请重试');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除失败，请重试');
    }
  };

  const toggleFeatured = async (post: Post) => {
    try {
      const token = localStorage.getItem('admin_token');
      const updatedPost = { ...post, featured: !post.featured };
      const response = await fetch(`/api/admin/posts/${post.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    }
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.content) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const isUpdate = currentPost.slug;
      const url = isUpdate ? `/api/admin/posts/${currentPost.slug}` : '/api/admin/posts';
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(currentPost),
      });

      if (response.ok) {
        await fetchPosts();
        setIsEditing(false);
        setCurrentPost({});
      } else {
        const data = await response.json();
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存失败，请重试');
    }
  };

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {currentPost.slug ? '编辑文章' : '创建新文章'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  标题 *
                </label>
                <input
                  type="text"
                  value={currentPost.title || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="请输入文章标题"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  摘要
                </label>
                <textarea
                  rows={3}
                  value={currentPost.excerpt || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="请输入文章摘要"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    分类
                  </label>
                  <input
                    type="text"
                    value={currentPost.category || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                    className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="文章分类"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={currentPost.tags?.join(', ') || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                    className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="标签1, 标签2, 标签3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  内容 *（支持Markdown）
                </label>
                <textarea
                  rows={20}
                  value={currentPost.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="请输入文章内容，支持Markdown格式"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105"
                >
                  <Rocket className="h-5 w-5" />
                  {currentPost.slug ? '更新文章' : '创建文章'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentPost({});
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-600 bg-transparent px-6 py-3 text-lg font-semibold text-gray-300 transition-all hover:bg-gray-800"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <Rocket className="h-8 w-8" />
            管理员面板
          </h1>
          <p className="mt-2 text-gray-400">
            管理您的博客文章
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            创建文章
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border-2 border-red-500/50 bg-transparent px-6 py-3 text-red-400 font-semibold transition-all hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            退出登录
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-effect flex flex-col items-center justify-center rounded-2xl p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-gray-500" />
            <h3 className="mb-2 text-2xl font-bold text-white">
              暂无文章
            </h3>
            <p className="text-gray-400">
              点击"创建文章"按钮开始您的创作之旅
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.slug} className="glass-effect card-hover rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-white">
                      {post.title}
                    </h3>
                    <button
                      onClick={() => toggleFeatured(post)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold transition-all ${
                        post.featured
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                      title={post.featured ? '取消精选' : '设为精选'}
                    >
                      <Star className={`h-4 w-4 ${post.featured ? 'fill-current' : ''}`} />
                      {post.featured ? '已精选' : '设为精选'}
                    </button>
                  </div>
                  <p className="mb-3 text-sm text-gray-400">
                    {post.date} · {post.category}
                  </p>
                  <p className="mb-3 text-gray-300 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 transition-all hover:bg-blue-500/30"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 transition-all hover:bg-red-500/30"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
