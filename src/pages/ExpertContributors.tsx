import { useNavigate } from 'react-router-dom';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function ExpertContributors() {
  const navigate = useNavigate();
  const { data: authors, isLoading: authorsLoading } = useBlogAuthors();
  const { data: allPosts } = useBlogPosts('published');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAuthorPostCount = (authorId: string) => {
    return allPosts?.filter(post => post.author_id === authorId).length || 0;
  };

  if (authorsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Expert Contributors | FPK University</title>
        <meta 
          name="description" 
          content="Meet our expert contributors who create evidence-based content on neurodiversity, learning differences, and educational strategies." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Expert Contributors</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Meet the experts, educators, and AI specialists who contribute to FPK University. 
              Our diverse team brings together decades of experience in neurodiversity, special education, 
              and learning sciences to create evidence-based content.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {authors?.map((author) => {
              const postCount = getAuthorPostCount(author.id);
              const slug = author.author_slug || author.id;
              
              return (
                <Card 
                  key={author.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/blog/author/${slug}`)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={author.avatar_url} alt={author.display_name} />
                        <AvatarFallback className="text-lg">
                          {getInitials(author.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {author.display_name}
                          </CardTitle>
                          {author.is_ai_author && (
                            <Badge variant="secondary" className="gap-1 flex-shrink-0">
                              <Sparkles className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        {author.credentials && (
                          <CardDescription className="text-sm line-clamp-1">
                            {author.credentials}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {author.bio && (
                      <p className="text-sm line-clamp-3 leading-relaxed">
                        {author.bio}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <FileText className="h-4 w-4" />
                      <span>
                        {postCount} {postCount === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {authors && authors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contributors found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
