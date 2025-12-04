import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Users } from "lucide-react";

interface DailyPrompt {
  id: string;
  prompt_text: string;
  day_of_week: number;
}

export const DailyPromptCard = () => {
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [reflectionCount, setReflectionCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchDailyPrompt();
    subscribeToReflections();
  }, []);

  const fetchDailyPrompt = async () => {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    const { data, error } = await supabase
      .from("daily_prompts")
      .select("*")
      .eq("day_of_week", today)
      .single();

    if (error) {
      console.error("Error fetching daily prompt:", error);
      return;
    }

    setPrompt(data);
    if (data) {
      fetchReflectionCount(data.id);
    }
  };

  const fetchReflectionCount = async (promptId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("reflections")
      .select("*", { count: "exact", head: true })
      .eq("prompt_id", promptId)
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
          if (prompt) {
            fetchReflectionCount(prompt.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async () => {
    if (!content.trim() || !prompt) return;

    setLoading(true);

    try {
      // Get current user's persona
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: persona } = await supabase
        .from("personas")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!persona) throw new Error("No persona found");

      const { error } = await supabase.from("reflections").insert({
        prompt_id: prompt.id,
        author_id: persona.id,
        content: content.trim(),
      });

      if (error) throw error;

      toast({
        title: "Reflection shared!",
        description: "Your reflection has been added to the community.",
      });

      setContent("");
      fetchReflectionCount(prompt.id);
    } catch (error) {
      console.error("Error submitting reflection:", error);
      toast({
        title: "Error",
        description: "Failed to share reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!prompt) return null;

  return (
    <Card className="p-4 sm:p-6 mb-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base sm:text-lg mb-1">Today's Reflection</h3>
          <p className="text-sm sm:text-base text-muted-foreground">{prompt.prompt_text}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{reflectionCount} {reflectionCount === 1 ? "reflection" : "reflections"} shared today</span>
      </div>

      <Textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-3 min-h-[80px] resize-none"
      />

      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || loading}
        className="w-full sm:w-auto"
        size="sm"
      >
        {loading ? "Sharing..." : "Share Reflection"}
      </Button>
    </Card>
  );
};
