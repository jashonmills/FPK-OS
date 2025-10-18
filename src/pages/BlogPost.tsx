import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';
import { SchemaMarkup } from '@/components/blog/SchemaMarkup';
import { Helmet } from 'react-helmet';
import { SocialShare } from '@/components/blog/SocialShare';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { ga4 } from '@/utils/ga4Setup';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = useBlogPost(slug || '');
  
  const author = post?.blog_authors;

  // Track blog view on mount with retry logic
  useEffect(() => {
    if (!slug || !post) return;

    let hasTracked = false;

    const trackView = async (retryCount = 0) => {
      if (hasTracked) return;
      
      const maxRetries = 2;
      const retryDelay = 1000; // 1 second

      try {
        console.log(`[BlogPost] Tracking view for: ${slug} (attempt ${retryCount + 1})`);
        
        // Track in database via edge function
        const { data, error } = await supabase.functions.invoke('track-blog-view', {
          body: {
            post_slug: slug,
            referrer: document.referrer,
            user_agent: navigator.userAgent
          }
        });

        if (error) {
          console.error('[BlogPost] Edge function error:', error);
          throw error;
        }

        console.log('[BlogPost] View tracked successfully:', data);
        hasTracked = true;

        // Track in Google Analytics
        ga4.trackCustomEvent('blog_post_view', {
          post_id: post.id,
          post_slug: slug,
          post_title: post.title,
          author_id: post.author_id,
          read_time: post.read_time_minutes
        });
      } catch (error) {
        console.error(`[BlogPost] Error tracking view (attempt ${retryCount + 1}):`, error);
        
        // Retry logic
        if (retryCount < maxRetries) {
          console.log(`[BlogPost] Retrying in ${retryDelay}ms...`);
          setTimeout(() => trackView(retryCount + 1), retryDelay);
        } else {
          console.error('[BlogPost] Max retries reached, view tracking failed');
        }
      }
    };

    // Small delay to ensure edge function is deployed
    setTimeout(() => trackView(), 500);
  }, [slug, post]);

  const handleBackClick = () => {
    // Check if the user came from /resources page
    if (document.referrer.includes('/resources')) {
      navigate('/resources');
    } else {
      navigate('/blog');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | FPK University</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        {post.focus_keyword && <meta name="keywords" content={post.focus_keyword} />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ''} />
        {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
        <meta property="og:url" content={`https://fpkuniversity.com/blog/${post.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt || ''} />
        {post.featured_image_url && <meta name="twitter:image" content={post.featured_image_url} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://fpkuniversity.com/blog/${post.slug}`} />
      </Helmet>
      
      <SchemaMarkup post={post} />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>

        {post.featured_image_url && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time_minutes} min read
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views_count} views
              </div>
            </div>

            {/* Author and Social Share Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-y">
              {/* Author Info */}
              {author && (
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    const slug = author.author_slug || author.id;
                    navigate(`/blog/author/${slug}`);
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={author.avatar_url} alt={author.display_name} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {author.display_name}
                    </p>
                    {author.credentials && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {author.credentials}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Social Share - Inline */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Share:</span>
                <SocialShare 
                  title={post.title}
                  url={`/blog/${post.slug}`}
                  excerpt={post.excerpt || undefined}
                  variant="icons-only"
                />
              </div>
            </div>

            {post.focus_keyword && (
              <div className="mt-6">
                <Badge variant="secondary">{post.focus_keyword}</Badge>
              </div>
            )}
          </header>

          <Separator className="my-8" />

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Full Author Bio at Bottom */}
          {author && author.bio && (
            <>
              <Separator className="my-8" />
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                <div 
                  className="flex gap-4 p-6 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    const slug = author.author_slug || author.id;
                    navigate(`/blog/author/${slug}`);
                  }}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={author.avatar_url} alt={author.display_name} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg hover:text-primary transition-colors">
                        {author.display_name}
                      </h4>
                    </div>
                    
                    {author.credentials && (
                      <p className="text-sm text-muted-foreground">{author.credentials}</p>
                    )}
                    
                    <p className="text-sm leading-relaxed">
                      {author.bio.length > 200 
                        ? `${author.bio.substring(0, 200)}...` 
                        : author.bio}
                    </p>
                    
                    <Button variant="link" className="p-0 h-auto font-semibold">
                      View all articles by {author.display_name} →
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </article>

        <Separator className="my-12" />

        <div className="flex justify-center">
          <Button onClick={handleBackClick}>
            Read More Articles
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
