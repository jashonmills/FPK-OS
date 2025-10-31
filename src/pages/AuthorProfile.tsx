import { useQuery } from '@tanstack/react-query';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Mail, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AuthorProfile() {
  const { authorSlug } = useParams<{ authorSlug: string }>();

  const { data: author, isLoading } = useQuery({
    queryKey: ['author-profile', authorSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_authors')
        .select('*')
        .eq('slug', authorSlug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!authorSlug,
  });

  const { data: articles } = useQuery({
    queryKey: ['author-articles', author?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select(`
          *,
          category:article_categories(name, slug)
        `)
        .eq('author_id', author!.id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!author?.id,
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-subtle" />;
  }

  if (!author) {
    return <Navigate to="/authors" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${author.name} - Expert Contributor | FPK-X.com`}
        description={author.bio || `Articles and resources by ${author.name}, ${author.credentials || 'expert contributor'}`}
        author={author.name}
      />
      <SchemaMarkup
        schema={[
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: '/' },
              { name: 'Authors', url: '/authors' },
              { name: author.name, url: `/authors/${authorSlug}` },
            ],
          },
          {
            type: 'Organization',
            name: 'FPK-X.com',
            url: window.location.origin,
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <Link
            to="/authors"
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Authors
          </Link>

          <Card className="mb-12">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={author.photo_url || undefined} alt={author.name} />
                  <AvatarFallback className="text-4xl">
                    {author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {author.name}
                  </h1>
                  {author.credentials && (
                    <Badge variant="secondary" className="mb-4 text-base">
                      {author.credentials}
                    </Badge>
                  )}

                  {author.bio && (
                    <p className="text-lg text-muted-foreground mb-6">
                      {author.bio}
                    </p>
                  )}

                  <div className="flex gap-4 justify-center md:justify-start">
                    {author.linkedin_url && (
                      <a
                        href={author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Linkedin className="w-5 h-5" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="mb-8" />

          <section>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Articles by {author.name}
            </h2>

            {articles && articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/guides/${article.category?.slug || 'general'}/${article.slug}`}
                  >
                    <Card className="transition-all hover:shadow-elegant hover:border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {article.category && (
                            <Badge variant="outline">{article.category.name}</Badge>
                          )}
                          {article.published_at && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(article.published_at), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                        <CardTitle className="hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        {article.excerpt && (
                          <CardDescription className="line-clamp-2">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No published articles yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
