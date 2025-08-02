import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  ragMetadata?: {
    ragEnabled: boolean;
    personalItems: number;
    externalItems: number;
    similarItems: number;
    confidence: number;
    sources: string[];
  };
}

export const useChatMessages = (sessionId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load messages for a session
  const loadMessages = async () => {
    // Critical validation: ensure we have valid UUIDs before database queries
    if (!sessionId || !user?.id || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid parameters for loadMessages:', { sessionId, userId: user?.id });
      setMessages([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Type-safe conversion with proper role casting
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        session_id: msg.session_id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error loading messages",
        description: "There was a problem loading the chat messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a message to the current session
  const addMessage = async (content: string, role: 'user' | 'assistant') => {
    // Critical validation: ensure we have valid UUIDs before database operations
    if (!sessionId || !user?.id || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid parameters for addMessage:', { sessionId, userId: user?.id });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role,
          content,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Type-safe message addition
      const newMessage: ChatMessage = {
        id: data.id,
        session_id: data.session_id,
        role: data.role as 'user' | 'assistant',
        content: data.content,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Enhanced sendMessage with RAG support
  const sendMessage = async (content: string, context?: string, chatMode: 'personal' | 'general' = 'personal') => {
    // Critical validation: ensure we have valid IDs before proceeding
    if (!sessionId || !user?.id || isSending || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid state for sendMessage:', { sessionId, userId: user?.id, isSending });
      return;
    }

    console.log('Starting enhanced sendMessage with RAG support...', { sessionId, content, context, chatMode });
    setIsSending(true);
    
    try {
      // Add user message first
      const userMessage = await addMessage(content, 'user');
      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      // Call enhanced AI function with RAG capabilities
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: content,
          userId: user.id,
          sessionId: sessionId,
          chatMode: chatMode,
          voiceActive: false,
          pageContext: context,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionLength: messages.length,
            ragEnabled: true,
            enhancedKnowledgeRetrieval: true
          }
        }
      });

      if (error) {
        console.error('Enhanced AI function error:', error);
        throw error;
      }

      const aiResponse = data?.response || "I'm here to guide your learning journey with enhanced knowledge access! 🌟 What would you like to explore together?";
      
      // Add AI response with RAG metadata
      const assistantMessage = await addMessage(aiResponse, 'assistant');
      if (!assistantMessage) {
        throw new Error('Failed to save AI response');
      }

      // Store RAG metadata in the message state
      if (data?.ragMetadata) {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, ragMetadata: data.ragMetadata }
            : msg
        ));
      }

      // Update session title and context tags for better organization
      if (messages.length <= 1) {
        const title = content.length > 40 ? content.substring(0, 40) + '...' : content;
        const contextTag = context?.includes('Notes') ? 'Study Notes' : 
                         context?.includes('Coach') ? 'AI Coaching' : 
                         context?.includes('Flashcard') ? 'Flashcard Help' : 
                         content.toLowerCase().includes('quiz') ? 'Quiz Help' :
                         content.toLowerCase().includes('strategy') ? 'Study Strategy' :
                         content.toLowerCase().includes('research') ? 'Research' :
                         content.toLowerCase().includes('definition') ? 'Definitions' :
                         chatMode === 'personal' ? 'Personal Study Support' : 'General Knowledge';
                         
        await supabase
          .from('chat_sessions')
          .update({ 
            title, 
            updated_at: new Date().toISOString(),
            context_tag: contextTag
          })
          .eq('id', sessionId);
      }

      // Show RAG enhancement notification
      if (data?.ragMetadata?.ragEnabled && data.ragMetadata.confidence > 0.3) {
        const totalSources = data.ragMetadata.personalItems + data.ragMetadata.externalItems + data.ragMetadata.similarItems;
        toast({
          title: "Enhanced Response",
          description: `Used ${totalSources} knowledge sources with ${Math.round(data.ragMetadata.confidence * 100)}% confidence`,
        });
      }

    } catch (error) {
      console.error('Error in enhanced sendMessage:', error);
      
      // Enhanced fallback responses based on context with RAG hints
      const contextualFallback = context?.includes('Notes') 
        ? "I'm here to help optimize your note-taking and study materials with enhanced knowledge access! 📚 Ask me about effective strategies, concepts, or research on topics you're studying."
        : context?.includes('Flashcard')
        ? "I can help you maximize your flashcard study sessions with comprehensive knowledge retrieval! 🎯 Ask me about spaced repetition, memory techniques, or specific concepts."
        : chatMode === 'personal'
        ? "I'm your AI learning coach with access to your personal study data and external knowledge sources! 🔒 Ask me about your progress, study strategies, or specific topics."
        : "I'm here with enhanced knowledge access to support your learning! 🌐 Ask me about any topic, study strategies, definitions, or research.";
        
      await addMessage(contextualFallback, 'assistant');
      
      toast({
        title: "AI Coach Ready",
        description: "I'm here with enhanced knowledge access to support your learning!",
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    addMessage,
    loadMessages
  };
};
