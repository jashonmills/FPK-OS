import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    author_id: string;
    personas: {
      display_name: string;
      avatar_url: string | null;
    };
  };
  onDelete: () => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetchSupportData();
    fetchCommentCount();
  }, [post.id]);

  const fetchSupportData = async () => {
    const { data, error } = await supabase
      .from("post_supports")
      .select("id, user_id")
      .eq("post_id", post.id);

    if (!error && data) {
      setSupportCount(data.length);
      setHasSupported(data.some((s) => s.user_id === user?.id));
    }
  };

  const fetchCommentCount = async () => {
    const { count, error } = await supabase
      .from("post_comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);

    if (!error && count !== null) {
      setCommentCount(count);
    }
  };

  const handleSupport = async () => {
    if (!user) return;

    try {
      if (hasSupported) {
        const { error } = await supabase
          .from("post_supports")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (error) throw error;
        setHasSupported(false);
        setSupportCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from("post_supports")
          .insert({ post_id: post.id, user_id: user.id });

        if (error) throw error;
        setHasSupported(true);
        setSupportCount((prev) => prev + 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.personas.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {post.personas.display_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {user?.id === post.author_id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSupport}
            className={hasSupported ? "text-accent" : "text-muted-foreground"}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${hasSupported ? "fill-current" : ""}`}
            />
            {supportCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {commentCount}
          </Button>
        </div>

        {showComments && (
          <CommentSection
            postId={post.id}
            onCommentAdded={fetchCommentCount}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
