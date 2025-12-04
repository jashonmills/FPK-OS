import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { Users, X, Lock, UserPlus, Globe } from 'lucide-react';
import { InviteMembersDialog } from './InviteMembersDialog';

interface ConversationDetailsProps {
  conversationId: string;
  onClose: () => void;
}

export const ConversationDetails = ({ conversationId, onClose }: ConversationDetailsProps) => {
  const { user } = useAuth();
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ['user-role', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
  });

  const isAdmin = userRole === 'admin';

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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {conversation?.type === 'channel' ? 'Channel Details' : 'Details'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
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

          {conversation?.type === 'channel' && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-2">Channel Privacy</h4>
                <div className="flex items-center gap-2">
                  {conversation.is_private ? (
                    <>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Only invited members can access
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="gap-1">
                        <Globe className="h-3 w-3" />
                        Public
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        All team members can access
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h4 className="text-sm font-semibold">
                  Members ({participants.length})
                </h4>
              </div>
              {isAdmin && conversation?.type === 'channel' && conversation?.is_private && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => setShowInviteDialog(true)}
                >
                  <UserPlus className="h-3 w-3" />
                  Invite
                </Button>
              )}
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

      <InviteMembersDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        conversationId={conversationId}
      />
    </div>
  );
};
