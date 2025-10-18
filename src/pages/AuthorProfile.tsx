import { useParams, useNavigate } from 'react-router-dom';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, Sparkles, Twitter, Linkedin, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

export default function AuthorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: authors, isLoading: authorsLoading } = useBlogAuthors();
  const { data: allPosts, isLoading: postsLoading } = useBlogPosts('published');
  
  const author = authors?.find(a => 
    a.author_slug === slug || a.id === slug
  );
  
  const authorPosts = allPosts?.filter(post => post.author_id === author?.id) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (authorsLoading || postsLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-32 w-full mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Author not found</h1>
        <Button onClick={() => navigate('/blog')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{author.display_name} | FPK University</title>
        <meta name="description" content={author.bio || `Articles by ${author.display_name}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {/* Author Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 p-8 border rounded-lg bg-muted/30">
            <Avatar className="h-32 w-32">
              <AvatarImage src={author.avatar_url} alt={author.display_name} />
              <AvatarFallback className="text-2xl">
                {getInitials(author.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{author.display_name}</h1>
                  {author.is_ai_author && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-4 w-4" />
                      AI Author
                    </Badge>
                  )}
                </div>
                {author.credentials && (
                  <p className="text-lg text-muted-foreground">{author.credentials}</p>
                )}
              </div>
              
              {author.bio && (
                <p className="text-base leading-relaxed">{author.bio}</p>
              )}
              
              {author.social_links && (
                <div className="flex gap-3">
                  {author.social_links.twitter && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <a href={author.social_links.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {author.social_links.linkedin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <a href={author.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {author.social_links.website && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <a href={author.social_links.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Articles by Author */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Articles by {author.display_name} ({authorPosts.length})
            </h2>
            
            {authorPosts.length === 0 ? (
              <p className="text-muted-foreground">No articles published yet.</p>
            ) : (
              <div className="grid gap-6">
                {authorPosts.map(post => (
                  <Card 
                    key={post.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="flex gap-6">
                      {post.featured_image_url && (
                        <div className="relative w-48 h-48 overflow-hidden rounded-l-lg flex-shrink-0">
                          <img
                            src={post.featured_image_url}
                            alt={post.featured_image_alt || post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 py-6 pr-6">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.read_time_minutes} min read
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
