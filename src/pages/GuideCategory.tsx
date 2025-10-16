import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function GuideCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { data: category } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!categorySlug,
  });

  const { data: articles } = useQuery({
    queryKey: ['category-articles', category?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          author:article_authors(name, credentials),
          category:article_categories(name, slug)
        `)
        .eq('category_id', category!.id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SEOHead
        title={`${category.name} Guides | FPX CNS-App`}
        description={category.description || `Expert guides and resources for ${category.name.toLowerCase()}`}
      />
      <SchemaMarkup
        schema={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: '/' },
            { name: 'Guides', url: '/guides' },
            { name: category.name, url: `/guides/${categorySlug}` },
          ],
        }}
      />

      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-16">
          <Link
            to="/guides"
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Guides
          </Link>

          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-muted-foreground">{category.description}</p>
            )}
          </div>

          {articles && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/guides/${categorySlug}/${article.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-elegant hover:border-primary/20">
                    {article.featured_image_url && (
                      <img
                        src={article.featured_image_url}
                        alt={`${article.title} - Comprehensive guide on neurodiversity support`}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {article.reading_time_minutes && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.reading_time_minutes} min
                          </div>
                        )}
                        {article.pillar_page_id && (
                          <Badge variant="outline" className="text-xs">Part of Series</Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        {article.author && (
                          <span className="truncate">By {article.author.name}</span>
                        )}
                        {article.published_at && (
                          <span>{format(new Date(article.published_at), 'MMM d')}</span>
                        )}
                      </div>
                      <div className="flex items-center text-primary font-medium mt-4 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
