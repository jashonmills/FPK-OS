import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, Volume2, VolumeX, Play, History, MessageCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useWidgetChatStorage } from '@/hooks/useWidgetChatStorage';
import { useConversationState, ChatMessage as ConversationMessage } from '@/hooks/useConversationState';
import { v4 as uuidv4 } from 'uuid';
import VoiceInputButton from '@/components/notes/VoiceInputButton';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
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

const StandaloneAIStudyCoachChat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  // Use anonymous ID for non-authenticated users
  const anonymousId = useState(() => `anonymous_${Date.now()}`)[0];
  const { messages, addMessage, clearAllMessages } = useWidgetChatStorage(user?.id || anonymousId);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    localStorage.getItem('aistudycoach_voice_autoplay') === 'true'
  );
  
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings, toggle } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [messages]);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant' as const,
        content: `Hello! I'm your AI Learning Coach in demo mode. I can help you with:

🌐 **General Knowledge** - Any subject, research, or educational topics
📖 **Study Techniques** - Learning strategies and academic methods  
💡 **Learning Guidance** - Study tips and educational advice
🔍 **How-To Guides** - General learning and study methods

Note: This is a demo version with limited features. For full personalized features with your study data, please log in to the main platform.

What would you like to learn about today?`
      };
      
      addMessage(welcomeMessage);
    }
  }, [messages.length, addMessage]);

  // Enhanced prompt type detection using conversation state analysis
  const { state: conversationState, analyzeConversation, updateState } = useConversationState();

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: messageText.trim()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to conversation format for analysis
      const conversationHistory: ConversationMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Analyze conversation to determine proper context and prompt type
      const analyzedState = analyzeConversation(conversationHistory, messageText);
      updateState(analyzedState);
      
      // Build contextData from conversation state
      const contextData = {
        quizTopic: analyzedState.currentTopic,
        teachingHistory: analyzedState.teachingMethods.join(', '),
        incorrectCount: analyzedState.incorrectAnswersCount,
        isInQuiz: analyzedState.isInQuiz,
        inRefresherMode: analyzedState.inRefresherMode
      };

      // Build lightweight client history (last 6 messages)
      const clientHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));
      
      // Call AI function with enhanced context
      const { data, error } = await withTimeout(
        supabase.functions.invoke('ai-study-chat', {
          body: {
            message: messageText,
            userId: user?.id || anonymousId,
            sessionId,
            promptType: analyzedState.promptType,
            chatMode: 'general',
            voiceActive: false,
            contextData,
            clientHistory
          }
        }),
        18000
      );
      
      if (error) {
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

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
        conversationState: conversationState
      });
      
      const fallbackResponse = {
        role: 'assistant' as const,
        content: generateFallbackResponse(messageText)
      };

      addMessage(fallbackResponse);
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isValidationError = errorMessage.includes('promptType') || errorMessage.includes('required');
      
      toast({
        title: isValidationError ? "Configuration Issue" : "Connection Issue",
        description: isValidationError ? "Please refresh and try again" : "Using offline mode",
        variant: isValidationError ? "destructive" : "default",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userMsg: string): string => {
    return `I'm experiencing a connection issue, but I can still help with "${userMsg}":

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

What specific topic would you like to focus on?`;
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
      // Auto-send voice input
      setTimeout(() => sendMessage(transcription), 100);
    }
  };

  const handleTTSToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      // Find the last AI message and speak it
      const lastAIMessage = messages.filter(m => m.role === 'assistant').pop();
      if (lastAIMessage) {
        speak(lastAIMessage.content);
        setLastSpokenMessageId(lastAIMessage.id);
      }
    }
  };

  const handleAutoPlayToggle = () => {
    const newAutoPlay = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlay);
    localStorage.setItem('aistudycoach_voice_autoplay', newAutoPlay.toString());
    
    // Shorter, less intrusive toast
    toast({
      title: newAutoPlay ? "Auto-play on" : "Auto-play off",
      duration: 1500
    });
  };

  const handleClearChat = () => {
    clearAllMessages();
    stop(); // Stop any current speech
    setLastSpokenMessageId(null);
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

  // Auto-play AI responses if enabled
  useEffect(() => {
    if (!autoPlayEnabled || !settings.enabled) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.id !== lastSpokenMessageId &&
        !isLoading) {
      
      // Small delay to ensure message is rendered
      setTimeout(() => {
        speak(lastMessage.content);
        setLastSpokenMessageId(lastMessage.id);
      }, 500);
    }
  }, [messages, autoPlayEnabled, settings.enabled, lastSpokenMessageId, isLoading, speak]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Demo Badge */}
      <div className="flex-shrink-0 bg-primary/10 border-b border-border p-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          🤖 AI Study Coach Demo - No login required
        </span>
        {messages.length >= 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Main Content Container - Single scrollable area for messages only */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {/* Messages Area */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">AI Study Coach</p>
                <p className="text-sm">Start a conversation to get personalized learning assistance</p>
                <p className="text-xs mt-2 opacity-75">This is a demo version - try asking study-related questions!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 p-4 rounded-lg max-w-[85%]",
                    msg.role === 'user'
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted"
                  )}
                >
                  <div className="flex-shrink-0">
                    {msg.role === 'user' ? (
                      <User className="w-6 h-6" />
                    ) : (
                      <Bot className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                    </div>
                    {msg.role === 'assistant' && settings.enabled && (
                      <div className="flex items-center gap-2 mt-2">
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
                          disabled={!settings.enabled}
                          className="h-6 px-2 text-xs"
                        >
                          {isSpeaking && lastSpokenMessageId === msg.id ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 p-4 rounded-lg max-w-[85%] mr-auto bg-muted">
                  <div className="flex-shrink-0">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Fixed Bottom Controls Container */}
      <div className="flex-shrink-0 p-4 max-w-4xl mx-auto w-full">
        {/* Voice Controls Row */}
        {settings.enabled && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTTSToggle}
                  disabled={!settings.enabled}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? 'Stop' : 'Read'}
                </Button>
                <Button
                  variant={autoPlayEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleAutoPlayToggle}
                  disabled={!settings.enabled}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Auto-play
                </Button>
                {messages.length >= 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearChat}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              {isSpeaking && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Speaking...
                </div>
              )}
            </div>
            {voiceInput.isRecording && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording...
              </div>
            )}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about learning..."
              disabled={isLoading}
              className="min-h-[44px] pr-12"
            />
            {settings.enabled && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton
                  onTranscription={handleVoiceInput}
                  placeholder="voice input"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StandaloneAIStudyCoachChat;