'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL, academyAPI } from '@/lib/api';
import { getToken, isStaff } from '@/lib/auth';
import Loading from '@/components/Loading';
import { useToast } from '@/components/Toast';
import { 
  FiArrowLeft, FiSave, FiPlus, FiTrash2, FiVideo, FiCode, 
  FiArrowUp, FiArrowDown, FiUpload
} from 'react-icons/fi';

interface CourseItem {
  id: number;
  order: number;
  content_type: 'video' | 'exercise';
  video?: number;
  exercise?: number;
  is_required: boolean;
  content_title?: string;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    thumbnail: null as File | null,
    estimated_duration: 0,
    is_active: true,
    is_featured: false,
  });

  const [newItem, setNewItem] = useState({
    content_type: 'video' as 'video' | 'exercise',
    content_id: '',
    is_required: true,
  });

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await academyAPI.courses.get(params.id as string);
      const courseData = courseRes.data;
      
      setCourse(courseData);
      setFormData({
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        thumbnail: null,
        estimated_duration: courseData.estimated_duration,
        is_active: courseData.is_active,
        is_featured: courseData.is_featured,
      });
      
      setItems(courseData.items || []);
      
      // Fetch available videos and exercises
      const [videosRes, exercisesRes] = await Promise.all([
        academyAPI.videos.list(),
        academyAPI.exercises.list(),
      ]);
      
      setAvailableVideos(Array.isArray(videosRes.data.results) ? videosRes.data.results : videosRes.data || []);
      setAvailableExercises(Array.isArray(exercisesRes.data.results) ? exercisesRes.data.results : exercisesRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      setSaving(true);

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

      const response = await fetch(`${API_BASE_URL}/api/academy/courses/${params.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      showToast('Cours mis à jour avec succès !', 'success');
      fetchData();
    } catch (error: any) {
      console.error('Error updating course:', error);
      showToast(error.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.content_id) {
      showToast('Veuillez sélectionner un contenu', 'error');
      return;
    }

    try {
      const data = {
        course: parseInt(params.id as string),
        content_type: newItem.content_type,
        [newItem.content_type]: parseInt(newItem.content_id),
        order: items.length + 1,
        is_required: newItem.is_required,
      };

      const response = await fetch(`${API_BASE_URL}/api/academy/course-items/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout');
      }

      showToast('Item ajouté !', 'success');
      setNewItem({ content_type: 'video', content_id: '', is_required: true });
      fetchData();
    } catch (error: any) {
      console.error('Error adding item:', error);
      showToast(error.message || 'Erreur lors de l\'ajout', 'error');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Supprimer cet item ?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/academy/course-items/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      showToast('Item supprimé !', 'success');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      showToast(error.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const handleMoveItem = async (itemId: number, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    // Swap orders
    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    // Update orders
    newItems[currentIndex].order = currentIndex + 1;
    newItems[newIndex].order = newIndex + 1;

    setItems(newItems);

    // Update in backend
    try {
      await Promise.all([
        fetch(`${API_BASE_URL}/api/academy/course-items/${newItems[currentIndex].id}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: newItems[currentIndex].order }),
        }),
        fetch(`${API_BASE_URL}/api/academy/course-items/${newItems[newIndex].id}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: newItems[newIndex].order }),
        }),
      ]);
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Erreur lors de la réorganisation', 'error');
      fetchData();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-red-600">Cours introuvable</p>
        <Link href="/admin/academy" className="text-primary-600 hover:underline mt-4 inline-block">
          Retour
        </Link>
      </div>
    );
  }

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
            Modifier le Cours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {course.title}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Info Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Informations du Cours
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Level & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Niveau
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Durée (min)
                  </label>
                  <input
                    type="number"
                    name="estimated_duration"
                    value={formData.estimated_duration}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                    <FiUpload />
                    <span>Changer</span>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Actif
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    En vedette
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FiSave />
                <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </form>
          </div>

          {/* Course Items */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contenu du Cours ({items.length} items)
            </h2>

            {/* Add Item Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ajouter un Item
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newItem.content_type}
                      onChange={(e) => setNewItem(prev => ({ ...prev, content_type: e.target.value as 'video' | 'exercise', content_id: '' }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="video">Vidéo</option>
                      <option value="exercise">Exercice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Contenu
                    </label>
                    <select
                      value={newItem.content_id}
                      onChange={(e) => setNewItem(prev => ({ ...prev, content_id: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Sélectionner...</option>
                      {newItem.content_type === 'video' ? (
                        availableVideos.map(v => (
                          <option key={v.id} value={v.id}>{v.title}</option>
                        ))
                      ) : (
                        availableExercises.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.is_required}
                    onChange={(e) => setNewItem(prev => ({ ...prev, is_required: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Obligatoire
                  </label>
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiPlus />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Liste des Items
              </h3>
              
              {items.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Aucun item. Ajoutez des vidéos et exercices.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          #{item.order}
                        </span>
                        {item.content_type === 'video' ? (
                          <FiVideo className="text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FiCode className="text-green-600 dark:text-green-400" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.content_title || 'Item'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.content_type === 'video' ? 'Vidéo' : 'Exercice'}
                            {item.is_required && ' • Obligatoire'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveItem(item.id, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FiArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => handleMoveItem(item.id, 'down')}
                          disabled={index === items.length - 1}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FiArrowDown size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

