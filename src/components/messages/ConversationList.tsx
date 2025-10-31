import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Hash, Plus, Search, MessageCircle, Trash2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { CreateChannelDialog } from './CreateChannelDialog';
import { StartDMDialog } from './StartDMDialog';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ConversationList = ({ selectedConversationId, onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showStartDM, setShowStartDM] = useState(false);
  const [deleteChannelId, setDeleteChannelId] = useState<string | null>(null);
  const [deleteChannelName, setDeleteChannelName] = useState<string>('');

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

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          last_read_at,
          conversations!inner (
            id,
            type,
            name,
            created_at,
            is_private
          )
        `)
        .eq('user_id', user!.id);

      if (error) throw error;

      // Get last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        data.map(async (cp) => {
          const conv = cp.conversations as any;
          
          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id, profiles!inner(full_name)')
            .eq('conversation_id', conv.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_deleted', false)
            .gt('created_at', cp.last_read_at || '1970-01-01');

          // For DMs, get the other participant
          let dmPartner = null;
          let dmPartnerName = 'Unknown User';
          if (conv.type === 'dm') {
            const { data: participants } = await supabase
              .from('conversation_participants')
              .select('user_id, profiles!inner(full_name, avatar_url)')
              .eq('conversation_id', conv.id)
              .neq('user_id', user!.id)
              .maybeSingle();
            
            if (participants) {
              dmPartner = participants.profiles as any;
              dmPartnerName = dmPartner?.full_name || 'Unknown User';
            }
          }

          return {
            id: conv.id,
            type: conv.type,
            name: conv.type === 'channel' ? conv.name : dmPartnerName,
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessage?.created_at,
            unreadCount: unreadCount || 0,
            dmPartner,
            avatarUrl: dmPartner?.avatar_url,
            isPrivate: conv.is_private,
          };
        })
      );

      return conversationsWithDetails.sort((a, b) => {
        const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return bTime - aTime;
      });
    },
  });

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const channels = filteredConversations.filter(c => c.type === 'channel');
  const dms = filteredConversations.filter(c => c.type === 'dm');

  const deleteChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', channelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Channel deleted',
        description: 'The channel has been deleted successfully.',
      });
      setDeleteChannelId(null);
      setDeleteChannelName('');
      if (selectedConversationId === deleteChannelId) {
        onSelectConversation('');
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete channel',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, channelId: string, channelName: string) => {
    e.stopPropagation();
    setDeleteChannelId(channelId);
    setDeleteChannelName(channelName);
  };

  return (
    <>
      <div className="h-full flex flex-col overflow-x-hidden w-full">
        <div className="p-3 md:p-4 border-b border-border/50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background w-full"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 w-full">
            {/* Channels Header - Sticky */}
            <div className="sticky top-0 z-10 bg-background flex items-center justify-between gap-2 px-2 py-2 mb-1 rounded-md">
              <h3 className="text-sm font-semibold text-muted-foreground min-w-0 flex-shrink">Channels</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex-shrink-0 hover:bg-primary/10"
                onClick={() => setShowCreateChannel(true)}
                title="Create Channel"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Channels List */}
            <div className="space-y-1">
            {channels.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/60 transition-colors overflow-hidden group",
                  selectedConversationId === conv.id && "bg-muted/80"
                )}
              >
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="flex items-start gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Hash className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {conv.isPrivate && <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                        <span className="font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis">{conv.name}</span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs flex-shrink-0">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                </button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={(e) => handleDeleteClick(e, conv.id, conv.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            </div>

            {/* Direct Messages Header - Sticky */}
            <div className="sticky top-0 z-10 bg-background flex items-center justify-between gap-2 px-2 py-2 mb-1 mt-4 rounded-md">
              <h3 className="text-sm font-semibold text-muted-foreground">Direct Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex-shrink-0 hover:bg-primary/10"
                onClick={() => setShowStartDM(true)}
                title="Start Direct Message"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Direct Messages List */}
            <div className="space-y-1">
            {dms.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/60 transition-colors text-left overflow-hidden",
                  selectedConversationId === conv.id && "bg-muted/80"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {conv.dmPartner ? (
                    <UserAvatar
                      fullName={conv.dmPartner.full_name}
                      avatarUrl={conv.dmPartner.avatar_url}
                      size={32}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{conv.name}</span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs flex-shrink-0">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <CreateChannelDialog open={showCreateChannel} onOpenChange={setShowCreateChannel} />
      <StartDMDialog open={showStartDM} onOpenChange={setShowStartDM} onStartDM={onSelectConversation} />
      
      <AlertDialog open={!!deleteChannelId} onOpenChange={() => setDeleteChannelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete #{deleteChannelName}? This action cannot be undone and will delete all messages in this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteChannelId && deleteChannelMutation.mutate(deleteChannelId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
