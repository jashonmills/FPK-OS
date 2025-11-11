import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { ReactionPicker } from "./ReactionPicker";
import { MessageReactions } from "./MessageReactions";
import { RepliedMessage } from "./RepliedMessage";
import { ReadReceipts } from "./ReadReceipts";
import { EditMessageDialog } from "./EditMessageDialog";
import { DeleteMessageDialog } from "./DeleteMessageDialog";
import { FileAttachment } from "./FileAttachment";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Reply, Pencil, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string | null;
  sender_id: string;
  created_at: string;
  updated_at?: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  deleted_at?: string | null;
  deleted_by_ai?: boolean;
  moderation_reason?: string | null;
  reply_to_message_id?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  sender?: {
    display_name: string;
    avatar_url: string | null;
  };
  replied_message?: {
    content: string;
    sender?: {
      display_name: string;
    };
  };
}

interface ChatWindowProps {
  conversationId: string;
}

export const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Array<{ display_name: string }>>([]);
  const [replyingTo, setReplyingTo] = useState<{ id: string; senderName: string; content: string } | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [userPersonaId, setUserPersonaId] = useState<string | null>(null);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSentMessageRef = useRef<{ content: string; timestamp: number } | null>(null);
  const personaCacheRef = useRef<Map<string, { display_name: string; avatar_url: string | null }>>(new Map());

  // Fetch current user's persona ID
  useEffect(() => {
    const fetchUserPersona = async () => {
      if (!user?.id) return;
      
      const { data: persona } = await supabase
        .from('personas')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (persona) {
        setUserPersonaId(persona.id);
      }
    };

    fetchUserPersona();
  }, [user?.id]);

  const handleOptimisticMessage = (optimisticMsg: any) => {
    if (optimisticMsg.failed) {
      // Remove failed message
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      return;
    }
    
    // Track this message for deduplication
    lastSentMessageRef.current = {
      content: optimisticMsg.content,
      timestamp: Date.now(),
    };
    
    // Add optimistic message if not already present
    setMessages(prev => {
      const exists = prev.find(m => m.id === optimisticMsg.id);
      if (exists) return prev;
      return [...prev, optimisticMsg];
    });
    
    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
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
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    // Mark messages as read (ignore duplicates)
    const { error } = await supabase
      .from('message_read_receipts')
      .insert(
        messageIds.map(id => ({
          message_id: id,
          user_id: user.id,
        }))
      )
      .select();

    if (error && !error.message.includes('duplicate key')) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at, updated_at, is_edited, is_deleted, deleted_at, deleted_by_ai, moderation_reason, reply_to_message_id, conversation_id, file_url, file_name, file_type, file_size')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
        return;
      }

      // Fetch sender personas and replied messages for all messages
      const enriched = await Promise.all(
        data.map(async (msg) => {
          const { data: persona } = await supabase
            .from('personas')
            .select('display_name, avatar_url')
            .eq('id', msg.sender_id)
            .single();

          let replied_message = undefined;
          if (msg.reply_to_message_id) {
            const { data: repliedMsg } = await supabase
              .from('messages')
              .select('content, sender_id')
              .eq('id', msg.reply_to_message_id)
              .single();

            if (repliedMsg) {
              const { data: repliedPersona } = await supabase
                .from('personas')
                .select('display_name')
                .eq('id', repliedMsg.sender_id)
                .single();

              replied_message = {
                content: repliedMsg.content,
                sender: repliedPersona || undefined,
              };
            }
          }

          return {
            ...msg,
            sender: persona || undefined,
            replied_message,
          };
        })
      );

      setMessages(enriched);
      setLoading(false);
      
      // Mark messages from others as read
      const messagesToMarkAsRead = enriched
        .filter(msg => msg.sender_id !== userPersonaId && !msg.id.toString().startsWith('temp-'))
        .map(msg => msg.id);
      
      if (messagesToMarkAsRead.length > 0) {
        markMessagesAsRead(messagesToMarkAsRead);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    fetchMessages();

    // Subscribe to new and updated messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('Realtime message received:', payload);
          
          // Check persona cache first to avoid redundant fetches
          const senderId = (payload.new as any).sender_id;
          let persona = personaCacheRef.current.get(senderId);
          
          if (!persona) {
            // Fetch sender persona info only if not cached
            const { data: fetchedPersona } = await supabase
              .from('personas')
              .select('display_name, avatar_url')
              .eq('id', senderId)
              .single();
            
            if (fetchedPersona) {
              persona = fetchedPersona;
              personaCacheRef.current.set(senderId, fetchedPersona);
            }
          }

          let replied_message = undefined;
          if ((payload.new as any).reply_to_message_id) {
            const { data: repliedMsg } = await supabase
              .from('messages')
              .select('content, sender_id')
              .eq('id', (payload.new as any).reply_to_message_id)
              .single();

            if (repliedMsg) {
              const { data: repliedPersona } = await supabase
                .from('personas')
                .select('display_name')
                .eq('id', repliedMsg.sender_id)
                .single();

              replied_message = {
                content: repliedMsg.content,
                sender: repliedPersona || undefined,
              };
            }
          }

          const newMessage = {
            ...payload.new,
            sender: persona || undefined,
            replied_message,
          } as Message;

          // Check if this is a recent message we just sent (deduplication)
          const isOwnRecentMessage = 
            lastSentMessageRef.current &&
            newMessage.content === lastSentMessageRef.current.content &&
            (Date.now() - lastSentMessageRef.current.timestamp) < 5000;

          setMessages(prev => {
            // If this is our own recent message, remove the optimistic version
            if (isOwnRecentMessage) {
              const withoutTemp = prev.filter(m => !m.id.toString().startsWith('temp-'));
              lastSentMessageRef.current = null;
              
              // Check if real message already exists
              const exists = withoutTemp.find(m => m.id === newMessage.id);
              if (exists) return withoutTemp;
              
              return [...withoutTemp, newMessage];
            }
            
            // For messages from others, just add if not duplicate
            const exists = prev.find(m => m.id === newMessage.id);
            if (exists) return prev;
            
            // Mark this new message as read if it's from someone else
            if (newMessage.sender_id !== userPersonaId) {
              markMessagesAsRead([newMessage.id]);
            }
            
            return [...prev, newMessage];
          });
          
          // Scroll to bottom
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('Message updated:', payload);
          
          // Fetch sender persona info
          const { data: persona } = await supabase
            .from('personas')
            .select('display_name, avatar_url')
            .eq('id', (payload.new as any).sender_id)
            .single();

          const updatedMessage = {
            ...payload.new,
            sender: persona || undefined,
          } as Message;

          // Update the message in the list
          setMessages(prev => 
            prev.map(m => m.id === updatedMessage.id ? updatedMessage : m)
          );
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userPersonaId, markMessagesAsRead]);

  // Set up typing indicator presence
  useEffect(() => {
    if (!conversationId) return;

    const typingChannel = supabase.channel(`typing:${conversationId}`, {
      config: { presence: { key: user?.id } }
    });

    typingChannel
      .on('presence', { event: 'sync' }, () => {
        const state = typingChannel.presenceState();
        const typing: Array<{ display_name: string }> = [];
        
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          presences.forEach((presence) => {
            // Don't show current user as typing
            if (presence.user_id !== user?.id && presence.typing) {
              typing.push({ display_name: presence.display_name });
            }
          });
        });
        
        setTypingUsers(typing);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User started typing:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User stopped typing:', leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === userPersonaId;
              const messageAge = Date.now() - new Date(message.created_at).getTime();
              const canEdit = isOwn && !message.is_deleted && messageAge < 15 * 60 * 1000; // 15 minutes
              const canDelete = isOwn && !message.is_deleted;
              
              return (
                <div
                  key={message.id}
                  className={`group flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.sender?.display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                   <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                     <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.sender?.display_name || 'Unknown'}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`text-xs flex items-center gap-1 ${
                              isOwn && !canEdit && !message.is_deleted 
                                ? 'text-muted-foreground/60' 
                                : 'text-muted-foreground'
                            }`}>
                              {isOwn && !message.is_deleted && (
                                <Clock className="w-3 h-3" />
                              )}
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isOwn && !message.is_deleted ? (
                              canEdit ? (
                                <p>
                                  Can edit for {Math.ceil((15 * 60 * 1000 - messageAge) / 60000)} more minute{Math.ceil((15 * 60 * 1000 - messageAge) / 60000) !== 1 ? 's' : ''}
                                </p>
                              ) : (
                                <p>Too old to edit (15 min limit)</p>
                              )
                            ) : (
                              <p>{new Date(message.created_at).toLocaleString()}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {message.is_edited && !message.is_deleted && (
                        <span className="text-xs text-muted-foreground italic">
                          (edited)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      {message.replied_message && !message.is_deleted && (
                        <RepliedMessage
                          senderName={message.replied_message.sender?.display_name || 'Unknown'}
                          content={message.replied_message.content}
                        />
                      )}
                      <div className="flex items-start gap-2">
                        <div
                          className={`rounded-lg px-4 py-2 max-w-md ${
                            message.is_deleted
                              ? message.deleted_by_ai
                                ? 'bg-destructive/10 border-2 border-destructive/50'
                                : 'bg-muted/50 border border-dashed border-border'
                              : isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.is_deleted ? (
                            <div className="flex flex-col gap-1">
                              <p className="text-sm italic text-muted-foreground flex items-center gap-2">
                                {message.deleted_by_ai ? (
                                  <>
                                    <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse" />
                                    <span className="font-medium text-destructive">Removed by AI moderation</span>
                                  </>
                                ) : (
                                  'Message deleted'
                                )}
                              </p>
                              {message.deleted_by_ai && message.moderation_reason && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {message.moderation_reason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              {message.content && (
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              )}
                              {message.file_url && message.file_name && message.file_type && (
                                <div className="mt-2">
                                  <FileAttachment
                                    fileUrl={message.file_url}
                                    fileName={message.file_name}
                                    fileType={message.file_type}
                                    fileSize={message.file_size || undefined}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {!message.is_deleted && (
                          <div className="flex gap-1">
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setEditingMessage({
                                  id: message.id,
                                  content: message.content
                                })}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                onClick={() => setDeletingMessageId(message.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setReplyingTo({
                                id: message.id,
                                senderName: message.sender?.display_name || 'Unknown',
                                content: message.content
                              })}
                            >
                              <Reply className="w-4 h-4" />
                            </Button>
                            <ReactionPicker onSelect={(emoji) => handleAddReaction(message.id, emoji)} />
                          </div>
                        )}
                      </div>
                    </div>
                    {!message.is_deleted && (
                      <div className="flex items-center gap-2">
                        <MessageReactions messageId={message.id} />
                        <ReadReceipts 
                          messageId={message.id}
                          senderId={message.sender_id}
                          conversationId={conversationId}
                          currentUserPersonaId={userPersonaId}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
        <TypingIndicator typingUsers={typingUsers} />
      </ScrollArea>
      <div className="border-t p-4">
        <MessageInput 
          conversationId={conversationId}
          onOptimisticMessage={handleOptimisticMessage}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
      {editingMessage && (
        <EditMessageDialog
          open={!!editingMessage}
          onOpenChange={(open) => !open && setEditingMessage(null)}
          messageId={editingMessage.id}
          currentContent={editingMessage.content}
        />
      )}
      {deletingMessageId && (
        <DeleteMessageDialog
          open={!!deletingMessageId}
          onOpenChange={(open) => !open && setDeletingMessageId(null)}
          messageId={deletingMessageId}
        />
      )}
    </div>
  );
};
