import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, Settings, Save, History, Zap, Volume2, VolumeX, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useChatMode } from '@/hooks/useChatMode';
import { useAICoachPerformanceAnalytics } from '@/hooks/useAICoachPerformanceAnalytics';
import { useAIFeatureGate } from '@/hooks/useAIFeatureGate';
import { cn } from '@/lib/utils';
import ChatModeToggle from './ChatModeToggle';
// import SaveToNotesDialog from './SaveToNotesDialog';
// import QuizSessionWidget from './QuizSessionWidget';
// import { useQuizSession } from '@/hooks/useQuizSession';

interface ChatMessage {
  id: string;
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

interface AdvancedChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any;
  fixedHeight?: boolean;
}

// Helper to prevent hanging requests
const withTimeout = <T,>(promise: Promise<T>, ms = 18000, timeoutMessage = 'AI response timed out'): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

const AdvancedChatInterface: React.FC<AdvancedChatInterfaceProps> = ({
  user, 
  completedSessions, 
  flashcards, 
  insights, 
  fixedHeight = false 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatMode, changeChatMode } = useChatMode();
  const { trackResponseTime, trackModeSwitch, trackRAGEffectiveness } = useAICoachPerformanceAnalytics();
  const { executeWithGate, checkFeatureAccess } = useAIFeatureGate();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showQuizWidget, setShowQuizWidget] = useState(false);
  const [sessionId, setSessionId] = useLocalStorage<string | null>(
    user?.id ? `ai_coach_session_id_${user.id}` : 'ai_coach_session_id', 
    null
  );
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    localStorage.getItem('aistudycoach_voice_autoplay') === 'true'
  );
  
  const { toast } = useToast();
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const { settings, toggle } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and load chat history
  useEffect(() => {
    if (user?.id) {
      // Clear any non-user-specific session storage
      const oldKey = 'ai_coach_session_id';
      if (localStorage.getItem(oldKey)) {
        localStorage.removeItem(oldKey);
      }
      
      // Reset user context when switching users
      setLastSpokenMessageId(null);
      
      initializeSession();
    }
  }, [user?.id]);

  // Watchdog: auto-clear stuck loading states
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      console.warn('AI Coach watchdog: clearing stuck loading after 20s');
      setIsLoading(false);
      toast({ title: 'Request timed out', description: 'Please try again.' });
    }, 20000);
    return () => clearTimeout(timer);
  }, [isLoading, toast]);

  // Improved auto-scroll logic that keeps responses visible
  const scrollToShowLatestMessage = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const lastMessageElements = container.querySelectorAll('[data-message-role="assistant"]');
    
    if (lastMessageElements.length > 0) {
      const lastAIMessage = lastMessageElements[lastMessageElements.length - 1];
      
      // Scroll to show the AI response within the visible area
      lastAIMessage.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center', // Center the response in the viewport
        inline: 'nearest'
      });
    } else {
      // Fallback to scrolling to bottom if no AI messages found
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  // Auto scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Use a longer delay to ensure DOM updates are complete
      setTimeout(scrollToShowLatestMessage, 300);
    }
  }, [messages, scrollToShowLatestMessage]);

  const getWelcomeMessage = (mode = chatMode) => {
    if (mode === 'personal') {
      return `Hello! I'm your AI Learning Coach with full access to your study data. I can help you with:

🎯 **Personalized Study Guidance** - Based on your ${completedSessions.length} study sessions
📚 **Flashcard Analysis** - Using your ${flashcards.length} flashcards  
🧠 **Learning Pattern Insights** - From your study history
🎮 **Quiz Sessions** - Just say "quiz me" to start practicing
💡 **Study Tips** - Tailored to your learning style

What would you like to work on today?`;
    } else {
      return `Hello! I'm your AI Learning Coach in General & Platform Guide mode. I can help you with:

🏫 **Platform Guidance** - How to use features, create flashcards, navigate
🌐 **General Knowledge** - Any subject, research, or educational topics
📖 **Study Techniques** - Learning strategies and academic methods
💡 **Getting Started** - Platform tutorials and feature explanations
🔍 **How-To Guides** - Step-by-step instructions for platform features

Note: I intelligently detect whether you need platform help or general knowledge. For your personal study data, switch to "My Data" mode.

What would you like to learn about today?`;
    }
  };

  const initializeSession = async () => {
    try {
      if (!sessionId) {
        // Create new session
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: 'AI Coach Session',
            context_tag: 'AI Coach'
          })
          .select()
          .single();

        if (error) throw error;
        setSessionId(data.id);
        
        // Add welcome message based on current mode
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }]);
      } else {
        // Verify session exists and belongs to current user before loading
        const { data: sessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('user_id')
          .eq('id', sessionId)
          .single();

        if (sessionError || !sessionData || sessionData.user_id !== user.id) {
          console.log('Invalid session found, creating new one');
          // Clear invalid session and create new one
          setSessionId(null);
          await initializeSession();
          return;
        }

        // Load existing messages
        loadChatHistory();
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      // Clear problematic session and start fresh
      setSessionId(null);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: "New Session Started", 
        description: "Created a fresh chat session",
        variant: "default"
      });
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        // If no chat history, show welcome message
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Clear invalid session and reset
      setSessionId(null);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Clean text for speech synthesis
  const cleanTextForSpeech = useCallback((text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s*(.*)/g, '$1') // Remove headers
      .replace(/[🎯📚🧠🎮💡🌐📖🔍]/g, '') // Remove emojis
      .replace(/\n\s*\n/g, '. ') // Replace double line breaks with periods
      .replace(/\n/g, ' ') // Replace single line breaks with spaces
      .trim();
  }, []);

  // Wrapper for speaking with text cleaning
  const speakText = useCallback((text: string) => {
    const cleanText = cleanTextForSpeech(text);
    if (cleanText) {
      speak(cleanText, { interrupt: true });
    }
  }, [speak, cleanTextForSpeech]);

  // Auto-speak new AI messages when TTS is enabled (only if auto-play is enabled)
  useEffect(() => {
    console.log('TTS Effect triggered:', { ttsEnabled: settings.enabled, messagesLength: messages.length, isLoading });
    
    // Check if auto-play is enabled in localStorage
    const autoPlayEnabled = localStorage.getItem('aistudycoach_voice_autoplay') === 'true';
    
    if (settings.enabled && settings.autoRead && autoPlayEnabled && messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      console.log('Last message:', { id: lastMessage.id, role: lastMessage.role, lastSpokenId: lastSpokenMessageId });
      
      if (lastMessage.role === 'assistant' && lastMessage.id !== lastSpokenMessageId) {
        console.log('Speaking new message:', lastMessage.id);
        setLastSpokenMessageId(lastMessage.id);
        
        // Small delay to ensure message is fully rendered
        setTimeout(() => {
          if (settings.enabled) { // Double-check TTS is still enabled
            speakText(lastMessage.content);
          }
        }, 500);
      }
    }
  }, [messages, settings.enabled, settings.autoRead, isLoading, lastSpokenMessageId, speakText]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Flashcard quiz detection - only detects flashcard-specific quiz requests
  const detectQuizRequest = (text: string): boolean => {
    const flashcardQuizKeywords = [
      'quiz me with my flashcards', 'practice my flashcards', 'review my cards',
      'flashcard quiz', 'practice cards', 'drill my flashcards', 
      'quiz my cards', 'review my flashcards', 'practice my cards'
    ];
    return flashcardQuizKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !user?.id) return;

    // Check usage limits before proceeding
    if (!checkFeatureAccess('ai_chat', 1)) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your AI chat limit. Please upgrade your plan to continue.",
        variant: "destructive"
      });
      return;
    }

    // Check for quiz session request
    if (detectQuizRequest(message) && flashcards && flashcards.length > 0) {
      setShowQuizWidget(true);
      setMessage('');
      return;
    } else if (detectQuizRequest(message) && (!flashcards || flashcards.length === 0)) {
      // Handle no flashcards available
      const noCardsMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'd love to start a quiz session with you! However, you don't have any flashcards yet. 

📚 **To get started:**
1. Upload study materials using the file upload card
2. The AI will automatically generate flashcards from your content
3. Then you can say "quiz me" to practice!

You can upload PDFs, documents, or text files and I'll create personalized flashcards for you.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, noCardsMessage]);
      setMessage('');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    const requestStartTime = performance.now();

    try {
      // Save user message to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'user',
            content: userMessage.content,
            timestamp: userMessage.timestamp
          });
      }

      console.log('🚀 Sending message to AI with mode:', { 
        chatMode, 
        message: userMessage.content.substring(0, 50) + '...',
        userId: user.id,
        sessionId 
      });

      // Call enhanced AI function with usage tracking
      const result = await executeWithGate(
        'ai_chat',
        async () => {
          const { data, error } = await withTimeout(
            supabase.functions.invoke('ai-study-chat', {
              body: {
                message: userMessage.content,
                userId: user.id,
                sessionId: sessionId,
                chatMode,
                voiceActive: false,
                metadata: {
                  completedSessions: completedSessions?.length || 0,
                  flashcardCount: flashcards?.length || 0,
                  ragEnabled: true,
                  insights: insights
                }
              }
            }),
            18000
          );
          
          if (error) throw error;
          return data;
        },
        {
          amount: 1,
          metadata: {
            messageLength: userMessage.content.length,
            chatMode,
            sessionId,
            feature: 'ai_study_chat'
          }
        }
      );

      const data = result;

      let aiResponse: ChatMessage;

      if (!data?.response) {
        // Enhanced fallback with study-specific guidance
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateStudyFallbackResponse(userMessage.content, completedSessions, flashcards),
          timestamp: new Date().toISOString()
        };
      } else {
        const responseTime = performance.now() - requestStartTime;
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          ragMetadata: data.ragMetadata
        };
        
        // Track performance analytics
        trackResponseTime(
          responseTime / 1000, // Convert to seconds
          chatMode,
          data.ragMetadata?.ragEnabled || false,
          true
        );
        
        // Track RAG effectiveness if available
        if (data.ragMetadata) {
          trackRAGEffectiveness(
            'chat_query',
            data.ragMetadata.ragEnabled,
            data.ragMetadata.confidence || 0,
            (data.ragMetadata.personalItems || 0) + (data.ragMetadata.externalItems || 0) + (data.ragMetadata.similarItems || 0),
            true // Assume helpful for now - could be enhanced with user feedback
          );
        }
        
        // Handle API key missing warnings
        if (data.error === 'openai_key_missing' && chatMode === 'general') {
          toast({
            title: "OpenAI API Key Required",
            description: "General mode requires OpenAI configuration. Switching back to My Data mode.",
            variant: "destructive"
          });
          changeChatMode('personal');
          trackModeSwitch('general', 'personal', 'openai_key_missing');
        } else if (data.error === 'anthropic_key_missing' && chatMode === 'personal') {
          toast({
            title: "Anthropic API Key Required", 
            description: "My Data mode requires Anthropic configuration. Switching to General mode.",
            variant: "destructive"
          });
          changeChatMode('general');
          trackModeSwitch('personal', 'general', 'anthropic_key_missing');
        }
      }

      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse.content,
            timestamp: aiResponse.timestamp
          });
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const responseTime = performance.now() - requestStartTime;
      
      // Track failed response
      trackResponseTime(
        responseTime / 1000,
        chatMode,
        false,
        false,
        'connection_error'
      );
      
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateStudyFallbackResponse(userMessage.content, completedSessions, flashcards),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using enhanced offline mode with your study data",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudyFallbackResponse = (userMsg: string, sessions: any[], cards: any[]): string => {
    const sessionCount = sessions?.length || 0;
    const cardCount = cards?.length || 0;
    
    return `Based on your question about "${userMsg}" and your study data (${sessionCount} sessions, ${cardCount} flashcards):

🎯 **Personalized Recommendations:**
- You've completed ${sessionCount} study sessions - great progress!
- With ${cardCount} flashcards, try active recall: test yourself without looking
- Focus on spaced repetition: review cards at increasing intervals

📚 **Study Techniques for Your Level:**
- **Pomodoro Method**: 25-min focused sessions (perfect for your pace)
- **Feynman Technique**: Explain concepts in simple terms
- **Active Recall**: Quiz yourself regularly on your flashcards

🧠 **Memory Enhancement:**
- Create visual associations for difficult concepts
- Use mnemonic devices for lists and sequences
- Practice interleaving: mix different topics in study sessions

💡 **Next Steps:**
- Try saying "quiz me" to practice with your flashcards
- Upload new study materials for personalized analysis
- Set up a regular study schedule based on your ${sessionCount} completed sessions

What specific topic from your studies would you like to dive deeper into?`;
  };

  const handleVoiceInput = async () => {
    if (voiceInput.isRecording) {
      try {
        // Track voice processing usage
        const transcribedText = await executeWithGate(
          'voice_processing',
          async () => {
            const result = await voiceInput.stopRecording();
            return result;
          },
          {
            amount: Math.ceil(voiceInput.recordingDuration / 60), // Track per minute
            metadata: {
              duration: voiceInput.recordingDuration,
              feature: 'voice_input_chat'
            }
          }
        );
        
        if (transcribedText && transcribedText.trim()) {
          setMessage(transcribedText.trim());
          // Auto-send the message
          setTimeout(() => {
            if (transcribedText.trim()) {
              handleSendMessage();
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error stopping voice recording:', error);
        toast({
          title: "Voice Input Error",
          description: "Failed to process voice input. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await voiceInput.startRecording((text) => {
          setMessage(text);
        });
      } catch (error) {
        console.error('Error starting voice recording:', error);
        toast({
          title: "Voice Input Error", 
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveToNotes = (message: ChatMessage) => {
    setSelectedMessage(message);
    setShowSaveDialog(true);
  };

  const clearChat = async () => {
    try {
      // Stop any current speech and reset tracking
      stop();
      setLastSpokenMessageId(null);
      
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .delete()
          .eq('session_id', sessionId);
      }
      setMessages([]);
      setSessionId(null);
      await initializeSession();
      
      toast({
        title: "Chat Cleared",
        description: "Started a new conversation",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  // Handle playing the introduction
  const handlePlayIntroduction = useCallback(() => {
    if (messages.length > 0) {
      const welcomeMessage = messages.find(msg => msg.id === 'welcome' && msg.role === 'assistant');
      if (welcomeMessage) {
        speakText(welcomeMessage.content);
        setHasPlayedIntro(true);
      }
    }
  }, [messages, speakText]);

  // Handle auto-play toggle
  const handleAutoPlayToggle = useCallback(() => {
    const newAutoPlayEnabled = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlayEnabled);
    localStorage.setItem('aistudycoach_voice_autoplay', newAutoPlayEnabled.toString());
    
    if (newAutoPlayEnabled && !hasPlayedIntro && messages.length > 0) {
      // If enabling auto-play and haven't played intro yet, play it now
      setTimeout(() => handlePlayIntroduction(), 500);
    }
  }, [autoPlayEnabled, hasPlayedIntro, messages.length, handlePlayIntroduction]);

  return (
    <>
      <Card className={cn("w-full overflow-x-hidden", fixedHeight ? "h-full flex flex-col" : "min-h-[600px]")}>
        <CardHeader className="flex-shrink-0 pb-4 overflow-x-hidden">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="font-semibold text-lg">AI Learning Coach</h2>
              <Badge variant="outline" className="text-xs">
                {completedSessions.length} Sessions • {flashcards.length} Cards
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              {/* Chat Mode Toggle */}
              <ChatModeToggle 
                mode={chatMode} 
                onModeChange={(mode) => {
                  console.log('🔄 Mode change triggered:', { from: chatMode, to: mode });
                  changeChatMode(mode);
                  setLastSpokenMessageId(null); // Reset spoken tracking
                  // Update welcome message if this is the only message
                  if (messages.length === 1 && messages[0].id === 'welcome') {
                    setMessages([{
                      id: 'welcome',
                      role: 'assistant',
                      content: getWelcomeMessage(mode),
                      timestamp: new Date().toISOString()
                    }]);
                  }
                }}
                className="scale-90 w-full sm:w-auto max-w-full min-w-0"
              />
              
              {/* Text-to-Speech Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggle}
                  className={cn(
                    "h-8 w-8 p-0",
                    settings.enabled ? "text-green-600 bg-green-50" : "text-gray-500"
                  )}
                  title={settings.enabled ? "Disable text-to-speech" : "Enable text-to-speech"}
                >
                  {settings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stop}
                    className="h-8 w-8 p-0 text-red-600 bg-red-50"
                    title="Stop speaking"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn("overflow-x-hidden flex flex-col", fixedHeight ? "flex-1 min-h-0" : "")}>
          {/* Audio Introduction Controls */}
          {!hasPlayedIntro && messages.length > 0 && messages[0].role === 'assistant' && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 mb-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button
                  onClick={handlePlayIntroduction}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-fit"
                  size="sm"
                  aria-label="Play introduction"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Introduction
                </Button>
                <span className="text-xs sm:text-sm text-purple-700 break-words">Listen to a spoken welcome message</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlayEnabled}
                    onChange={handleAutoPlayToggle}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-purple-700 break-words">Enable auto-play next time</span>
                </label>
              </div>
            </div>
          )}
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className={cn(
              "flex-1 overflow-y-auto mb-4 space-y-4",
              fixedHeight ? "min-h-0" : "min-h-[400px] max-h-[400px]"
            )}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-message-role={msg.role}
                className={cn(
                  "flex gap-3 p-3 rounded-lg group",
                  msg.role === 'user'
                    ? "bg-purple-50 ml-8"
                    : "bg-gray-50 mr-8"
                )}
              >
                <div className="flex-shrink-0">
                  {msg.role === 'user' ? (
                    <User className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  
                  {/* RAG Metadata */}
                  {msg.ragMetadata && (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        🔍 RAG Enhanced
                      </Badge>
                      {msg.ragMetadata.personalItems > 0 && (
                        <Badge variant="outline" className="text-xs">
                          📚 {msg.ragMetadata.personalItems} Personal
                        </Badge>
                      )}
                      {msg.ragMetadata.externalItems > 0 && (
                        <Badge variant="outline" className="text-xs">
                          🌐 {msg.ragMetadata.externalItems} External
                        </Badge>
                      )}
                    </div>
                  )}
                  
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">
                       {new Date(msg.timestamp).toLocaleTimeString()}
                     </span>
                     
                     {/* Speech controls for AI messages */}
                     {msg.role === 'assistant' && 'speechSynthesis' in window && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => speakText(msg.content)}
                         className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                         title="Speak this message"
                       >
                         <Volume2 className="h-3 w-3" />
                       </Button>
                     )}
                   </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 p-3 rounded-lg bg-gray-50 sm:mr-8">
                <Bot className="h-5 w-5 text-gray-600" />
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {chatMode === 'personal' ? 'Analyzing your study data...' : 'Processing your request...'}
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    user?.id 
                      ? chatMode === 'personal' 
                         ? "Ask about your study data, flashcards, or say 'quiz me'..."
                         : "Ask platform questions or general knowledge..."
                      : "Please log in to chat"
                  }
                  disabled={isLoading || !user?.id}
                  className="pr-12"
                />
                
                {/* Voice Input Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                    voiceInput.isRecording && "text-red-500"
                  )}
                  onClick={handleVoiceInput}
                  disabled={!user?.id || voiceInput.isProcessing}
                  title={voiceInput.isRecording ? "Stop voice input" : "Start voice input"}
                >
                  {voiceInput.isRecording ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim() || !user?.id}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-4 min-w-0">
                <span className="truncate">💡 Try: "Quiz me", "Analyze my progress", or click mic to speak</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {settings.enabled && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Volume2 className="h-3 w-3" />
                      <span>TTS</span>
                      {isSpeaking && <span className="animate-pulse">• Speaking</span>}
                    </div>
                  )}
                  {voiceInput.isNativeSupported && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Mic className="h-3 w-3" />
                      <span>Voice Input</span>
                      {voiceInput.isRecording && <span className="animate-pulse">• Listening</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {chatMode === 'personal' ? '🔒 My Data' : '🏫 General & Guide'}
                </Badge>
                {chatMode === 'personal' && (
                  <span className="text-xs text-purple-600">
                    {completedSessions.length}S • {flashcards.length}F
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temporarily remove save dialog and quiz widget until dependencies are fixed */}
    </>
  );
};

export default AdvancedChatInterface;
