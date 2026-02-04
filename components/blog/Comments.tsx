'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Send, MessageSquare, User, Mail, Loader2, Sparkles, Trash2,
  Heart, MessageCircle, ChevronDown, ChevronUp, Bold, Italic,
  Link2, List, Quote, Code
} from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  date: string;
  replyTo?: string;
  parentId?: string;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
}

// Markdown 渲染函数
function renderMarkdown(text: string): string {
  let html = text
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/50 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-blue-300">$1</code>')
    // 粗体
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
    // 斜体
    .replace(/\*([^*]+)\*/g, '<em class="text-gray-300">$1</em>')
    // 删除线
    .replace(/~~([^~]+)~~/g, '<del class="text-gray-500">$1</del>')
    // 引用
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500/50 pl-4 my-2 text-gray-400 italic">$1</blockquote>')
    // 无序列表
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-300 list-decimal">$1</li>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    // 换行
    .replace(/\n/g, '<br />');

  return html;
}

// Markdown 工具栏按钮
function MarkdownToolbar({ onInsert }: { onInsert: (before: string, after?: string) => void }) {
  const tools = [
    { icon: Bold, label: '粗体', before: '**', after: '**' },
    { icon: Italic, label: '斜体', before: '*', after: '*' },
    { icon: Code, label: '代码', before: '`', after: '`' },
    { icon: Quote, label: '引用', before: '> ', after: '' },
    { icon: List, label: '列表', before: '- ', after: '' },
    { icon: Link2, label: '链接', before: '[', after: '](url)' },
  ];

  return (
    <div className="flex items-center gap-1 mb-2 px-1">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={() => onInsert(tool.before, tool.after)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

// 单个评论组件
function CommentItem({
  comment,
  postId,
  isLoggedIn,
  onDelete,
  onReply,
  onLike,
  likedComments,
  depth = 0
}: {
  comment: Comment;
  postId: string;
  isLoggedIn: boolean;
  onDelete: (id: string) => void;
  onReply: (parentId: string, replyTo: string) => void;
  onLike: (id: string, action: 'like' | 'unlike') => void;
  likedComments: Set<string>;
  depth?: number;
}) {
  const [showReplies, setShowReplies] = useState(true);
  const isLiked = likedComments.has(comment.id);

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="glass-effect card-hover rounded-2xl p-5 glow-effect">
        <div className="flex items-start gap-3">
          {/* 头像 */}
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-md">
            {comment.author.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {/* 头部信息 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{comment.author}</span>
                {comment.replyTo && (
                  <span className="text-sm text-gray-400">
                    回复 <span className="text-blue-400">@{comment.replyTo}</span>
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(comment.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="glass-effect card-hover flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:text-red-400"
                  title="删除评论"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* 内容 */}
            <div
              className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(comment.content) }}
            />

            {/* 操作按钮 */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => onLike(comment.id, isLiked ? 'unlike' : 'like')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isLiked
                    ? 'text-pink-400 bg-pink-500/10'
                    : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/5'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{comment.likes || 0}</span>
              </button>

              <button
                onClick={() => onReply(comment.id, comment.author)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">回复</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {depth < 2 && comment.replies.length > 3 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mb-2 ml-8"
            >
              {showReplies ? (
                <><ChevronUp className="h-4 w-4" /> 收起回复</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> 查看 {comment.replies.length} 条回复</>
              )}
            </button>
          )}

          {(showReplies || depth >= 2) && (
            <div className="space-y-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isLoggedIn={isLoggedIn}
                  onDelete={onDelete}
                  onReply={onReply}
                  onLike={onLike}
                  likedComments={likedComments}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ parentId: string; replyTo: string } | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0);

  // 计算评论总数（包括回复）
  const countComments = (list: Comment[]): number => {
    return list.reduce((count, comment) => {
      count += 1;
      if (comment.replies) {
        count += countComments(comment.replies);
      }
      return count;
    }, 0);
  };

  useEffect(() => {
    loadComments();
    checkAuth();
    // 从localStorage加载点赞状态
    const storedLikes = localStorage.getItem(`likes_${postId}`);
    if (storedLikes) {
      setLikedComments(new Set(JSON.parse(storedLikes)));
    }
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
        setTotalCount(countComments(data));
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleLike = async (commentId: string, action: 'like' | 'unlike') => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action }),
      });

      if (response.ok) {
        const { liked, likes } = await response.json();

        // 更新本地状态
        const newLikedComments = new Set(likedComments);
        if (liked) {
          newLikedComments.add(commentId);
        } else {
          newLikedComments.delete(commentId);
        }
        setLikedComments(newLikedComments);
        localStorage.setItem(`likes_${postId}`, JSON.stringify([...newLikedComments]));

        // 更新评论点赞数
        const updateLikes = (list: Comment[]): Comment[] => {
          return list.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, likes };
            }
            if (comment.replies) {
              return { ...comment, replies: updateLikes(comment.replies) };
            }
            return comment;
          });
        };
        setComments(updateLikes(comments));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleReply = (parentId: string, replyTo: string) => {
    setReplyingTo({ parentId, replyTo });
    // 滚动到表单
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
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
          parentId: replyingTo?.parentId,
          replyTo: replyingTo?.replyTo,
        }),
      });

      if (response.ok) {
        const comment = await response.json();

        // 更新本地评论列表
        if (replyingTo) {
          // 添加到回复
          const addReply = (list: Comment[]): Comment[] => {
            return list.map(c => {
              if (c.id === replyingTo.parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), comment]
                };
              }
              if (c.replies) {
                return { ...c, replies: addReply(c.replies) };
              }
              return c;
            });
          };
          setComments(addReply(comments));
        } else {
          // 新评论
          setComments([...comments, comment]);
        }

        setTotalCount(prev => prev + 1);
        setNewComment({ author: '', email: '', content: '' });
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？相关的回复也会被删除。')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // 递归删除评论及其回复
        const removeComment = (list: Comment[]): Comment[] => {
          return list.filter(c => {
            if (c.id === commentId) return false;
            if (c.replies) {
              c.replies = removeComment(c.replies);
            }
            return true;
          });
        };
        const newComments = removeComment(comments);
        setComments(newComments);
        setTotalCount(countComments(newComments));
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 插入Markdown标记
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.getElementById('comment-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newComment.content;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setNewComment(prev => ({ ...prev, content: newText }));

    // 恢复焦点和选区
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [newComment.content]);

  return (
    <div className="mt-12 relative z-10">
      {/* Header */}
      <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg glow-effect">
          <MessageSquare className="h-6 w-6" />
        </div>
        星际留言板 ({totalCount})
      </h2>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-12">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              isLoggedIn={isLoggedIn}
              onDelete={handleDeleteComment}
              onReply={handleReply}
              onLike={handleLike}
              likedComments={likedComments}
            />
          ))}
        </div>
      ) : (
        <div className="glass-effect flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-500/30 p-12 text-center mb-12">
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
      <div id="comment-form" className="overflow-hidden rounded-3xl glass-effect glow-effect">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Send className="h-6 w-6" />
            {replyingTo ? (
              <>
                回复 <span className="text-blue-400">@{replyingTo.replyTo}</span>
                <button
                  onClick={cancelReply}
                  className="ml-2 text-sm text-gray-400 hover:text-white underline"
                >
                  取消
                </button>
              </>
            ) : (
              '发表留言'
            )}
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
                htmlFor="comment-content"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300"
              >
                <MessageSquare className="h-4 w-4" />
                留言内容 *
                <span className="text-xs text-gray-500 ml-2">支持 Markdown 语法</span>
              </label>
              <MarkdownToolbar onInsert={insertMarkdown} />
              <textarea
                id="comment-content"
                rows={5}
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                className="glass-effect w-full rounded-xl border-2 border-blue-500/30 bg-black/40 px-4 py-3 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 placeholder-gray-500 font-mono text-sm"
                placeholder="分享您的想法... 支持 **粗体**、*斜体*、`代码`、> 引用 等Markdown语法"
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
                  {replyingTo ? '发送回复' : '发送留言'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
