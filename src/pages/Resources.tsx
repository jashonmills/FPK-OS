import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Calendar, Clock, ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

export default function Resources() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fixingPosts, setFixingPosts] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  
  const { data: posts, isLoading, refetch } = useBlogPosts('published');
  const { data: categories } = useBlogCategories();

  // Auto-fix published posts on first load if none are visible
  useEffect(() => {
    const fixPublishedPosts = async () => {
      if (!isLoading && posts && posts.length === 0 && !fixingPosts) {
        setFixingPosts(true);
        try {
          const { error } = await supabase.functions.invoke('fix-published-posts');
          if (!error) {
            await refetch();
          }
        } catch (err) {
          console.error('Error fixing posts:', err);
        } finally {
          setFixingPosts(false);
        }
      }
    };
    
    fixPublishedPosts();
  }, [isLoading, posts, fixingPosts, refetch]);

  // Get the 5 most recent posts
  const recentPosts = posts?.slice(0, 5) || [];
  
  // Get posts after the first 5 for "All Articles" section
  const olderPosts = posts?.slice(5) || [];
  
  // Filter posts based on search
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Helmet>
        <title>Educational Resources | FPK University</title>
        <meta name="description" content="Explore articles, guides, and expert insights on neurodiversity, IEP advocacy, study strategies, and empowering learning approaches." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 bg-white/50 backdrop-blur-sm hover:bg-white/70"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-fpk-orange/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-fpk-orange" />
            </div>
            <h1 className="text-4xl font-bold">Educational Resources</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Insights on education, neurodiversity, IEP advocacy, and learning strategies
          </p>
        </div>

        <div className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {categories && categories.length > 0 && (
            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between mt-3 hover:bg-white/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {selectedCategory 
                      ? `Category: ${categories.find(c => c.id === selectedCategory)?.name}` 
                      : 'All Categories'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? 'bg-fpk-orange hover:bg-fpk-orange/90' : ''}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? 'bg-fpk-orange hover:bg-fpk-orange/90' : ''}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {!searchQuery && !selectedCategory && recentPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 bg-white/70 backdrop-blur-sm rounded-lg p-4">
              Latest Articles
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map(post => (
                <Card 
                  key={post.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.featured_image_url && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image_url}
                        alt={post.featured_image_alt || post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt || post.meta_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Only show All Articles section if there are more than 5 posts total, or if search/filter is active */}
        {(searchQuery || selectedCategory || (posts && posts.length > 5)) && (
          <div>
            <h2 className="text-2xl font-bold mb-6 bg-white/70 backdrop-blur-sm rounded-lg p-4">
              {searchQuery || selectedCategory ? 'Search Results' : 'All Articles'}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(searchQuery || selectedCategory ? filteredPosts : olderPosts).map(post => (
              <Card 
                key={post.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {post.featured_image_url && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={post.featured_image_url}
                      alt={post.featured_image_alt || post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt || post.meta_description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
              </Card>
            ))}
          </div>

            {(searchQuery || selectedCategory ? filteredPosts : olderPosts).length === 0 && (
              <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg">
                <p className="text-muted-foreground">No articles found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
