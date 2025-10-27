import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PostCard from "@/components/community/PostCard";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Persona {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  persona_type: string;
  created_at: string;
  user_id: string;
}

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
  circle_id: string;
}

export default function ProfilePage() {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (personaId) {
      fetchPersonaAndPosts();
    }
  }, [personaId]);

  const fetchPersonaAndPosts = async () => {
    try {
      // Fetch persona details
      const { data: personaData, error: personaError } = await supabase
        .from("personas")
        .select("*")
        .eq("id", personaId)
        .single();

      if (personaError) throw personaError;
      setPersona(personaData);

      // Fetch posts by this persona
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          personas!posts_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq("author_id", personaId)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const formattedPosts = postsData?.map((post: any) => ({
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        author_id: post.author_id,
        personas: {
          display_name: post.personas.display_name,
          avatar_url: post.personas.avatar_url,
        },
        circle_id: post.circle_id,
      })) || [];

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = () => {
    // Refetch posts after deletion
    fetchPersonaAndPosts();
  };

  const handleSendMessage = async () => {
    if (!user || !persona) return;

    setStartingChat(true);
    try {
      const { data, error } = await supabase.functions.invoke('start-conversation', {
        body: {
          participant_ids: [persona.user_id],
          is_group: false,
          group_name: null,
        },
      });

      if (error) throw error;

      navigate(`/messages/${data.conversation_id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-y-auto bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Card className="p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen overflow-y-auto bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/community")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="p-6">
            <p className="text-muted-foreground">Persona not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/community")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={persona.avatar_url || undefined} />
            <AvatarFallback className="text-xl sm:text-2xl">
              {persona.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{persona.display_name}</h1>
                <Badge variant="secondary" className="mb-2">
                  {persona.persona_type}
                </Badge>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Member since {new Date(persona.created_at).toLocaleDateString()}
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={handleSendMessage}
                disabled={startingChat || !user}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {startingChat ? "Starting..." : "Message"}
              </Button>
            </div>

            {persona.bio && (
              <p className="text-sm sm:text-base text-muted-foreground mt-4">{persona.bio}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Posts by {persona.display_name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center">
            <p className="text-muted-foreground">No posts yet</p>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
          ))
        )}
      </div>
      </div>
    </div>
  );
}
