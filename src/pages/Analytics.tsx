import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Users, MessageSquare, Heart, Calendar, ArrowLeft } from "lucide-react";
import StatsCard from "@/components/analytics/StatsCard";
import EngagementChart from "@/components/analytics/EngagementChart";
import ActivityChart from "@/components/analytics/ActivityChart";
import TopPostsTable from "@/components/analytics/TopPostsTable";
import { getDateRange, calculateGrowthRate } from "@/utils/analyticsHelpers";

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30");

  // Memoize date range to prevent infinite re-renders
  const { startDate, endDate } = useMemo(() => {
    return getDateRange(parseInt(dateRange));
  }, [dateRange]);

  // Fetch user's persona
  const { data: persona, isLoading: personaLoading, isError: personaError, error: personaErrorDetails } = useQuery({
    queryKey: ["persona", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Debug logging
  console.log('Analytics Debug:', {
    personaLoading,
    personaError,
    hasPersona: !!persona,
    userId: user?.id,
  });

  // Fetch posts data
  const { data: postsData, isLoading: postsLoading, isError: postsError } = useQuery({
    queryKey: ["analytics-posts", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, created_at, content, image_url")
        .eq("author_id", persona?.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!persona?.id,
  });

  // Fetch all posts for comparison
  const { data: allPostsData } = useQuery({
    queryKey: ["analytics-all-posts", persona?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id")
        .eq("author_id", persona?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!persona?.id,
  });

  // Fetch supports received
  const { data: supportsData } = useQuery({
    queryKey: ["analytics-supports", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_supports")
        .select("id, created_at, post_id")
        .in("post_id", postsData?.map(p => p.id) || [])
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
    enabled: !!postsData && postsData.length > 0,
  });

  // Fetch comments received
  const { data: commentsData } = useQuery({
    queryKey: ["analytics-comments", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("id, created_at, post_id, author_id")
        .in("post_id", postsData?.map(p => p.id) || [])
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
    enabled: !!postsData && postsData.length > 0,
  });

  // Fetch comments made
  const { data: commentsMadeData } = useQuery({
    queryKey: ["analytics-comments-made", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("id, created_at")
        .eq("author_id", persona?.id)
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
    enabled: !!persona?.id,
  });

  // Fetch followers
  const { data: followersData, isLoading: followersLoading } = useQuery({
    queryKey: ["analytics-followers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("followers")
        .select("id, created_at")
        .eq("followed_user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch following
  const { data: followingData, isLoading: followingLoading } = useQuery({
    queryKey: ["analytics-following", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("following_user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch messages sent
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["analytics-messages", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, created_at")
        .eq("sender_id", persona?.id)
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
    enabled: !!persona?.id,
  });

  // Fetch reflections
  const { data: reflectionsData, isLoading: reflectionsLoading } = useQuery({
    queryKey: ["analytics-reflections", persona?.id, startDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reflections")
        .select("id, created_at")
        .eq("author_id", persona?.id)
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
    enabled: !!persona?.id,
  });

  const isLoading = personaLoading || postsLoading || followersLoading || followingLoading || messagesLoading || reflectionsLoading;
  const hasError = personaError || postsError;

  // Check authentication after all hooks
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Handle errors
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
            <CardDescription>
              {personaError ? "Unable to load your profile. " : ""}
              {postsError ? "Unable to load your posts. " : ""}
              Please try refreshing the page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Handle no persona case
  if (!persona) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
            <CardDescription>
              Please create a profile to view your analytics. Go to Community page to create your persona.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalPosts = postsData?.length || 0;
  const totalSupports = supportsData?.length || 0;
  const totalComments = commentsData?.length || 0;
  const totalCommentsMade = commentsMadeData?.length || 0;
  const totalFollowers = followersData?.length || 0;
  const totalFollowing = followingData?.length || 0;
  const totalMessages = messagesData?.length || 0;
  const totalReflections = reflectionsData?.length || 0;

  const engagementRate = totalPosts > 0 ? ((totalSupports + totalComments) / totalPosts).toFixed(1) : "0";
  const avgSupportsPerPost = totalPosts > 0 ? (totalSupports / totalPosts).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community/dashboard")}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Your Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your engagement, growth, and community impact
              </p>
            </div>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Posts Created"
            value={totalPosts}
            icon={<Calendar className="h-4 w-4" />}
            description={`${allPostsData?.length || 0} total posts`}
          />
          <StatsCard
            title="Supports Received"
            value={totalSupports}
            icon={<Heart className="h-4 w-4" />}
            description={`${avgSupportsPerPost} avg per post`}
          />
          <StatsCard
            title="Comments Received"
            value={totalComments}
            icon={<MessageSquare className="h-4 w-4" />}
            description={`${totalCommentsMade} comments made`}
          />
          <StatsCard
            title="Followers"
            value={totalFollowers}
            icon={<Users className="h-4 w-4" />}
            description={`Following ${totalFollowing}`}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Over Time</CardTitle>
                  <CardDescription>Posts, supports, and comments</CardDescription>
                </CardHeader>
                <CardContent>
                  <EngagementChart
                    postsData={postsData || []}
                    supportsData={supportsData || []}
                    commentsData={commentsData || []}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Patterns</CardTitle>
                  <CardDescription>Your posting activity by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityChart
                    postsData={postsData || []}
                    commentsData={commentsMadeData || []}
                    messagesData={messagesData || []}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most engaged content</CardDescription>
              </CardHeader>
              <CardContent>
                <TopPostsTable
                  posts={postsData || []}
                  supports={supportsData || []}
                  comments={commentsData || []}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Engagement Rate"
                value={engagementRate}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Per post average"
              />
              <StatsCard
                title="Total Interactions"
                value={totalSupports + totalComments}
                icon={<Heart className="h-4 w-4" />}
                description={`${totalSupports} supports, ${totalComments} comments`}
              />
              <StatsCard
                title="Response Rate"
                value={totalPosts > 0 ? ((totalComments / totalPosts) * 100).toFixed(0) + "%" : "0%"}
                icon={<MessageSquare className="h-4 w-4" />}
                description="Comments per post"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Timeline</CardTitle>
                <CardDescription>How your content performs over time</CardDescription>
              </CardHeader>
              <CardContent>
                <EngagementChart
                  postsData={postsData || []}
                  supportsData={supportsData || []}
                  commentsData={commentsData || []}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Posts by Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <TopPostsTable
                  posts={postsData || []}
                  supports={supportsData || []}
                  comments={commentsData || []}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Activity"
                value={totalPosts + totalCommentsMade + totalMessages}
                icon={<TrendingUp className="h-4 w-4" />}
                description="All actions combined"
              />
              <StatsCard
                title="Messages Sent"
                value={totalMessages}
                icon={<MessageSquare className="h-4 w-4" />}
                description="In the selected period"
              />
              <StatsCard
                title="Reflections"
                value={totalReflections}
                icon={<Calendar className="h-4 w-4" />}
                description="Daily reflections"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Your activity patterns throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart
                  postsData={postsData || []}
                  commentsData={commentsMadeData || []}
                  messagesData={messagesData || []}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Posts"
                value={allPostsData?.length || 0}
                icon={<Calendar className="h-4 w-4" />}
                description="All time"
              />
              <StatsCard
                title="With Images"
                value={postsData?.filter(p => p.image_url).length || 0}
                icon={<TrendingUp className="h-4 w-4" />}
                description={`${totalPosts > 0 ? ((postsData?.filter(p => p.image_url).length || 0) / totalPosts * 100).toFixed(0) : 0}% of posts`}
              />
              <StatsCard
                title="Avg Supports"
                value={avgSupportsPerPost}
                icon={<Heart className="h-4 w-4" />}
                description="Per post"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Best Performing Content</CardTitle>
                <CardDescription>Posts ranked by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <TopPostsTable
                  posts={postsData || []}
                  supports={supportsData || []}
                  comments={commentsData || []}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Followers"
                value={totalFollowers}
                icon={<Users className="h-4 w-4" />}
                description="People following you"
              />
              <StatsCard
                title="Following"
                value={totalFollowing}
                icon={<Users className="h-4 w-4" />}
                description="People you follow"
              />
              <StatsCard
                title="Community Reach"
                value={totalSupports + totalComments}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Total interactions"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Your community over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Follower growth chart - Coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
