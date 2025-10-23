'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { academyAPI } from '@/lib/api';
import { FiArrowLeft, FiCheckCircle, FiClock, FiBarChart, FiLock } from 'react-icons/fi';
import Loading from '@/components/Loading';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail?: string;
  duration: number;
  level: string;
  level_display: string;
  is_active: boolean;
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/academy'); // Redirect to Academy page which will show login screen
      return;
    }
    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchVideo();
    }
  }, [params.id, isAuthenticated]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.videos.get(Number(params.id));
      setVideo(response.data);
    } catch (error: any) {
      console.error('Error fetching video:', error);
      setError('Erreur lors du chargement de la vidéo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!video) return;

    try {
      setMarking(true);
      await academyAPI.videos.markCompleted(video.id);
      setCompleted(true);
      alert('🎉 Félicitations ! Vidéo marquée comme complétée !');
    } catch (error: any) {
      console.error('Error marking video as completed:', error);
      alert('Erreur lors du marquage. Assurez-vous d\'être connecté.');
    } finally {
      setMarking(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert YouTube URL to embed format
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner') || lowerLevel.includes('débutant')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (lowerLevel.includes('intermediate') || lowerLevel.includes('intermédiaire')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    if (lowerLevel.includes('advanced') || lowerLevel.includes('avancé')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Vidéo non trouvée'}
          </h2>
          <Link href="/academy" className="text-primary-600 dark:text-primary-400 hover:underline">
            Retour à l'Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom px-4">
        {/* Back Button */}
        <Link
          href="/academy"
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <FiArrowLeft />
          <span>Retour à l'Academy</span>
        </Link>

        <div className="max-w-5xl mx-auto">
          {/* Video Player */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(video.video_url)}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">
                {video.title}
              </h1>
              <button
                onClick={handleMarkCompleted}
                disabled={marking || completed}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition ${
                  completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <FiCheckCircle />
                <span>{completed ? 'Complété !' : marking ? 'Marquage...' : 'Marquer comme complété'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(video.level_display)}`}>
                <FiBarChart className="inline mr-1" />
                {video.level_display}
              </span>
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <FiClock className="mr-2" />
                {video.duration} minutes
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <Link
                href="/academy"
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Explorer plus de vidéos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Découvrez d'autres cours dans l'Academy
                </p>
              </Link>
              <Link
                href="/academy?tab=exercises"
                className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Pratiquer avec des exercices
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mettez en pratique ce que vous avez appris
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

