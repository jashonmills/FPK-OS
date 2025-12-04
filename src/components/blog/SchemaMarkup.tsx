import { BlogPost } from '@/hooks/useBlogPosts';
import { generateArticleSchema, extractFAQsFromMarkdown, generateFAQSchema } from '@/utils/schemaGenerator';

interface SchemaMarkupProps {
  post: BlogPost;
  siteUrl?: string;
}

export function SchemaMarkup({ post, siteUrl = 'https://fpkuniversity.com' }: SchemaMarkupProps) {
  const articleSchema = generateArticleSchema(post, siteUrl);
  
  const faqs = extractFAQsFromMarkdown(post.content);
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
