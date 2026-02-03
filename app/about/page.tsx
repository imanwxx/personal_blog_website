'use client';

import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import AINetwork3D from '@/components/blog/AINetwork3D';

interface AboutData {
  name: string;
  bio: string;
  avatarUrl: string;
  videoUrl: string;
  skills?: string[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    name: 'imanwxx',
    bio: '分享生活，机器人，人工智能与智能驾驶技术。',
    avatarUrl: '',
    videoUrl: '',
    skills: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AboutData>({ ...aboutData });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchAbout();
    checkAuth();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
        setEditData(data);
      }
    } catch (error) {
      console.error('获取关于我信息失败:', error);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
  };

  const handleFileUpload = async (file: File, type: 'avatar' | 'video'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      throw new Error('上传失败');
    } catch (error) {
      console.error('文件上传失败:', error);
      alert('文件上传失败，请重试');
      return '';
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 本地预览
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // 上传到服务器
      const url = await handleFileUpload(file, 'avatar');
      if (url) {
        setEditData({ ...editData, avatarUrl: url });
      } else {
        alert('头像上传失败，请检查网络连接后重试');
      }
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 本地预览
      const reader = new FileReader();
      reader.onload = (e) => setVideoPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // 上传到服务器
      const url = await handleFileUpload(file, 'video');
      if (url) {
        setEditData({ ...editData, videoUrl: url });
      } else {
        alert('视频上传失败，请检查网络连接后重试');
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('请先登录');
        return;
      }
      
      // 确保技能数据正确
      const dataToSave = {
        ...editData,
        skills: editData.skills || []
      };
      
      console.log('Saving data:', dataToSave);
      
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        setAboutData(dataToSave);
        setIsEditing(false);
        setAvatarPreview('');
        setVideoPreview('');
        setNewSkill('');
        alert('保存成功');
      } else {
        const errorData = await response.json();
        alert(`保存失败: ${errorData.error || '请重试'}`);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleCancel = () => {
    try {
      setEditData({ 
        name: aboutData.name || '',
        bio: aboutData.bio || '',
        avatarUrl: aboutData.avatarUrl || '',
        videoUrl: aboutData.videoUrl || '',
        skills: aboutData.skills || []
      });
      setIsEditing(false);
      setAvatarPreview('');
      setVideoPreview('');
      setNewSkill('');
    } catch (error) {
      console.error('取消编辑时出错:', error);
      // 如果出错，重置到默认状态
      setEditData({
        name: 'imanwxx',
        bio: '分享生活，机器人，人工智能与智能驾驶技术。',
        avatarUrl: '',
        videoUrl: '',
        skills: [],
      });
      setIsEditing(false);
      setAvatarPreview('');
      setVideoPreview('');
      setNewSkill('');
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setEditData({
      ...editData,
      skills: (editData.skills || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          <X className="h-4 w-4" />
          返回首页
        </Link>

        {/* Content */}
        <div className="glass-effect overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          {isEditing ? (
            /* Edit Mode */
            <div className="p-8">
              <h2 className="mb-8 text-2xl font-bold text-white">编辑关于我</h2>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    头像
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="h-32 w-32 overflow-hidden rounded-full bg-gray-800">
                      {avatarPreview || editData.avatarUrl ? (
                        <img
                          src={avatarPreview || editData.avatarUrl}
                          alt="头像预览"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600">
                          <User className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white font-semibold shadow-md transition-all hover:scale-105">
                        <Upload className="h-5 w-5" />
                        上传头像
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-2 text-sm text-gray-400">
                        支持 JPG、PNG 等格式，建议尺寸 200x200
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    视频
                  </label>
                  <div className="space-y-4">
                    {videoPreview || editData.videoUrl ? (
                      <div className="overflow-hidden rounded-xl bg-gray-800">
                        <video
                          src={videoPreview || editData.videoUrl}
                          controls
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50">
                        <div className="text-center">
                          <Video className="mx-auto mb-2 h-12 w-12 text-gray-600" />
                          <p className="text-gray-400">暂无视频</p>
                        </div>
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white font-semibold shadow-md transition-all hover:scale-105">
                      <Upload className="h-5 w-5" />
                      上传视频
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="请输入姓名"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    简介 *
                  </label>
                  <textarea
                    rows={6}
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="请输入个人简介"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    技能点（将显示在3D神经网络中）
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="glass-effect flex-1 rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="输入技能名称，按回车添加"
                      />
                      <button
                        onClick={addSkill}
                        className="glass-effect card-hover rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105"
                      >
                        添加
                      </button>
                    </div>
                    {(editData.skills || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(editData.skills || []).map((skill, index) => (
                          <div
                            key={index}
                            className="glass-effect flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-white"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105"
                  >
                    <Save className="h-5 w-5" />
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-600 bg-transparent px-6 py-3 text-lg font-semibold text-gray-300 transition-all hover:bg-gray-800"
                  >
                    <X className="h-5 w-5" />
                    取消
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="p-8">
              {/* Header */}
              <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    {aboutData.avatarUrl ? (
                      <img
                        src={aboutData.avatarUrl}
                        alt="头像"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white">
                        <User className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="mb-2 text-4xl font-bold text-white">
                      {aboutData.name}
                    </h1>
                    <p className="text-gray-400">{aboutData.bio}</p>
                  </div>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="glass-effect card-hover flex items-center gap-2 rounded-xl px-4 py-2 text-gray-300 transition-all hover:text-white"
                    title="编辑"
                  >
                    <Edit2 className="h-5 w-5" />
                    编辑
                  </button>
                )}
              </div>

              {/* Video */}
              {aboutData.videoUrl && (
                <div className="mb-8 overflow-hidden rounded-2xl border-2 border-gray-700 bg-gray-800 shadow-xl">
                  <video
                    src={aboutData.videoUrl}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              {/* 3D AI Network Visualization */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    🧠 AI 神经网络
                  </h3>
                </div>
                <div className="glass-effect overflow-hidden rounded-3xl border-2 border-purple-500/30" style={{ height: '600px' }}>
                  <AINetwork3D skills={aboutData.skills} />
                </div>
              </div>

              {/* Skills & Interests - Neural Network Style */}
              <div className="mb-8">
                <h3 className="mb-6 text-2xl font-bold text-white">
                  🧠 技能神经网络
                </h3>
                <div className="glass-effect rounded-2xl p-6 border-2 border-purple-500/30">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* 核心技能 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        核心技能
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(aboutData.skills || []).length > 0 ? (
                          (aboutData.skills || []).map((skill, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white text-sm font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all cursor-default"
                            >
                              {skill}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">暂无技能点，请在编辑模式添加</p>
                        )}
                      </div>
                    </div>

                    {/* 技能统计 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        技能统计
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">总技能数</span>
                          <span className="text-white font-bold text-lg">{(aboutData.skills || []).length}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((aboutData.skills || []).length * 10, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          技能熟练度: {(aboutData.skills || []).length > 0 ? '初级' : '待添加'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 技能连接可视化 */}
                  {(aboutData.skills || []).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        技能关联
                      </h4>
                      <div className="relative h-32 bg-gray-800/50 rounded-xl overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 400 100">
                          {/* 连接线 */}
                          {(aboutData.skills || []).slice(0, 5).map((_, index) => {
                            const x1 = 50 + (index * 70);
                            const y1 = 50;
                            const x2 = 50 + ((index + 1) % 5 * 70);
                            const y2 = 50 + (index % 2 === 0 ? -20 : 20);
                            return (
                              <line
                                key={`line-${index}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="rgba(139, 92, 246, 0.3)"
                                strokeWidth="2"
                              />
                            );
                          })}
                          {/* 节点 */}
                          {(aboutData.skills || []).slice(0, 5).map((skill, index) => (
                            <g key={`node-${index}`}>
                              <circle
                                cx={50 + (index * 70)}
                                cy={50}
                                r="8"
                                fill="rgba(139, 92, 246, 0.8)"
                                className="animate-pulse"
                              />
                              <text
                                x={50 + (index * 70)}
                                y={75}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                              >
                                {skill.length > 6 ? skill.substring(0, 6) + '...' : skill}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                  <Mail className="h-5 w-5" />
                  联系方式
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      const email = '1064930364@qq.com';
                      try {
                        // 尝试使用现代 Clipboard API
                        if (navigator.clipboard && window.isSecureContext) {
                          await navigator.clipboard.writeText(email);
                          alert('邮箱地址已复制到剪贴板！');
                        } else {
                          // 降级方案：使用传统的复制方法
                          const textArea = document.createElement('textarea');
                          textArea.value = email;
                          textArea.style.position = 'fixed';
                          textArea.style.left = '-999999px';
                          textArea.style.top = '-999999px';
                          document.body.appendChild(textArea);
                          textArea.focus();
                          textArea.select();
                          
                          try {
                            const successful = document.execCommand('copy');
                            if (successful) {
                              alert('邮箱地址已复制到剪贴板！');
                            } else {
                              throw new Error('execCommand failed');
                            }
                          } catch (err) {
                            alert('复制失败，请手动复制邮箱地址：' + email);
                          } finally {
                            textArea.remove();
                          }
                        }
                      } catch (error) {
                        console.error('复制失败:', error);
                        alert('复制失败，请手动复制邮箱地址：' + email);
                      }
                    }}
                    className="glass-effect card-hover flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-300 transition-all hover:text-blue-400"
                    title="点击复制邮箱地址"
                  >
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span className="flex-1">1064930364@qq.com</span>
                  </button>
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
                    <User className="h-5 w-5 text-purple-400" />
                    <span className="flex-1">GitHub: github.com/imanwxx</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
