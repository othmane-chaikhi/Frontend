import { Metadata } from 'next';

// Base SEO configuration
export const baseSEO = {
  title: 'Othmane Chaikhi | Portfolio & Blog',
  description: 'Ingénieur en Informatique et Réseaux - Portfolio personnel et blog technique. Développeur Python/Django, JavaScript/React, Java/Spring Boot. Spécialisé en développement web et analyse de données.',
  keywords: [
    'Othmane Chaikhi',
    'Portfolio',
    'Développeur',
    'Ingénieur Informatique',
    'Python',
    'Django',
    'JavaScript',
    'React',
    'Java',
    'Spring Boot',
    'Développement Web',
    'Blog Technique',
    'MIAGE',
    'Base de données',
    'MySQL',
    'Oracle',
    'SQL Server',
    'Docker',
    'Git',
    'C++',
    'C#',
    '.NET Core',
    'PHP',
    'Big Data',
    'Analyse de données',
    'Testing',
    'Développement logiciel'
  ],
  authors: [{ name: 'Othmane Chaikhi' }],
  creator: 'Othmane Chaikhi',
  publisher: 'Othmane Chaikhi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://othmane-chaikhi.vercel.app',
    siteName: 'Othmane Chaikhi Portfolio',
    title: 'Othmane Chaikhi | Portfolio & Blog',
    description: 'Ingénieur en Informatique et Réseaux - Portfolio personnel et blog technique',
    images: [
      {
        url: '/images/avatar-professional.jpg',
        width: 1200,
        height: 630,
        alt: 'Othmane Chaikhi - Ingénieur en Informatique et Réseaux',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Othmane Chaikhi | Portfolio & Blog',
    description: 'Ingénieur en Informatique et Réseaux - Portfolio personnel et blog technique',
    images: ['/images/avatar-professional.jpg'],
    creator: '@othmane_chaikhi',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://othmane-chaikhi.vercel.app',
  },
};

// SEO metadata generator
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Othmane Chaikhi',
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Metadata {
  const fullTitle = title ? `${title} | Othmane Chaikhi` : baseSEO.title;
  const fullDescription = description || baseSEO.description;
  const fullKeywords = [...baseSEO.keywords, ...keywords];
  const fullUrl = url ? `https://othmane-chaikhi.vercel.app${url}` : baseSEO.openGraph.url;
  const fullImage = image || baseSEO.openGraph.images[0].url;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: 'Othmane Chaikhi',
    robots: baseSEO.robots,
    openGraph: {
      type,
      locale: 'fr_FR',
      url: fullUrl,
      siteName: baseSEO.openGraph.siteName,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: '@othmane_chaikhi',
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Structured Data (JSON-LD) generators
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Othmane Chaikhi',
    jobTitle: 'Ingénieur en Informatique et Réseaux',
    description: 'Développeur passionné par les technologies modernes et l\'innovation',
    url: 'https://othmane-chaikhi.vercel.app',
    image: 'https://othmane-chaikhi.vercel.app/images/avatar-professional.jpg',
    sameAs: [
      'https://github.com/othmane-chaikhi',
      'https://linkedin.com/in/othmane-chaikhi',
    ],
    knowsAbout: [
      'Python',
      'Django',
      'JavaScript',
      'React',
      'Java',
      'Spring Boot',
      'MySQL',
      'Oracle',
      'SQL Server',
      'Docker',
      'Git',
      'C++',
      'C#',
      '.NET Core',
      'PHP',
      'Big Data',
      'Analyse de données',
      'Testing',
      'Développement logiciel'
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Université - Formation MIAGE'
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance / Disponible'
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Othmane Chaikhi Portfolio',
    description: 'Portfolio personnel et blog technique d\'Othmane Chaikhi',
    url: 'https://othmane-chaikhi.vercel.app',
    author: {
      '@type': 'Person',
      name: 'Othmane Chaikhi'
    },
    publisher: {
      '@type': 'Person',
      name: 'Othmane Chaikhi'
    },
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://othmane-chaikhi.vercel.app/blog?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author = 'Othmane Chaikhi',
  tags = [],
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://othmane-chaikhi.vercel.app${url}`,
    image: image ? `https://othmane-chaikhi.vercel.app${image}` : 'https://othmane-chaikhi.vercel.app/images/avatar-professional.jpg',
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://othmane-chaikhi.vercel.app'
    },
    publisher: {
      '@type': 'Person',
      name: 'Othmane Chaikhi',
      url: 'https://othmane-chaikhi.vercel.app'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://othmane-chaikhi.vercel.app${url}`
    },
    keywords: tags.join(', '),
    inLanguage: 'fr-FR'
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://othmane-chaikhi.vercel.app${item.url}`
    }))
  };
}

// SEO utility functions
export function formatDateForSEO(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString();
}

export function generateCanonicalUrl(path: string): string {
  return `https://othmane-chaikhi.vercel.app${path}`;
}

export function generateImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `https://othmane-chaikhi.vercel.app${imagePath}`;
}

// Meta tags for specific pages
export const pageSEO = {
  home: {
    title: 'Accueil',
    description: 'Portfolio d\'Othmane Chaikhi - Ingénieur en Informatique et Réseaux. Découvrez mes projets, compétences et articles techniques.',
    keywords: ['portfolio', 'accueil', 'présentation', 'compétences']
  },
  blog: {
    title: 'Blog',
    description: 'Articles techniques et projets d\'Othmane Chaikhi. Tutoriels, guides et réflexions sur le développement web et les technologies.',
    keywords: ['blog', 'articles', 'tutoriels', 'technologies', 'développement']
  },
  academy: {
    title: 'Académie',
    description: 'Cours et exercices de programmation par Othmane Chaikhi. Apprenez Python, JavaScript, Java et bien plus.',
    keywords: ['cours', 'formation', 'programmation', 'apprentissage', 'exercices']
  },
  docs: {
    title: 'Documentation',
    description: 'Documentation technique et guides d\'utilisation des projets d\'Othmane Chaikhi.',
    keywords: ['documentation', 'guides', 'API', 'technique']
  }
};
