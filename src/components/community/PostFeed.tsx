import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    display_name: string;
    avatar_url: string | null;
  };
}

interface PostFeedProps {
  circleId: string;
}

const PostFeed = ({ circleId }: PostFeedProps) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [circleName, setCircleName] = useState("");

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
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          author_id,
          personas!posts_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq("circle_id", circleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data as any);
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
    <div className="flex flex-col h-full">
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
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-2xl mx-auto w-full">
                <CreatePostForm circleId={circleId} onPostCreated={fetchPosts} />

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
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reflections" className="mt-0">
            <div className="h-[calc(100vh-12rem)]">
              <ReflectionsFeed />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PostFeed;
