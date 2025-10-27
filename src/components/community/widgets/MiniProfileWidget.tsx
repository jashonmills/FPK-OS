import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { User, FileText, Users, UserPlus } from "lucide-react";

interface MiniProfileWidgetProps {
  userId: string;
}

export const MiniProfileWidget = ({ userId }: MiniProfileWidgetProps) => {
  const [persona, setPersona] = useState<any>(null);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonaAndStats();
  }, [userId]);

  const fetchPersonaAndStats = async () => {
    try {
      const { data: personaData } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", userId)
        .single();

      setPersona(personaData);

      if (personaData) {
        const [followersRes, followingRes] = await Promise.all([
          supabase
            .from("followers")
            .select("id", { count: "exact", head: true })
            .eq("followed_user_id", userId),
          supabase
            .from("followers")
            .select("id", { count: "exact", head: true })
            .eq("following_user_id", userId),
        ]);

        setStats({
          posts: personaData.posts_count || 0,
          followers: followersRes.count || 0,
          following: followingRes.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WidgetCard title="My Profile" icon={<User className="h-4 w-4" />}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </WidgetCard>
    );
  }

  if (!persona) return null;

  return (
    <WidgetCard title="My Profile" icon={<User className="h-4 w-4" />}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={persona.avatar_url} />
            <AvatarFallback>{persona.display_name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{persona.display_name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {persona.persona_type?.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <p className="text-lg font-bold">{stats.posts}</p>
          </div>
          <div className="text-center border-x border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <p className="text-lg font-bold">{stats.followers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <UserPlus className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <p className="text-lg font-bold">{stats.following}</p>
          </div>
        </div>

        <Button asChild className="w-full" variant="outline">
          <Link to={`/community/profile/${persona.id}`}>
            View My Profile
          </Link>
        </Button>
      </div>
    </WidgetCard>
  );
};
