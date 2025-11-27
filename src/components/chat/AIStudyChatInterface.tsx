import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, Volume2, VolumeX, Play, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useWidgetChatStorage } from '@/hooks/useWidgetChatStorage';
import { useConversationState, ChatMessage as ConversationMessage } from '@/hooks/useConversationState';
import { v4 as uuidv4 } from 'uuid';
import VoiceInputButton from '@/components/notes/VoiceInputButton';
import { useCleanup } from '@/utils/cleanupManager';
import ChatModeToggle from '@/components/ai-coach/ChatModeToggle';
import { SaveBeforeClearDialog } from '@/components/ai-coach/SaveBeforeClearDialog';
import { useSavedCoachChats } from '@/hooks/useSavedCoachChats';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface SessionData {
  id: string;
  course_id?: string;
  completed_at?: string;
}

interface FlashcardData {
  id: string;
  front_content: string;
  back_content: string;
  difficulty_level?: number;
}

interface InsightData {
  type: 'performance' | 'pattern' | 'recommendation' | 'motivation';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIStudyChatInterfaceProps {
  chatMode?: 'personal' | 'general' | 'org_admin';
  dataSource?: 'general' | 'mydata'; // For Personal AI Coach tri-modal system
  adminMode?: 'educational' | 'org_data'; // For Org Admin
  showHeader?: boolean;
  placeholder?: string;
  // Dashboard-specific props
  userId?: string;
  orgId?: string;
  user?: User;
  completedSessions?: SessionData[];
  flashcards?: FlashcardData[];
  insights?: InsightData[];
  fixedHeight?: boolean;
  isStructuredMode?: boolean;
  // Callback to promote to structured mode
  onPromoteToStructured?: () => void;
  // Callback to expose messages to parent
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

const withProgressiveTimeout = <T,>(
  promise: Promise<T>, 
  onProgress: (message: string) => void,
  cleanup: any,
  ms = 18000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let progressTimer: NodeJS.Timeout;
    
    // Show "Still thinking..." after 8 seconds  
    const progressTimeout = cleanup.setTimeout(() => {
      onProgress("Still thinking... This might take a moment.");
    }, 8000);
    
    // Final timeout after 18 seconds
    const finalTimeout = cleanup.setTimeout(() => {
      cleanup.cleanup(progressTimeout);
      reject(new Error('Request timed out - please try again'));
    }, ms);
    
    promise.then((value) => {
      cleanup.cleanup(progressTimeout);
      cleanup.cleanup(finalTimeout);
      resolve(value);
    }).catch((err) => {
      cleanup.cleanup(progressTimeout);
      cleanup.cleanup(finalTimeout);
      reject(err);
    });
  });
};

export const AIStudyChatInterface: React.FC<AIStudyChatInterfaceProps> = ({
  chatMode: initialChatMode = 'general',
  dataSource = 'general',
  adminMode = 'educational',
  showHeader = true,
  placeholder = "Ask me anything about your studies...",
  userId,
  orgId,
  user,
  completedSessions = [],
  flashcards = [],
  insights,
  fixedHeight = false,
  isStructuredMode = false,
  onPromoteToStructured,
  onMessagesChange
}) => {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const currentUserId = userId || currentUser?.id;
  const [chatMode, setChatMode] = useState(initialChatMode);
  const { toast } = useToast();
  const anonymousId = useState(() => `anonymous_${Date.now()}`)[0];
  const { messages, addMessage, clearAllMessages, isLoaded } = useWidgetChatStorage(currentUserId || anonymousId);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { state: conversationState, analyzeConversation, updateState } = useConversationState();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => uuidv4());
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    safeLocalStorage.getItem<string>('aistudycoach_voice_autoplay', {
      fallbackValue: 'false',
      logErrors: false
    }) === 'true'
  );
  
  const { speak, stop, isSpeaking, isGenerating } = useTextToSpeech();
  const { settings, toggle } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const inputRef = useRef<HTMLInputElement>(null);
  const cleanup = useCleanup('AIStudyChatInterface');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isSubmittingRef = useRef(false);

  // Expose messages to parent component
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  // Auto scroll when messages change (but not when input is focused)
  useEffect(() => {
    if (messages.length > 0 && !isInputFocused) {
      cleanup.setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [messages, cleanup, isInputFocused]);

  // Add welcome message with dashboard data (only after storage is loaded)
  useEffect(() => {
    if (!isLoaded) return; // Wait for storage to load
    
    if (messages.length === 0) {
      const welcomeContent = chatMode === 'personal' 
        ? `Hello! I'm your personalized AI Learning Coach. I have access to your study data and can help you with:

🎯 **Personalized Guidance** - Based on your uploaded materials and progress
📚 **Study Sessions** - Using your flashcards and notes for targeted practice
🧠 **Socratic Teaching** - I'll guide you to discover answers through questions
🎮 **Interactive Quizzes** - Practice with your flashcards by saying "quiz me"
💡 **Smart Insights** - Tailored advice based on your learning patterns

I can see you have ${completedSessions?.length || 0} completed study sessions and ${flashcards?.length || 0} flashcards ready for practice.

What would you like to focus on in today's learning session?`
        : `Hello! I'm your AI Learning Coach in general knowledge mode. I can help you with:

🌐 **General Knowledge** - Any subject, research, or educational topics
📖 **Study Techniques** - Learning strategies and academic methods  
💡 **Learning Guidance** - Study tips and educational advice
🔍 **Research Help** - Information gathering and analysis

For personalized features with your study materials, you can switch to Personal mode using the toggle above.

What would you like to learn about today?`;

      const welcomeMessage = {
        role: 'assistant' as const,
        content: welcomeContent
      };
      
      addMessage(welcomeMessage);
    }
  }, [isLoaded, messages.length, addMessage, chatMode, completedSessions?.length, flashcards?.length]);

  // Convert widget messages to conversation format for analysis
  const convertToConversationHistory = useCallback((widgetMessages: typeof messages): ConversationMessage[] => {
    return widgetMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }, []);

  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage = {
      role: 'user' as const,
      content: messageText.trim()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setProgressMessage(null);

    try {
      // Optimize for simple math questions - skip heavy analysis
      const isMathQuestion = /^\s*\d+\s*[\+\-\*\/]\s*\d+\s*[?]?\s*$/.test(messageText.trim());
      
      let analyzedState;
      let contextData = {};
      
      if (isMathQuestion) {
        // Fast path for simple math
        analyzedState = {
          promptType: 'direct_answer',
          isInQuiz: false,
          inRefresherMode: false,
          currentTopic: 'mathematics',
          teachingMethods: [],
          incorrectAnswersCount: 0
        };
        console.log('🚀 Fast path: Simple math question detected');
      } else {
        // Full analysis for complex questions
        const conversationHistory = convertToConversationHistory(messages);
        analyzedState = analyzeConversation(conversationHistory, messageText);
        
        contextData = {
          quizTopic: analyzedState.currentTopic,
          teachingHistory: analyzedState.teachingMethods.join(', '),
          incorrectCount: analyzedState.incorrectAnswersCount,
          isInQuiz: analyzedState.isInQuiz,
          inRefresherMode: analyzedState.inRefresherMode
        };
      }
      
      updateState(analyzedState);

      // Build lightweight client history (last 6 messages)
      const clientHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));
      
      console.log('🎯 Sending AI Study Chat request (Optimized):', {
        messageLength: messageText.length,
        promptType: analyzedState.promptType,
        sessionId: sessionId.substring(0, 8) + '...',
        historyLength: clientHistory.length,
        isMathQuestion,
        conversationState: {
          isInQuiz: analyzedState.isInQuiz,
          currentTopic: analyzedState.currentTopic,
          incorrectCount: analyzedState.incorrectAnswersCount
        }
      });

      // Call AI function with progressive timeout and cancellation using OpenAI Assistant
      const { data, error } = await withProgressiveTimeout(
        supabase.functions.invoke('ai-study-chat', {
          body: {
            message: messageText,
            userId: currentUserId || anonymousId,
            sessionId,
            promptType: analyzedState.promptType,
            chatMode,
            dataSource, // For Personal AI Coach tri-modal system
            adminMode, // For Org Admin: educational or org_data
            voiceActive: false,
            useOpenAIAssistant: true,
            threadId: threadId,
            contextData: {
              ...contextData,
              orgId // Include orgId for org admin context
            },
            clientHistory
          }
        }),
        (progress) => setProgressMessage(progress),
        cleanup,
        18000
      );
      
      if (error) {
        console.error('❌ AI Study Chat API error:', {
          error: error.message,
          details: error,
          promptType: analyzedState.promptType,
          messageText: messageText.substring(0, 50) + '...'
        });
        throw error;
      }

      // Store thread ID for conversation continuity
      if (data?.threadId) {
        setThreadId(data.threadId);
      }

      if (!data?.response) {
        console.warn('⚠️ AI Study Chat: No response data received');
        throw new Error('No response received from AI');
      }

      console.log('✅ AI Study Chat response received:', {
        source: data.source,
        blueprintVersion: data.blueprintVersion,
        promptType: data.metadata?.promptType,
        threadId: data?.threadId
      });

      const aiResponse = {
        role: 'assistant' as const,
        content: data.response
      };

      addMessage(aiResponse);

      // Update conversation state based on AI response
      if (data.metadata?.promptType) {
        updateState({ 
          promptType: data.metadata.promptType,
          lastAIQuestion: data.response.includes('?') ? data.response : null
        });
      }

    } catch (error) {
      console.error('❌ Chat error details:', {
        error: error instanceof Error ? error.message : error,
        messageText: messageText.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
        conversationState: conversationState,
        isAborted: abortControllerRef.current?.signal.aborted
      });
      
      // Don't show error if request was cancelled by user
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Request cancelled by user');
        return;
      }
      
      const fallbackResponse = {
        role: 'assistant' as const,
        content: generateFallbackResponse(messageText, chatMode)
      };

      addMessage(fallbackResponse);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeoutError = errorMessage.includes('timed out') || errorMessage.includes('timeout');
      const isValidationError = errorMessage.includes('promptType') || errorMessage.includes('required');
      
      toast({
        title: isTimeoutError ? "Request Timed Out" : isValidationError ? "Configuration Issue" : "Connection Issue",
        description: isTimeoutError ? 
          "The request took too long. Please try a simpler question." :
          isValidationError ? "Please refresh and try again" : "Using offline mode",
        variant: isTimeoutError || isValidationError ? "destructive" : "default",
        duration: isTimeoutError ? 5000 : 3000
      });
    } finally {
      setIsLoading(false);
      setProgressMessage(null);
      abortControllerRef.current = null;
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 500);
    }
  };

  const generateFallbackResponse = (userMsg: string, mode: string): string => {
    if (mode === 'personal') {
      return `I'm experiencing a connection issue, but let's use this as a learning opportunity! 🤔 About "${userMsg}" - what do you already know or think about this topic? What questions does it raise for you?`;
    }
    
    return `I'm having a temporary connection issue, but I can still guide your learning about "${userMsg}":

🎯 **Study Recommendations:**
- Try active recall: test yourself without looking at answers
- Use spaced repetition: review material at increasing intervals
- Break complex topics into smaller, manageable chunks

📚 **Study Techniques:**
- **Pomodoro Method**: 25-min focused sessions with 5-min breaks
- **Feynman Technique**: Explain concepts in simple terms
- **Active Learning**: Engage with material through questions and discussions

💡 **Next Steps:**
- Create flashcards for key concepts
- Practice with quiz sessions when available
- Set up a regular study schedule

What specific aspect would you like to focus on?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoiceInput = (transcription: string) => {
    if (transcription.trim()) {
      setInput(transcription);
      cleanup.setTimeout(() => sendMessage(transcription), 100);
    }
  };

  const handleTTSToggle = useCallback(() => {
    if (isSpeaking || isGenerating) {
      stop();
    } else {
      const lastAIMessage = messages.filter(m => m.role === 'assistant').pop();
      if (lastAIMessage) {
        speak(lastAIMessage.content, { interrupt: true });
        setLastSpokenMessageId(lastAIMessage.id);
      }
    }
  }, [isSpeaking, isGenerating, messages, speak, stop]);

  const handleAutoPlayToggle = () => {
    const newAutoPlay = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlay);
    safeLocalStorage.setItem('aistudycoach_voice_autoplay', newAutoPlay.toString());
    
    toast({
      title: newAutoPlay ? "Auto-play on" : "Auto-play off",
      duration: 1500
    });
  };

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { saveCurrentChat } = useSavedCoachChats();

  const handleClearChatClick = () => {
    if (messages.length > 1) { // Only show dialog if there are actual messages (beyond welcome)
      setShowSaveDialog(true);
    } else {
      handleClearChat();
    }
  };

  const handleClearChat = () => {
    clearAllMessages();
    stop();
    setLastSpokenMessageId(null);
    setThreadId(null); // Reset OpenAI thread
    // Reset conversation state
    updateState({
      promptType: 'initiate_session',
      isInQuiz: false,
      inRefresherMode: false,
      lastAIQuestion: null,
      currentTopic: null,
      incorrectAnswersCount: 0,
      teachingMethods: []
    });
    
    toast({
      title: "Chat cleared",
      description: "Starting fresh conversation",
      duration: 2000
    });
  };

  const handleSaveAndClear = async (title?: string) => {
    if (currentUser && messages.length > 0) {
      await saveCurrentChat(messages, title);
    }
    handleClearChat();
  };

  // Generate suggested title for save dialog
  const generateSuggestedTitle = () => {
    const firstUserMessage = messages.find(m => m.role === 'user')?.content;
    if (!firstUserMessage) return '';
    
    const words = firstUserMessage.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  };

  // Auto-play AI responses if enabled
  useEffect(() => {
    if (!autoPlayEnabled || !settings.enabled) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.id !== lastSpokenMessageId &&
        !isLoading) {
      
      cleanup.setTimeout(() => {
        speak(lastMessage.content);
        setLastSpokenMessageId(lastMessage.id);
      }, 500);
    }
  }, [messages, autoPlayEnabled, settings.enabled, lastSpokenMessageId, isLoading, speak]);

  return (
    <Card className={cn("w-full flex flex-col bg-white/35 backdrop-blur-sm border-white/20 overflow-hidden", fixedHeight ? "h-full max-h-full" : "min-h-[600px]")}>
      {showHeader && (
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Brain className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <h2 className="font-semibold text-lg whitespace-nowrap">AI Learning Coach</h2>
              {(completedSessions?.length > 0 || flashcards?.length > 0) && (
                <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">
                  {completedSessions?.length || 0} Sessions • {flashcards?.length || 0} Cards
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              {/* Promote to Structured button - only show in Free Chat with sufficient history */}
              {onPromoteToStructured && !isStructuredMode && messages.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPromoteToStructured}
                  className="h-8 px-3 text-xs font-medium bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
                  title="Continue this conversation in Structured Mode"
                >
                  <Brain className="h-3 w-3 mr-1.5" />
                  Promote to Structured
                </Button>
              )}
              
              <ChatModeToggle 
                mode={chatMode} 
                onModeChange={setChatMode}
                className="scale-90 w-full sm:w-auto max-w-full min-w-0"
              />
              
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
                onClick={handleClearChatClick}
                title="Clear chat"
                className="h-8 w-8 p-0"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={cn("flex-1 flex flex-col overflow-hidden pb-0", fixedHeight ? "min-h-0" : "")}>
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className={cn(
            "flex-1 overflow-y-auto px-4 pb-1 space-y-3 overscroll-contain",
            fixedHeight ? "min-h-0" : "min-h-[400px] max-h-[400px]"
          )}
        >
          {/* Progress Message */}
          {isLoading && progressMessage && (
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 mr-8">
              <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm text-blue-700">{progressMessage}</p>
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
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
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  
                  {msg.role === 'assistant' && settings.enabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (isSpeaking && lastSpokenMessageId === msg.id) {
                          stop();
                        } else {
                          speak(msg.content);
                          setLastSpokenMessageId(msg.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      title="Speak this message"
                    >
                      {isSpeaking && lastSpokenMessageId === msg.id ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 p-3 rounded-lg bg-gray-50 mr-8">
              <Bot className="h-5 w-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form - Fixed at bottom */}
        <div className="flex-shrink-0 px-4 pt-[5px] pb-4 border-t border-border" style={{ 
          backgroundColor: 'hsl(var(--background))'
        }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={(e) => {
                  // Prevent viewport jump and disable auto-scroll
                  setIsInputFocused(true);
                  e.preventDefault();
                  // Don't call focus again, we're already in focus
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                }}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1"
                style={{ 
                  // Prevent zoom on iOS
                  fontSize: '16px'
                }}
              />
              <VoiceInputButton
                onTranscription={handleVoiceInput}
                disabled={isLoading}
              />
              
              {/* Cancel button when loading */}
              {isLoading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (abortControllerRef.current) {
                      abortControllerRef.current.abort();
                      setIsLoading(false);
                      setProgressMessage(null);
                      toast({
                        title: "Request cancelled",
                        description: "You can try asking again",
                        duration: 2000
                      });
                    }
                  }}
                  className="px-3 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel
                </Button>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Progress indicator */}
            {isLoading && (
              <div className="text-xs text-gray-500">
                {progressMessage || "Processing your request..."}
              </div>
            )}
          </form>
        </div>
      </CardContent>

      {/* Save Before Clear Dialog */}
      <SaveBeforeClearDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSaveAndClear={handleSaveAndClear}
        onClearWithoutSaving={handleClearChat}
        messageCount={messages.length}
        suggestedTitle={generateSuggestedTitle()}
      />
    </Card>
  );
};

export default AIStudyChatInterface;