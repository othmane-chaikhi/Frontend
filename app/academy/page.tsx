'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiBook, FiCode, FiVideo, FiMessageCircle, FiPlay, 
  FiCheckCircle, FiArrowRight, FiTarget, FiUsers, FiAward,
  FiSend, FiX, FiAlertCircle, FiLock, FiClock
} from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';
import { generateMetadata, pageSEO } from '@/lib/seo';

// SEO metadata is handled by layout.tsx

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  level: string;
  level_display: string;
  is_active: boolean;
  is_featured: boolean;
  estimated_duration: number;
  items_count: number;
  videos_count: number;
  exercises_count: number;
  user_progress?: {
    is_started: boolean;
    is_completed: boolean;
    completion_percentage: number;
    current_item_order?: number;
  };
  created_at: string;
  updated_at: string;
}

export default function AcademyPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: "👋 Bonjour! Je suis l'assistant de l'Academy. Comment puis-je vous aider aujourd'hui?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    setIsAuthenticated(!!token);
    setCheckingAuth(false);
  }, []);

  // Fetch courses from API
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await academyAPI.courses.list();
        const coursesData = Array.isArray(response.data.results) ? response.data.results : 
                            Array.isArray(response.data) ? response.data : [];

        setCourses(coursesData.filter((c: Course) => c.is_active));
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError('Erreur lors du chargement des cours. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Using HuggingFace Inference API (free tier)
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: For production, this should be in environment variables
          'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: messages.filter(m => m.role === 'user').slice(-3).map(m => m.content),
            generated_responses: messages.filter(m => m.role === 'bot').slice(-3).map(m => m.content),
            text: userMessage
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = data.generated_text || "Je suis désolé, je n'ai pas compris. Pouvez-vous reformuler?";
        setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      } else {
        // Fallback response if API fails
        const fallbackResponses = [
          "C'est une excellente question! Pour plus d'informations, consultez nos cours vidéo.",
          "Je vous recommande de commencer par nos exercices de niveau débutant.",
          "N'hésitez pas à explorer notre bibliothèque de tutoriels!",
          "Voulez-vous en savoir plus sur un langage spécifique?"
        ];
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        setMessages(prev => [...prev, { role: 'bot', content: randomResponse }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Désolé, je rencontre un problème technique. Essayez de consulter nos ressources en attendant!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner') || lowerLevel.includes('débutant') || lowerLevel.includes('facile') || lowerLevel.includes('easy')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (lowerLevel.includes('intermediate') || lowerLevel.includes('intermédiaire') || lowerLevel.includes('moyen') || lowerLevel.includes('medium')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    if (lowerLevel.includes('advanced') || lowerLevel.includes('avancé') || lowerLevel.includes('difficile') || lowerLevel.includes('hard')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return <Loading />;
  }

  // Show login required screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiLock className="text-white" size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Authentification Requise
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              L'Academy est réservée aux utilisateurs connectés. Connectez-vous pour accéder à nos cours vidéo, exercices pratiques et bien plus !
            </p>

            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Se Connecter
              </Link>
              
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Créer un Compte
              </Link>

              <Link
                href="/"
                className="block text-primary-600 dark:text-primary-400 hover:underline text-sm mt-4"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <FiVideo className="mx-auto text-primary-600 dark:text-primary-400 mb-2" size={24} />
              <p className="text-xs text-gray-600 dark:text-gray-400">Vidéos E-Learning</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <FiCode className="mx-auto text-green-600 dark:text-green-400 mb-2" size={24} />
              <p className="text-xs text-gray-600 dark:text-gray-400">Exercices Pratiques</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <FiAward className="mx-auto text-yellow-600 dark:text-yellow-400 mb-2" size={24} />
              <p className="text-xs text-gray-600 dark:text-gray-400">Badges & XP</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <FiCheckCircle className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">✨ Maintenant Disponible</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Coding Academy
            </h1>

            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Apprenez la programmation avec des vidéos interactives et des exercices pratiques. Gagnez de l'XP, débloquez des badges et progressez à votre rythme !
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <FiVideo className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Vidéos E-Learning</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Cours vidéo complets et interactifs</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <FiCode className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Exercices Pratiques</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pratiquez avec des exercices réels</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <FiUsers className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Communauté Active</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Apprenez ensemble et progressez</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 flex items-center">
                <FiAward className="mr-4" size={40} />
                Bienvenue dans l'Academy
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                Une plateforme d'apprentissage complète et interactive où vous pouvez apprendre la programmation 
                à votre rythme. Regardez des vidéos, pratiquez avec des exercices réels, et progressez avec un 
                système de badges et XP motivant.
              </p>
              <p className="text-lg leading-relaxed">
                🎓 Vidéos e-learning • 💻 Éditeur de code professionnel • 🏆 Système de badges
                • 📊 Suivi de progression • 🤖 Assistant IA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container-custom px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🎓 Parcours d'Apprentissage
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choisissez un cours et suivez le contenu dans l'ordre. Cliquez sur "Next" pour progresser automatiquement !
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement des contenus...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start space-x-4">
                <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Erreur de chargement</h3>
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Courses Grid */}
            {!loading && !error && (
              <>
                {courses.length === 0 ? (
                  <div className="text-center py-20">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Aucun cours disponible
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Les cours seront bientôt ajoutés. Revenez plus tard !
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                      <div
                        key={course.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Thumbnail */}
                        <div className="relative">
                          <img 
                            src={course.thumbnail || 'https://via.placeholder.com/400x225/6366F1/FFFFFF?text=Course'} 
                            alt={course.title} 
                            className="w-full h-48 object-cover" 
                          />
                          {course.is_featured && (
                            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                              <FiAward className="mr-1" size={14} />
                              Featured
                            </div>
                          )}
                          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level_display)}`}>
                            {course.level_display}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{course.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                          {/* Course Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                              <FiVideo className="mr-1" size={14} />
                              <span>{course.videos_count} vidéos</span>
                            </div>
                            <div className="flex items-center">
                              <FiCode className="mr-1" size={14} />
                              <span>{course.exercises_count} exercices</span>
                            </div>
                            <div className="flex items-center">
                              <FiClock className="mr-1" size={14} />
                              <span>{course.estimated_duration}min</span>
                            </div>
                          </div>

                          {/* Progress Bar (if started) */}
                          {course.user_progress && course.user_progress.is_started && (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progression</span>
                                <span>{course.user_progress.completion_percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${course.user_progress.completion_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <Link
                            href={`/academy/courses/${course.id}`}
                            className="block w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-center rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                          >
                            {course.user_progress?.is_started ? 
                              (course.user_progress.is_completed ? '✓ Revoir le cours' : '▶ Continuer') : 
                              '🚀 Commencer'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        {chatOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 text-white">
            <h3 className="text-lg font-bold flex items-center">
              <FiMessageCircle className="mr-2" />
              Assistant Academy
            </h3>
            <p className="text-sm text-white/80">Je suis là pour vous aider!</p>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container-custom px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Commencez Votre Apprentissage Maintenant!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            L'Academy est ouverte ! Accédez à tous nos cours, exercices et fonctionnalités. Progressez à votre rythme et devenez un développeur accompli.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FiPlay />
              <span>Commencer un Cours</span>
            </button>
            <Link href="/blog" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white rounded-xl font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              Voir le Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

