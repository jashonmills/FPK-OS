import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  personas: {
    id: string;
    display_name: string;
  };
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentSection = ({ postId, onCommentAdded }: CommentSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [postId]);

  const fetchComments = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          id,
          content,
          created_at,
          author_id,
          personas!post_comments_author_id_fkey (
            id,
            display_name
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data as any);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setFetching(false);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
          onCommentAdded();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        author_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      onCommentAdded();
    } catch (error: any) {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      {fetching ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link to={`/community/profile/${comment.personas.id}`}>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {comment.personas.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="bg-secondary rounded-lg p-3">
                  <Link 
                    to={`/community/profile/${comment.personas.id}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {comment.personas.display_name}
                  </Link>
                  <p className="text-sm text-secondary-foreground mt-1">
                    {comment.content}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-3">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="resize-none flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !newComment.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
