import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MessageInputProps {
  conversationId: string;
  onOptimisticMessage?: (message: any) => void;
}

export const MessageInput = ({ conversationId, onOptimisticMessage }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

    try {
      const { data, error } = await supabase.functions.invoke('send-message', {
        body: {
          conversation_id: conversationId,
          content: messageContent,
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
    <div className="flex gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
  );
};
