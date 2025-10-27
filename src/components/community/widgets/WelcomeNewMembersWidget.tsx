import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FollowButton from "../FollowButton";

export const WelcomeNewMembersWidget = () => {
  const { user } = useAuth();
  const [newMembers, setNewMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewMembers();
    subscribeToNewMembers();
  }, []);

  const fetchNewMembers = async () => {
    try {
      const { data } = await supabase
        .from("personas")
        .select("id, user_id, display_name, avatar_url, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setNewMembers(data || []);
    } catch (error) {
      console.error("Error fetching new members:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewMembers = () => {
    const channel = supabase
      .channel("new-personas")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "personas",
        },
        () => {
          fetchNewMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <WidgetCard title="Welcome New Members" icon={<UserPlus className="h-4 w-4" />}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Welcome New Members"
      icon={<UserPlus className="h-4 w-4" />}
    >
      <div className="space-y-3">
        {newMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-2">
            <Link
              to={`/community/profile/${member.id}`}
              className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.display_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                </p>
              </div>
            </Link>
            {user?.id !== member.user_id && (
              <FollowButton targetUserId={member.user_id} size="sm" />
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};
