'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI } from '@/lib/api';
import { Post } from '@/lib/types';
import { isStaff } from '@/lib/auth';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { FiSave } from 'react-icons/fi';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: PageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: '',
    is_published: true,
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.get(parseInt(params.id));
      const postData = response.data;
      setPost(postData);
      setFormData({
        title: postData.title,
        content: postData.content,
        video_url: postData.video_url || '',
        is_published: postData.is_published,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title || !formData.content) {
      setErrors({ general: 'Title and content are required' });
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('is_published', formData.is_published.toString());
      
      if (mediaFile) {
        data.append('media', mediaFile);
      } else if (formData.video_url) {
        data.append('video_url', formData.video_url);
      }

      await postsAPI.update(parseInt(params.id), data);
      showToast('Post updated successfully!', 'success');
      setTimeout(() => router.push('/admin/posts'), 1500);
    } catch (err: any) {
      console.error('Error updating post:', err);
      setErrors(err.response?.data || { general: 'Error updating post' });
      showToast('Error updating post', 'error');
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

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Edit Post
          </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <label className="label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter post title"
              disabled={submitting}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="input"
              placeholder="Write your post content..."
              disabled={submitting}
            />
            {errors.content && <p className="error-message">{errors.content}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Update Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input"
                disabled={submitting}
              />
              {mediaFile && (
                <p className="text-sm text-green-600 mt-1">
                  New file selected: {mediaFile.name}
                </p>
              )}
              {!mediaFile && post.media && (
                <p className="text-sm text-gray-600 mt-1">
                  Current: {post.media.split('/').pop()}
                </p>
              )}
            </div>

            <div>
              <label className="label">YouTube Video URL</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="input"
                placeholder="https://youtube.com/watch?v=..."
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              disabled={submitting}
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="inline mr-2" />
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

