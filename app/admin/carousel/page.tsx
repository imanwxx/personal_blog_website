'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, Edit, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';
import Link from 'next/link';
import { CarouselItem } from '@/lib/carousel';

export default function CarouselAdminPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    src: '',
    alt: '',
    title: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/carousel');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('获取轮播图失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/carousel/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        setFormData((prev) => ({ ...prev, src: result.imagePath }));
        alert('图片上传成功！');
      } else {
        const error = await response.json();
        alert(error.error || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('admin_token');
    const url = formData.id
      ? '/api/carousel'
      : '/api/carousel';

    const method = formData.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(formData.id ? '更新成功！' : '添加成功！');
        setShowForm(false);
        setFormData({ id: '', src: '', alt: '', title: '' });
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.error || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      src: item.src,
      alt: item.alt,
      title: item.title
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个轮播图吗？')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/carousel?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('删除成功！');
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.error || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ id: '', src: '', alt: '', title: '' });
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-gray-600 bg-black/40 px-4 py-2 text-gray-300 transition-all hover:border-blue-500 hover:text-white"
          >
            ← 返回首页
          </Link>

          <h1 className="mb-4 text-4xl font-bold text-white">
            轮播图管理
          </h1>

          <p className="text-lg text-gray-300">
            管理首页轮播图内容
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormData({ id: '', src: '', alt: '', title: '' });
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            添加轮播图
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 glass-effect rounded-2xl p-6 border border-gray-700">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {formData.id ? '编辑轮播图' : '添加轮播图'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-700 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="输入轮播图标题"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  描述
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-700 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="输入图片描述"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  图片URL
                </label>
                <input
                  type="text"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-700 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="/images/your-image.jpg"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  或上传新图片
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-600 bg-black/40 px-6 py-3 text-gray-300 transition-all hover:border-blue-500 hover:text-blue-400">
                    <Upload className="h-5 w-5" />
                    <span>选择图片</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span>上传中...</span>
                    </div>
                  )}
                </div>
              </div>

              {formData.src && (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    预览
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-xl border-2 border-gray-700">
                    <img
                      src={formData.src}
                      alt={formData.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105"
                >
                  <Save className="h-5 w-5" />
                  {formData.id ? '更新' : '保存'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-xl bg-gray-700 px-6 py-3 text-white font-semibold transition-all hover:bg-gray-600"
                >
                  <X className="h-5 w-5" />
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Carousel Items List */}
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item.id} className="glass-effect rounded-2xl overflow-hidden border-2 border-gray-700">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-48 md:h-auto md:w-80 flex-shrink-0">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-gray-400">
                    {item.alt}
                  </p>
                  <p className="mb-4 text-sm text-gray-500">
                    图片URL: {item.src}
                  </p>

                  <div className="mt-auto flex gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-blue-400 transition-all hover:bg-blue-500/30"
                    >
                      <Edit className="h-4 w-4" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-400 transition-all hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-600 bg-black/40 p-12 text-center">
            <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="mb-2 text-2xl font-bold text-white">
              暂无轮播图
            </h3>
            <p className="text-gray-400 mb-6">
              点击上方按钮添加第一个轮播图
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
