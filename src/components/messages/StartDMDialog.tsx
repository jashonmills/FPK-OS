import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

interface StartDMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartDM: (conversationId: string) => void;
}

export const StartDMDialog = ({ open, onOpenChange, onStartDM }: StartDMDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users-for-dm'],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', user!.id);

      if (error) throw error;
      return data;
    },
  });

  const startDMMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      const { data, error } = await supabase.rpc('get_or_create_dm_conversation', {
        user1_id: user!.id,
        user2_id: otherUserId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onStartDM(conversationId);
      setSelectedUserId(null);
      setSearchQuery('');
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a Direct Message</DialogTitle>
          <DialogDescription>
            Select a team member to start a private conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-lg">
            <div className="p-2 space-y-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors ${
                    selectedUserId === u.id ? 'bg-accent' : ''
                  }`}
                >
                  <UserAvatar
                    fullName={u.full_name || 'Unknown'}
                    avatarUrl={u.avatar_url}
                    size={36}
                  />
                  <span className="font-medium">{u.full_name}</span>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No team members found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedUserId && startDMMutation.mutate(selectedUserId)}
            disabled={!selectedUserId || startDMMutation.isPending}
          >
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
