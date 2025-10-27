import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  targetUserId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function FollowButton({ targetUserId, variant = "outline", size = "sm" }: FollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId !== user.id) {
      checkFollowStatus();
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("followers")
      .select("id")
      .eq("following_user_id", user.id)
      .eq("followed_user_id", targetUserId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleToggleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("following_user_id", user.id)
          .eq("followed_user_id", targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user",
        });
      } else {
        const { error } = await supabase
          .from("followers")
          .insert({
            following_user_id: user.id,
            followed_user_id: targetUserId,
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || targetUserId === user.id) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
