import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { formatDate, getMediaUrl, getYouTubeEmbedUrl, truncateText } from '@/lib/utils';
import { FiCalendar, FiUser, FiMessageCircle } from 'react-icons/fi';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const mediaUrl = getMediaUrl(post.media);
  const videoEmbedUrl = getYouTubeEmbedUrl(post.video_url || '');

  return (
    <Link href={`/blog/${post.id}`} className="card group cursor-pointer h-full flex flex-col">
      {/* Media */}
      {post.media_type === 'image' && mediaUrl && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={mediaUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {post.media_type === 'video' && videoEmbedUrl && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <iframe
            src={videoEmbedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {truncateText(post.content, 150)}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <FiUser size={16} />
            <span>{post.author.username}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FiCalendar size={16} />
            <span>{formatDate(post.created_at)}</span>
          </span>
        </div>
        <span className="flex items-center space-x-1">
          <FiMessageCircle size={16} />
          <span>{post.comments_count}</span>
        </span>
      </div>
    </Link>
  );
}

