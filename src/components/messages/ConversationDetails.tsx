import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { Users } from 'lucide-react';

interface ConversationDetailsProps {
  conversationId: string;
}

export const ConversationDetails = ({ conversationId }: ConversationDetailsProps) => {
  const { data: conversation } = useQuery({
    queryKey: ['conversation-details', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: participants = [] } = useQuery({
    queryKey: ['conversation-participants', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('profiles!inner(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return data.map(p => p.profiles);
    },
  });

  return (
    <div className="w-80 border-l border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">
          {conversation?.type === 'channel' ? 'Channel Details' : 'Conversation Details'}
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {conversation?.type === 'channel' && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-1">Channel Name</h4>
                <p className="text-sm text-muted-foreground">#{conversation.name}</p>
              </div>

              {conversation.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{conversation.description}</p>
                </div>
              )}

              <Separator />
            </>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              <h4 className="text-sm font-semibold">
                Members ({participants.length})
              </h4>
            </div>
            <div className="space-y-2">
              {participants.map((participant: any) => (
                <div key={participant.id} className="flex items-center gap-2">
                  <UserAvatar
                    fullName={participant.full_name}
                    avatarUrl={participant.avatar_url}
                    size={32}
                  />
                  <span className="text-sm">{participant.full_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
