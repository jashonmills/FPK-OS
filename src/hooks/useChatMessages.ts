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

  // Enhanced sendMessage with RAG support and advanced Socratic analysis
  const sendMessage = async (content: string, context?: string, chatMode: 'personal' | 'general' = 'personal') => {
    // Critical validation: ensure we have valid IDs before proceeding
    if (!sessionId || !user?.id || isSending || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid state for sendMessage:', { sessionId, userId: user?.id, isSending });
      return;
    }

    console.log('🚀 ADVANCED SOCRATIC SENDMESSAGE v2.0 - Starting enhanced processing...', { 
      sessionId: sessionId.substring(0, 8) + '...', 
      content: content.substring(0, 50) + '...', 
      context, 
      chatMode 
    });
    
    setIsSending(true);
    
    try {
      // Add user message first
      const userMessage = await addMessage(content, 'user');
      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      // Prepare client history for advanced AI processing
      const clientHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      // Call enhanced AI function with advanced Socratic capabilities
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: content,
          userId: user.id,
          sessionId: sessionId,
          chatMode: chatMode,
          voiceActive: false,
          pageContext: context,
          clientHistory: clientHistory, // Send conversation history for advanced analysis
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionLength: messages.length,
            ragEnabled: true,
            enhancedKnowledgeRetrieval: true,
            socraticMode: true,
            advancedStudentModeling: true
          }
        }
      });

      if (error) {
        console.error('🚨 Enhanced Socratic AI function error:', error);
        throw error;
      }

      console.log('✅ ADVANCED SOCRATIC RESPONSE received:', {
        hasResponse: !!data?.response,
        hasStudentProfile: !!data?.studentProfile,
        hasConversationAnalysis: !!data?.conversationAnalysis,
        hasMemoryState: !!data?.memoryState,
        source: data?.source,
        blueprintVersion: data?.blueprintVersion
      });

      const aiResponse = data?.response || "I'm your AI study coach, ready to guide your learning through thoughtful questions! 🎓 What would you like to explore together?";
      
      // Add AI response with enhanced metadata
      const assistantMessage = await addMessage(aiResponse, 'assistant');
      if (!assistantMessage) {
        throw new Error('Failed to save AI response');
      }

      // Store enhanced metadata in the message state
      if (data?.studentProfile || data?.conversationAnalysis || data?.memoryState) {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                ragMetadata: {
                  ragEnabled: true,
                  personalItems: 0,
                  externalItems: 0,
                  similarItems: 0,
                  confidence: data?.studentProfile?.understanding || 0.5,
                  sources: ['advanced_socratic_analysis'],
                  studentProfile: data?.studentProfile,
                  conversationAnalysis: data?.conversationAnalysis,
                  memoryState: data?.memoryState
                }
              }
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
                         chatMode === 'personal' ? 'Socratic Learning Session' : 'General Knowledge Exploration';
                         
        await supabase
          .from('chat_sessions')
          .update({ 
            title, 
            updated_at: new Date().toISOString(),
            context_tag: contextTag
          })
          .eq('id', sessionId);
      }

      // Show enhanced response notification
      if (data?.studentProfile) {
        const understanding = Math.round((data.studentProfile.understanding || 0.5) * 100);
        const confidence = Math.round((data.studentProfile.confidence || 0.5) * 100);
        
        toast({
          title: "🧠 Advanced Socratic Mode",
          description: `Personalized response based on ${understanding}% understanding, ${confidence}% confidence`,
        });
      } else if (data?.source === 'adaptive_fallback') {
        toast({
          title: "📚 Adaptive Learning Mode",
          description: "Using intelligent fallback with student modeling",
        });
      }

    } catch (error) {
      console.error('❌ Error in advanced Socratic sendMessage:', error);
      
      // Enhanced fallback responses based on context with Socratic approach
      const contextualFallback = context?.includes('Notes') 
        ? "I'm here to help you think critically about your notes! 📚 Instead of giving you answers, let me ask: What patterns do you notice in the material you've studied? What questions arise as you review your notes?"
        : context?.includes('Flashcard')
        ? "Let's approach your flashcard study strategically! 🎯 Rather than just testing recall, what connections can you make between the concepts on your cards? How might you group them thematically?"
        : chatMode === 'personal'
        ? "I'm your AI learning coach, ready to guide your discovery through questions! 🔍 What aspect of this topic would you like to explore first? What do you already know that might connect to this?"
        : "I'm here to facilitate your learning through guided inquiry! 🌐 Instead of providing direct answers, let me ask: What's your current understanding of this topic? What specific aspect intrigues you most?";
        
      await addMessage(contextualFallback, 'assistant');
      
      toast({
        title: "🤔 Socratic Mode Active",
        description: "I'm here to guide your learning through thoughtful questions!",
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
