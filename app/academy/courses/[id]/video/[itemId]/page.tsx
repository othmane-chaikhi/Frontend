'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiArrowRight, FiCheckCircle, FiX
} from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';

interface VideoData {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  level_display: string;
}

interface CourseItem {
  id: number;
  order: number;
  content_type: string;
  content_data: VideoData;
}

export default function CourseVideoPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [nextItem, setNextItem] = useState<any>(null);

  useEffect(() => {
    if (params.itemId) {
      fetchItem();
    }
  }, [params.itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.courseItems.get(Number(params.itemId));
      setItem(response.data);
    } catch (err: any) {
      console.error('Error fetching item:', err);
      setError('Erreur lors du chargement de la vidéo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!item) return;

    try {
      setCompleting(true);
      const response = await academyAPI.courses.completeItem(
        params.id as string,
        item.id
      );

      setNextItem(response.data.next_item);
      setShowCompletionModal(true);
    } catch (err: any) {
      console.error('Error marking as completed:', err);
      alert('Erreur lors de la validation');
    } finally {
      setCompleting(false);
    }
  };

  const handleNext = () => {
    if (nextItem) {
      if (nextItem.content_type === 'video') {
        router.push(`/academy/courses/${params.id}/video/${nextItem.id}`);
      } else if (nextItem.content_type === 'exercise') {
        router.push(`/academy/courses/${params.id}/exercise/${nextItem.id}`);
      }
    } else {
      // Course completed
      router.push(`/academy/courses/${params.id}`);
    }
    setShowCompletionModal(false);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href={`/academy/courses/${params.id}`} className="text-primary-600 hover:underline">
            ← Retour au cours
          </Link>
        </div>
      </div>
    );
  }

  const video = item.content_data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom px-4">
        {/* Back to Course */}
        <Link
          href={`/academy/courses/${params.id}`}
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <FiArrowLeft />
          <span>Retour au cours</span>
        </Link>

        {/* Video Player */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(video.video_url)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold mb-3">
                  Vidéo • {video.duration} min
                </span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {video.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleMarkCompleted}
                disabled={completing}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiCheckCircle />
                <span>{completing ? 'Validation...' : '✓ Marquer comme vu et continuer'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX size={24} />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600 dark:text-green-400" size={40} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Excellent travail !
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {nextItem ? 
                  'Vidéo complétée ! Passez au prochain item.' : 
                  '🎉 Félicitations ! Vous avez terminé le cours !'}
              </p>

              <button
                onClick={handleNext}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>{nextItem ? 'Suivant' : 'Terminer'}</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


