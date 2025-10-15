import { Helmet } from 'react-helmet-async';

interface ArticleSchema {
  type: 'Article';
  headline: string;
  description: string;
  author: {
    name: string;
    credentials?: string;
  };
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchema {
  type: 'FAQPage';
  items: FAQItem[];
}

interface SoftwareApplicationSchema {
  type: 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  offers?: {
    price: string;
    priceCurrency: string;
  }[];
  operatingSystem?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchema {
  type: 'BreadcrumbList';
  items: BreadcrumbItem[];
}

interface OrganizationSchema {
  type: 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

type SchemaType = ArticleSchema | FAQSchema | SoftwareApplicationSchema | BreadcrumbSchema | OrganizationSchema;

interface SchemaMarkupProps {
  schema: SchemaType | SchemaType[];
}

export const SchemaMarkup = ({ schema }: SchemaMarkupProps) => {
  const generateSchema = (schemaData: SchemaType) => {
    const baseUrl = window.location.origin;
    
    switch (schemaData.type) {
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: schemaData.headline,
          description: schemaData.description,
          author: {
            '@type': 'Person',
            name: schemaData.author.name,
            ...(schemaData.author.credentials && { jobTitle: schemaData.author.credentials }),
          },
          datePublished: schemaData.datePublished,
          ...(schemaData.dateModified && { dateModified: schemaData.dateModified }),
          ...(schemaData.image && { image: schemaData.image }),
          ...(schemaData.keywords && { keywords: schemaData.keywords.join(', ') }),
          publisher: {
            '@type': 'Organization',
            name: 'FPX CNS-App',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/assets/fpx-cns-logo.png`,
            },
          },
        };
        
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: schemaData.items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        };
        
      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: schemaData.name,
          description: schemaData.description,
          applicationCategory: schemaData.applicationCategory,
          ...(schemaData.offers && {
            offers: schemaData.offers.map(offer => ({
              '@type': 'Offer',
              price: offer.price,
              priceCurrency: offer.priceCurrency,
            })),
          }),
          ...(schemaData.operatingSystem && { operatingSystem: schemaData.operatingSystem }),
          ...(schemaData.aggregateRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: schemaData.aggregateRating.ratingValue,
              reviewCount: schemaData.aggregateRating.reviewCount,
            },
          }),
        };
        
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schemaData.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          })),
        };
        
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: schemaData.name,
          url: schemaData.url,
          ...(schemaData.logo && { logo: schemaData.logo }),
          ...(schemaData.description && { description: schemaData.description }),
          ...(schemaData.sameAs && { sameAs: schemaData.sameAs }),
        };
        
      default:
        return null;
    }
  };

  const schemas = Array.isArray(schema) ? schema : [schema];
  const jsonLd = schemas.map(generateSchema).filter(Boolean);

  return (
    <Helmet>
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
