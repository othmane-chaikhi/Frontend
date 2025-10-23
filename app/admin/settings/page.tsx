'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfigAPI } from '@/lib/api';
import { isStaff } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { 
  FiUpload, FiDownload, FiTrash2, FiFile, FiCheck, FiGithub, 
  FiLinkedin, FiTwitter, FiMail, FiSave, FiHome, FiUser, FiCode, 
  FiPlus, FiX 
} from 'react-icons/fi';

interface SocialMediaLinks {
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  email: string;
}

interface HomePageContent {
  home_title: string;
  home_subtitle: string;
  home_description: string;
  about_text: string;
}

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
}

export default function SettingsPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCv, setCurrentCv] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [savingHome, setSavingHome] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  
  const [socialLinks, setSocialLinks] = useState<SocialMediaLinks>({
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    email: '',
  });
  
  const [homeContent, setHomeContent] = useState<HomePageContent>({
    home_title: '',
    home_subtitle: '',
    home_description: '',
    about_text: '',
  });
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', level: 80, icon: 'FiCode', color: 'from-blue-500 to-blue-600' });
  
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isStaff()) {
      router.push('/');
      return;
    }
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      setLoading(true);
      const response = await siteConfigAPI.get();
      
      if (response.data.cv) {
        setCurrentCv(response.data.cv);
      }
      
      // Load social media links
      setSocialLinks({
        github_url: response.data.github_url || '',
        linkedin_url: response.data.linkedin_url || '',
        twitter_url: response.data.twitter_url || '',
        email: response.data.email || '',
      });
      
      // Load home page content
      setHomeContent({
        home_title: response.data.home_title || 'Othmane Chaikhi',
        home_subtitle: response.data.home_subtitle || 'Ingénieur en Informatique et Réseaux',
        home_description: response.data.home_description || '',
        about_text: response.data.about_text || '',
      });
      
      // Load skills
      if (response.data.skills_json && Array.isArray(response.data.skills_json)) {
        setSkills(response.data.skills_json);
      } else {
        // Default skills
        setSkills([
          { name: 'Python/Django', level: 90, icon: 'FiCode', color: 'from-blue-500 to-blue-600' },
          { name: 'JavaScript/React', level: 85, icon: 'FiCode', color: 'from-yellow-500 to-yellow-600' },
          { name: 'Base de données', level: 80, icon: 'FiDatabase', color: 'from-green-500 to-green-600' },
          { name: 'Java/Spring Boot', level: 75, icon: 'FiServer', color: 'from-red-500 to-red-600' },
          { name: 'C/C++/C#/.NET Core', level: 75, icon: 'FiCpu', color: 'from-purple-500 to-purple-600' },
          { name: 'PHP', level: 75, icon: 'FiCode', color: 'from-indigo-500 to-indigo-600' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching site config:', error);
      showToast('Erreur lors du chargement de la configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Veuillez uploader un fichier PDF ou Word', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Le fichier est trop volumineux (max 5MB)', 'error');
        return;
      }

      setCvFile(file);
    }
  };

  const handleUpload = async () => {
    if (!cvFile) {
      showToast('Veuillez sélectionner un fichier', 'warning');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('cv', cvFile);

      await siteConfigAPI.updateCV(formData);
      showToast('CV uploadé avec succès!', 'success');
      setCvFile(null);
      fetchSiteConfig();
    } catch (error) {
      console.error('Error uploading CV:', error);
      showToast('Erreur lors de l\'upload du CV', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cv', '');
      
      await siteConfigAPI.updateCV(formData);
      showToast('CV supprimé avec succès', 'success');
      setCurrentCv(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleSocialLinkChange = (field: keyof SocialMediaLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSocialLinks = async () => {
    try {
      setSavingSocial(true);
      await siteConfigAPI.update(1, socialLinks);
      showToast('Liens réseaux sociaux mis à jour!', 'success');
    } catch (error) {
      console.error('Error saving social links:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleHomeContentChange = (field: keyof HomePageContent, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveHomeContent = async () => {
    try {
      setSavingHome(true);
      await siteConfigAPI.update(1, homeContent);
      showToast('Contenu de la page d\'accueil mis à jour!', 'success');
    } catch (error) {
      console.error('Error saving home content:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSavingHome(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      showToast('Veuillez entrer un nom de compétence', 'warning');
      return;
    }
    setSkills([...skills, newSkill]);
    setNewSkill({ name: '', level: 80, icon: 'FiCode', color: 'from-blue-500 to-blue-600' });
    showToast('Compétence ajoutée! N\'oubliez pas de sauvegarder.', 'info');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    showToast('Compétence supprimée! N\'oubliez pas de sauvegarder.', 'info');
  };

  const handleSaveSkills = async () => {
    try {
      setSavingSkills(true);
      await siteConfigAPI.update(1, { skills_json: skills });
      showToast('Compétences mises à jour!', 'success');
    } catch (error) {
      console.error('Error saving skills:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSavingSkills(false);
    }
  };

  const getCvUrl = () => {
    if (!currentCv) return null;
    return currentCv.startsWith('http')
      ? currentCv
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${currentCv}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {ToastComponent}
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Paramètres du Site
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tout le contenu de votre portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* CV Management Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      <FiFile className="inline mr-2" />
                      Gestion du CV
                    </h2>
                  </div>
                </div>

                {currentCv && (
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FiCheck className="text-green-500" size={20} />
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {currentCv.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={getCvUrl()!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                        >
                          <FiDownload size={16} />
                        </a>
                        <button
                          onClick={handleDelete}
                          className="p-2 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-red-300 transition-colors"
                        >
                          <FiTrash2 className="text-red-600" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {cvFile ? cvFile.name : 'Choisir un fichier...'}
                      </span>
                      <FiUpload className="text-gray-400" />
                    </div>
                  </label>

                  {cvFile && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Upload...</span>
                        </>
                      ) : (
                        <>
                          <FiUpload />
                          <span>Uploader le CV</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Social Media Links Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <FiMail className="inline mr-2" />
                  Réseaux Sociaux
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiGithub className="inline mr-1" /> GitHub
                    </label>
                    <input
                      type="url"
                      value={socialLinks.github_url}
                      onChange={(e) => handleSocialLinkChange('github_url', e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiLinkedin className="inline mr-1" /> LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin_url}
                      onChange={(e) => handleSocialLinkChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/profile"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiTwitter className="inline mr-1" /> Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter_url}
                      onChange={(e) => handleSocialLinkChange('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiMail className="inline mr-1" /> Email
                    </label>
                    <input
                      type="email"
                      value={socialLinks.email}
                      onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                      placeholder="contact@exemple.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSaveSocialLinks}
                    disabled={savingSocial}
                    className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {savingSocial ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sauvegarde...</span>
                      </>
                    ) : (
                      <>
                        <FiSave />
                        <span>Sauvegarder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* Home Page Content Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <FiHome className="inline mr-2" />
                  Contenu de la Page d'Accueil
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Titre Principal
                    </label>
                    <input
                      type="text"
                      value={homeContent.home_title}
                      onChange={(e) => handleHomeContentChange('home_title', e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={homeContent.home_subtitle}
                      onChange={(e) => handleHomeContentChange('home_subtitle', e.target.value)}
                      placeholder="Votre titre professionnel"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={homeContent.home_description}
                      onChange={(e) => handleHomeContentChange('home_description', e.target.value)}
                      placeholder="Description courte..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      À Propos (section détaillée)
                    </label>
                    <textarea
                      value={homeContent.about_text}
                      onChange={(e) => handleHomeContentChange('about_text', e.target.value)}
                      placeholder="Votre présentation détaillée..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSaveHomeContent}
                    disabled={savingHome}
                    className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {savingHome ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sauvegarde...</span>
                      </>
                    ) : (
                      <>
                        <FiSave />
                        <span>Sauvegarder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Skills Management Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <FiCode className="inline mr-2" />
                  Gestion des Compétences
                </h2>

                {/* Existing Skills */}
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({skill.level}%)</span>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Skill */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom de la compétence
                    </label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Ex: Python, React, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Niveau ({newSkill.level}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddSkill}
                      className="btn bg-green-500 hover:bg-green-600 text-white py-2 flex items-center justify-center space-x-2"
                    >
                      <FiPlus />
                      <span>Ajouter</span>
                    </button>

                    <button
                      onClick={handleSaveSkills}
                      disabled={savingSkills}
                      className="btn btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {savingSkills ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <FiSave />
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
              Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Les modifications sont appliquées immédiatement après sauvegarde</li>
              <li>• Le contenu dynamique s'affiche sur la page d'accueil et le footer</li>
              <li>• Les compétences doivent être sauvegardées après ajout ou suppression</li>
              <li>• Format CV recommandé: PDF (max 5MB)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
