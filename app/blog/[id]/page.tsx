'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { postsAPI, commentsAPI } from '@/lib/api';
import { Post, Comment } from '@/lib/types';
import Loading from '@/components/Loading';
import { formatDate, formatRelativeTime, getMediaUrl, getYouTubeEmbedUrl } from '@/lib/utils';
import { isAuthenticated, getUser } from '@/lib/auth';
import { FiCalendar, FiUser, FiMessageCircle } from 'react-icons/fi';
import SEOHead from '@/components/SEOHead';
import { generateMetadata } from '@/lib/seo';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.get(parseInt(params.id));
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      router.push('/login');
      return;
    }

    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      await commentsAPI.create({
        post: parseInt(params.id),
        content: commentContent,
      });
      
      setCommentContent('');
      fetchPost(); // Refresh to show new comment
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return null;
  }

  const mediaUrl = getMediaUrl(post.media);
  const videoEmbedUrl = getYouTubeEmbedUrl(post.video_url || '');

  return (
    <div className="container-custom py-12">
      {post && (
        <SEOHead
          title={post.title}
          description={post.content.substring(0, 160)}
          url={`/blog/${post.id}`}
          image={post.media || undefined}
          publishedTime={post.created_at}
          modifiedTime={post.updated_at}
          author="Othmane Chaikhi"
          tags={[]}
          breadcrumbs={[
            { name: 'Accueil', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.id}` }
          ]}
        />
      )}
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-600">
            <span className="flex items-center space-x-2">
              <FiUser />
              <span>{post.author.username}</span>
            </span>
            <span className="flex items-center space-x-2">
              <FiCalendar />
              <span>{formatDate(post.created_at)}</span>
            </span>
            <span className="flex items-center space-x-2">
              <FiMessageCircle />
              <span>{post.comments_count} Comments</span>
            </span>
          </div>
        </div>

        {/* Media */}
        {post.media_type === 'image' && mediaUrl && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={mediaUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {post.media_type === 'video' && videoEmbedUrl && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <iframe
              src={videoEmbedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Comments ({post.comments_count})
          </h2>

          {/* Comment Form */}
          {authenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-12">
              <div className="mb-4">
                <label className="label">Add a comment</label>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write your comment..."
                  rows={4}
                  className="input"
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-12 p-6 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                Please login to leave a comment
              </p>
              <button
                onClick={() => router.push('/login')}
                className="btn btn-primary"
              >
                Login
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {comment.author.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.author.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatRelativeTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

