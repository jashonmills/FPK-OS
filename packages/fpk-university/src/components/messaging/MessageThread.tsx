import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Reply, Pencil, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/hooks/useConversations';
import { useMessages, Message } from '@/hooks/useMessages';
import { MessageComposer } from './MessageComposer';
import { useAuth } from '@/hooks/useAuth';
import { format, isToday, isYesterday } from 'date-fns';
import { Input } from '@/components/ui/input';

interface MessageThreadProps {
  conversation: Conversation;
  onMarkAsRead: () => void;
}

export function MessageThread({ conversation, onMarkAsRead }: MessageThreadProps) {
  const { messages, isLoading, sendMessage, editMessage, deleteMessage, loadMore, hasMore } = useMessages(conversation.id);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark as read when viewing
  useEffect(() => {
    onMarkAsRead();
  }, [conversation.id, onMarkAsRead]);

  const handleSendMessage = async (content: string, mentionedUserIds?: string[]) => {
    await sendMessage(
      content, 
      replyingTo?.id, 
      mentionedUserIds,
      conversation.org_id,
      conversation.name || undefined
    );
    setReplyingTo(null);
  };

  const handleStartEdit = (message: Message) => {
    setEditingMessage(message);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (editingMessage && editContent.trim()) {
      await editMessage(editingMessage.id, editContent);
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; messages: Message[] }[]>((acc, msg) => {
    const date = format(new Date(msg.created_at), 'yyyy-MM-dd');
    const existing = acc.find(g => g.date === date);
    if (existing) {
      existing.messages.push(msg);
    } else {
      acc.push({ date, messages: [msg] });
    }
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn("flex gap-3", i % 2 === 0 && "flex-row-reverse")}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-16 w-48 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {hasMore && (
          <div className="text-center mb-4">
            <Button variant="ghost" size="sm" onClick={loadMore}>
              Load more messages
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {groupedMessages.map(group => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                  {isToday(new Date(group.date)) 
                    ? 'Today' 
                    : isYesterday(new Date(group.date))
                      ? 'Yesterday'
                      : format(new Date(group.date), 'MMMM d, yyyy')
                  }
                </span>
              </div>

              {/* Messages for this date */}
              {group.messages.map((message, idx) => {
                const isOwnMessage = message.sender_id === user?.id;
                const showAvatar = idx === 0 || group.messages[idx - 1]?.sender_id !== message.sender_id;
                const isEditing = editingMessage?.id === message.id;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 group",
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar */}
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && !isOwnMessage && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {(message.sender?.full_name || 'U').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message bubble */}
                    <div className={cn(
                      "max-w-[70%] flex flex-col",
                      isOwnMessage ? "items-end" : "items-start"
                    )}>
                      {/* Sender name for group chats */}
                      {showAvatar && !isOwnMessage && conversation.type === 'group' && (
                        <span className="text-xs text-muted-foreground mb-1 ml-1">
                          {message.sender?.full_name}
                        </span>
                      )}

                      {/* Reply preview */}
                      {message.replying_to && (
                        <div className={cn(
                          "text-xs px-3 py-1.5 rounded-t-lg border-l-2 border-primary/50 mb-0.5",
                          isOwnMessage 
                            ? "bg-primary/5 text-primary-foreground/70" 
                            : "bg-muted/50 text-muted-foreground"
                        )}>
                          <span className="font-medium">
                            {message.replying_to.sender_id === user?.id ? 'You' : message.sender?.full_name}
                          </span>
                          <p className="truncate max-w-[200px]">{message.replying_to.content}</p>
                        </div>
                      )}

                      {/* Message content */}
                      <div className={cn(
                        "px-4 py-2 rounded-2xl relative group",
                        isOwnMessage 
                          ? "bg-primary text-primary-foreground rounded-br-md" 
                          : "bg-muted rounded-bl-md"
                      )}>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-w-[200px]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSaveEdit();
                                }
                                if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                            />
                            <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            {message.is_edited && (
                              <span className="text-[10px] opacity-60 ml-1">(edited)</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] text-muted-foreground mt-0.5 mx-1">
                        {formatMessageDate(message.created_at)}
                      </span>
                    </div>

                    {/* Actions menu */}
                    {!isEditing && (
                      <div className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity self-center",
                        isOwnMessage ? "order-first" : ""
                      )}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                            <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            {isOwnMessage && (
                              <>
                                <DropdownMenuItem onClick={() => handleStartEdit(message)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteMessage(message.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Composer */}
      <MessageComposer
        conversationId={conversation.id}
        orgId={conversation.org_id}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
