'use client';

import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X, Upload, Image as ImageIcon, Video, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Skill {
  name: string;
  category: string;
}

interface AboutData {
  name: string;
  bio: string;
  avatarUrl: string;
  videoUrl: string;
  skills?: Skill[];
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
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('前端开发');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

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
        setNewSkillName('');
        setNewSkillCategory('前端开发');
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
      setNewSkillName('');
      setNewSkillCategory('前端开发');
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
      setNewSkillName('');
      setNewSkillCategory('前端开发');
    }
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), { name: newSkillName.trim(), category: newSkillCategory }]
      });
      setNewSkillName('');
    }
  };

  const removeSkill = (index: number) => {
    setEditData({
      ...editData,
      skills: (editData.skills || []).filter((_, i) => i !== index)
    });
  };

  const skillCategories = [
    '前端开发',
    '后端开发',
    '人工智能',
    '机器人',
    '数据库',
    '工具框架',
    '其他'
  ];

  const getFilteredSkills = () => {
    if (selectedCategory === '全部') {
      return aboutData.skills || [];
    }
    return (aboutData.skills || []).filter(skill => skill.category === selectedCategory);
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
                    技能点（分类管理）
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="glass-effect rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none min-w-[140px]"
                      >
                        {skillCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="glass-effect flex-1 rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder={`输入${newSkillCategory}技能名称，按回车添加`}
                      />
                      <button
                        onClick={addSkill}
                        className="glass-effect card-hover rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold transition-all hover:scale-105"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {(editData.skills || []).length > 0 && (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {skillCategories.map(category => {
                          const categorySkills = (editData.skills || []).filter(s => s.category === category);
                          if (categorySkills.length === 0) return null;
                          return (
                            <div key={category} className="space-y-2">
                              <div className="text-sm font-semibold text-purple-400">{category}</div>
                              <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill, idx) => {
                                  const originalIndex = (editData.skills || []).findIndex(s => s.name === skill.name && s.category === skill.category);
                                  return (
                                    <div
                                      key={`${skill.name}-${skill.category}-${idx}`}
                                      className="glass-effect flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-white"
                                    >
                                      <span>{skill.name}</span>
                                      <button
                                        onClick={() => removeSkill(originalIndex)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
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

              {/* Skills Section */}
              {(aboutData.skills || []).length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-2xl font-bold text-white flex items-center gap-2">
                    <span>🎯</span> 技能专长
                  </h3>
                  <div className="glass-effect rounded-2xl p-6 border-2 border-purple-500/30">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => setSelectedCategory('全部')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === '全部'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        全部 ({(aboutData.skills || []).length})
                      </button>
                      {skillCategories.map(category => {
                        const count = (aboutData.skills || []).filter(s => s.category === category).length;
                        if (count === 0) return null;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              selectedCategory === category
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {category} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Skills Grid */}
                    {selectedCategory === '全部' ? (
                      <div className="space-y-4">
                        {skillCategories.map(category => {
                          const categorySkills = (aboutData.skills || []).filter(s => s.category === category);
                          if (categorySkills.length === 0) return null;
                          return (
                            <div key={category}>
                              <div className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                {category}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill, idx) => (
                                  <div
                                    key={`${skill.name}-${skill.category}-${idx}`}
                                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-white text-sm font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all cursor-default"
                                  >
                                    {skill.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {getFilteredSkills().map((skill, idx) => (
                          <div
                            key={`${skill.name}-${skill.category}-${idx}`}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-white text-sm font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all cursor-default"
                          >
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
