import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2, MoreVertical, Pin, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import CommentSection from "./CommentSection";
import ShareButton from "./ShareButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: {
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
  const [isPinning, setIsPinning] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchSupportData();
    fetchCommentCount();
    checkBookmarkStatus();
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

  const checkBookmarkStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", post.id)
      .maybeSingle();
    
    setIsBookmarked(!!data);
  };

  const toggleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id);

        if (error) throw error;
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Post removed from bookmarks",
        });
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, post_id: post.id });

        if (error) throw error;
        setIsBookmarked(true);
        toast({
          title: "Post bookmarked",
          description: "Post saved to bookmarks",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

  const handlePinPost = async () => {
    if (!user) return;

    setIsPinning(true);
    try {
      const { data: persona } = await supabase
        .from("personas")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!persona) throw new Error("Persona not found");

      const { error } = await supabase
        .from("personas")
        .update({ pinned_post_id: post.id })
        .eq("id", persona.id);

      if (error) throw error;

      toast({
        title: "Post pinned",
        description: "This post is now pinned to your profile",
      });
    } catch (error: any) {
      console.error("Error pinning post:", error);
      toast({
        title: "Error",
        description: "Failed to pin post",
        variant: "destructive",
      });
    } finally {
      setIsPinning(false);
    }
  };

  const isAuthor = user && post.author_id;

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader className="pb-3 p-4 sm:p-6 sm:pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to={`/community/profile/${post.personas.id}`}>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">
                  {post.personas.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link 
                to={`/community/profile/${post.personas.id}`}
                className="font-semibold text-sm sm:text-base text-foreground hover:underline"
              >
                {post.personas.display_name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePinPost} disabled={isPinning}>
                  <Pin className="w-4 h-4 mr-2" />
                  Pin to Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap">{post.content}</p>
          
          {/* Display image if present */}
          {post.image_url && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="w-full h-auto object-cover max-h-96"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSupport}
            className={hasSupported ? "text-accent" : "text-muted-foreground"}
          >
            <Heart
              className={`h-4 w-4 mr-1 sm:mr-2 ${hasSupported ? "fill-current" : ""}`}
            />
            <span className="text-sm">{supportCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-sm">{commentCount}</span>
          </Button>
          <ShareButton postId={post.id} />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className={cn("text-muted-foreground", isBookmarked && "text-primary")}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
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
