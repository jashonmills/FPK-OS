import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Hash, Plus, Search, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { CreateChannelDialog } from './CreateChannelDialog';
import { StartDMDialog } from './StartDMDialog';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ConversationList = ({ selectedConversationId, onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showStartDM, setShowStartDM] = useState(false);

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
            created_at
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
          if (conv.type === 'dm') {
            const { data: participants } = await supabase
              .from('conversation_participants')
              .select('user_id, profiles!inner(full_name, avatar_url)')
              .eq('conversation_id', conv.id)
              .neq('user_id', user!.id)
              .single();
            
            if (participants) {
              dmPartner = participants.profiles as any;
            }
          }

          return {
            id: conv.id,
            type: conv.type,
            name: conv.type === 'channel' ? conv.name : dmPartner?.full_name || 'Unknown User',
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessage?.created_at,
            unreadCount: unreadCount || 0,
            dmPartner,
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

  return (
    <>
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Channels</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowCreateChannel(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {channels.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left",
                  selectedConversationId === conv.id && "bg-accent"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{conv.name}</span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))}

            <div className="flex items-center justify-between px-2 py-1 mb-1 mt-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Direct Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowStartDM(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {dms.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left",
                  selectedConversationId === conv.id && "bg-accent"
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{conv.name}</span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <CreateChannelDialog open={showCreateChannel} onOpenChange={setShowCreateChannel} />
      <StartDMDialog open={showStartDM} onOpenChange={setShowStartDM} onStartDM={onSelectConversation} />
    </>
  );
};
