import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Authors() {
  const { data: authors } = useQuery({
    queryKey: ['authors-directory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_authors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEOHead
        title="Our Expert Contributors | FPX CNS-App"
        description="Meet our team of experienced professionals contributing evidence-based content on neurodiversity, special education, autism, ADHD, and behavioral support."
        keywords={['expert authors', 'neurodiversity experts', 'special education professionals', 'BCBA', 'licensed therapists']}
      />
      <SchemaMarkup
        schema={{
          type: 'BreadcrumbList',
          items: [
            { name: 'Home', url: '/' },
            { name: 'Authors', url: '/authors' },
          ],
        }}
      />

      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-16">
          <header className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Expert Contributors
            </h1>
            <p className="text-xl text-muted-foreground">
              Licensed professionals and experienced practitioners dedicated to providing evidence-based guidance
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {authors?.map((author) => (
              <Link key={author.id} to={`/authors/${author.slug}`}>
                <Card className="h-full transition-all hover:shadow-elegant hover:border-primary/20">
                  <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={author.photo_url || undefined} alt={author.name} />
                      <AvatarFallback className="text-2xl">
                        {author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{author.name}</CardTitle>
                    {author.credentials && (
                      <Badge variant="secondary" className="mx-auto mt-2">
                        {author.credentials}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {author.bio && (
                      <p className="text-sm text-muted-foreground text-center line-clamp-4">
                        {author.bio}
                      </p>
                    )}
                    <div className="flex justify-center gap-4 mt-4">
                      {author.linkedin_url && (
                        <a
                          href={author.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {(!authors || authors.length === 0) && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No authors available yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
