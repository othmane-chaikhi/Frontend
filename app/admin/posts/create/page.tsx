'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI } from '@/lib/api';
import { isStaff } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { FiImage, FiVideo, FiSave } from 'react-icons/fi';

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: '',
    is_published: true,
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
      setFormData({ ...formData, video_url: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title || !formData.content) {
      setErrors({ general: 'Title and content are required' });
      return;
    }

    if (!mediaFile && !formData.video_url) {
      setErrors({ general: 'Please provide either an image or a video URL' });
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('is_published', formData.is_published.toString());
      
      if (mediaFile) {
        data.append('media', mediaFile);
      } else if (formData.video_url) {
        data.append('video_url', formData.video_url);
      }

      await postsAPI.create(data);
      showToast('Post created successfully!', 'success');
      setTimeout(() => router.push('/admin/posts'), 1500);
    } catch (err: any) {
      console.error('Error creating post:', err);
      setErrors(err.response?.data || { general: 'Error creating post' });
      showToast('Error creating post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Create New Post
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
              disabled={loading}
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
              disabled={loading}
            />
            {errors.content && <p className="error-message">{errors.content}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label flex items-center space-x-2">
                <FiImage />
                <span>Image Upload</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input"
                disabled={loading || !!formData.video_url}
              />
              {mediaFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {mediaFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="label flex items-center space-x-2">
                <FiVideo />
                <span>YouTube Video URL</span>
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="input"
                placeholder="https://youtube.com/watch?v=..."
                disabled={loading || !!mediaFile}
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
              disabled={loading}
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="inline mr-2" />
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={loading}
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

