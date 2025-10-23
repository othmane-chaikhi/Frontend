'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsAPI } from '@/lib/api';
import { Post } from '@/lib/types';
import { isStaff } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.list();
      setPosts(response.data.results);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToast('Error loading posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await postsAPI.delete(id);
      showToast('Post deleted successfully!', 'success');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error deleting post', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manage Posts
            </h1>
            <p className="text-gray-600">
              View, edit, and delete your blog posts
            </p>
          </div>
          <Link href="/admin/posts/create" className="btn btn-primary">
            <FiPlus className="inline mr-2" />
            Create Post
          </Link>
        </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No posts yet.</p>
          <Link href="/admin/posts/create" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link
                        href={`/blog/${post.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {post.author.username}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {post.media_type || 'none'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="flex items-center space-x-1 text-green-600">
                          <FiEye size={16} />
                          <span className="text-sm">Published</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-gray-600">
                          <FiEyeOff size={16} />
                          <span className="text-sm">Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

