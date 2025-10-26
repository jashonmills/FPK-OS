import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

interface CreatePostFormProps {
  circleId: string;
  onPostCreated: () => void;
}

const CreatePostForm = ({ circleId, onPostCreated }: CreatePostFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("posts").insert({
        circle_id: circleId,
        author_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;

      setContent("");
      onPostCreated();
      toast({
        title: "Post shared!",
        description: "Your message has been posted to the circle.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
