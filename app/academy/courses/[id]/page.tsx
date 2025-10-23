'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiCheckCircle, FiClock, FiVideo, FiCode, FiPlay,
  FiArrowRight, FiAward, FiTarget
} from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';

interface CourseItem {
  id: number;
  order: number;
  content_type: 'video' | 'exercise';
  is_required: boolean;
  content_title: string;
  content_description: string;
  content_data: any;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  level: string;
  level_display: string;
  items: CourseItem[];
  items_count: number;
  videos_count: number;
  exercises_count: number;
  user_progress?: {
    is_started: boolean;
    is_completed: boolean;
    completion_percentage: number;
    current_item_id?: number;
    current_item_order?: number;
    completed_items_ids: number[];
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.courses.get(params.id as string);
      setCourse(response.data);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async () => {
    if (!course) return;

    try {
      setStarting(true);
      await academyAPI.courses.start(course.id);
      
      // Refresh course data to get progress
      await fetchCourse();
      
      // Navigate to first item
      if (course.items && course.items.length > 0) {
        const firstItem = course.items[0];
        navigateToItem(firstItem);
      }
    } catch (err: any) {
      console.error('Error starting course:', err);
      alert('Erreur lors du démarrage du cours');
    } finally {
      setStarting(false);
    }
  };

  const handleContinueCourse = () => {
    if (!course || !course.user_progress) return;

    // Find current item
    const currentItemId = course.user_progress.current_item_id;
    if (currentItemId) {
      const currentItem = course.items.find(item => item.id === currentItemId);
      if (currentItem) {
        navigateToItem(currentItem);
        return;
      }
    }

    // If no current item, go to first uncompleted item
    const nextItem = course.items.find(item => 
      !course.user_progress!.completed_items_ids.includes(item.id)
    );
    
    if (nextItem) {
      navigateToItem(nextItem);
    } else {
      // All completed, go to first item
      navigateToItem(course.items[0]);
    }
  };

  const navigateToItem = (item: CourseItem) => {
    if (item.content_type === 'video' && item.content_data) {
      router.push(`/academy/courses/${course!.id}/video/${item.id}`);
    } else if (item.content_type === 'exercise' && item.content_data) {
      router.push(`/academy/courses/${course!.id}/exercise/${item.id}`);
    }
  };

  const isItemCompleted = (itemId: number) => {
    return course?.user_progress?.completed_items_ids.includes(itemId) || false;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/academy" className="text-primary-600 hover:underline">
            ← Retour à l'Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container-custom px-4">
        {/* Back Button */}
        <Link
          href="/academy"
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <FiArrowLeft />
          <span>Retour aux cours</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Thumbnail */}
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {course.level_display}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FiVideo />
                    <span>{course.videos_count} vidéos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCode />
                    <span>{course.exercises_count} exercices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiTarget />
                    <span>{course.items_count} items au total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {course.user_progress && course.user_progress.is_started && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold">Votre progression</span>
                  <span className="font-bold">{course.user_progress.completion_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${course.user_progress.completion_percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!course.user_progress || !course.user_progress.is_started ? (
              <button
                onClick={handleStartCourse}
                disabled={starting}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiPlay />
                <span>{starting ? 'Démarrage...' : '🚀 Commencer le cours'}</span>
              </button>
            ) : (
              <button
                onClick={handleContinueCourse}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                {course.user_progress.is_completed ? (
                  <>
                    <FiCheckCircle />
                    <span>✓ Revoir le cours</span>
                  </>
                ) : (
                  <>
                    <FiPlay />
                    <span>▶ Continuer où j'en étais</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiTarget className="mr-3" />
            Contenu du cours
          </h2>

          <div className="space-y-4">
            {course.items.map((item, index) => {
              const isCompleted = isItemCompleted(item.id);
              const isCurrent = course.user_progress?.current_item_id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : isCompleted
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Order Number */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isCompleted ? <FiCheckCircle /> : item.order}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {item.content_type === 'video' ? (
                            <FiVideo className="text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FiCode className="text-green-600 dark:text-green-400" />
                          )}
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            {item.content_type === 'video' ? 'Vidéo' : 'Exercice'}
                          </span>
                          {item.is_required && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded">
                              Requis
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {item.content_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.content_description}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigateToItem(item)}
                      className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <span>{isCompleted ? 'Revoir' : isCurrent ? 'Continuer' : 'Commencer'}</span>
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


