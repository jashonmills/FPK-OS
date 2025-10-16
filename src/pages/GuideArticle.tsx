import { useQuery } from '@tanstack/react-query';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { SocialShare } from '@/components/content/SocialShare';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowLeft, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIAttribution } from '@/components/shared/AIAttribution';

export default function GuideArticle() {
  const { categorySlug, articleSlug } = useParams<{ categorySlug: string; articleSlug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          author:article_authors(*),
          category:article_categories(*),
          pillar_page:public_articles!pillar_page_id(title, slug)
        `)
        .eq('slug', articleSlug)
        .eq('is_published', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!articleSlug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_relationships')
        .select(`
          related_article:public_articles!related_article_id(
            id,
            slug,
            title,
            excerpt,
            reading_time_minutes,
            category:article_categories(slug)
          )
        `)
        .eq('article_id', article!.id);
      if (error) throw error;
      return data.map(r => r.related_article);
    },
    enabled: !!article?.id,
  });

  useEffect(() => {
    if (!article) return;

    // Track article view
    const trackView = async () => {
      await supabase
        .from('public_articles')
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq('id', article.id);
    };

    trackView();
  }, [article]);

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-subtle" />;
  }

  if (!article) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <>
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt || article.description || ''}
        canonical={`${window.location.origin}/guides/${categorySlug}/${articleSlug}`}
        ogImage={article.featured_image_url}
        ogType="article"
        publishedTime={article.published_at || undefined}
        modifiedTime={article.updated_at || undefined}
        author={article.author?.name}
        keywords={article.keywords || []}
      />
      <SchemaMarkup
        schema={[
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: '/' },
              { name: 'Guides', url: '/guides' },
              { name: article.category?.name || 'Articles', url: `/guides/${categorySlug}` },
              { name: article.title, url: `/guides/${categorySlug}/${articleSlug}` },
            ],
          },
          {
            type: 'Article',
            headline: article.title,
            description: article.description || article.excerpt || '',
            author: {
              name: article.author?.name || 'FPX CNS-App Team',
              credentials: article.author?.credentials,
            },
            datePublished: article.published_at || article.created_at,
            dateModified: article.updated_at,
            image: article.featured_image_url,
            keywords: article.keywords,
          },
        ]}
      />

      <article className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            to={`/guides/${categorySlug}`}
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {article.category?.name || 'Guides'}
          </Link>

          {article.pillar_page && (
            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">
                Part of: {article.pillar_page.title}
              </Badge>
            </div>
          )}

          <header className="mb-12">
            {article.category && (
              <Badge className="mb-4">{article.category.name}</Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-xl text-muted-foreground mb-6">
              {article.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <>
                  {article.author.slug === 'fpx-ai-assistant' ? (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-foreground">
                        {article.author.name}
                      </span>
                      <AIAttribution variant="icon" />
                    </div>
                  ) : (
                    <Link
                      to={`/authors/${article.author.slug}`}
                      className="flex items-center hover:text-primary transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium text-foreground">
                        {article.author.name}
                      </span>
                      {article.author.credentials && (
                        <span className="ml-1">, {article.author.credentials}</span>
                      )}
                    </Link>
                  )}
                </>
              )}
              
              {article.published_at && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(article.published_at), 'MMMM d, yyyy')}
                </div>
              )}
              
              {article.reading_time_minutes && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.reading_time_minutes} min read
                </div>
              )}
            </div>

            <SocialShare
              title={article.title}
              url={window.location.href}
              description={article.excerpt || article.description}
            />
          </div>
        </header>

          {article.featured_image_url && (
            <img
              src={article.featured_image_url}
              alt={`${article.title} - Featured image for neurodiversity guide`}
              className="w-full rounded-lg mb-12 shadow-elegant"
              loading="eager"
              decoding="async"
              width="800"
              height="450"
            />
          )}

          <Separator className="mb-12" />

          <div className="article-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2 prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>

          {relatedArticles && relatedArticles.length > 0 && (
            <>
              <Separator className="my-12" />
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedArticles.map((related: any) => (
                    <Link
                      key={related.id}
                      to={`/guides/${related.category?.slug || categorySlug}/${related.slug}`}
                      className="p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-primary mb-2">{related.title}</h3>
                      {related.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                      )}
                      {related.reading_time_minutes && (
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {related.reading_time_minutes} min
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </article>
    </>
  );
}
