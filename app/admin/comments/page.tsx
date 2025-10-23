'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { commentsAPI } from '@/lib/api';
import { Comment } from '@/lib/types';
import { isStaff } from '@/lib/auth';
import { formatDateTime } from '@/lib/utils';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { FiTrash2, FiCheckCircle, FiXCircle, FiExternalLink } from 'react-icons/fi';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.list();
      setComments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      showToast('Error loading comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      await commentsAPI.toggleApproval(id);
      const newStatus = !currentStatus;
      showToast(
        newStatus ? 'Comment approved!' : 'Comment unapproved',
        newStatus ? 'success' : 'warning'
      );
      fetchComments();
    } catch (error) {
      console.error('Error toggling approval:', error);
      showToast('Error updating comment status', 'error');
    }
  };

  const handleDelete = async (id: number, authorName: string) => {
    if (!confirm(`Are you sure you want to delete comment by ${authorName}?`)) {
      return;
    }

    try {
      await commentsAPI.delete(id);
      showToast('Comment deleted successfully!', 'success');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Error deleting comment', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Comments
          </h1>
          <p className="text-gray-600">
            Review and moderate user comments
          </p>
        </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`card ${!comment.is_approved ? 'border-l-4 border-orange-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {comment.author.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(comment.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {comment.is_approved ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <Link
                  href={`/blog/${comment.post}`}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  target="_blank"
                >
                  <span>View Post #{comment.post}</span>
                  <FiExternalLink size={14} />
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleApproval(comment.id, comment.is_approved)}
                    className={`p-2 rounded-lg transition ${
                      comment.is_approved
                        ? 'text-orange-600 hover:bg-orange-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={comment.is_approved ? 'Unapprove' : 'Approve'}
                  >
                    {comment.is_approved ? (
                      <FiXCircle size={20} />
                    ) : (
                      <FiCheckCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id, comment.author.username)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

