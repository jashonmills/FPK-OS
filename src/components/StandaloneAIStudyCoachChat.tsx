import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, Volume2, VolumeX, Play, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useChatMode } from '@/hooks/useChatMode';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import ChatModeToggle from '@/components/ai-coach/ChatModeToggle';

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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatMode, changeChatMode } = useChatMode();
  const [sessionId, setSessionId] = useLocalStorage<string | null>('ai_coach_session_id', null);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    localStorage.getItem('aistudycoach_voice_autoplay') === 'true'
  );
  
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings, toggle } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and load chat history
  useEffect(() => {
    if (user?.id) {
      setLastSpokenMessageId(null);
      initializeSession();
    }
  }, [user?.id]);

  // Auto scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [messages]);

  const getWelcomeMessage = (mode = chatMode) => {
    if (mode === 'personal') {
      return `Hello! I'm your AI Learning Coach with access to your study data. I can help you with:

🎯 **Personalized Study Guidance** - Based on your study sessions
📚 **Flashcard Analysis** - Using your flashcards  
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
        // Verify session exists and load messages
        const { data: sessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('user_id')
          .eq('id', sessionId)
          .single();

        if (sessionError || !sessionData || sessionData.user_id !== user.id) {
          setSessionId(null);
          await initializeSession();
          return;
        }

        loadChatHistory();
      }
    } catch (error) {
      console.error('Error initializing session:', error);
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
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
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
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s*(.*)/g, '$1')
      .replace(/[🎯📚🧠🎮💡🌐📖🔍]/g, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, ' ')
      .trim();
  }, []);

  const speakText = useCallback((text: string) => {
    const cleanText = cleanTextForSpeech(text);
    if (cleanText) {
      speak(cleanText, { interrupt: true });
    }
  }, [speak, cleanTextForSpeech]);

  // Auto-speak new AI messages when TTS is enabled
  useEffect(() => {
    const autoPlayEnabled = localStorage.getItem('aistudycoach_voice_autoplay') === 'true';
    
    if (settings.enabled && settings.autoRead && autoPlayEnabled && messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.role === 'assistant' && lastMessage.id !== lastSpokenMessageId) {
        setLastSpokenMessageId(lastMessage.id);
        
        setTimeout(() => {
          if (settings.enabled) {
            speakText(lastMessage.content);
          }
        }, 500);
      }
    }
  }, [messages, settings.enabled, settings.autoRead, isLoading, lastSpokenMessageId, speakText]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !user?.id) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

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

      // Call AI function
      const { data, error } = await withTimeout(
        supabase.functions.invoke('ai-study-chat', {
          body: {
            message: userMessage.content,
            userId: user.id,
            sessionId: sessionId,
            chatMode,
            voiceActive: false,
            metadata: {
              ragEnabled: true
            }
          }
        }),
        18000
      );
      
      if (error) throw error;

      let aiResponse: ChatMessage;

      if (!data?.response) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateFallbackResponse(userMessage.content),
          timestamp: new Date().toISOString()
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          ragMetadata: data.ragMetadata
        };
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
      
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode",
        variant: "default"
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

  const handleVoiceInput = async () => {
    if (voiceInput.isRecording) {
      try {
        const transcribedText = await voiceInput.stopRecording();
        
        if (transcribedText && transcribedText.trim()) {
          setMessage(transcribedText.trim());
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

  const clearChat = async () => {
    try {
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

  const handlePlayIntroduction = useCallback(() => {
    if (messages.length > 0) {
      const welcomeMessage = messages.find(msg => msg.id === 'welcome' && msg.role === 'assistant');
      if (welcomeMessage) {
        speakText(welcomeMessage.content);
        setHasPlayedIntro(true);
      }
    }
  }, [messages, speakText]);

  const handleAutoPlayToggle = useCallback(() => {
    const newAutoPlayEnabled = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlayEnabled);
    localStorage.setItem('aistudycoach_voice_autoplay', newAutoPlayEnabled.toString());
    
    if (newAutoPlayEnabled && !hasPlayedIntro && messages.length > 0) {
      setTimeout(() => handlePlayIntroduction(), 500);
    }
  }, [autoPlayEnabled, hasPlayedIntro, messages.length, handlePlayIntroduction]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">AI Study Coach</h2>
            <p className="text-muted-foreground mb-4">Please log in to access the AI Study Coach chat interface.</p>
            <Button onClick={() => window.location.href = '/login'} className="bg-purple-600 hover:bg-purple-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="font-semibold text-lg">AI Learning Coach</h2>
              <Badge variant="outline" className="text-xs">
                Standalone Chat
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <ChatModeToggle 
                mode={chatMode} 
                onModeChange={(mode) => {
                  changeChatMode(mode);
                  setLastSpokenMessageId(null);
                  if (messages.length === 1 && messages[0].id === 'welcome') {
                    setMessages([{
                      id: 'welcome',
                      role: 'assistant',
                      content: getWelcomeMessage(mode),
                      timestamp: new Date().toISOString()
                    }]);
                  }
                }}
                className="scale-90"
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
                onClick={clearChat}
                className="h-8 w-8 p-0"
                title="Clear chat"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col flex-1 min-h-0">
          {/* Audio Introduction Controls */}
          {!hasPlayedIntro && messages.length > 0 && messages[0].role === 'assistant' && (
            <div className="flex items-center justify-between p-3 mb-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayIntroduction}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                  aria-label="Play introduction"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Introduction
                </Button>
                <span className="text-sm text-purple-700">Listen to a spoken welcome message</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlayEnabled}
                    onChange={handleAutoPlayToggle}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-purple-700">Enable auto-play next time</span>
                </label>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0"
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
              <div className="flex gap-3 p-3 rounded-lg bg-gray-50 mr-8">
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
                    chatMode === 'personal' 
                       ? "Ask about your study data, flashcards, or say 'quiz me'..."
                       : "Ask platform questions or general knowledge..."
                  }
                  disabled={isLoading}
                  className="pr-12"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                    voiceInput.isRecording && "text-red-500"
                  )}
                  onClick={handleVoiceInput}
                  disabled={voiceInput.isProcessing}
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
                disabled={isLoading || !message.trim()}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>💡 Try: "Quiz me", "Analyze my progress", or click mic to speak</span>
                <div className="flex items-center gap-3">
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
              
              <Badge variant="outline" className="text-xs">
                {chatMode === 'personal' ? '🔒 My Data' : '🏫 General & Guide'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandaloneAIStudyCoachChat;