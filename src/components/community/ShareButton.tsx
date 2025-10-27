import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ShareButtonProps {
  postId: string;
  onShare?: () => void;
}

export default function ShareButton({ postId, onShare }: ShareButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isShared, setIsShared] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShareData();
  }, [postId, user]);

  const fetchShareData = async () => {
    // Get total share count
    const { count } = await supabase
      .from("shares")
      .select("*", { count: "exact", head: true })
      .eq("original_post_id", postId);

    setShareCount(count || 0);

    // Check if current user has shared
    if (user) {
      const { data } = await supabase
        .from("shares")
        .select("id")
        .eq("original_post_id", postId)
        .eq("sharing_user_id", user.id)
        .maybeSingle();

      setIsShared(!!data);
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share posts",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isShared) {
        const { error } = await supabase
          .from("shares")
          .delete()
          .eq("original_post_id", postId)
          .eq("sharing_user_id", user.id);

        if (error) throw error;

        setIsShared(false);
        setShareCount((prev) => prev - 1);
        toast({
          title: "Unshared",
          description: "Post removed from your shares",
        });
      } else {
        const { error } = await supabase
          .from("shares")
          .insert({
            original_post_id: postId,
            sharing_user_id: user.id,
          });

        if (error) throw error;

        setIsShared(true);
        setShareCount((prev) => prev + 1);
        toast({
          title: "Shared!",
          description: "Post shared to your followers",
        });
        onShare?.();
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          disabled={loading}
          className={isShared ? "text-primary" : ""}
        >
          <Share2 className="w-4 h-4 mr-1" />
          {shareCount > 0 && <span>{shareCount}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share post</p>
      </TooltipContent>
    </Tooltip>
  );
}
