'use client';

import Script from 'next/script';

interface ArticleData {
  title: string;
  description: string;
  date: string;
  slug: string;
  author?: string;
  image?: string;
  tags?: string[];
}

interface WebsiteData {
  name: string;
  url: string;
  description: string;
}

// 文章结构化数据
export function ArticleStructuredData({
  title,
  description,
  date,
  slug,
  author = 'imanwxx',
  image,
  tags = [],
}: ArticleData) {
  const BASE_URL = 'http://49.232.232.252:3000';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: date,
    dateModified: date,
    url: `${BASE_URL}/posts/${slug}`,
    image: image || `${BASE_URL}/favicon.ico`,
    publisher: {
      '@type': 'Organization',
      name: 'imanwxx 博客',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.ico`,
      },
    },
    keywords: tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/posts/${slug}`,
    },
  };

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// 网站结构化数据
export function WebsiteStructuredData({
  name,
  url,
  description,
}: WebsiteData) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: url,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// 面包屑导航结构化数据
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
