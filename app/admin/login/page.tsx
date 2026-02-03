'use client';

import { useState, useEffect } from 'react';
import { Lock, User as UserIcon, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (error) {
      setError('登录失败，请重试');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-effect rounded-2xl p-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Rocket className="h-8 w-8" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-bold text-white">
            管理员登录
          </h1>
          <p className="mb-8 text-center text-gray-400">
            请输入您的管理员账号
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
              >
                <UserIcon className="h-4 w-4" />
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
              >
                <Lock className="h-4 w-4" />
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
