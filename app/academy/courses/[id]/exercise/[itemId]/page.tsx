'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FiArrowLeft, FiArrowRight, FiCheckCircle, FiX, FiCode, FiPlay,
  FiEye, FiTerminal, FiRefreshCw, FiEyeOff
} from 'react-icons/fi';
import { academyAPI } from '@/lib/api';
import Loading from '@/components/Loading';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), { ssr: false }) as any;

interface ExerciseData {
  id: number;
  title: string;
  description: string;
  language: string;
  language_display: string;
  difficulty_display: string;
  instructions: string;
  starter_code: string;
}

interface CourseItem {
  id: number;
  order: number;
  content_type: string;
  content_data: ExerciseData;
}

export default function CourseExercisePageEnhanced() {
  const params = useParams();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [item, setItem] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [nextItem, setNextItem] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<{success: boolean; message: string; feedback?: string; hint?: string; alreadyCompleted?: boolean; currentAnswerIncorrect?: boolean} | null>(null);
  
  // Live Preview State
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState('');
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    if (params.itemId) {
      fetchItem();
    }
  }, [params.itemId]);

  // Separate useEffect for Pyodide loading (only once)
  useEffect(() => {
    let isMounted = true;
    
    const loadPyodideScript = () => {
      if (typeof window === 'undefined') return;
      
      // Check if already loaded
      if ((window as any).loadPyodide) {
        if (isMounted) setPyodideReady(true);
        return;
      }
      
      // Check if script already exists
      if (document.querySelector('script[src*="pyodide"]')) {
        // Script exists, wait for it to load
        const checkInterval = setInterval(() => {
          if ((window as any).loadPyodide) {
            if (isMounted) setPyodideReady(true);
            clearInterval(checkInterval);
          }
        }, 100);
        
        // Timeout after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);
        return;
      }
      
      // Load script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('✅ Pyodide script loaded successfully');
        if (isMounted) setPyodideReady(true);
      };
      
      script.onerror = (error) => {
        console.error('❌ Failed to load Pyodide script:', error);
      };
      
      document.head.appendChild(script);
    };
    
    loadPyodideScript();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Auto-update preview for HTML/CSS/JS
  useEffect(() => {
    if (item && isWebLanguage()) {
      const timer = setTimeout(() => {
        updatePreview();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [code, item]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await academyAPI.courseItems.get(Number(params.itemId));
      setItem(response.data);
      setCode(response.data.content_data.starter_code || '');
      
      // Auto-enable preview for web languages
      if (isWebLanguage(response.data.content_data.language)) {
        setShowPreview(true);
      }
    } catch (err: any) {
      console.error('Error fetching item:', err);
      setError('Erreur lors du chargement de l\'exercice');
    } finally {
      setLoading(false);
    }
  };

  const isWebLanguage = (lang?: string) => {
    const language = lang || item?.content_data.language || '';
    return ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase());
  };

  const updatePreview = () => {
    if (!isWebLanguage()) return;

    let htmlContent = code;
    
    // If it's pure CSS, wrap it in HTML
    if (item?.content_data.language.toLowerCase() === 'css') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${code}</style>
        </head>
        <body>
          <h1>CSS Preview</h1>
          <div class="demo">This is a demo element</div>
        </body>
        </html>
      `;
    }
    // If it's pure JS, wrap it in HTML with a console
    else if (['javascript', 'js'].includes(item?.content_data.language.toLowerCase() || '')) {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: monospace; padding: 20px; }
            #output { border: 1px solid #ccc; padding: 10px; background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h3>Output:</h3>
          <div id="output"></div>
          <script>
            const originalLog = console.log;
            console.log = function(...args) {
              const output = document.getElementById('output');
              output.innerHTML += args.join(' ') + '<br>';
              originalLog.apply(console, args);
            };
            
            try {
              ${code}
            } catch (error) {
              document.getElementById('output').innerHTML += '<span style="color: red;">Error: ' + error.message + '</span>';
            }
          </script>
        </body>
        </html>
      `;
    }

    setPreviewContent(htmlContent);
  };

  const runCode = async () => {
    setRunning(true);
    setCodeOutput('🔄 Executing your code...\n');

    try {
      const language = item?.content_data.language.toLowerCase() || '';
      
      // For HTML/CSS, use preview mode
      if (['html', 'css'].includes(language)) {
        handlePreview();
        setRunning(false);
        return;
      }
      
      // For ALL other languages, use Judge0 API!
      setCodeOutput('⚡ Sending your code to Judge0 execution server...\n');
      
      const response = await academyAPI.exercises.execute(item?.content_data.id || 0, {
        code: code,
        stdin: ''
      });
      
      let output = '';
      
      if (response.success) {
        output += '✅ Execution completed successfully!\n\n';
        
        if (response.stdout) {
          output += `📤 Output:\n${response.stdout}\n\n`;
        }
        
        if (response.time) {
          output += `⏱️ Time: ${response.time}s\n`;
        }
        
        if (response.memory) {
          output += `💾 Memory: ${response.memory} KB\n`;
        }
        
        output += `\n${response.message}`;
      } else {
        output += '❌ Execution failed\n\n';
        
        if (response.compile_output) {
          output += `🔧 Compilation Error:\n${response.compile_output}\n\n`;
        }
        
        if (response.stderr) {
          output += `⚠️ Error:\n${response.stderr}\n\n`;
        }
        
        output += response.message || 'Unknown error';
      }
      
      setCodeOutput(output);
    } catch (err: any) {
      console.error('Error executing code:', err);
      setCodeOutput(`❌ Error: ${err.message || 'Unknown error'}\n\n💡 Try refreshing the page or check your network connection.`);
    } finally {
      setRunning(false);
    }
  };

  const handleViewSolution = async () => {
    if (!item) return;

    try {
      setLoadingSolution(true);
      const response = await academyAPI.exercises.getSolution(item.content_data.id);
      setSolution(response.data.solution);
      setShowSolution(true);
    } catch (err: any) {
      console.error('Error fetching solution:', err);
      alert('Erreur lors du chargement de la solution');
    } finally {
      setLoadingSolution(false);
    }
  };

  const handleSubmit = async () => {
    if (!item) return;

    try {
      setSubmitting(true);
      
      // Submit code to exercise API
      const exerciseResponse = await academyAPI.exercises.submit(
        item.content_data.id,
        code
      );

      setSubmitResult({
        success: exerciseResponse.data.success,
        message: exerciseResponse.data.message,
        feedback: exerciseResponse.data.feedback,
        hint: exerciseResponse.data.hint,
        alreadyCompleted: exerciseResponse.data.already_completed,
        currentAnswerIncorrect: exerciseResponse.data.current_answer_incorrect
      });

      // If correct and NOT already completed, mark as completed and get next item
      if (exerciseResponse.data.success && !exerciseResponse.data.already_completed) {
        const completeResponse = await academyAPI.courses.completeItem(
          params.id as string,
          item.id
        );
        setNextItem(completeResponse.data.next_item);
        setShowCompletionModal(true);
      } else if (exerciseResponse.data.already_completed && exerciseResponse.data.current_answer_incorrect) {
        // Exercise already completed but current answer is wrong - don't show completion modal
        // Just show the feedback (already set in submitResult)
      } else if (exerciseResponse.data.already_completed) {
        // Exercise already completed and current answer is also correct
        // Don't show the modal again, just show feedback
      }
    } catch (err: any) {
      console.error('Error submitting:', err);
      setSubmitResult({
        success: false,
        message: 'Erreur lors de la soumission'
      });
    } finally {
      setSubmitting(false);
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
      router.push(`/academy/courses/${params.id}`);
    }
    setShowCompletionModal(false);
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

  const exercise = item.content_data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-custom px-4">
        {/* Header */}
        <Link
          href={`/academy/courses/${params.id}`}
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <FiArrowLeft />
          <span>Retour au cours</span>
        </Link>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiCode className="text-green-600 dark:text-green-400" size={24} />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                EXERCICE
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {exercise.title}
            </h1>

            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                exercise.difficulty_display === 'Facile' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                exercise.difficulty_display === 'Moyen' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {exercise.difficulty_display}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                {exercise.language_display}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {exercise.description}
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📋 Instructions:
              </h3>
              <div 
                className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: exercise.instructions }}
              />
            </div>

            {/* Submit Result */}
            {submitResult && (
              <div className={`p-4 rounded-lg ${
                submitResult.alreadyCompleted && submitResult.currentAnswerIncorrect
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800'
                  : submitResult.success
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
              }`}>
                <p className={`font-semibold mb-2 ${
                  submitResult.alreadyCompleted && submitResult.currentAnswerIncorrect
                    ? 'text-yellow-800 dark:text-yellow-400'
                    : submitResult.success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                }`}>
                  {submitResult.message}
                </p>
                {submitResult.feedback && (
                  <p className={
                    submitResult.alreadyCompleted && submitResult.currentAnswerIncorrect
                      ? 'text-yellow-700 dark:text-yellow-300'
                      : submitResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }>
                    {submitResult.feedback}
                  </p>
                )}
                {submitResult.hint && (
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    💡 {submitResult.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Editor + Preview */}
          <div className="space-y-4">
            {/* Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Votre Code
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {exercise.language_display}
                  </span>
                </div>
                
                {/* Toggle Preview / Run buttons */}
                <div className="flex items-center space-x-2">
                  {isWebLanguage() && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        showPreview
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <FiEye className="inline mr-1" size={14} />
                      Preview
                    </button>
                  )}
                  {!isWebLanguage() && (
                    <>
                      <button
                        onClick={runCode}
                        disabled={running || pyodideLoading}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <FiPlay className="inline mr-1" size={14} />
                        {pyodideLoading ? 'Loading Python...' : running ? 'Running...' : 'Run'}
                      </button>
                      {!pyodideReady && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 animate-pulse">
                          ⏳ Python env loading...
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="border border-gray-300 dark:border-gray-600">
                <Editor
                  height="400px"
                  language={exercise.language.toLowerCase()}
                  theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
                  value={code}
                  onChange={(value: string | undefined) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>

            {/* Live Preview (HTML/CSS/JS) */}
            {isWebLanguage() && showPreview && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    🔴 Live Preview
                  </span>
                  <button
                    onClick={updatePreview}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <FiRefreshCw className="inline" size={12} /> Refresh
                  </button>
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={previewContent}
                  className="w-full h-96 border-0"
                  sandbox="allow-scripts"
                  title="Live Preview"
                />
              </div>
            )}

            {/* Code Output (Python/Other) */}
            {!isWebLanguage() && codeOutput && (
              <div className="bg-gray-900 text-green-400 rounded-2xl shadow-lg overflow-hidden p-6 font-mono text-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <FiTerminal size={16} />
                  <span className="font-semibold">Terminal Output</span>
                </div>
                <pre className="whitespace-pre-wrap">{codeOutput}</pre>
              </div>
            )}

            {/* Solution Display */}
            {showSolution && solution && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 flex items-center">
                    <FiEye className="mr-2" />
                    Solution
                  </h3>
                  <button
                    onClick={() => setShowSolution(false)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <FiEyeOff size={20} />
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <Editor
                    height="300px"
                    language={exercise.language.toLowerCase()}
                    theme="vs-dark"
                    value={solution}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* View Solution Button */}
              {!showSolution && (
                <button
                  onClick={handleViewSolution}
                  disabled={loadingSolution}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FiEye />
                  <span>{loadingSolution ? 'Chargement...' : '👁️ Voir la Solution'}</span>
                </button>
              )}
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiPlay />
                <span>{submitting ? 'Vérification...' : '🚀 Soumettre et continuer'}</span>
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
                🎉 Parfait !
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {nextItem ? 
                  'Exercice réussi ! Passez au prochain item.' : 
                  '🏆 Félicitations ! Vous avez terminé le cours !'}
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

