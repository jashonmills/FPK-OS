import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Sparkles, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReflectionComposer } from "./ReflectionComposer";
import { Link } from "react-router-dom";

interface Reflection {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  personas: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

interface DailyPrompt {
  id: string;
  prompt_text: string;
  day_of_week: number;
}

export const ReflectionsFeed = () => {
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [reflectionCount, setReflectionCount] = useState(0);

  useEffect(() => {
    fetchDailyPrompt();
    subscribeToReflections();
  }, []);

  useEffect(() => {
    if (prompt) {
      fetchReflections();
      fetchReflectionCount();
    }
  }, [prompt]);

  const fetchDailyPrompt = async () => {
    const today = new Date().getDay();
    
    const { data, error } = await supabase
      .from("daily_prompts")
      .select("*")
      .eq("day_of_week", today)
      .single();

    if (error) {
      console.error("Error fetching daily prompt:", error);
      setLoading(false);
      return;
    }

    setPrompt(data);
  };

  const fetchReflections = async () => {
    if (!prompt) return;

    setLoading(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data, error } = await supabase
        .from("reflections")
        .select(`
          id,
          content,
          created_at,
          author_id,
          personas!reflections_author_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq("prompt_id", prompt.id)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReflections(data as any);
    } catch (error) {
      console.error("Error fetching reflections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReflectionCount = async () => {
    if (!prompt) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("reflections")
      .select("*", { count: "exact", head: true })
      .eq("prompt_id", prompt.id)
      .gte("created_at", today.toISOString());

    if (!error && count !== null) {
      setReflectionCount(count);
    }
  };

  const subscribeToReflections = () => {
    const channel = supabase
      .channel("reflections_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reflections",
        },
        () => {
          fetchReflections();
          fetchReflectionCount();
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

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No prompt available for today.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-2xl mx-auto w-full">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg mb-1">Today's Reflection</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{prompt.prompt_text}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{reflectionCount} {reflectionCount === 1 ? "reflection" : "reflections"} shared today</span>
          </div>
        </Card>

        <ReflectionComposer promptId={prompt.id} onReflectionCreated={fetchReflections} />

        {reflections.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-sm sm:text-base text-muted-foreground">
              No reflections yet. Be the first to share!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <Card key={reflection.id} className="p-4 sm:p-6">
                <div className="flex gap-3 mb-3">
                  <Link to={`/community/profile/${reflection.author_id}`}>
                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={reflection.personas.avatar_url || undefined} />
                      <AvatarFallback>
                        {reflection.personas.display_name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/community/profile/${reflection.author_id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {reflection.personas.display_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reflection.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap break-words">
                  {reflection.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
