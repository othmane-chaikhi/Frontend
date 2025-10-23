'use client';

import Head from 'next/head';
import { generateMetadata, generatePersonStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Othmane Chaikhi',
  tags = [],
  noindex = false
}: SEOProps) {
  const metadata = generateMetadata({
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    tags
  });

  const personStructuredData = generatePersonStructuredData();
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords?.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={`https://othmane-chaikhi.vercel.app${url}`} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metadata.openGraph?.title} />
      <meta property="og:description" content={metadata.openGraph?.description} />
      <meta property="og:url" content={metadata.openGraph?.url} />
      <meta property="og:image" content={metadata.openGraph?.images?.[0]?.url} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Othmane Chaikhi Portfolio" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Article specific Open Graph */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.twitter?.title} />
      <meta name="twitter:description" content={metadata.twitter?.description} />
      <meta name="twitter:image" content={metadata.twitter?.images?.[0]} />
      <meta name="twitter:creator" content="@othmane_chaikhi" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Othmane Chaikhi" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="fr-FR" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.country" content="France" />
      
      {/* Verification Tags (Add your actual verification codes) */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      <meta name="yahoo-site-verification" content="your-yahoo-verification-code" />
    </Head>
  );
}
