import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TransparentTile } from '@/components/ui/transparent-tile';

export default function BlogAnalytics() {
  const navigate = useNavigate();
  
  const { data: stats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('views_count, likes_count, published_at, status');
      
      const totalViews = posts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
      const totalLikes = posts?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0;
      const published = posts?.filter(p => p.status === 'published').length || 0;
      
      return { totalViews, totalLikes, totalPosts: posts?.length || 0, published };
    },
  });

  const { data: topPosts } = useQuery({
    queryKey: ['top-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('title, views_count, slug')
        .eq('status', 'published')
        .order('views_count', { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  const { data: dailyViews } = useQuery({
    queryKey: ['daily-views'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_analytics')
        .select('date, views')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date');
      return data || [];
    },
  });

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/blog')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>
      
      <TransparentTile className="p-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Blog Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Track your content performance</p>
      </TransparentTile>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.published}/{stats?.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views/Post</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.published ? Math.round(stats.totalViews / stats.published) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Daily Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyViews}>
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPosts}>
                <XAxis dataKey="title" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views_count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
