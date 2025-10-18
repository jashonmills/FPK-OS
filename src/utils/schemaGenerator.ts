import { BlogPost } from '@/hooks/useBlogPosts';

interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': string;
    '@id': string;
  };
}

interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  telephone?: string;
  url?: string;
  geo?: {
    '@type': string;
    latitude?: number;
    longitude?: number;
  };
}

export function generateArticleSchema(post: BlogPost, siteUrl: string): ArticleSchema {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.meta_description || '',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FPK University',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  if (post.featured_image_url) {
    schema.image = post.featured_image_url;
  }

  return schema;
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateLocalBusinessSchema(business: {
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
  url?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.phone,
  };

  if (business.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country || 'US',
    };
  }

  if (business.coordinates?.lat && business.coordinates?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng,
    };
  }

  return schema;
}

export function extractFAQsFromMarkdown(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const faqPattern = /## FAQ\s*([\s\S]*?)(?=##|$)/i;
  const match = content.match(faqPattern);
  
  if (match) {
    const faqSection = match[1];
    const qaPattern = /\*\*Q:\s*([^*]+)\*\*\s*A:\s*([^\n]+)/g;
    let qaMatch;
    
    while ((qaMatch = qaPattern.exec(faqSection)) !== null) {
      faqs.push({
        question: qaMatch[1].trim(),
        answer: qaMatch[2].trim(),
      });
    }
  }
  
  return faqs;
}

export function extractLocationFromContent(content: string): {
  city?: string;
  state?: string;
  region?: string;
} | null {
  const locationPatterns = [
    /(?:in|near|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s+([A-Z]{2})/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s+(Oregon|Washington|California|Nevada)/gi,
  ];

  for (const pattern of locationPatterns) {
    const match = pattern.exec(content);
    if (match) {
      return {
        city: match[1],
        state: match[2],
        region: `${match[1]}, ${match[2]}`,
      };
    }
  }

  return null;
}
