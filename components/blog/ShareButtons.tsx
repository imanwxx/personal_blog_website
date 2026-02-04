'use client';

import { Share2, Link2, Mail, MessageCircle, Twitter } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  summary?: string;
}

// 微信分享二维码组件
function WeChatShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">微信扫一扫分享</h3>
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          {/* 使用二维码API生成二维码 */}
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
            alt="微信分享二维码"
            className="w-48 h-48 mx-auto"
          />
        </div>
        <p className="text-gray-600 text-sm mb-4">打开微信扫一扫，分享给好友</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

export default function ShareButtons({ title, url, summary }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showWeChatModal, setShowWeChatModal] = useState(false);

  const shareText = summary ? `${title} - ${summary}` : title;

  const shareByEmail = () => {
    const subject = `推荐阅读：${title}`;
    const body = `我觉得这篇文章不错，推荐给你：\n\n${title}\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareToWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=500');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=500');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <>
      <div className="glass-effect rounded-xl p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
          <Share2 className="h-4 w-4" />
          分享文章
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* 微信分享 */}
          <button
            onClick={() => setShowWeChatModal(true)}
            className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-green-500 hover:bg-green-500/10"
            title="微信分享"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          
          {/* 微博分享 */}
          <button
            onClick={shareToWeibo}
            className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-red-500 hover:bg-red-500/10"
            title="分享到微博"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.402-.649.386-1.02.426-1.899.003-2.525-.793-1.17-2.966-1.109-5.419-.031 0 0-.777.34-.578-.274.381-1.205.324-2.213-.27-2.8-1.348-1.33-4.937.047-8.014 3.079C1.116 10.641 0 12.792 0 14.667c0 3.589 4.613 5.773 9.127 5.773 5.916 0 9.856-3.44 9.856-6.175 0-1.649-1.389-2.583-2.894-3.016zM21.466 6.088c-1.043-1.187-2.59-1.842-4.354-1.842-.552 0-1.001.448-1.001 1s.449 1 1.001 1c1.168 0 2.183.43 2.854 1.214.646.754.974 1.778.974 2.964 0 .552.448 1 1 1s1-.448 1-1c0-1.551-.479-2.891-1.474-4.336zm-2.774 1.638c-.437-.497-1.084-.771-1.822-.771-.551 0-1 .448-1 1s.449 1 1 1c.328 0 .593.12.777.337.176.207.269.497.269.837 0 .552.448 1 1 1s1-.448 1-1c0-.723-.222-1.356-.644-1.903z"/>
            </svg>
          </button>
          
          {/* Twitter分享 */}
          <button
            onClick={shareToTwitter}
            className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-blue-400 hover:bg-blue-400/10"
            title="分享到 Twitter"
          >
            <Twitter className="h-5 w-5" />
          </button>
          
          {/* 邮件分享 */}
          <button
            onClick={shareByEmail}
            className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-yellow-500 hover:bg-yellow-500/10"
            title="通过邮件分享"
          >
            <Mail className="h-5 w-5" />
          </button>
          
          {/* 复制链接 */}
          <button
            onClick={copyLink}
            className="glass-effect card-hover flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-all hover:text-purple-400 hover:bg-purple-400/10"
            title={copied ? "已复制" : "复制链接"}
          >
            {copied ? (
              <span className="text-xs font-bold text-green-400">✓</span>
            ) : (
              <Link2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* 微信分享弹窗 */}
      {showWeChatModal && (
        <WeChatShareModal url={url} onClose={() => setShowWeChatModal(false)} />
      )}
    </>
  );
}
