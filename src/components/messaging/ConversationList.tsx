import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  currentUserId?: string;
}

export function ConversationList({
  conversations,
  isLoading,
  selectedId,
  onSelect,
  currentUserId
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Search by name
    if (conv.name?.toLowerCase().includes(query)) return true;
    
    // Search by participant names
    const participantMatch = conv.participants?.some(p => 
      p.profile?.full_name?.toLowerCase().includes(query) ||
      p.profile?.email?.toLowerCase().includes(query)
    );
    if (participantMatch) return true;
    
    return false;
  });

  const getConversationDisplay = (conv: Conversation) => {
    if (conv.type === 'group') {
      return {
        name: conv.name || 'Group Chat',
        avatar: null,
        initials: conv.name?.substring(0, 2).toUpperCase() || 'GC',
        isGroup: true
      };
    }

    // For DMs, show the other participant
    const otherParticipant = conv.participants?.find(p => p.user_id !== user?.id);
    return {
      name: otherParticipant?.profile?.full_name || otherParticipant?.profile?.email || 'Unknown',
      avatar: otherParticipant?.profile?.avatar_url,
      initials: (otherParticipant?.profile?.full_name || 'U').substring(0, 2).toUpperCase(),
      isGroup: false
    };
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border/50">
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

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to get started</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const display = getConversationDisplay(conv);
              const lastMessage = conv.last_message;
              const hasUnread = (conv.unread_count || 0) > 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    selectedId === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={display.avatar || undefined} />
                      <AvatarFallback className={display.isGroup ? "bg-primary/20" : ""}>
                        {display.isGroup ? <Users className="h-5 w-5" /> : display.initials}
                      </AvatarFallback>
                    </Avatar>
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "font-medium truncate",
                        hasUnread && "text-foreground"
                      )}>
                        {display.name}
                      </span>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    
                    {lastMessage && (
                      <p className={cn(
                        "text-sm truncate",
                        hasUnread 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground"
                      )}>
                        {lastMessage.sender_id === user?.id && "You: "}
                        {lastMessage.content}
                      </p>
                    )}

                    {display.isGroup && conv.participants && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {conv.participants.length} members
                      </p>
                    )}
                  </div>

                  {hasUnread && conv.unread_count && conv.unread_count > 0 && (
                    <Badge variant="default" className="ml-auto flex-shrink-0">
                      {conv.unread_count > 99 ? '99+' : conv.unread_count}
                    </Badge>
                  )}
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
