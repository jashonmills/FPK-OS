import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Reaction {
  id: string;
  emoji: string;
  persona_id: string;
  user_id: string;
}

interface GroupedReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
  reactionId?: string;
}

interface MessageReactionsProps {
  messageId: string;
}

export const MessageReactions = ({ messageId }: MessageReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchReactions();

    // Subscribe to reaction changes
    const channel = supabase
      .channel(`reactions:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`,
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId]);

  const fetchReactions = async () => {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('id, emoji, persona_id, user_id')
      .eq('message_id', messageId);

    if (error) {
      console.error('Error fetching reactions:', error);
      return;
    }

    setReactions(data || []);
  };

  const toggleReaction = async (emoji: string) => {
    if (!user) return;

    // Get user's persona
    const { data: persona } = await supabase
      .from('personas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!persona) {
      toast.error("Could not find your profile");
      return;
    }

    // Check if user already reacted with this emoji
    const existingReaction = reactions.find(
      (r) => r.persona_id === persona.id && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (error) {
        console.error('Error removing reaction:', error);
        toast.error("Failed to remove reaction");
      }
    } else {
      // Add reaction
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          persona_id: persona.id,
          emoji,
        });

      if (error) {
        console.error('Error adding reaction:', error);
        toast.error("Failed to add reaction");
      }
    }
  };

  // Group reactions by emoji
  const groupedReactions: GroupedReaction[] = reactions.reduce((acc, reaction) => {
    const existing = acc.find((r) => r.emoji === reaction.emoji);
    const isUserReaction = reaction.user_id === user?.id;

    if (existing) {
      existing.count++;
      if (isUserReaction) {
        existing.userReacted = true;
        existing.reactionId = reaction.id;
      }
    } else {
      acc.push({
        emoji: reaction.emoji,
        count: 1,
        userReacted: isUserReaction,
        reactionId: isUserReaction ? reaction.id : undefined,
      });
    }

    return acc;
  }, [] as GroupedReaction[]);

  if (groupedReactions.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {groupedReactions.map((reaction) => (
          <Tooltip key={reaction.emoji}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 px-2.5 py-0 text-sm gap-1.5 transition-all rounded-full backdrop-blur-md border group/reaction relative",
                  reaction.userReacted 
                    ? "bg-primary/20 border-primary/40 hover:bg-destructive/20 hover:border-destructive/40 shadow-md" 
                    : "bg-background/40 border-border/30 hover:bg-background/60 shadow-sm"
                )}
                onClick={() => toggleReaction(reaction.emoji)}
              >
                <span className={cn(
                  "text-base transition-all",
                  reaction.userReacted && "group-hover/reaction:opacity-30"
                )}>{reaction.emoji}</span>
                <span className={cn(
                  "text-xs font-medium",
                  reaction.userReacted ? "text-primary group-hover/reaction:text-destructive" : "text-muted-foreground"
                )}>{reaction.count}</span>
                {reaction.userReacted && (
                  <X className="w-3 h-3 absolute inset-0 m-auto opacity-0 group-hover/reaction:opacity-100 transition-opacity text-destructive" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{reaction.userReacted ? "Click to remove your reaction" : "React with this emoji"}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
