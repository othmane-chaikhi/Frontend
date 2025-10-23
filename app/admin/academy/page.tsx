'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { academyAPI } from '@/lib/api';
import { isStaff } from '@/lib/auth';
import Loading from '@/components/Loading';
import { 
  FiVideo, FiCode, FiUsers, FiTrendingUp, FiPlus, 
  FiEdit, FiTrash2, FiEye, FiAward, FiBook
} from 'react-icons/fi';
import { useToast } from '@/components/Toast';

export default function AcademyAdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, videosRes, exercisesRes] = await Promise.all([
        academyAPI.courses.list(),
        academyAPI.videos.list(),
        academyAPI.exercises.list()
      ]);
      
      // Vérifier que les données sont des arrays (l'API retourne {count, results})
      const coursesData = Array.isArray(coursesRes.data.results) ? coursesRes.data.results : 
                          Array.isArray(coursesRes.data) ? coursesRes.data : [];
      const videosData = Array.isArray(videosRes.data.results) ? videosRes.data.results : [];
      const exercisesData = Array.isArray(exercisesRes.data.results) ? exercisesRes.data.results : [];
      
      setCourses(coursesData.slice(0, 5)); // Last 5
      setVideos(videosData.slice(0, 5)); // Last 5
      setExercises(exercisesData.slice(0, 5)); // Last 5
      
      // Calculate stats
      setStats({
        total_courses: coursesData.length,
        active_courses: coursesData.filter((c: any) => c.is_active).length,
        total_videos: videosData.length,
        total_exercises: exercisesData.length,
        active_videos: videosData.filter((v: any) => v.is_active).length,
        active_exercises: exercisesData.filter((e: any) => e.is_active).length,
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      
      // Message d'erreur plus spécifique
      let errorMsg = 'Erreur lors du chargement des données';
      
      if (error?.message?.includes('<!DOCTYPE')) {
        errorMsg = '❌ Backend non accessible. Vérifiez que Django tourne sur http://localhost:8000';
      } else if (error?.response?.status === 404) {
        errorMsg = '❌ Endpoints non trouvés. Lancez: MIGRATE_COURSES.bat';
      } else if (error?.response?.status === 401) {
        errorMsg = '❌ Non authentifié. Reconnectez-vous';
      } else {
        errorMsg = error?.response?.data?.detail || error?.message || errorMsg;
      }
      
      showToast(errorMsg, 'error');
      
      // Initialiser avec des arrays vides pour éviter les erreurs
      setCourses([]);
      setVideos([]);
      setExercises([]);
      setStats({
        total_courses: 0,
        active_courses: 0,
        total_videos: 0,
        total_exercises: 0,
        active_videos: 0,
        active_exercises: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion Academy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos cours, vidéos e-learning et exercices pratiques
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiBook size={32} />
              <span className="text-3xl font-bold">{stats?.total_courses || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Cours</h3>
            <p className="text-indigo-100 text-sm">{stats?.active_courses || 0} actifs</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiVideo size={32} />
              <span className="text-3xl font-bold">{stats?.total_videos || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Vidéos</h3>
            <p className="text-blue-100 text-sm">{stats?.active_videos || 0} actives</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiCode size={32} />
              <span className="text-3xl font-bold">{stats?.total_exercises || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Exercices</h3>
            <p className="text-green-100 text-sm">{stats?.active_exercises || 0} actifs</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiAward size={32} />
              <span className="text-3xl font-bold">{(stats?.total_videos || 0) + (stats?.total_exercises || 0)}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Contenu Total</h3>
            <p className="text-purple-100 text-sm">Vidéos + Exercices</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/academy/courses/create"
            className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                <FiPlus className="text-indigo-600 dark:text-indigo-400 group-hover:text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Nouveau Cours
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Créer un cours/série
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/academy/videos/create"
            className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <FiPlus className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Nouvelle Vidéo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ajouter une vidéo e-learning
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/academy/exercises/create"
            className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <FiPlus className="text-green-600 dark:text-green-400 group-hover:text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Nouvel Exercice
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Créer un exercice pratique
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📚 Derniers Cours
            </h2>
            <Link
              href="/admin/academy/courses"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center space-x-2"
            >
              <span>Voir tout</span>
              <FiEye />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Niveau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contenu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <FiBook className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">Aucun cours pour le moment</p>
                        <Link href="/admin/academy/courses/create" className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block">
                          Créer votre premier cours →
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{course.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {course.level_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                          <div className="flex items-center space-x-2">
                            <FiVideo size={14} />
                            <span>{course.videos_count}</span>
                            <FiCode size={14} className="ml-2" />
                            <span>{course.exercises_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {course.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/academy/courses/${course.id}/edit`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              <FiEdit size={18} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dernières Vidéos
            </h2>
            <Link
              href="/admin/academy/videos"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center space-x-2"
            >
              <span>Voir tout</span>
              <FiEye />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Niveau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {videos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Aucune vidéo pour le moment
                      </td>
                    </tr>
                  ) : (
                    videos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{video.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            video.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            video.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {video.level_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {video.duration}
                        </td>
                        <td className="px-6 py-4">
                          {video.is_active ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/academy/videos/${video.id}/edit`}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mr-3"
                          >
                            <FiEdit className="inline" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Exercises */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Derniers Exercices
            </h2>
            <Link
              href="/admin/academy/exercises"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center space-x-2"
            >
              <span>Voir tout</span>
              <FiEye />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Langage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Difficulté
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {exercises.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Aucun exercice pour le moment
                      </td>
                    </tr>
                  ) : (
                    exercises.map((exercise) => (
                      <tr key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{exercise.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                            {exercise.language_display}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {exercise.difficulty_display}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {exercise.is_active ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">Actif</span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">Inactif</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/academy/exercises/${exercise.id}/edit`}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mr-3"
                          >
                            <FiEdit className="inline" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

