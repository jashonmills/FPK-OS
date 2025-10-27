import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, MessageSquare, Heart, Award, Users } from "lucide-react";
import PostCard from "@/components/community/PostCard";
import EditProfileDialog from "@/components/community/EditProfileDialog";
import { InviteFriendsSection } from "@/components/community/InviteFriendsSection";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface Persona {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  persona_type: string;
  posts_count: number;
  comments_count: number;
  supports_received_count: number;
  user_id: string;
}

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author_id: string;
  circle_id: string;
  personas: {
    display_name: string;
    avatar_url: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  posts: {
    content: string;
    circle_id: string;
  };
}

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  daily_prompts: {
    prompt_text: string;
  } | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const isInviteSystemEnabled = useFeatureFlag('user_invite_system_enabled');

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch persona
      const { data: personaData, error: personaError } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (personaError) throw personaError;
      setPersona(personaData);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          author_id,
          circle_id
        `)
        .eq("author_id", personaData.id)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Manually fetch personas for each post
      const formattedPosts = await Promise.all(
        (postsData || []).map(async (post: any) => {
          const { data: personaInfo } = await supabase
            .from("personas")
            .select("display_name, avatar_url")
            .eq("id", post.author_id)
            .single();

          return {
            ...post,
            personas: personaInfo || { display_name: "Unknown", avatar_url: null },
          };
        })
      );

      setPosts(formattedPosts);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select(`
          *,
          posts!inner (
            content,
            circle_id
          )
        `)
        .eq("author_id", personaData.id)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from("reflections")
        .select(`
          *,
          daily_prompts (
            prompt_text
          )
        `)
        .eq("author_id", personaData.id)
        .order("created_at", { ascending: false });

      if (reflectionsError) throw reflectionsError;
      setReflections(reflectionsData || []);

      // Fetch referral count if invite system enabled
      if (isInviteSystemEnabled) {
        const { data: referralsData, error: referralsError } = await supabase
          .from("referrals")
          .select("id", { count: 'exact' })
          .eq("inviting_user_id", user.id);
        
        if (!referralsError && referralsData) {
          setReferralCount(referralsData.length);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!persona) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/community")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Button onClick={() => setEditDialogOpen(true)}>
            Edit Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{persona.posts_count}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{persona.comments_count}</p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{persona.supports_received_count}</p>
                <p className="text-sm text-muted-foreground">Supports</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reflections.length}</p>
                <p className="text-sm text-muted-foreground">Reflections</p>
              </div>
            </div>
          </Card>

          {isInviteSystemEnabled && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{referralCount}</p>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="comments">My Comments</TabsTrigger>
            <TabsTrigger value="reflections">My Reflections</TabsTrigger>
            {isInviteSystemEnabled && (
              <TabsTrigger value="invites">Invite Friends</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">You haven't created any posts yet</p>
              </Card>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={fetchDashboardData} />
              ))
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {comments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">You haven't made any comments yet</p>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <p className="text-sm mb-2">{comment.content}</p>
                  <div className="text-xs text-muted-foreground">
                    On post: "{comment.posts.content.substring(0, 50)}..."
                    <br />
                    {new Date(comment.created_at).toLocaleDateString()} at{" "}
                    {new Date(comment.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reflections" className="space-y-4">
            {reflections.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">You haven't written any reflections yet</p>
              </Card>
            ) : (
              reflections.map((reflection) => (
                <Card key={reflection.id} className="p-4">
                  {reflection.daily_prompts && (
                    <div className="mb-3 pb-3 border-b">
                      <p className="text-sm font-medium text-muted-foreground">Prompt:</p>
                      <p className="text-sm italic">"{reflection.daily_prompts.prompt_text}"</p>
                    </div>
                  )}
                  <p className="text-sm mb-2">{reflection.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reflection.created_at).toLocaleDateString()} at{" "}
                    {new Date(reflection.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              ))
            )}
          </TabsContent>

          {isInviteSystemEnabled && (
            <TabsContent value="invites">
              <InviteFriendsSection userId={user.id} />
            </TabsContent>
          )}
        </Tabs>

        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          persona={persona}
          onProfileUpdated={fetchDashboardData}
        />
      </div>
    </div>
  );
}
