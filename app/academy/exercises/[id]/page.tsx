'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { academyAPI } from '@/lib/api';
import { FiArrowLeft, FiPlay, FiCheck, FiX, FiEye, FiCode } from 'react-icons/fi';
import Loading from '@/components/Loading';

// Import Monaco Editor dynamically (client-side only)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Exercise {
  id: number;
  title: string;
  description: string;
  language: string;
  language_display: string;
  difficulty: string;
  difficulty_display: string;
  instructions: string;
  starter_code: string;
  is_active: boolean;
}

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState('');

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
      fetchExercise();
    }
  }, [params.id, isAuthenticated]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.exercises.get(Number(params.id));
      setExercise(response.data);
      setCode(response.data.starter_code || '');
    } catch (error: any) {
      console.error('Error fetching exercise:', error);
      setError('Erreur lors du chargement de l\'exercice');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!exercise) return;

    try {
      setSubmitting(true);
      setOutput('');
      
      const response = await academyAPI.exercises.submit(exercise.id, code);
      
      if (response.data.success) {
        setOutput(`✅ Bravo ! Votre code est correct !\n\nScore: ${response.data.score || 100}/100\n\n${response.data.message || ''}`);
      } else {
        setOutput(`❌ Votre code n'est pas tout à fait correct.\n\n${response.data.message || 'Essayez encore !'}`);
      }
    } catch (error: any) {
      console.error('Error submitting code:', error);
      if (error?.response?.status === 401) {
        setOutput('❌ Vous devez être connecté pour soumettre du code.');
      } else {
        setOutput(`❌ Erreur lors de la soumission: ${error?.response?.data?.detail || error?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowSolution = async () => {
    if (!exercise) return;

    try {
      const response = await academyAPI.exercises.getSolution(exercise.id);
      setSolution(response.data.solution_code);
      setShowSolution(true);
    } catch (error: any) {
      console.error('Error fetching solution:', error);
      alert('Erreur lors du chargement de la solution. Assurez-vous d\'être connecté.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const lowerDiff = difficulty.toLowerCase();
    if (lowerDiff.includes('easy') || lowerDiff.includes('facile')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (lowerDiff.includes('medium') || lowerDiff.includes('moyen')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    if (lowerDiff.includes('hard') || lowerDiff.includes('difficile')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Exercice non trouvé'}
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

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Instructions */}
            <div className="space-y-6">
              {/* Exercise Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {exercise.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(exercise.difficulty_display)}`}>
                    {exercise.difficulty_display}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                    <FiCode className="inline mr-1" />
                    {exercise.language_display}
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {exercise.description}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <FiCheck className="mr-2 text-blue-500" />
                    Instructions
                  </h3>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {exercise.instructions}
                  </div>
                </div>
              </div>

              {/* Output */}
              {output && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    {output.includes('✅') ? (
                      <FiCheck className="mr-2 text-green-500" />
                    ) : (
                      <FiX className="mr-2 text-red-500" />
                    )}
                    Résultat
                  </h3>
                  <pre className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                    output.includes('✅')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                  }`}>
                    {output}
                  </pre>
                </div>
              )}

              {/* Solution */}
              {showSolution && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiEye className="mr-2 text-purple-500" />
                    Solution
                  </h3>
                  <pre className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                      {solution}
                    </code>
                  </pre>
                </div>
              )}
            </div>

            {/* Right Panel - Code Editor */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Votre Code
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShowSolution}
                      className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition flex items-center space-x-2"
                    >
                      <FiEye />
                      <span>Voir la solution</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2"
                    >
                      <FiPlay />
                      <span>{submitting ? 'Soumission...' : 'Soumettre'}</span>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <Editor
                    height="600px"
                    language={exercise.language.toLowerCase()}
                    theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      suggest: {
                        showKeywords: true,
                        showSnippets: true,
                      },
                    }}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>💡 <strong>Astuce :</strong> Testez votre code étape par étape</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

