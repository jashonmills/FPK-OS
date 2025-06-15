
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import QuizSessionWidget from './QuizSessionWidget';
import { useQuizSession } from '@/hooks/useQuizSession';
import ChatMessagesPane from '@/components/chat/ChatMessagesPane';

interface ChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatInterface = ({ user, completedSessions, flashcards, insights }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatMode, setChatMode] = useState<'personal' | 'general'>('personal');
  const [voiceActive, setVoiceActive] = useState(false);
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
      const cardCount = await startQuizSession();
      if (cardCount > 0) {
        setMessage(''); // Clear input
        return; // Don't send to AI, start quiz instead
      }
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

      // Call AI function
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message,
          userId: user.id,
          sessionId,
          chatMode,
          voiceActive,
          metadata: {
            completedSessions: completedSessions.length,
            flashcardCount: flashcards?.length || 0
          }
        }
      });

      if (error) throw error;

      // Add AI response to state
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm here to help with your learning journey!",
        timestamp: new Date().toISOString()
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
    endSession();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Quiz session cancelled. I'm here whenever you're ready to practice again! 📚",
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-white to-purple-50/30">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold text-lg">AI Learning Coach</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleChatMode}
              className={cn(
                "text-xs",
                chatMode === 'personal' 
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
              )}
            >
              {chatMode === 'personal' ? '🔒 My Data' : '🌐 General Knowledge'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceMode}
              className={cn(
                "text-xs",
                voiceActive && "bg-green-100 text-green-700 hover:bg-green-200"
              )}
            >
              {voiceActive ? '🔊 Voice On' : '🔇 Voice Off'}
            </Button>
          </div>
        </div>

        {/* Messages Area - Now using ChatMessagesPane */}
        <div className="flex-1 overflow-hidden">
          {/* Quiz Session Widget */}
          {sessionState.isActive && (
            <div className="p-3 sm:p-4">
              <QuizSessionWidget
                onComplete={handleQuizComplete}
                onCancel={handleQuizCancel}
              />
            </div>
          )}

          {/* Chat Messages using ChatMessagesPane */}
          {!sessionState.isActive && (
            <ChatMessagesPane
              messages={messages}
              isLoading={false}
              isSending={isSending}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        {/* Input Area */}
        {!sessionState.isActive && (
          <div className="border-t p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
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
                placeholder="Ask about your study data, learning strategies, or get help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending || isRecording || isProcessing}
                className="flex-1"
              />
              
              <Button
                onClick={handleVoiceToggle}
                disabled={isSending || isProcessing}
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                className={cn(
                  "transition-all duration-200",
                  isRecording && "animate-pulse"
                )}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button 
                onClick={handleSendMessage}
                disabled={isSending || !message.trim() || isRecording || isProcessing}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>💡 Try: "Quiz me on these cards" or "Practice session"</span>
              <span className={cn(
                "px-2 py-0.5 rounded",
                chatMode === 'personal' 
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              )}>
                {chatMode === 'personal' ? '🔒 My Data Mode' : '🌐 General Knowledge Mode'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
