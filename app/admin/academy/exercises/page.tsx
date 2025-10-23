'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiCode, FiEye, FiEyeOff } from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';

interface Exercise {
  id: number;
  title: string;
  description: string;
  language: string;
  language_display: string;
  difficulty: string;
  difficulty_display: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.exercises.list();
      // Handle both array and paginated response
      const exercisesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      setExercises(exercisesData);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      alert('Erreur lors du chargement des exercices');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'exercice "${title}" ?`)) {
      return;
    }

    try {
      setDeleting(id);
      await academyAPI.exercises.delete(id);
      alert('Exercice supprimé avec succès !');
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (exercise: Exercise) => {
    try {
      await academyAPI.exercises.update(exercise.id, {
        is_active: !exercise.is_active
      });
      alert(`Exercice ${exercise.is_active ? 'désactivé' : 'activé'} !`);
      fetchExercises();
    } catch (error) {
      console.error('Error toggling exercise:', error);
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
              Gestion des Exercices
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gérez tous les exercices de l'Academy
            </p>
          </div>
          <Link
            href="/admin/academy/exercises/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            Nouvel Exercice
          </Link>
        </div>

        {/* Exercises List */}
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
                    Langage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Difficulté
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
                {exercises.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <FiCode className="mx-auto h-12 w-12 mb-4" />
                      <p>Aucun exercice trouvé</p>
                      <Link
                        href="/admin/academy/exercises/create"
                        className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                      >
                        <FiPlus size={16} />
                        Créer votre premier exercice
                      </Link>
                    </td>
                  </tr>
                ) : (
                  exercises.map((exercise) => (
                    <tr key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        #{exercise.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FiCode className="text-purple-600" size={20} />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {exercise.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                              {exercise.description.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {exercise.language_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {exercise.difficulty_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(exercise)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            exercise.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {exercise.is_active ? (
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
                            href={`/admin/academy/exercises/${exercise.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            title="Modifier"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(exercise.id, exercise.title)}
                            disabled={deleting === exercise.id}
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
