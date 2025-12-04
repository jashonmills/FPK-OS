import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/contexts/UserRoleContext";

import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";
import { ReflectionsFeed } from "./ReflectionsFeed";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author_id: string;
  personas: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

interface PostFeedProps {
  circleId: string;
}

const PostFeed = ({ circleId }: PostFeedProps) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [circleName, setCircleName] = useState("");
  const [currentPersona, setCurrentPersona] = useState<{ id: string; display_name: string } | null>(null);

  useEffect(() => {
    const fetchCurrentPersona = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("personas")
        .select("id, display_name")
        .eq("user_id", user.id)
        .single();
      
      if (data) setCurrentPersona(data);
    };
    fetchCurrentPersona();
  }, [user]);

  useEffect(() => {
    if (!circleId) return;
    fetchCircleInfo();
    fetchPosts();
    subscribeToNewPosts();
  }, [circleId]);

  const fetchCircleInfo = async () => {
    const { data, error } = await supabase
      .from("circles")
      .select("name")
      .eq("id", circleId)
      .single();

    if (!error && data) {
      setCircleName(data.name);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // First fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, content, image_url, created_at, author_id")
        .eq("circle_id", circleId)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Then fetch persona data for each author
      const authorIds = [...new Set(postsData?.map(p => p.author_id) || [])];
      const { data: personasData, error: personasError } = await supabase
        .from("personas")
        .select("id, user_id, display_name, avatar_url")
        .in("id", authorIds);

      if (personasError) throw personasError;

      // Map personas to posts
      const personasMap = new Map(
        personasData?.map(p => [p.id, p]) || []
      );

      const postsWithPersonas = postsData?.map(post => ({
        ...post,
        personas: personasMap.get(post.author_id) || {
          id: "",
          display_name: "Unknown User",
          avatar_url: null
        }
      }));

      setPosts(postsWithPersonas as any);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewPosts = () => {
    const channel = supabase
      .channel(`posts-${circleId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `circle_id=eq.${circleId}`,
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div id="main-content-feed" className="flex flex-col h-full">
      <div className="border-b border-border p-4 sm:p-6 bg-card">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{circleName}</h2>
        
        <Tabs defaultValue="circle-feed" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="circle-feed" className="flex-1 sm:flex-none">
              Circle Feed
            </TabsTrigger>
            <TabsTrigger value="reflections" className="flex-1 sm:flex-none">
              Today's Reflections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="circle-feed" className="mt-0">
            <div className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-16rem)] overflow-y-auto">
              <div className="p-4 sm:p-6 pb-[40rem] space-y-4 sm:space-y-6 max-w-2xl mx-auto w-full">
                {currentPersona && (circleName !== "Announcements" || isAdmin) && (
                  <CreatePostForm 
                    circleId={circleId} 
                    personaId={currentPersona.id}
                    personaName={currentPersona.display_name}
                    onPostCreated={fetchPosts} 
                  />
                )}

                {posts.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <p className="text-sm sm:text-base text-muted-foreground">
                      No posts yet. Be the first to share something!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} onDelete={fetchPosts} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reflections" className="mt-0">
            <div className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-16rem)]">
              <ReflectionsFeed />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PostFeed;
