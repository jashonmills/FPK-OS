
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Brain, Database, Globe, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import QuizSessionWidget from './QuizSessionWidget';
import { useQuizSession } from '@/hooks/useQuizSession';

interface ChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any;
  fixedHeight?: boolean;
}

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

const ChatInterface = ({ user, completedSessions, flashcards, insights, fixedHeight = false }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatMode, setChatMode] = useState<'personal' | 'general'>('personal');
  const [voiceActive, setVoiceActive] = useState(false);
  const [showQuizWidget, setShowQuizWidget] = useState(false);
  const { toast } = useToast();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { awardFlashcardStudyXP } = useXPIntegration();
  const [sessionId, setSessionId] = useLocalStorage<string | null>('ai_coach_session_id', null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { sessionState, startQuizSession, endSession } = useQuizSession();

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        // Create a new session
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user?.id,
            title: 'AI Coach Session',
            context_tag: 'AI Coach'
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating chat session:', error);
          return;
        }

        setSessionId(data.id);
        return;
      }

      // Load existing messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      }
    };

    if (user?.id) {
      loadMessages();
    }
  }, [user?.id, sessionId]);

  // Quiz trigger detection
  const detectQuizRequest = (message: string): boolean => {
    const quizKeywords = [
      'quiz me', 'practice', 'review these', 'test me', 'challenge me',
      'quiz session', 'study session', 'practice cards', 'drill me'
    ];
    const lowerMessage = message.toLowerCase();
    return quizKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    // Check for quiz session request
    if (detectQuizRequest(message) && flashcards && flashcards.length > 0) {
      setShowQuizWidget(true);
      setMessage(''); // Clear input
      return; // Don't send to AI, show quiz widget instead
    }

    // Add user message to state immediately for better UX
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage(''); // Clear input field
    setIsSending(true);

    try {
      // Save message to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
          });
      }

      // Call enhanced AI function with RAG support
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message,
          userId: user.id,
          sessionId,
          chatMode,
          voiceActive,
          metadata: {
            completedSessions: completedSessions.length,
            flashcardCount: flashcards?.length || 0,
            ragEnabled: true // Enable RAG for this request
          }
        }
      });

      if (error) throw error;

      // Add AI response with RAG metadata
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm here to help with your learning journey!",
        timestamp: new Date().toISOString(),
        ragMetadata: data.ragMetadata
      };

      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse.content,
            timestamp: new Date().toISOString()
          });
      }

      // Award XP for meaningful interactions
      if (message.length > 15) {
        await awardFlashcardStudyXP(1, 1, 30); // Award some XP for interaction
      }

      // Show RAG enhancement toast if enabled
      if (data.ragMetadata?.ragEnabled && data.ragMetadata.confidence > 0.3) {
        toast({
          title: "Enhanced Response",
          description: `Used ${data.ragMetadata.personalItems + data.ragMetadata.externalItems} knowledge sources`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        setMessage(transcribedText);
        toast({
          title: "Voice recorded",
          description: "Your voice has been transcribed. You can edit it before sending.",
        });
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast({
          title: "Recording failed",
          description: "There was an error processing your voice. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await startRecording();
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone. Click the mic button again to stop.",
        });
      } catch (error) {
        console.error('Error starting recording:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleChatMode = () => {
    const newMode = chatMode === 'personal' ? 'general' : 'personal';
    setChatMode(newMode);
    toast({
      title: `Switched to ${newMode === 'personal' ? 'My Data' : 'General Knowledge'} mode`,
      description: newMode === 'personal' 
        ? "I'll focus on your personal study data and learning patterns."
        : "I'll access external knowledge to answer general questions.",
    });
  };

  const toggleVoiceMode = () => {
    setVoiceActive(!voiceActive);
    toast({
      title: voiceActive ? "Voice mode disabled" : "Voice mode enabled",
      description: voiceActive 
        ? "Responses will be optimized for reading."
        : "Responses will be optimized for listening.",
    });
  };

  const handleQuizComplete = (results: any) => {
    setShowQuizWidget(false);
    // Add a message showing quiz results
    const resultMessage = `🎉 Quiz session completed! You got ${results.correctOnFirstTry}/${results.totalCards} correct on the first try with ${results.accuracy}% overall accuracy. Great work!`;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: resultMessage,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleQuizCancel = () => {
    setShowQuizWidget(false);
    endSession();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Quiz session cancelled. I'm here whenever you're ready to practice again! 📚",
      timestamp: new Date().toISOString()
    }]);
  };

  const renderRAGIndicator = (ragMetadata?: ChatMessage['ragMetadata']) => {
    if (!ragMetadata || !ragMetadata.ragEnabled) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <Brain className="h-3 w-3" />
        <span>Enhanced with</span>
        {ragMetadata.personalItems > 0 && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{ragMetadata.personalItems} personal</span>
          </div>
        )}
        {ragMetadata.externalItems > 0 && (
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{ragMetadata.externalItems} external</span>
          </div>
        )}
        {ragMetadata.similarItems > 0 && (
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span>{ragMetadata.similarItems} similar</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn(
      "bg-gradient-to-br from-white to-purple-50/30",
      fixedHeight ? "h-full flex flex-col" : "h-full flex flex-col"
    )}>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {/* Header - Mobile Optimized */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            <h2 className="font-semibold text-sm sm:text-lg truncate">AI Learning Coach</h2>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleChatMode}
              className={cn(
                "text-xs px-2 py-1 h-auto whitespace-nowrap",
                chatMode === 'personal' 
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
              )}
            >
              {chatMode === 'personal' ? '🔒 My Data' : '🌐 General'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceMode}
              className={cn(
                "text-xs px-2 py-1 h-auto whitespace-nowrap",
                voiceActive && "bg-green-100 text-green-700 hover:bg-green-200"
              )}
            >
              {voiceActive ? '🔊 Voice' : '🔇 Text'}
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className={cn(
          "flex-1 overflow-hidden",
          fixedHeight && "min-h-0"
        )}>
          {/* Quiz Session Widget */}
          {(sessionState.isActive || showQuizWidget) && (
            <div className="p-3 sm:p-4">
              <QuizSessionWidget
                onComplete={handleQuizComplete}
                onCancel={handleQuizCancel}
                autoStart={showQuizWidget && !sessionState.isActive}
              />
            </div>
          )}

          {/* Chat Messages */}
          {!sessionState.isActive && !showQuizWidget && (
            <div className={cn(
              fixedHeight ? "h-full" : "flex-1",
              "p-3 sm:p-4 overflow-y-auto"
            )}>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 text-sm sm:text-base",
                      msg.role === 'user' 
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-gray-100 text-gray-900"
                    )}>
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                      {msg.role === 'assistant' && renderRAGIndicator(msg.ragMetadata)}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-2 sm:p-3 max-w-[80%]">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Mobile Optimized */}
        {!sessionState.isActive && !showQuizWidget && (
          <div className="border-t p-3 sm:p-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
            {/* Voice Recording Status */}
            {(isRecording || isProcessing) && (
              <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-purple-700 font-medium">Recording...</span>
                    </>
                  )}
                  {isProcessing && (
                    <>
                      <div className="animate-spin w-3 h-3 border border-purple-600 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-purple-700 font-medium">Processing voice...</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending || isRecording || isProcessing}
                className="flex-1 text-sm sm:text-base"
              />
              
              <Button
                onClick={handleVoiceToggle}
                disabled={isSending || isProcessing}
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                className={cn(
                  "transition-all duration-200 flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11",
                  isRecording && "animate-pulse"
                )}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button 
                onClick={handleSendMessage}
                disabled={isSending || !message.trim() || isRecording || isProcessing}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span className="hidden sm:block">💡 Try: "Quiz me on these cards" or "Practice session"</span>
              <span className="sm:hidden">💡 Try: "Quiz me" or "Practice"</span>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  chatMode === 'personal' 
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                )}>
                  {chatMode === 'personal' ? '🔒 My Data' : '🌐 General'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
