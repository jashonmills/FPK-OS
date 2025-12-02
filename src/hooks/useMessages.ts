import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { triggerNewMessageNotification, triggerMentionNotification } from '@/utils/notificationTriggers';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  replying_to_message_id: string | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  replying_to?: Message;
  attachments?: MessageAttachment[];
  mentions?: string[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
}

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async (limit = 50, before?: string) => {
    if (!conversationId) return;

    try {
      if (!before) setIsLoading(true);

      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch sender profiles
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds);

      // Fetch attachments
      const messageIds = data?.map(m => m.id) || [];
      const { data: attachments } = await supabase
        .from('message_attachments')
        .select('*')
        .in('message_id', messageIds);

      // Fetch mentions
      const { data: mentions } = await supabase
        .from('message_mentions')
        .select('*')
        .in('message_id', messageIds);

      // Fetch replied-to messages
      const replyIds = data?.filter(m => m.replying_to_message_id).map(m => m.replying_to_message_id) || [];
      const { data: replyMessages } = await supabase
        .from('messages')
        .select('*')
        .in('id', replyIds);

      const messagesWithDetails: Message[] = (data || []).map(msg => ({
        ...msg,
        sender: profiles?.find(p => p.id === msg.sender_id),
        attachments: attachments?.filter(a => a.message_id === msg.id) || [],
        mentions: mentions?.filter(m => m.message_id === msg.id).map(m => m.mentioned_user_id) || [],
        replying_to: replyMessages?.find(r => r.id === msg.replying_to_message_id)
      }));

      if (before) {
        setMessages(prev => [...prev, ...messagesWithDetails.reverse()]);
      } else {
        setMessages(messagesWithDetails.reverse());
      }

      setHasMore(data?.length === limit);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, toast]);

  const sendMessage = useCallback(async (
    content: string,
    replyToId?: string,
    mentionedUserIds?: string[],
    orgId?: string,
    conversationName?: string
  ): Promise<Message | null> => {
    if (!conversationId || !user || !content.trim()) return null;

    // Optimistic update - add message immediately
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
      replying_to_message_id: replyToId || null,
      is_edited: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: { id: user.id },
      attachments: [],
      mentions: mentionedUserIds || []
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          replying_to_message_id: replyToId || null
        })
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => 
        m.id === optimisticMessage.id ? { ...m, id: message.id } : m
      ));

      // Add mentions if any
      if (mentionedUserIds?.length) {
        await supabase
          .from('message_mentions')
          .insert(
            mentionedUserIds.map(userId => ({
              message_id: message.id,
              mentioned_user_id: userId
            }))
          );
      }

      // Send notifications in the background
      if (orgId) {
        // Get sender name
        const { data: senderProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        const senderName = senderProfile?.full_name || 'Someone';

        // Get other participants to notify
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversationId)
          .neq('user_id', user.id);

        const recipientIds = participants?.map(p => p.user_id) || [];

        // Send new message notifications (exclude mentioned users - they get a mention notification)
        const nonMentionedRecipients = recipientIds.filter(
          id => !mentionedUserIds?.includes(id)
        );
        
        if (nonMentionedRecipients.length > 0) {
          triggerNewMessageNotification(
            nonMentionedRecipients,
            orgId,
            conversationId,
            senderName,
            content.trim(),
            conversationName
          ).catch(err => console.error('Failed to send new message notifications:', err));
        }

        // Send mention notifications
        if (mentionedUserIds?.length) {
          mentionedUserIds.forEach(mentionedUserId => {
            triggerMentionNotification(
              mentionedUserId,
              orgId,
              conversationId,
              senderName,
              conversationName
            ).catch(err => console.error('Failed to send mention notification:', err));
          });
        }
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      return null;
    }
  }, [conversationId, user, toast]);

  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<boolean> => {
    if (!user || !newContent.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ content: newContent.trim() })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to edit message',
        variant: 'destructive'
      });
      return false;
    }
  }, [user, toast]);

  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== messageId));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
      return false;
    }
  }, [user, toast]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            
            // Check if message already exists (prevent duplicates from optimistic update)
            setMessages(prev => {
              if (prev.some(m => m.id === newMessage.id)) {
                return prev;
              }
              
              // Get sender profile asynchronously and update
              supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('id', newMessage.sender_id)
                .single()
                .then(({ data: profile }) => {
                  setMessages(current => 
                    current.map(m => 
                      m.id === newMessage.id 
                        ? { ...m, sender: profile || undefined }
                        : m
                    )
                  );
                });

              const fullMessage: Message = {
                ...newMessage,
                sender: undefined,
                attachments: [],
                mentions: []
              };

              return [...prev, fullMessage];
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(m => 
              m.id === payload.new.id ? { ...m, ...payload.new } : m
            ));
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    hasMore,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMore: () => {
      if (messages.length > 0 && hasMore) {
        fetchMessages(50, messages[0].created_at);
      }
    },
    refetch: fetchMessages
  };
}
