import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ReplyPreview } from "./ReplyPreview";
import { FileUpload } from "./FileUpload";
import { SpeechToTextButton } from "./SpeechToTextButton";
import { checkProfanity } from "@/utils/profanityFilter";
import { CaptionStyle } from "./CaptionFormatting";
import { useCaptionPreferences } from "@/hooks/useCaptionPreferences";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<{ id: string; display_name: string; avatar_url: string | null } | null>(null);
  const { defaultStyle } = useCaptionPreferences();
  const navigate = useNavigate();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<ReturnType<typeof supabase.channel>>();
  const interimTextRef = useRef<string>("");
  const contentBeforeInterimRef = useRef<string>("");

  // Fetch current user's persona
  useEffect(() => {
    const fetchPersona = async () => {
      if (!user?.id) return;
      
      const { data: persona } = await supabase
        .from('personas')
        .select('id, display_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (persona) {
        setCurrentPersona(persona);
      }
    };

    fetchPersona();
  }, [user?.id]);

  // Set up typing indicator
  useEffect(() => {
    const setupPresence = async () => {
      if (!currentPersona) return;

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

    if (currentPersona && conversationId) {
      setupPresence();
    }

    return () => {
      if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
  };
}, [conversationId, currentPersona]);

  const broadcastTyping = async (isTyping: boolean) => {
    if (!channelRef.current || !currentPersona) return;

    if (isTyping) {
      await channelRef.current.track({
        user_id: user?.id,
        persona_id: currentPersona.id,
        display_name: currentPersona.display_name,
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
    if ((!content.trim() && !selectedFile) || sending || !currentPersona) return;

    const messageContent = content.trim();
    
    // Client-side profanity check for immediate feedback
    if (messageContent) {
      const profanityCheck = checkProfanity(messageContent);
      if (!profanityCheck.isClean) {
        toast.error("Message blocked", {
          description: profanityCheck.reason || "Your message contains inappropriate content.",
          duration: 5000,
        });
        setSending(false);
        return;
      }
    }
    
    setSending(true);

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;
    let fileSize: number | null = null;

    // Upload file if present
    if (selectedFile) {
      try {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${user?.id}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error("Failed to upload file");
        setSending(false);
        return;
      }
    }

    // Optimistic update: create temporary message with full persona info
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: currentPersona.id,
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      sender: {
        display_name: currentPersona.display_name,
        avatar_url: currentPersona.avatar_url,
      },
    };

    // Immediately show the message to the user
    if (onOptimisticMessage) {
      onOptimisticMessage(optimisticMessage);
    }

    // Clear input and file immediately for better UX
    setContent("");
    setSelectedFile(null);
    setImageCaption("");
    setCaptionStyle({});
    setShowFileUpload(false);
    
    // Reset speech-to-text refs to prevent stacking on next voice input
    interimTextRef.current = "";
    contentBeforeInterimRef.current = "";
    
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
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          image_caption: fileType?.startsWith("image/") ? imageCaption : null,
          caption_style: fileType?.startsWith("image/") && imageCaption ? captionStyle : null,
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

  const handleTranscript = (text: string, isFinal: boolean) => {
    setContent(prev => {
      if (isFinal) {
        // Final transcript: append to content before interim started
        const base = contentBeforeInterimRef.current || prev;
        const newContent = base ? `${base} ${text}` : text;
        
        // Reset refs
        interimTextRef.current = "";
        contentBeforeInterimRef.current = newContent;
        
        return newContent;
      } else {
        // Interim transcript: replace previous interim
        if (!contentBeforeInterimRef.current) {
          contentBeforeInterimRef.current = prev;
        }
        
        interimTextRef.current = text;
        const base = contentBeforeInterimRef.current;
        return base ? `${base} ${text}` : text;
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 shadow-inner">
      {replyingTo && (
        <ReplyPreview
          senderName={replyingTo.senderName}
          content={replyingTo.content}
          onCancel={onCancelReply!}
        />
      )}
      {showFileUpload && (
        <FileUpload
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          onClearFile={() => {
            setSelectedFile(null);
            setImageCaption("");
            setCaptionStyle({});
          }}
          caption={imageCaption}
          onCaptionChange={setImageCaption}
          captionStyle={captionStyle}
          onCaptionStyleChange={setCaptionStyle}
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
        <div className="flex flex-col gap-2">
          <SpeechToTextButton
            onTranscript={handleTranscript}
            disabled={sending}
          />
          <Button
            onClick={() => setShowFileUpload(!showFileUpload)}
            variant="outline"
            size="icon"
            className="h-[28px] w-[60px]"
            disabled={sending}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={(!content.trim() && !selectedFile) || sending}
            size="icon"
            className="h-[28px] w-[60px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
