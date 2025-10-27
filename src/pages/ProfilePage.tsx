import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/community/PostCard";
import EditProfileDialog from "@/components/community/EditProfileDialog";
import { ArrowLeft, MessageCircle, Pencil } from "lucide-react";
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

interface Circle {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  is_private: boolean;
}

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  daily_prompts: {
    prompt_text: string;
    day_of_week: number;
  } | null;
}

export default function ProfilePage() {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

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

      // Fetch circles the user is a member of
      const { data: circlesData, error: circlesError } = await supabase
        .from("circle_members")
        .select(`
          circles!inner (
            id,
            name,
            description,
            created_at,
            is_private
          )
        `)
        .eq("user_id", personaData.user_id);

      if (circlesError) throw circlesError;

      const formattedCircles = circlesData?.map((cm: any) => cm.circles).filter((c: any) => !c.is_private) || [];
      setCircles(formattedCircles);

      // Fetch reflections by this user
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from("reflections")
        .select(`
          *,
          daily_prompts (
            prompt_text,
            day_of_week
          )
        `)
        .eq("author_id", personaId)
        .order("created_at", { ascending: false });

      if (reflectionsError) throw reflectionsError;

      const formattedReflections = reflectionsData?.map((r: any) => ({
        id: r.id,
        content: r.content,
        created_at: r.created_at,
        daily_prompts: r.daily_prompts,
      })) || [];

      setReflections(formattedReflections);
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

              {user && persona.user_id === user.id ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
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
              )}
            </div>

            {persona.bio && (
              <p className="text-sm sm:text-base text-muted-foreground mt-4">{persona.bio}</p>
            )}
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="circles">Circles</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {posts.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center">
              <p className="text-muted-foreground">No posts yet</p>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
            ))
          )}
        </TabsContent>

        <TabsContent value="circles" className="space-y-4">
          {circles.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center">
              <p className="text-muted-foreground">Not a member of any public circles yet</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {circles.map((circle) => (
                <Card
                  key={circle.id}
                  className="p-4 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => navigate(`/community?circle=${circle.id}`)}
                >
                  <h3 className="font-semibold mb-2">{circle.name}</h3>
                  {circle.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {circle.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Joined {new Date(circle.created_at).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reflections" className="space-y-4">
          {reflections.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center">
              <p className="text-muted-foreground">No reflections shared yet</p>
            </Card>
          ) : (
            reflections.map((reflection) => (
              <Card key={reflection.id} className="p-4 sm:p-6">
                {reflection.daily_prompts && (
                  <div className="mb-3 pb-3 border-b">
                    <p className="text-sm font-medium text-muted-foreground">
                      Daily Prompt:
                    </p>
                    <p className="text-sm italic">"{reflection.daily_prompts.prompt_text}"</p>
                  </div>
                )}
                <p className="text-sm sm:text-base mb-3">{reflection.content}</p>
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
      </Tabs>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        persona={persona}
        onProfileUpdated={fetchPersonaAndPosts}
      />
      </div>
    </div>
  );
}
