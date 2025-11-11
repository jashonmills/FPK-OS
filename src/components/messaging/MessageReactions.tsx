import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    <div className="flex flex-wrap gap-1 mt-1">
      {groupedReactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 py-0 text-xs gap-1",
            reaction.userReacted && "bg-primary/10 border border-primary"
          )}
          onClick={() => toggleReaction(reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          <span className="text-muted-foreground">{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};
