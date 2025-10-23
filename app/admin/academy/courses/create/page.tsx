'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import { getToken, isStaff } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';

export default function CreateCoursePage() {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    thumbnail: null as File | null,
    estimated_duration: 0,
    is_active: true,
    is_featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prev => ({ ...prev, [name]: files?.[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStaff()) {
      showToast('Non autorisé', 'error');
      router.push('/');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('level', formData.level);
      data.append('estimated_duration', formData.estimated_duration.toString());
      data.append('is_active', formData.is_active.toString());
      data.append('is_featured', formData.is_featured.toString());
      
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }

      const response = await fetch(`${API_BASE_URL}/api/academy/courses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création');
      }

      const createdCourse = await response.json();
      showToast('Cours créé avec succès !', 'success');
      router.push(`/admin/academy/courses/${createdCourse.id}/edit`);
    } catch (error: any) {
      console.error('Error creating course:', error);
      showToast(error.message || 'Erreur lors de la création', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-8">
        <div className="mb-8">
          <Link
            href="/admin/academy"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
          >
            <FiArrowLeft />
            <span>Retour à l'Academy</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Créer un Nouveau Cours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ajoutez un cours/série à votre Academy
          </p>
        </div>

        <div className="max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Titre du Cours *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Python pour Débutants"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Décrivez votre cours..."
              />
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Niveau *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label htmlFor="estimated_duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Durée Estimée (minutes)
              </label>
              <input
                type="number"
                id="estimated_duration"
                name="estimated_duration"
                value={formData.estimated_duration}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="60"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Image de Couverture
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <FiUpload />
                  <span>Choisir une image</span>
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.thumbnail && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.thumbnail.name}
                  </span>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actif (visible pour les utilisateurs)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_featured" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  En vedette (mis en avant sur la page Academy)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiSave />
                <span>{loading ? 'Création...' : 'Créer le Cours'}</span>
              </button>

              <Link
                href="/admin/academy"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              📝 Prochaine étape
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Après avoir créé votre cours, vous pourrez ajouter des vidéos et des exercices dans l'ordre souhaité depuis la page d'édition.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
