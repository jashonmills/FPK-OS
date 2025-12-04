import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Guides() {
  const navigate = useNavigate();
  
  const { data: categories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: pillarPages } = useQuery({
    queryKey: ['pillar-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          author:article_authors(name, credentials),
          category:article_categories(name, slug)
        `)
        .is('pillar_page_id', null)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEOHead
        title="Neurodiversity Support Guides | FPK-X.com"
        description="Expert guides and resources for parents, educators, and caregivers supporting neurodivergent children. Evidence-based strategies for IEPs, autism, ADHD, and more."
        keywords={['neurodiversity guides', 'IEP guide', 'autism resources', 'ADHD strategies', 'special education']}
      />
      <SchemaMarkup
        schema={[
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: '/' },
              { name: 'Guides', url: '/guides' },
            ],
          },
          {
            type: 'Organization',
            name: 'FPK-X.com',
            url: window.location.origin,
            description: 'Care coordination and progress tracking for neurodivergent children',
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-subtle">
        {/* Header Navigation */}
        <div className="glass-subtle border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Neurodiversity Resource Hub
            </h1>
            <p className="text-xl text-muted-foreground">
              Evidence-based guides and strategies to support neurodivergent children at home, school, and beyond.
            </p>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-primary mb-6">Browse by Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/guides/${category.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-elegant hover:border-primary/20">
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        {category.description && (
                          <CardDescription>{category.description}</CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pillar Pages */}
          {pillarPages && pillarPages.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-6">Featured Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillarPages.map((article) => (
                  <Link
                    key={article.id}
                    to={`/guides/${article.category?.slug || 'general'}/${article.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-elegant hover:border-primary/20">
                      {article.featured_image_url && (
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          loading="lazy"
                        />
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {article.category && (
                            <Badge variant="secondary">{article.category.name}</Badge>
                          )}
                          {article.reading_time_minutes && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.reading_time_minutes} min read
                            </div>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
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
                            <span>
                              By {article.author.name}
                              {article.author.credentials && `, ${article.author.credentials}`}
                            </span>
                          )}
                          {article.published_at && (
                            <span>{format(new Date(article.published_at), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                        <div className="flex items-center text-primary font-medium mt-4 group-hover:translate-x-1 transition-transform">
                          Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(!pillarPages || pillarPages.length === 0) && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Guides Coming Soon
              </h3>
              <p className="text-muted-foreground">
                We're working on comprehensive guides to support your journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
