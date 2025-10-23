'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsAPI, siteConfigAPI } from '@/lib/api';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import SkeletonPost from '@/components/SkeletonPost';
import { 
  FiArrowRight, FiDownload, FiGithub, FiLinkedin, 
  FiMail, FiCode, FiDatabase, FiServer, FiCpu,
  FiHeart, FiWind
} from 'react-icons/fi';
import Image from 'next/image';
import { generateMetadata, pageSEO } from '@/lib/seo';

// Compétences avec pourcentages
const skills = [
  { name: 'Python/Django', level: 90, icon: <FiCode />, color: 'from-blue-500 to-blue-600' },
  { name: 'JavaScript/React', level: 85, icon: <FiCode />, color: 'from-yellow-500 to-yellow-600' },
  { name: 'Base de données', level: 80, icon: <FiDatabase />, color: 'from-green-500 to-green-600' },
  { name: 'Java/Spring Boot', level: 75, icon: <FiServer />, color: 'from-red-500 to-red-600' },
  { name: 'C/C++/C#/.NET Core', level: 75, icon: <FiCpu />, color: 'from-purple-500 to-purple-600' },
  { name: 'PHP', level: 75, icon: <FiCode />, color: 'from-indigo-500 to-indigo-600' },
];

// Technologies
const technologies = [
  'Python', 'Django', 'JavaScript', 'React', 'Java', 'Spring Boot',
  'PHP', '.NET Core', 'MySQL', 'Oracle', 'SQL Server', 'Docker',
  'C/C++', 'C#', 'Git'
];

interface SocialLinks {
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  email?: string | null;
}

interface HomeContent {
  title: string;
  subtitle: string;
  description: string;
  aboutText: string;
}

interface Skill {
  name: string;
  level: number;
  icon: React.ReactElement;
  color: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [homeContent, setHomeContent] = useState<HomeContent>({
    title: 'Othmane Chaikhi',
    subtitle: 'Ingénieur en Informatique et Réseaux',
    description: '',
    aboutText: ''
  });
  const [dynamicSkills, setDynamicSkills] = useState<Skill[]>(skills);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Appels parallèles pour plus de vitesse
      const [postsResponse, configResponse] = await Promise.allSettled([
        postsAPI.recent(),
        siteConfigAPI.get()
      ]);

      // Traiter les posts
      if (postsResponse.status === 'fulfilled') {
        // Limiter à 3 articles pour la home page (plus rapide)
        setPosts(postsResponse.value.data.slice(0, 3));
      } else {
        console.error('Error fetching posts:', postsResponse.reason);
      }

      // Traiter le CV, les liens sociaux, et le contenu dynamique
      if (configResponse.status === 'fulfilled') {
        const config = configResponse.value.data;
        
        // CV
        if (config.cv) {
          const cvFullUrl = config.cv.startsWith('http')
            ? config.cv
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${config.cv}`;
          setCvUrl(cvFullUrl);
        }
        
        // Social Links
        setSocialLinks({
          github_url: config.github_url,
          linkedin_url: config.linkedin_url,
          twitter_url: config.twitter_url,
          email: config.email,
        });
        
        // Home Content
        setHomeContent({
          title: config.home_title || 'Othmane Chaikhi',
          subtitle: config.home_subtitle || 'Ingénieur en Informatique et Réseaux',
          description: config.home_description || '',
          aboutText: config.about_text || ''
        });
        
        // Skills
        if (config.skills_json && Array.isArray(config.skills_json) && config.skills_json.length > 0) {
          setDynamicSkills(config.skills_json);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section avec effet 3D */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-primary-400/30 to-purple-400/30 dark:from-primary-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 dark:from-pink-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Avatar professionnel */}
            <div className="mb-6 sm:mb-8 animate-scale-in">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto mb-4 sm:mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/avatar-professional.jpg"
                    alt="Othmane Chaikhi"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Badge animé */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg mb-6 sm:mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Disponible pour nouvelles opportunités</span>
            </div>

            {/* Titre principal avec gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              {homeContent.title}
            </h1>

            {/* Sous-titre */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {homeContent.subtitle}
            </h2>

            {/* Description */}
            {homeContent.description ? (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
                {homeContent.description}
              </p>
            ) : (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
                Passionné par le développement web et les technologies modernes. 
                Je crée des applications fiables, bien structurées et performantes avec 
                <span className="font-semibold text-primary-600 dark:text-primary-400"> Python/Django</span>,
                <span className="font-semibold text-yellow-600 dark:text-yellow-400"> JavaScript/React</span>, et
                <span className="font-semibold text-red-600 dark:text-red-400"> Java/Spring Boot</span>.
              </p>
            )}

            {/* Boutons d'action avec effet 3D */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
              <Link 
                href="/blog" 
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Voir mes Projets</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-400"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <FiDownload className="group-hover:animate-bounce" />
                    <span>Télécharger mon CV</span>
                  </span>
                </a>
              )}
            </div>

            {/* Social Links avec effet hover 3D */}
            <div className="flex justify-center space-x-4 sm:space-x-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {socialLinks.github_url && (
                <a href={socialLinks.github_url} target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 group">
                  <FiGithub className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" size={20} />
                </a>
              )}
              {socialLinks.linkedin_url && (
                <a href={socialLinks.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 group">
                  <FiLinkedin className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
                </a>
              )}
              {socialLinks.email && (
                <a href={`mailto:${socialLinks.email}`}
                   className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 group">
                  <FiMail className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* À propos Section avec carte 3D */}
      <section className="py-12 sm:py-16 md:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 transform hover:scale-[1.02] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center flex-wrap">
                <span className="w-8 sm:w-12 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mr-3 sm:mr-4"></span>
                <span>À propos de moi</span>
              </h2>
              {homeContent.aboutText ? (
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {homeContent.aboutText}
                </p>
              ) : (
                <>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                    Ingénieur en Informatique et Réseaux, je débute ma carrière avec une formation solide et des projets concrets 
                    dans les domaines du développement logiciel, du testing, du Big Data et de l'analyse de données.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Grâce à mon parcours orienté MIAGE, je combine des compétences techniques en programmation 
                    (Python, Java, SQL) avec une bonne compréhension des enjeux métier et de la gestion de projet. 
                    Curieux, rigoureux et passionné par la donnée, je suis prêt à relever de nouveaux défis et à contribuer 
                    activement à des projets innovants et orientés résultats.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compétences Section avec barres animées */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Mes Compétences
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Technologies et outils que je maîtrise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
            {dynamicSkills.map((skill, index) => (
              <div 
                key={skill.name}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white text-sm sm:text-base`}>
                      <FiCode />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{skill.name}</h3>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Technologies badges */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">Technologies</h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {technologies.map((tech, index) => (
                <span 
                  key={tech}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-600 dark:hover:border-primary-400 transform hover:-translate-y-1 transition-all duration-300 cursor-default text-sm sm:text-base"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles récents avec effet 3D */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/10">
        <div className="container-custom px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Articles Récents
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Découvrez mes derniers projets et articles
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Voir tout</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aucun article pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {posts.map((post) => (
                  <div key={post.id} className="transform hover:scale-105 transition-transform duration-300">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 sm:mt-12 text-center sm:hidden">
                <Link href="/blog" className="btn btn-primary">
                  Voir tous les articles
                  <FiArrowRight className="inline ml-2" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Beyond Code - Passion Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 right-20 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 sm:w-64 h-48 sm:h-64 bg-red-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
                <FiHeart className="text-red-400" />
                <span className="text-xs sm:text-sm font-medium">My Passion</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Beyond Code
              </h2>
              <p className="text-lg sm:text-xl text-gray-300">
                La vie ne se résume pas qu'au code...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Image Section */}
              <div className="relative group order-1 md:order-none">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50"></div>
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src="/images/avatar-motorcycle.jpg"
                    alt="Motorcycle Passion"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <div className="flex items-center space-x-2 text-white">
                      <FiWind size={20} className="sm:w-6 sm:h-6" />
                      <span className="text-base sm:text-lg font-semibold">Freedom on Two Wheels</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="space-y-4 sm:space-y-6 order-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <FiWind size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Riding Motorcycles 🏍️</h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        Quand je ne code pas, vous me trouverez sur deux roues, explorant de nouvelles routes 
                        et profitant de la liberté qu'offre la moto. Cette passion m'apprend la concentration, 
                        la gestion du risque et le dépassement de soi - des qualités qui se reflètent dans 
                        mon travail de développeur.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <FiHeart size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Balance & Focus</h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        La moto, c'est comme le code : il faut rester concentré, anticiper les obstacles 
                        et prendre les bonnes décisions au bon moment. Cette discipline m'aide à maintenir 
                        un équilibre entre vie professionnelle et personnelle.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="px-3 sm:px-4 py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                    🏍️ Motorcycle Enthusiast
                  </span>
                  <span className="px-3 sm:px-4 py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                    🌍 Road Trips
                  </span>
                  <span className="px-3 sm:px-4 py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                    ⚡ Speed & Precision
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section avec effet glassmorphism */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Restons en Contact
                </h2>
                <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white/90">
                  Intéressé par une collaboration ? N'hésitez pas à me contacter !
                </p>
                       <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                         {socialLinks.email && (
                           <a 
                             href={`mailto:${socialLinks.email}`}
                             className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center space-x-2"
                           >
                             <FiMail />
                             <span>M'envoyer un email</span>
                           </a>
                         )}
                         {socialLinks.linkedin_url && (
                           <a
                             href={socialLinks.linkedin_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/50 hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center space-x-2"
                           >
                             <FiLinkedin />
                             <span>LinkedIn</span>
                           </a>
                         )}
                       </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

