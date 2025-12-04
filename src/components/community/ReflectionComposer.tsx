import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReflectionComposerProps {
  promptId: string;
  onReflectionCreated: () => void;
}

export const ReflectionComposer = ({ promptId, onReflectionCreated }: ReflectionComposerProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: persona } = await supabase
        .from("personas")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!persona) throw new Error("No persona found");

      const { error } = await supabase.from("reflections").insert({
        prompt_id: promptId,
        author_id: persona.id,
        content: content.trim(),
      });

      if (error) throw error;

      toast({
        title: "Reflection shared!",
        description: "Your reflection has been added to the community.",
      });

      setContent("");
      onReflectionCreated();
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

  return (
    <Card className="p-4 sm:p-6">
      <Textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-3 min-h-[100px] resize-none"
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Sharing..." : "Share Reflection"}
      </Button>
    </Card>
  );
};
