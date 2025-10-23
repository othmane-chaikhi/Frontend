'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsAPI } from '@/lib/api';
import { isStaff } from '@/lib/auth';
import Loading from '@/components/Loading';
import { FiFileText, FiMessageCircle, FiCheckCircle, FiClock, FiPlus, FiSettings, FiBook } from 'react-icons/fi';

interface Stats {
  total_posts: number;
  published_posts: number;
  total_comments: number;
  pending_comments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.stats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your posts, comments, Academy, and site settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Total Posts</p>
              <p className="text-3xl font-bold">{stats?.total_posts || 0}</p>
            </div>
            <FiFileText size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Published</p>
              <p className="text-3xl font-bold">{stats?.published_posts || 0}</p>
            </div>
            <FiCheckCircle size={40} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">Total Comments</p>
              <p className="text-3xl font-bold">{stats?.total_comments || 0}</p>
            </div>
            <FiMessageCircle size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 mb-1">Pending</p>
              <p className="text-3xl font-bold">{stats?.pending_comments || 0}</p>
            </div>
            <FiClock size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/posts/create"
            className="card hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition">
                <FiPlus size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Create New Post</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Write a new blog post</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/posts"
            className="card hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition">
                <FiFileText size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage Posts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Edit or delete posts</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/comments"
            className="card hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition">
                <FiMessageCircle size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage Comments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review and moderate</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="card hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition">
                <FiSettings size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage CV & settings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/academy"
            className="card hover:shadow-xl transition-all group border-2 border-transparent hover:border-yellow-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition">
                <FiBook size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Academy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage videos & exercises</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

