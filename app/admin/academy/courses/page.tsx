'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { academyAPI } from '@/lib/api';
import { isStaff } from '@/lib/auth';
import Loading from '@/components/Loading';
import { FiArrowLeft, FiBook, FiVideo, FiCode, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/Toast';

export default function CoursesListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchCourses();
  }, [router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.courses.list();
      const coursesData = Array.isArray(response.data.results) ? response.data.results : 
                          Array.isArray(response.data) ? response.data : [];
      setCourses(coursesData);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      showToast('Erreur lors du chargement des cours', 'error');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le cours "${title}" ?\n\nCette action est irréversible et supprimera également tous les items du cours.`)) {
      return;
    }

    try {
      await academyAPI.courses.delete(id);
      showToast('Cours supprimé avec succès !', 'success');
      fetchCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/academy"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
          >
            <FiArrowLeft />
            <span>Retour à l'Academy</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📚 Tous les Cours
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {courses.length} cours au total
              </p>
            </div>

            <Link
              href="/admin/academy/courses/new"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <span>Créer un Cours</span>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
            💡 Gestion des cours
          </h3>
          <p className="text-blue-800 dark:text-blue-300 mb-4">
            Créez et gérez vos cours directement depuis cette interface. Vous pourrez :
          </p>
          <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-1">
            <li>Définir le titre, description, niveau du cours</li>
            <li>Ajouter des items (vidéos/exercices) dans l'ordre souhaité</li>
            <li>Marquer certains items comme requis</li>
            <li>Activer/désactiver le cours</li>
          </ul>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <FiBook className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Aucun cours pour le moment
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Créez votre premier cours pour commencer !
              </p>
              <Link
                href="/admin/academy/courses/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>Créer le premier cours</span>
              </Link>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
              >
                {/* Thumbnail */}
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                {!course.thumbnail && (
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <FiBook className="text-white" size={64} />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {course.level_display}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {course.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-1">
                      <FiVideo size={14} />
                      <span>{course.videos_count} vidéos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCode size={14} />
                      <span>{course.exercises_count} exercices</span>
                    </div>
                    <div>
                      <span className="font-semibold">{course.items_count}</span> items
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/academy/courses/${course.id}`}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Voir
                    </Link>
                    <Link
                      href={`/admin/academy/courses/${course.id}/edit`}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Éditer
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}


