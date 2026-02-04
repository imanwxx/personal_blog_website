import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Tag, ArrowRight, Rocket, Star } from 'lucide-react';

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  coverImage?: string;
  featured?: boolean;
}

export default function PostCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  category,
  coverImage,
  featured = false,
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`}>
      <article className="glass-effect group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 text-sm font-semibold text-white shadow-md">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  精选
                </span>
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md glow-effect">
                <Rocket className="h-3.5 w-3.5" />
                {category}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Category Badge (when no cover image) */}
          {!coverImage && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md glow-effect">
                <Rocket className="h-3.5 w-3.5" />
                {category}
              </span>
            </div>
          )}

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400 group-hover:neon-text">
          {title}
        </h2>

        {/* Meta Info */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN })}
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <span>{tags.slice(0, 2).join(' · ')}</span>
            {tags.length > 2 && (
              <span className="text-xs text-gray-500">+{tags.length - 2}</span>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <p className="mb-4 text-gray-300 line-clamp-2">{excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 glow-effect z-10">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
      </article>
    </Link>
  );
}
