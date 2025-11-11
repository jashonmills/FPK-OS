import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ReplyPreview } from "./ReplyPreview";

interface MessageInputProps {
  conversationId: string;
  onOptimisticMessage?: (message: any) => void;
  replyingTo?: {
    id: string;
    senderName: string;
    content: string;
  } | null;
  onCancelReply?: () => void;
}

export const MessageInput = ({ conversationId, onOptimisticMessage, replyingTo, onCancelReply }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<ReturnType<typeof supabase.channel>>();

  // Set up typing indicator
  useEffect(() => {
    const setupPresence = async () => {
      // Fetch user's persona for typing indicator
      const { data: persona } = await supabase
        .from('personas')
        .select('id, display_name, avatar_url')
        .eq('user_id', user?.id)
        .single();

      if (!persona) return;

      const channel = supabase.channel(`typing:${conversationId}`, {
        config: { presence: { key: user?.id } }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          // Presence state synced
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            channelRef.current = channel;
          }
        });
    };

    if (user?.id && conversationId) {
      setupPresence();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, user?.id]);

  const broadcastTyping = async (isTyping: boolean) => {
    if (!channelRef.current) return;

    const { data: persona } = await supabase
      .from('personas')
      .select('id, display_name, avatar_url')
      .eq('user_id', user?.id)
      .single();

    if (!persona) return;

    if (isTyping) {
      await channelRef.current.track({
        user_id: user?.id,
        persona_id: persona.id,
        display_name: persona.display_name,
        typing: true,
        timestamp: Date.now()
      });
    } else {
      await channelRef.current.untrack();
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Broadcast typing indicator
    if (e.target.value.trim()) {
      broadcastTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        broadcastTyping(false);
      }, 2000);
    } else {
      broadcastTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSend = async () => {
    if (!content.trim() || sending) return;

    const messageContent = content.trim();
    setSending(true);

    // Optimistic update: create temporary message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: user?.id || '',
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
      is_sending: true, // Flag to indicate this is optimistic
    };

    // Immediately show the message to the user
    if (onOptimisticMessage) {
      onOptimisticMessage(optimisticMessage);
    }

    // Clear input immediately for better UX
    setContent("");
    
    // Stop typing indicator
    broadcastTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-message', {
        body: {
          conversation_id: conversationId,
          content: messageContent,
          reply_to_message_id: replyingTo?.id || null,
        },
      });

      if (error) {
        // Remove optimistic message on error
        if (onOptimisticMessage) {
          onOptimisticMessage({ ...optimisticMessage, failed: true });
        }
        
        // Check if it's a ban error
        if (error.message?.includes('USER_BANNED') || error.message?.includes('MESSAGE_BLOCKED')) {
          toast.error("Your message was blocked due to a policy violation. Redirecting...");
          setTimeout(() => navigate('/banned'), 1000);
          return;
        }
        throw error;
      }

      // Check if de-escalation occurred
      if (data?.de_escalated) {
        toast("A friendly reminder was added to help keep the conversation constructive.", {
          description: "Thank you for being part of our community!"
        });
      }
      
      // Clear reply after successful send
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
      // Restore content if there was an error
      setContent(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {replyingTo && (
        <ReplyPreview
          senderName={replyingTo.senderName}
          content={replyingTo.content}
          onCancel={onCancelReply!}
        />
      )}
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] resize-none"
          disabled={sending}
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
