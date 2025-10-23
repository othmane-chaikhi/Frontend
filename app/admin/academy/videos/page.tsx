'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiVideo, FiEye, FiEyeOff } from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  level: string;
  level_display: string;
  duration: number;
  order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.videos.list();
      // Handle both array and paginated response
      const videosData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Erreur lors du chargement des vidéos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${title}" ?`)) {
      return;
    }

    try {
      setDeleting(id);
      await academyAPI.videos.delete(id);
      alert('Vidéo supprimée avec succès !');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (video: Video) => {
    try {
      await academyAPI.videos.update(video.id, {
        is_active: !video.is_active
      });
      alert(`Vidéo ${video.is_active ? 'désactivée' : 'activée'} !`);
      fetchVideos();
    } catch (error) {
      console.error('Error toggling video:', error);
      alert('Erreur lors de la modification');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Vidéos
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gérez toutes les vidéos de l'Academy
            </p>
          </div>
          <Link
            href="/admin/academy/videos/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            Nouvelle Vidéo
          </Link>
        </div>

        {/* Videos List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ordre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <FiVideo className="mx-auto h-12 w-12 mb-4" />
                      <p>Aucune vidéo trouvée</p>
                      <Link
                        href="/admin/academy/videos/create"
                        className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                      >
                        <FiPlus size={16} />
                        Créer votre première vidéo
                      </Link>
                    </td>
                  </tr>
                ) : (
                  videos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        #{video.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FiVideo className="text-red-600" size={20} />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {video.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                              {video.description.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          video.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {video.level_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {video.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(video)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            video.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {video.is_active ? (
                            <span className="flex items-center gap-1">
                              <FiEye size={12} /> Actif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FiEyeOff size={12} /> Inactif
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/academy/videos/${video.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            title="Modifier"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(video.id, video.title)}
                            disabled={deleting === video.id}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href="/admin/academy"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Retour au Dashboard Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
