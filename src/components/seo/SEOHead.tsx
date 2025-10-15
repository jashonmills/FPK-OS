import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = 'https://storage.googleapis.com/gpt-engineer-file-uploads/WdHeGnA3LGRO4sqLeybIC8JsE3F3/social-images/social-1760080506105-Gemini_Generated_Image_j09gffj09gffj09g.png',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
}: SEOHeadProps) => {
  const fullTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const metaDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}
      
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
