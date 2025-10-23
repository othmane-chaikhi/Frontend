'use client';

import { useState } from 'react';
import { 
  FiBook, FiCode, FiTool, FiZap, FiCheckCircle, 
  FiAlertCircle, FiLayers, FiServer, FiMonitor, FiHeart, FiUsers, FiTarget
} from 'react-icons/fi';
import { generateMetadata, pageSEO } from '@/lib/seo';

// SEO metadata for docs page
export const metadata = generateMetadata({
  title: pageSEO.docs.title,
  description: pageSEO.docs.description,
  keywords: pageSEO.docs.keywords,
  url: '/docs',
});

type Language = 'fr' | 'en' | 'ar';

const content = {
  fr: {
    title: " Documentation",
    subtitle: "Guide complet du portfolio",
    
    nav: {
      overview: "Vue d'ensemble",
      about: "Mon Histoire",
      dynamic: "Gestion Dynamique",
      technologies: "Technologies",
      features: "Fonctionnalités",
      problems: "Problèmes & Solutions",
      usage: "Utilisation",
      api: "API Reference"
    },
    
    overview: {
      title: "Vue d'ensemble du projet",
      description: "Plateforme complète combinant un portfolio personnel, un blog technique et une académie d'apprentissage interactif.",
      stats: [
        { label: "Technologies", value: "15+", icon: <FiLayers /> },
        { label: "Fonctionnalités", value: "50+", icon: <FiZap /> },
        { label: "Langages supportés", value: "7+", icon: <FiCode /> },
      ]
    },
    
    about: {
      title: "Mon Histoire & Vision",
      subtitle: "Pourquoi j'ai créé cette plateforme",
      mission: {
        title: "Ma Mission",
        description: "Cette plateforme représente bien plus qu'un simple portfolio technique. C'est le résultat d'une vision : créer un espace où le personal branding rencontre l'éducation accessible.",
        goals: [
          {
            icon: <FiTarget />,
            title: "Personal Branding",
            desc: "Construire une présence professionnelle solide et authentique qui reflète mes compétences et ma passion pour le développement."
          },
          {
            icon: <FiUsers />,
            title: "Aider à Apprendre",
            desc: "Rendre l'apprentissage de la programmation accessible à tous, avec des exercices interactifs et une validation intelligente."
          },
          {
            icon: <FiHeart />,
            title: "Faciliter le Parcours",
            desc: "Créer une expérience d'apprentissage fluide et motivante, où chaque étape apporte satisfaction et progression visible."
          }
        ]
      },
      story: {
        title: "L'Histoire de ce Projet",
        paragraphs: [
          "Ce projet est né d'une passion pour le développement web et d'un désir profond de partager mes connaissances. En tant que développeur, j'ai constaté que l'apprentissage de la programmation peut être difficile sans les bons outils et le bon accompagnement.",
          "J'ai voulu créer une plateforme qui combine trois éléments essentiels : un portfolio pour présenter mon travail et mes compétences, un blog pour partager mes expériences et découvertes techniques, et surtout une académie interactive pour aider les autres à apprendre.",
          "L'Academy n'est pas qu'une simple collection d'exercices. C'est un environnement d'apprentissage intelligent qui utilise Judge0 pour l'exécution réelle du code et Gemini AI pour fournir des retours personnalisés. Chaque exercice est pensé pour progresser naturellement, avec un système de points et de feedback constructif."
        ]
      },
      values: {
        title: "Mes Valeurs",
        items: [
          " Excellence technique - Utiliser les meilleures technologies disponibles",
          " Partage de connaissances - Rendre l'apprentissage accessible à tous",
          " Innovation - Intégrer des outils modernes comme Judge0 et Gemini AI",
          " Communauté - Créer un espace d'apprentissage bienveillant",
          " Progression continue - Toujours améliorer et ajouter de nouvelles fonctionnalités"
        ]
      },
      impact: {
        title: "L'Impact Visé",
        description: "Mon objectif est d'aider les apprenants à :",
        points: [
          "Pratiquer la programmation avec des exercices concrets",
          "Recevoir des retours immédiats et constructifs",
          "Progresser à leur rythme avec un système de points motivant",
          "Accéder à une plateforme gratuite et de qualité",
          "Développer leurs compétences dans plusieurs langages (Python, JavaScript, C++, Java, SQL...)"
        ]
      }
    },
    
    dynamic: {
      title: " Gestion 100% Dynamique",
      subtitle: "Tout est configurable depuis le Dashboard Admin",
      intro: "Cette plateforme est entièrement dynamique. Chaque texte, chaque compétence, chaque cours peut être modifié directement depuis l'interface d'administration, sans toucher une seule ligne de code !",
      sections: [
        {
          title: " Contenu Textuel",
          icon: "📝",
          features: [
            "Tous les textes de la page d'accueil sont modifiables",
            "Descriptions, titres, sous-titres personnalisables",
            "Liens sociaux (GitHub, LinkedIn) configurables",
            "Email de contact modifiable",
            "CV uploadable et remplaçable à tout moment"
          ]
        },
        {
          title: " Compétences (Skills)",
          icon: "",
          features: [
            "Ajouter/modifier/supprimer des compétences depuis l'admin",
            "Pourcentages de maîtrise ajustables",
            "Ordre des compétences modifiable",
            "Catégories personnalisables",
            "Affichage automatique avec barres de progression"
          ]
        },
        {
          title: "Blog",
          icon: "",
          features: [
            "Créer des articles avec éditeur riche",
            "Upload d'images et vidéos (YouTube)",
            "Gestion des commentaires",
            "Publier/dépublier des articles",
            "Recherche et filtrage intégrés"
          ]
        },
        {
          title: " Academy",
          icon: "",
          features: [
            "Créer des cours complets depuis le dashboard",
            "Ajouter des vidéos YouTube facilement",
            "Créer des exercices de code avec Monaco Editor",
            "Configurer la difficulté et les points",
            "Réorganiser l'ordre des leçons (drag & drop)",
            "Support multi-langages (Python, JS, C++, Java, SQL...)"
          ]
        },
        {
          title: " Médias",
          icon: "",
          features: [
            "Upload d'images avec compression automatique",
            "Gestion des avatars",
            "Galerie de médias organisée",
            "Support GIF, PNG, JPEG",
            "Intégration vidéos YouTube"
          ]
        }
      ],
      advantages: {
        title: " Avantages de la Gestion Dynamique",
        items: [
          {
            title: "Aucun code requis",
            desc: "Modifiez tout depuis l'interface admin. Pas besoin de connaître React ou Django !"
          },
          {
            title: "Mises à jour instantanées",
            desc: "Les changements sont visibles immédiatement après sauvegarde"
          },
          {
            title: "Multi-utilisateurs",
            desc: "Plusieurs admins peuvent gérer le contenu simultanément"
          },
          {
            title: "Historique des modifications",
            desc: "Django garde une trace de toutes les modifications"
          },
          {
            title: "Validation automatique",
            desc: "Les formulaires vérifient automatiquement la validité des données"
          },
          {
            title: "Prévisualisation",
            desc: "Voyez vos changements avant de les publier"
          }
        ]
      },
      howto: {
        title: " Comment utiliser l'Admin Dashboard",
        steps: [
          "1. Connectez-vous à : http://localhost:3000/admin (ou votresite.com/admin)",
          "2. Utilisez vos identifiants staff",
          "3. Naviguez entre les sections : Posts, Courses, Videos, Exercises, Settings",
          "4. Cliquez sur 'Ajouter' pour créer du nouveau contenu",
          "5. Remplissez les formulaires (tous les champs sont expliqués)",
          "6. Cliquez sur 'Sauvegarder'",
          "7. Retournez sur le site public pour voir vos changements !"
        ]
      }
    },
    
    technologies: {
      title: " Technologies utilisées",
      backend: {
        title: "Backend",
        items: [
          { name: "Django 5.2.7", desc: "Framework Python principal" },
          { name: "Django REST Framework", desc: "API RESTful" },
          { name: "MySQL", desc: "Base de données relationnelle" },
          { name: "Judge0 API", desc: "Exécution de code en temps réel" },
          { name: "Google Gemini AI", desc: "Validation intelligente du code" },
          { name: "Pillow", desc: "Traitement d'images" },
        ]
      },
      frontend: {
        title: "Frontend",
        items: [
          { name: "Next.js 14", desc: "Framework React avec App Router" },
          { name: "TypeScript", desc: "JavaScript typé" },
          { name: "Tailwind CSS", desc: "Framework CSS utility-first" },
          { name: "Monaco Editor", desc: "Éditeur de code VS Code" },
          { name: "Axios", desc: "Client HTTP" },
          { name: "React Icons", desc: "Bibliothèque d'icônes" },
        ]
      }
    },
    
    features: {
      title: " Fonctionnalités principales",
      portfolio: {
        title: "Portfolio",
        items: [
          "Page d'accueil avec présentation",
          "Compétences avec barres de progression",
          "Téléchargement de CV",
          "Liens sociaux (GitHub, LinkedIn)",
          "Design responsive et dark mode"
        ]
      },
      blog: {
        title: "Blog",
        items: [
          "Articles avec images/vidéos",
          "Système de commentaires",
          "Recherche d'articles",
          "Pagination",
          "Admin dashboard pour gérer les posts"
        ]
      },
      academy: {
        title: "Academy",
        items: [
          "Cours interactifs multi-langages",
          "Exercices de code avec Monaco Editor",
          "Exécution en temps réel (Judge0)",
          "Validation IA (Gemini)",
          "Système de progression et points",
          "Support Python, JS, C++, Java, SQL, C",
          "Terminal intégré avec output"
        ]
      }
    },
    
    problems: {
      title: "⚠️ Problèmes rencontrés & Solutions",
      items: [
        {
          problem: "Erreur Judge0 500",
          solution: "Gestion des valeurs null dans stdout/stderr avec (result.get('stdout') or '').strip()",
          file: "backend/apps/portfolio/services/judge0_service.py"
        },
        {
          problem: "Pyodide SyntaxError: Unexpected token '<'",
          solution: "Chargement de Pyodide dans useEffect au lieu du composant Script",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "Double /api/ dans les URLs",
          solution: "Correction des endpoints de ${API_BASE_URL}/api/ à ${API_BASE_URL}/",
          file: "frontend/lib/api.ts"
        },
        {
          problem: "Validation trop permissive",
          solution: "Intégration de Gemini AI pour validation intelligente + Judge0 pour exécution réelle",
          file: "backend/apps/portfolio/views.py"
        },
        {
          problem: "CRUD courses depuis Django Admin",
          solution: "Création de pages frontend dédiées pour gérer courses/videos/exercises",
          file: "frontend/app/admin/academy/"
        },
        {
          problem: "Monaco Editor TypeScript errors",
          solution: "Import dynamique avec SSR désactivé et typage explicite des handlers",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "Exercices déjà complétés re-validés",
          solution: "Ajout de flags already_completed et current_answer_incorrect dans l'API",
          file: "backend/apps/portfolio/views.py - AcademyExerciseViewSet"
        }
      ]
    },
    
    usage: {
      title: " Guide d'utilisation",
      installation: {
        title: "Installation",
        steps: [
          "Cloner le repository",
          "Créer l'environnement virtuel: python -m venv venv",
          "Activer: .\\venv\\Scripts\\activate (Windows)",
          "Installer backend: pip install -r requirements.txt",
          "Installer frontend: cd frontend && npm install",
          "Migrations: python manage.py migrate",
          "Créer superuser: python manage.py createsuperuser",
          "Lancer: .\\RECONSTRUIRE_TOUT.bat"
        ]
      },
      development: {
        title: "Développement",
        steps: [
          "Backend: cd backend && python manage.py runserver",
          "Frontend: cd frontend && npm run dev",
          "Accéder: http://localhost:3000",
          "Admin: http://localhost:3000/admin",
          "API: http://localhost:8000/api"
        ]
      },
      gemini: {
        title: "Configuration Gemini AI",
        steps: [
          "Obtenir clé API: https://makersuite.google.com/app/apikey",
          "Windows: set GEMINI_API_KEY=votre_clé",
          "Linux/Mac: export GEMINI_API_KEY=votre_clé",
          "Redémarrer le backend"
        ]
      }
    },
    
    api: {
      title: " API Reference",
      endpoints: [
        { method: "GET", path: "/api/posts/", desc: "Liste des articles" },
        { method: "POST", path: "/api/posts/", desc: "Créer un article (staff only)" },
        { method: "GET", path: "/api/posts/{id}/", desc: "Détail d'un article" },
        { method: "GET", path: "/academy/courses/", desc: "Liste des cours" },
        { method: "POST", path: "/academy/courses/", desc: "Créer un cours (staff only)" },
        { method: "GET", path: "/academy/exercises/{id}/", desc: "Détail d'un exercice" },
        { method: "POST", path: "/academy/exercises/{id}/execute/", desc: "Exécuter du code (Judge0)" },
        { method: "POST", path: "/academy/exercises/{id}/submit/", desc: "Soumettre solution (Gemini)" },
        { method: "GET", path: "/academy/exercises/{id}/solution/", desc: "Voir la solution" },
        { method: "GET", path: "/academy/progress/", desc: "Progression utilisateur" },
      ]
    }
  },
  
  en: {
    title: " Documentation",
    subtitle: "Complete Portfolio Guide",
    
    nav: {
      overview: "Overview",
      about: "My Story",
      dynamic: "Dynamic Management",
      technologies: "Technologies",
      features: "Features",
      problems: "Problems & Solutions",
      usage: "Usage",
      api: "API Reference"
    },
    
    overview: {
      title: "Project Overview",
      description: "Complete platform combining a personal portfolio, technical blog, and interactive learning academy.",
      stats: [
        { label: "Technologies", value: "15+", icon: <FiLayers /> },
        { label: "Features", value: "50+", icon: <FiZap /> },
        { label: "Supported Languages", value: "7+", icon: <FiCode /> },
      ]
    },
    
    about: {
      title: "My Story & Vision",
      subtitle: "Why I created this platform",
      mission: {
        title: "My Mission",
        description: "This platform represents much more than a simple technical portfolio. It's the result of a vision: creating a space where personal branding meets accessible education.",
        goals: [
          {
            icon: <FiTarget />,
            title: "Personal Branding",
            desc: "Build a strong and authentic professional presence that reflects my skills and passion for development."
          },
          {
            icon: <FiUsers />,
            title: "Help People Learn",
            desc: "Make programming accessible to everyone, with interactive exercises and intelligent validation."
          },
          {
            icon: <FiHeart />,
            title: "Facilitate Learning Journey",
            desc: "Create a smooth and motivating learning experience, where each step brings satisfaction and visible progress."
          }
        ]
      },
      story: {
        title: "The Story Behind This Project",
        paragraphs: [
          "This project was born from a passion for web development and a deep desire to share my knowledge. As a developer, I've seen that learning programming can be difficult without the right tools and guidance.",
          "I wanted to create a platform that combines three essential elements: a portfolio to showcase my work and skills, a blog to share my experiences and technical discoveries, and most importantly an interactive academy to help others learn.",
          "The Academy is not just a simple collection of exercises. It's an intelligent learning environment that uses Judge0 for real code execution and Gemini AI to provide personalized feedback. Each exercise is designed to progress naturally, with a points system and constructive feedback."
        ]
      },
      values: {
        title: "My Values",
        items: [
          " Technical Excellence - Use the best available technologies",
          " Knowledge Sharing - Make learning accessible to all",
          " Innovation - Integrate modern tools like Judge0 and Gemini AI",
          " Community - Create a supportive learning space",
          " Continuous Progress - Always improve and add new features"
        ]
      },
      impact: {
        title: "The Intended Impact",
        description: "My goal is to help learners to:",
        points: [
          "Practice programming with concrete exercises",
          "Receive immediate and constructive feedback",
          "Progress at their own pace with a motivating points system",
          "Access a free and quality platform",
          "Develop skills in multiple languages (Python, JavaScript, C++, Java, SQL...)"
        ]
      }
    },
    
    technologies: {
      title: " Technologies Used",
      backend: {
        title: "Backend",
        items: [
          { name: "Django 5.2.7", desc: "Main Python framework" },
          { name: "Django REST Framework", desc: "RESTful API" },
          { name: "MySQL", desc: "Relational database" },
          { name: "Judge0 API", desc: "Real-time code execution" },
          { name: "Google Gemini AI", desc: "Intelligent code validation" },
          { name: "Pillow", desc: "Image processing" },
        ]
      },
      frontend: {
        title: "Frontend",
        items: [
          { name: "Next.js 14", desc: "React framework with App Router" },
          { name: "TypeScript", desc: "Typed JavaScript" },
          { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
          { name: "Monaco Editor", desc: "VS Code editor" },
          { name: "Axios", desc: "HTTP client" },
          { name: "React Icons", desc: "Icon library" },
        ]
      }
    },
    
    features: {
      title: " Main Features",
      portfolio: {
        title: "Portfolio",
        items: [
          "Homepage with presentation",
          "Skills with progress bars",
          "CV download",
          "Social links (GitHub, LinkedIn)",
          "Responsive design and dark mode"
        ]
      },
      blog: {
        title: "Blog",
        items: [
          "Articles with images/videos",
          "Comment system",
          "Article search",
          "Pagination",
          "Admin dashboard to manage posts"
        ]
      },
      academy: {
        title: "Academy",
        items: [
          "Interactive multi-language courses",
          "Code exercises with Monaco Editor",
          "Real-time execution (Judge0)",
          "AI validation (Gemini)",
          "Progress and points system",
          "Support Python, JS, C++, Java, SQL, C",
          "Integrated terminal with output"
        ]
      }
    },
    
    problems: {
      title: "⚠️ Problems Encountered & Solutions",
      items: [
        {
          problem: "Judge0 500 Error",
          solution: "Handle null values in stdout/stderr with (result.get('stdout') or '').strip()",
          file: "backend/apps/portfolio/services/judge0_service.py"
        },
        {
          problem: "Pyodide SyntaxError: Unexpected token '<'",
          solution: "Load Pyodide in useEffect instead of Script component",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "Double /api/ in URLs",
          solution: "Fix endpoints from ${API_BASE_URL}/api/ to ${API_BASE_URL}/",
          file: "frontend/lib/api.ts"
        },
        {
          problem: "Too permissive validation",
          solution: "Integrate Gemini AI for intelligent validation + Judge0 for real execution",
          file: "backend/apps/portfolio/views.py"
        },
        {
          problem: "CRUD courses from Django Admin",
          solution: "Create dedicated frontend pages to manage courses/videos/exercises",
          file: "frontend/app/admin/academy/"
        },
        {
          problem: "Monaco Editor TypeScript errors",
          solution: "Dynamic import with SSR disabled and explicit handler typing",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "Already completed exercises re-validated",
          solution: "Add already_completed and current_answer_incorrect flags in API",
          file: "backend/apps/portfolio/views.py - AcademyExerciseViewSet"
        }
      ]
    },
    
    usage: {
      title: " Usage Guide",
      installation: {
        title: "Installation",
        steps: [
          "Clone repository",
          "Create virtual environment: python -m venv venv",
          "Activate: .\\venv\\Scripts\\activate (Windows)",
          "Install backend: pip install -r requirements.txt",
          "Install frontend: cd frontend && npm install",
          "Migrations: python manage.py migrate",
          "Create superuser: python manage.py createsuperuser",
          "Launch: .\\RECONSTRUIRE_TOUT.bat"
        ]
      },
      development: {
        title: "Development",
        steps: [
          "Backend: cd backend && python manage.py runserver",
          "Frontend: cd frontend && npm run dev",
          "Access: http://localhost:3000",
          "Admin: http://localhost:3000/admin",
          "API: http://localhost:8000/api"
        ]
      },
      gemini: {
        title: "Gemini AI Configuration",
        steps: [
          "Get API key: https://makersuite.google.com/app/apikey",
          "Windows: set GEMINI_API_KEY=your_key",
          "Linux/Mac: export GEMINI_API_KEY=your_key",
          "Restart backend"
        ]
      }
    },
    
    api: {
      title: " API Reference",
      endpoints: [
        { method: "GET", path: "/api/posts/", desc: "List articles" },
        { method: "POST", path: "/api/posts/", desc: "Create article (staff only)" },
        { method: "GET", path: "/api/posts/{id}/", desc: "Article detail" },
        { method: "GET", path: "/academy/courses/", desc: "List courses" },
        { method: "POST", path: "/academy/courses/", desc: "Create course (staff only)" },
        { method: "GET", path: "/academy/exercises/{id}/", desc: "Exercise detail" },
        { method: "POST", path: "/academy/exercises/{id}/execute/", desc: "Execute code (Judge0)" },
        { method: "POST", path: "/academy/exercises/{id}/submit/", desc: "Submit solution (Gemini)" },
        { method: "GET", path: "/academy/exercises/{id}/solution/", desc: "View solution" },
        { method: "GET", path: "/academy/progress/", desc: "User progress" },
      ]
    }
  },
  
  ar: {
    title: " التوثيق",
    subtitle: "دليل شامل للمحفظة",
    
    nav: {
      overview: "نظرة عامة",
      about: "قصتي",
      technologies: "التقنيات",
      features: "الميزات",
      problems: "المشاكل والحلول",
      usage: "الاستخدام",
      api: "مرجع API"
    },
    
    overview: {
      title: "نظرة عامة على المشروع",
      description: "منصة كاملة تجمع بين محفظة شخصية، مدونة تقنية، وأكاديمية تعليمية تفاعلية.",
      stats: [
        { label: "التقنيات", value: "15+", icon: <FiLayers /> },
        { label: "الميزات", value: "50+", icon: <FiZap /> },
        { label: "اللغات المدعومة", value: "7+", icon: <FiCode /> },
      ]
    },
    
    about: {
      title: "قصتي ورؤيتي",
      subtitle: "لماذا أنشأت هذه المنصة",
      mission: {
        title: "مهمتي",
        description: "تمثل هذه المنصة أكثر من مجرد محفظة تقنية بسيطة. إنها نتيجة رؤية: إنشاء مساحة يلتقي فيها العلامة التجارية الشخصية مع التعليم المتاح للجميع.",
        goals: [
          {
            icon: <FiTarget />,
            title: "العلامة التجارية الشخصية",
            desc: "بناء حضور مهني قوي وأصيل يعكس مهاراتي وشغفي بالتطوير."
          },
          {
            icon: <FiUsers />,
            title: "مساعدة الناس على التعلم",
            desc: "جعل تعلم البرمجة في متناول الجميع، مع تمارين تفاعلية والتحقق الذكي."
          },
          {
            icon: <FiHeart />,
            title: "تسهيل رحلة التعلم",
            desc: "خلق تجربة تعلم سلسة ومحفزة، حيث تجلب كل خطوة الرضا والتقدم المرئي."
          }
        ]
      },
      story: {
        title: "القصة وراء هذا المشروع",
        paragraphs: [
          "ولد هذا المشروع من شغف بتطوير الويب ورغبة عميقة في مشاركة معرفتي. كمطور، رأيت أن تعلم البرمجة يمكن أن يكون صعبًا بدون الأدوات الصحيحة والتوجيه المناسب.",
          "أردت إنشاء منصة تجمع بين ثلاثة عناصر أساسية: محفظة لعرض عملي ومهاراتي، مدونة لمشاركة تجاربي واكتشافاتي التقنية، والأهم من ذلك أكاديمية تفاعلية لمساعدة الآخرين على التعلم.",
          "الأكاديمية ليست مجرد مجموعة بسيطة من التمارين. إنها بيئة تعلم ذكية تستخدم Judge0 لتنفيذ الكود الحقيقي و Gemini AI لتقديم ملاحظات شخصية. كل تمرين مصمم للتقدم بشكل طبيعي، مع نظام نقاط وملاحظات بناءة."
        ]
      },
      values: {
        title: "قيمي",
        items: [
          " التميز التقني - استخدام أفضل التقنيات المتاحة",
          " مشاركة المعرفة - جعل التعلم في متناول الجميع",
          " الابتكار - دمج أدوات حديثة مثل Judge0 و Gemini AI",
          " المجتمع - إنشاء مساحة تعلم داعمة",
          " التقدم المستمر - التحسين دائمًا وإضافة ميزات جديدة"
        ]
      },
      impact: {
        title: "التأثير المقصود",
        description: "هدفي هو مساعدة المتعلمين على:",
        points: [
          "ممارسة البرمجة بتمارين ملموسة",
          "تلقي ملاحظات فورية وبناءة",
          "التقدم بالسرعة الخاصة بهم مع نظام نقاط محفز",
          "الوصول إلى منصة مجانية وعالية الجودة",
          "تطوير المهارات في لغات متعددة (Python, JavaScript, C++, Java, SQL...)"
        ]
      }
    },
    
    technologies: {
      title: " التقنيات المستخدمة",
      backend: {
        title: "الواجهة الخلفية",
        items: [
          { name: "Django 5.2.7", desc: "إطار Python الرئيسي" },
          { name: "Django REST Framework", desc: "واجهة برمجة تطبيقات RESTful" },
          { name: "MySQL", desc: "قاعدة بيانات علائقية" },
          { name: "Judge0 API", desc: "تنفيذ الكود في الوقت الفعلي" },
          { name: "Google Gemini AI", desc: "التحقق الذكي من الكود" },
          { name: "Pillow", desc: "معالجة الصور" },
        ]
      },
      frontend: {
        title: "الواجهة الأمامية",
        items: [
          { name: "Next.js 14", desc: "إطار React مع App Router" },
          { name: "TypeScript", desc: "JavaScript مع أنواع" },
          { name: "Tailwind CSS", desc: "إطار CSS utility-first" },
          { name: "Monaco Editor", desc: "محرر أكواد VS Code" },
          { name: "Axios", desc: "عميل HTTP" },
          { name: "React Icons", desc: "مكتبة أيقونات" },
        ]
      }
    },
    
    features: {
      title: " الميزات الرئيسية",
      portfolio: {
        title: "المحفظة",
        items: [
          "صفحة رئيسية مع التقديم",
          "المهارات مع أشرطة التقدم",
          "تنزيل السيرة الذاتية",
          "روابط التواصل الاجتماعي (GitHub, LinkedIn)",
          "تصميم متجاوب والوضع الليلي"
        ]
      },
      blog: {
        title: "المدونة",
        items: [
          "مقالات مع صور/فيديوهات",
          "نظام التعليقات",
          "البحث عن المقالات",
          "الترقيم",
          "لوحة تحكم الإدارة لإدارة المنشورات"
        ]
      },
      academy: {
        title: "الأكاديمية",
        items: [
          "دورات تفاعلية متعددة اللغات",
          "تمارين برمجية مع Monaco Editor",
          "التنفيذ في الوقت الفعلي (Judge0)",
          "التحقق بالذكاء الاصطناعي (Gemini)",
          "نظام التقدم والنقاط",
          "دعم Python, JS, C++, Java, SQL, C",
          "طرفية متكاملة مع المخرجات"
        ]
      }
    },
    
    problems: {
      title: "⚠️ المشاكل التي واجهناها والحلول",
      items: [
        {
          problem: "خطأ Judge0 500",
          solution: "معالجة القيم الفارغة في stdout/stderr باستخدام (result.get('stdout') or '').strip()",
          file: "backend/apps/portfolio/services/judge0_service.py"
        },
        {
          problem: "Pyodide SyntaxError: Unexpected token '<'",
          solution: "تحميل Pyodide في useEffect بدلاً من مكون Script",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "مضاعفة /api/ في عناوين URL",
          solution: "تصحيح نقاط النهاية من ${API_BASE_URL}/api/ إلى ${API_BASE_URL}/",
          file: "frontend/lib/api.ts"
        },
        {
          problem: "التحقق متساهل جداً",
          solution: "دمج Gemini AI للتحقق الذكي + Judge0 للتنفيذ الحقيقي",
          file: "backend/apps/portfolio/views.py"
        },
        {
          problem: "إدارة الدورات من Django Admin",
          solution: "إنشاء صفحات frontend مخصصة لإدارة الدورات/الفيديوهات/التمارين",
          file: "frontend/app/admin/academy/"
        },
        {
          problem: "أخطاء TypeScript في Monaco Editor",
          solution: "استيراد ديناميكي مع تعطيل SSR وكتابة صريحة للمعالجات",
          file: "frontend/app/academy/courses/[id]/exercise/[itemId]/page.tsx"
        },
        {
          problem: "إعادة التحقق من التمارين المكتملة",
          solution: "إضافة علامات already_completed و current_answer_incorrect في API",
          file: "backend/apps/portfolio/views.py - AcademyExerciseViewSet"
        }
      ]
    },
    
    usage: {
      title: " دليل الاستخدام",
      installation: {
        title: "التثبيت",
        steps: [
          "استنساخ المستودع",
          "إنشاء بيئة افتراضية: python -m venv venv",
          "تفعيل: .\\venv\\Scripts\\activate (Windows)",
          "تثبيت الواجهة الخلفية: pip install -r requirements.txt",
          "تثبيت الواجهة الأمامية: cd frontend && npm install",
          "الترحيلات: python manage.py migrate",
          "إنشاء مستخدم متميز: python manage.py createsuperuser",
          "إطلاق: .\\RECONSTRUIRE_TOUT.bat"
        ]
      },
      development: {
        title: "التطوير",
        steps: [
          "الواجهة الخلفية: cd backend && python manage.py runserver",
          "الواجهة الأمامية: cd frontend && npm run dev",
          "الوصول: http://localhost:3000",
          "الإدارة: http://localhost:3000/admin",
          "API: http://localhost:8000/api"
        ]
      },
      gemini: {
        title: "تكوين Gemini AI",
        steps: [
          "الحصول على مفتاح API: https://makersuite.google.com/app/apikey",
          "Windows: set GEMINI_API_KEY=your_key",
          "Linux/Mac: export GEMINI_API_KEY=your_key",
          "إعادة تشغيل الواجهة الخلفية"
        ]
      }
    },
    
    api: {
      title: " مرجع API",
      endpoints: [
        { method: "GET", path: "/api/posts/", desc: "قائمة المقالات" },
        { method: "POST", path: "/api/posts/", desc: "إنشاء مقال (للموظفين فقط)" },
        { method: "GET", path: "/api/posts/{id}/", desc: "تفاصيل المقال" },
        { method: "GET", path: "/academy/courses/", desc: "قائمة الدورات" },
        { method: "POST", path: "/academy/courses/", desc: "إنشاء دورة (للموظفين فقط)" },
        { method: "GET", path: "/academy/exercises/{id}/", desc: "تفاصيل التمرين" },
        { method: "POST", path: "/academy/exercises/{id}/execute/", desc: "تنفيذ الكود (Judge0)" },
        { method: "POST", path: "/academy/exercises/{id}/submit/", desc: "إرسال الحل (Gemini)" },
        { method: "GET", path: "/academy/exercises/{id}/solution/", desc: "عرض الحل" },
        { method: "GET", path: "/academy/progress/", desc: "تقدم المستخدم" },
      ]
    }
  }
};

export default function DocsPage() {
  const [lang, setLang] = useState<Language>('fr');
  const [activeSection, setActiveSection] = useState('overview');
  
  const t = content[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom py-12">
        
        {/* Header with Language Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t.subtitle}
            </p>
          </div>
          
          {/* Language Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setLang('fr')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                lang === 'fr' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                lang === 'en' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                lang === 'ar' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🇸🇦 AR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {Object.entries(t.nav).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                      activeSection === key
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.overview.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  {t.overview.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {t.overview.stats.map((stat, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 text-center">
                      <div className="text-4xl text-blue-500 dark:text-blue-300 mb-2 flex justify-center">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.about.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {t.about.subtitle}
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t.about.mission.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {t.about.mission.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {t.about.mission.goals.map((goal, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                        <div className="text-3xl text-blue-500 dark:text-blue-400 mb-3 flex justify-center">
                          {goal.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                          {goal.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                          {goal.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Story */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t.about.story.title}
                  </h3>
                  <div className="space-y-4">
                    {t.about.story.paragraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Values */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t.about.values.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.about.values.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-lg">
                        <span className="mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t.about.impact.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {t.about.impact.description}
                  </p>
                  <ul className="space-y-3">
                    {t.about.impact.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-lg">
                        <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Dynamic Management Section */}
            {activeSection === 'dynamic' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.dynamic.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {t.dynamic.subtitle}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t.dynamic.intro}
                  </p>
                </div>

                {/* Management Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.dynamic.sections.map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="text-4xl mb-4">{section.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                            <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Advantages */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t.dynamic.advantages.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.dynamic.advantages.items.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to use */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t.dynamic.howto.title}
                  </h3>
                  <div className="space-y-3">
                    {t.dynamic.howto.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                        <span className="font-mono text-blue-500 dark:text-blue-400 font-bold">
                          {step.split('.')[0]}.
                        </span>
                        <span>{step.split('. ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Technologies Section */}
            {activeSection === 'technologies' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {t.technologies.title}
                  </h2>
                  
                  {/* Backend */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiServer className="text-green-500" />
                      {t.technologies.backend.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {t.technologies.backend.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Frontend */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiMonitor className="text-blue-500" />
                      {t.technologies.frontend.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {t.technologies.frontend.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {t.features.title}
                  </h2>
                  
                  {/* Portfolio Features */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      📁 {t.features.portfolio.title}
                    </h3>
                    <ul className="space-y-2">
                      {t.features.portfolio.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Blog Features */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      ✍️ {t.features.blog.title}
                    </h3>
                    <ul className="space-y-2">
                      {t.features.blog.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Academy Features */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      🎓 {t.features.academy.title}
                    </h3>
                    <ul className="space-y-2">
                      {t.features.academy.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Problems & Solutions Section */}
            {activeSection === 'problems' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {t.problems.title}
                </h2>
                
                <div className="space-y-6">
                  {t.problems.items.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <FiAlertCircle className="text-orange-500 text-xl mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {item.problem}
                          </h3>
                          <div className="flex items-start gap-2 text-green-700 dark:text-green-400 mb-2">
                            <FiCheckCircle className="mt-1 flex-shrink-0" />
                            <p>{item.solution}</p>
                          </div>
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                            {item.file}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Section */}
            {activeSection === 'usage' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {t.usage.title}
                  </h2>
                  
                  {/* Installation */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      ⚙️ {t.usage.installation.title}
                    </h3>
                    <ol className="space-y-3">
                      {t.usage.installation.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-blue-500">{idx + 1}.</span>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                            {step}
                          </code>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Development */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      💻 {t.usage.development.title}
                    </h3>
                    <ol className="space-y-3">
                      {t.usage.development.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-blue-500">{idx + 1}.</span>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                            {step}
                          </code>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Gemini Config */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      🤖 {t.usage.gemini.title}
                    </h3>
                    <ol className="space-y-3">
                      {t.usage.gemini.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-blue-500">{idx + 1}.</span>
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                            {step}
                          </code>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* API Section */}
            {activeSection === 'api' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {t.api.title}
                </h2>
                
                <div className="space-y-4">
                  {t.api.endpoints.map((endpoint, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          endpoint.method === 'GET' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-gray-900 dark:text-white font-mono">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {endpoint.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

