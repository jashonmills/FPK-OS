import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { toast } from '@/hooks/use-toast';

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export const InviteMembersDialog = ({ open, onOpenChange, conversationId }: InviteMembersDialogProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch current participants
  const { data: participants = [] } = useQuery({
    queryKey: ['conversation-participants', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return data.map(p => p.user_id);
    },
    enabled: open,
  });

  // Fetch all profiles except current participants
  const { data: availableMembers = [] } = useQuery({
    queryKey: ['available-members', conversationId, participants],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .not('id', 'in', `(${participants.join(',')})`);

      if (error) throw error;
      return data;
    },
    enabled: open && participants.length > 0,
  });

  const inviteMembersMutation = useMutation({
    mutationFn: async (memberIds: string[]) => {
      const inserts = memberIds.map(userId => ({
        conversation_id: conversationId,
        user_id: userId,
      }));

      const { error } = await supabase
        .from('conversation_participants')
        .insert(inserts);

      if (error) throw error;

      // Create notifications for invited members
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const notifications = memberIds.map(userId => ({
          recipient_id: userId,
          sender_id: user.id,
          type: 'channel_invite',
          content: 'invited you to a channel',
          metadata: { conversation_id: conversationId },
        }));

        await supabase.from('notifications').insert(notifications);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Members invited',
        description: `Successfully invited ${selectedMembers.length} member(s) to the channel.`,
      });
      queryClient.invalidateQueries({ queryKey: ['conversation-participants', conversationId] });
      setSelectedMembers([]);
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to invite members. Please try again.',
        variant: 'destructive',
      });
      console.error('Error inviting members:', error);
    },
  });

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleInvite = () => {
    if (selectedMembers.length === 0) return;
    inviteMembersMutation.mutate(selectedMembers);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Select team members to invite to this private channel.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-2">
            {availableMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                All team members are already in this channel.
              </p>
            ) : (
              availableMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleToggleMember(member.id)}
                >
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleToggleMember(member.id)}
                  />
                  <UserAvatar
                    fullName={member.full_name || member.email}
                    avatarUrl={member.avatar_url}
                    size={32}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedMembers.length === 0 || inviteMembersMutation.isPending}
          >
            {inviteMembersMutation.isPending
              ? 'Inviting...'
              : `Invite ${selectedMembers.length > 0 ? `(${selectedMembers.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
