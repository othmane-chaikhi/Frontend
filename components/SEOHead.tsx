'use client';

import { useEffect } from 'react';
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function SEOHead({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author = 'Othmane Chaikhi',
  tags = [],
  breadcrumbs = []
}: SEOHeadProps) {
  useEffect(() => {
    // Generate structured data for article
    const articleStructuredData = generateArticleStructuredData({
      title,
      description,
      url,
      image,
      publishedTime,
      modifiedTime,
      author,
      tags
    });

    // Generate breadcrumb structured data
    const breadcrumbStructuredData = breadcrumbs.length > 0 
      ? generateBreadcrumbStructuredData(breadcrumbs)
      : null;

    // Add structured data to head
    const addStructuredData = (data: any) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    addStructuredData(articleStructuredData);
    
    if (breadcrumbStructuredData) {
      addStructuredData(breadcrumbStructuredData);
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        if (script.textContent?.includes(title)) {
          script.remove();
        }
      });
    };
  }, [title, description, url, image, publishedTime, modifiedTime, author, tags, breadcrumbs]);

  return null;
}
