import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  personas: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export const GeneralChatTab = () => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);

  // Fetch current user's persona
  useEffect(() => {
    const fetchPersona = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("personas")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setCurrentPersonaId(data.id);
      }
    };

    fetchPersona();
  }, [user]);

  // Fetch global conversation ID
  useEffect(() => {
    const fetchGlobalChat = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("conversation_type", "GROUP")
        .eq("group_name", "General Chat")
        .maybeSingle();

      if (error) {
        console.error("Error fetching global chat:", error);
        toast.error("Failed to load General Chat");
        return;
      }

      if (data) {
        setConversationId(data.id);
      }
    };

    fetchGlobalChat();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          sender_id,
          personas!messages_sender_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
        setLoading(false);
        return;
      }

      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`general-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new;

          // Fetch persona info for the new message
          const { data: personaData } = await supabase
            .from("personas")
            .select("id, display_name, avatar_url")
            .eq("id", newMessage.sender_id)
            .single();

          if (personaData) {
            const fullMessage = {
              ...newMessage,
              personas: personaData,
            } as Message;

            setMessages((current) => [...current, fullMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || !conversationId || !currentPersonaId || sending) return;

    setSending(true);
    const messageContent = content.trim();
    setContent("");

    try {
      const { error } = await supabase.functions.invoke("send-message", {
        body: {
          conversation_id: conversationId,
          content: messageContent,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      if (error.message?.includes("banned")) {
        toast.error("You have been temporarily banned from messaging");
      } else if (error.message?.includes("policy")) {
        toast.error("Message flagged for review");
      } else {
        toast.error("Failed to send message");
      }
      
      setContent(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-card">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">General Chat</h3>
          <span className="text-sm text-muted-foreground ml-auto">
            Platform-wide conversation
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h4 className="font-semibold text-lg mb-2">Welcome to General Chat!</h4>
            <p className="text-muted-foreground max-w-md">
              This is a space for everyone to connect. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={message.personas.avatar_url || undefined} />
                  <AvatarFallback>
                    {message.personas.display_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.personas.display_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm break-words">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[80px] resize-none"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            size="icon"
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
