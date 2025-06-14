import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Bot, Send, Wifi, WifiOff, Mic, MicOff, Brain, TrendingUp, MoreVertical, RotateCcw, Download, Archive, ChevronDown, Volume2, VolumeX, Square, Pause, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp?: Date;
  id?: string; // Add unique ID to prevent duplicate speaking
}

interface ChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  completedSessions,
  flashcards,
  insights
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'slow' | 'error'>('good');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [lastReadMessageId, setLastReadMessageId] = useState<string>('');
  
  const { isRecording, isProcessing, startRecording, stopRecording, isNativeListening, transcript } = useEnhancedVoiceInput();
  const { speak, stopSpeech, togglePauseSpeech, readAIMessage, isSupported: ttsSupported, isSpeaking, isPaused } = useTextToSpeech();
  const { settings, toggle: toggleVoice, isSupported: voiceSupported } = useVoiceSettings();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [chatHistory, isAtBottom]);

  // Handle scroll to detect if user is at bottom
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isBottom = scrollHeight - scrollTop === clientHeight;
    setIsAtBottom(isBottom);
  };

  // Create a new chat session when the interface loads
  useEffect(() => {
    if (user && !currentSessionId) {
      createNewSession();
    }
  }, [user]);

  // Auto-read new AI messages with better duplicate prevention
  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.role === 'assistant' && settings.enabled && settings.autoRead) {
        const messageId = lastMessage.id || `${lastMessage.timestamp?.getTime()}-${lastMessage.message.substring(0, 20)}`;
        
        // Only read if this is a new message we haven't read before
        if (messageId !== lastReadMessageId) {
          console.log('🔊 New AI message detected, preparing to speak:', lastMessage.message.substring(0, 50) + '...');
          setLastReadMessageId(messageId);
          
          if (!settings.hasInteracted) {
            console.log('🔊 Warning: User has not interacted yet, speech may be blocked');
          }
          
          // Add a small delay to ensure the UI has updated
          setTimeout(() => {
            readAIMessage(lastMessage.message);
          }, 500);
        }
      } else {
        if (lastMessage.role === 'assistant') {
          console.log('🔊 AI message detected but speech skipped - enabled:', settings.enabled, 'autoRead:', settings.autoRead);
        }
      }
    }
  }, [chatHistory, readAIMessage, settings.enabled, settings.autoRead, settings.hasInteracted, lastReadMessageId]);

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'AI Coach Session',
          context_tag: 'AI Coaching'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setSessionStartTime(Date.now());
      
      // Track session start analytics event
      console.log('📊 AI Coach Session Started:', {
        sessionId: data.id,
        userId: user.id,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  // Generate personalized greeting based on user data
  useEffect(() => {
    if (user && chatHistory.length === 0) {
      const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'there';
      const totalSessions = completedSessions.length;
      const totalCards = flashcards?.length || 0;
      
      let personalizedGreeting = `Hi ${userName}! I'm Claude, your AI Learning Coach. `;
      
      if (totalSessions > 0) {
        const accuracy = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0) / 
                        completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 1) * 100;
        
        personalizedGreeting += `I've been analyzing your ${totalSessions} study sessions and ${totalCards} flashcards. Your overall accuracy is ${Math.round(accuracy)}%! `;
        
        if (accuracy >= 80) {
          personalizedGreeting += "You're doing excellent work! Let's discuss strategies to maintain this momentum.";
        } else if (accuracy >= 60) {
          personalizedGreeting += "You're making solid progress! I have some specific suggestions to help boost your performance.";
        } else {
          personalizedGreeting += "I see opportunities to strengthen your learning approach. Let's work together to identify what methods work best for you.";
        }
      } else {
        personalizedGreeting += "I'm here to help guide your learning journey with personalized insights and strategies. Take a few study sessions and I'll analyze your learning patterns to provide tailored coaching!";
      }

      const greetingMessage = {
        role: 'assistant' as const,
        message: personalizedGreeting,
        timestamp: new Date(),
        id: 'initial-greeting'
      };

      setChatHistory([greetingMessage]);
    }
  }, [user, completedSessions, flashcards]);

  const saveMessageToSession = async (content: string, role: 'user' | 'assistant') => {
    if (!currentSessionId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          role,
          content,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving message to session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    // Stop any current speech when user sends a message
    if (settings.enabled && isSpeaking) {
      console.log('🔊 Stopping speech before sending message');
      stopSpeech();
    }

    const userMessage = chatMessage;
    setChatMessage('');
    const userMessageObj = { 
      role: 'user' as const, 
      message: userMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    setChatHistory(prev => [...prev, userMessageObj]);
    setIsLoading(true);
    setIsAnalyzing(true);
    setConnectionStatus('good');
    setResponseTime(null);

    // Save user message to session
    await saveMessageToSession(userMessage, 'user');

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setConnectionStatus('slow');
      }, 5000);

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id,
          sessionId: currentSessionId
        }
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      setResponseTime(responseTimeMs);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      setConnectionStatus('good');
      const aiResponse = data?.response || "I'm here to guide your learning journey!";
      
      const aiMessageObj = { 
        role: 'assistant' as const, 
        message: aiResponse,
        timestamp: new Date(),
        id: `ai-${Date.now()}`
      };
      
      setChatHistory(prev => [...prev, aiMessageObj]);

      // Save assistant message to session
      await saveMessageToSession(aiResponse, 'assistant');

      // Track message exchange analytics event
      console.log('📊 AI Coach Message Exchange:', {
        sessionId: currentSessionId,
        userMessage: userMessage,
        responseTime: responseTimeMs,
        timestamp: new Date().toISOString()
      });

      console.log(`AI response time: ${responseTimeMs}ms`);

    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      const coachingTips = [
        "Remember: consistency beats intensity! Even 15 minutes of focused study daily builds stronger neural pathways than cramming.",
        "I notice you're engaging with your studies! Try the Pomodoro Technique: 25 minutes focused work, 5 minute break to optimize retention.",
        "Active recall is your superpower! Instead of re-reading, quiz yourself on what you've learned to strengthen memory pathways.",
        "Growth mindset moment: Every mistake is data for improvement. Review what you got wrong to turn weaknesses into strengths!",
        "Spaced repetition works wonders! Review material at increasing intervals to move knowledge from short-term to long-term memory."
      ];
      
      const randomTip = coachingTips[Math.floor(Math.random() * coachingTips.length)];
      
      const fallbackMessageObj = { 
        role: 'assistant' as const, 
        message: randomTip,
        timestamp: new Date(),
        id: `fallback-${Date.now()}`
      };
      
      setChatHistory(prev => [...prev, fallbackMessageObj]);

      // Save fallback message to session
      await saveMessageToSession(randomTip, 'assistant');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        setChatMessage(transcribedText);
        toast({
          title: "Voice recorded",
          description: "Your message has been transcribed successfully.",
        });
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast({
          title: "Recording error",
          description: "Failed to process your voice recording. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await startRecording((text) => {
          setChatMessage(text);
        });
        toast({
          title: "Recording started",
          description: isNativeListening ? "Speak your message now..." : "Recording audio...",
        });
      } catch (error) {
        console.error('Error starting recording:', error);
        toast({
          title: "Microphone error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSpeakMessage = (message: string) => {
    if (ttsSupported && settings.enabled) {
      speak(message, { interrupt: true });
    }
  };

  const handleResetChat = () => {
    // Track session end analytics event before resetting
    if (currentSessionId && sessionStartTime) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      console.log('📊 AI Coach Session Ended:', {
        sessionId: currentSessionId,
        duration: sessionDuration,
        messageCount: chatHistory.length,
        timestamp: new Date().toISOString()
      });
    }

    setChatHistory([]);
    setResponseTime(null);
    setCurrentSessionId(null);
    setSessionStartTime(null);
    
    // Create a new session for the next conversation
    createNewSession();
    
    toast({
      title: "Chat reset",
      description: "Your conversation has been cleared.",
    });
  };

  const handleSaveChat = () => {
    const chatData = {
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      messages: chatHistory,
      user: user?.email || 'unknown'
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-coach-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat saved",
      description: "Your conversation has been downloaded.",
    });
  };

  const handleArchiveChat = () => {
    const archiveKey = `ai-coach-archive-${Date.now()}`;
    const chatData = {
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      messages: chatHistory,
      user: user?.email || 'unknown'
    };
    
    localStorage.setItem(archiveKey, JSON.stringify(chatData));
    
    toast({
      title: "Chat archived",
      description: "Your conversation has been saved to local archive.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      toast({
        title: "Speech stopped",
        description: "Voice output has been interrupted.",
      });
    }
  };

  const handlePauseResumeSpeech = () => {
    if (isSpeaking) {
      togglePauseSpeech();
      toast({
        title: isPaused ? "Speech resumed" : "Speech paused",
        description: isPaused ? "Voice output has been resumed." : "Voice output has been paused.",
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'good': return <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case 'slow': return <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      case 'error': return <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'good': return responseTime ? `AI Coach Connected (${responseTime}ms)` : 'AI Coach Connected';
      case 'slow': return 'Analyzing your data...';
      case 'error': return 'Coaching mode';
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to stop speech completely
      if (event.key === 'Escape') {
        if (isSpeaking) {
          event.preventDefault();
          stopSpeech();
          toast({
            title: "Speech stopped",
            description: "Voice output has been interrupted.",
          });
        }
      }
      // Space bar to pause/resume speech (when not typing)
      else if (event.key === ' ' && (event.ctrlKey || event.metaKey)) {
        if (isSpeaking) {
          event.preventDefault();
          handlePauseResumeSpeech();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSpeaking, isPaused, stopSpeech, togglePauseSpeech, toast]);

  return (
    <Card className="h-[500px] sm:h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-3 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 w-full">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">AI Learning Coach</span>
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white text-xs">
              Claude
            </Badge>
            {completedSessions.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white flex items-center gap-1 text-xs">
                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Analyzing your data</span>
                <span className="sm:hidden">Analyzing</span>
              </Badge>
            )}
            {settings.enabled && (
              <Badge variant="secondary" className="bg-white/20 text-white flex items-center gap-1 text-xs">
                <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Voice Active</span>
                <span className="sm:hidden">Voice</span>
              </Badge>
            )}
            {isSpeaking && !isPaused && (
              <Badge variant="secondary" className="bg-green-500/80 text-white flex items-center gap-1 text-xs animate-pulse">
                <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Speaking</span>
                <span className="sm:hidden">🔊</span>
              </Badge>
            )}
            {isPaused && (
              <Badge variant="secondary" className="bg-yellow-500/80 text-white flex items-center gap-1 text-xs">
                <Pause className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Paused</span>
                <span className="sm:hidden">⏸</span>
              </Badge>
            )}
            {!settings.hasInteracted && settings.enabled && (
              <Badge variant="secondary" className="bg-orange-500/80 text-white flex items-center gap-1 text-xs">
                <span className="hidden sm:inline">Click to enable voice</span>
                <span className="sm:hidden">Click for voice</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* ... keep existing status display code */}
              <span className="text-xs hidden sm:inline">{/* status text */}</span>
            </div>
            {/* Smart Pause/Resume/Stop Speech Controls */}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Button
                  onClick={togglePauseSpeech}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20"
                  title={isPaused ? "Resume speaking (Ctrl+Space)" : "Pause speaking (Ctrl+Space)"}
                >
                  {isPaused ? (
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
                <Button
                  onClick={stopSpeech}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20"
                  title="Stop speaking (ESC)"
                >
                  <Square className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                </Button>
              </div>
            )}
            {/* ... keep existing dropdown menu code */}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 relative overflow-hidden">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef} onScrollCapture={handleScroll}>
          <div className="space-y-3 sm:space-y-4 min-w-0">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex min-w-0 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] min-w-0 p-2 sm:p-3 rounded-lg relative group ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white ml-2 sm:ml-4' 
                    : 'bg-muted text-foreground mr-2 sm:mr-4'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-purple-600">AI Learning Coach</span>
                      {ttsSupported && settings.enabled && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleSpeakMessage(msg.message)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <p className="text-xs sm:text-sm break-words overflow-wrap-anywhere min-w-0">{msg.message}</p>
                  {msg.timestamp && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {/* Only show thinking indicator when actually loading */}
            {isLoading && (
              <div className="flex justify-start min-w-0">
                <div className="bg-muted text-foreground p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex space-x-1 flex-shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground min-w-0">
                      {isAnalyzing ? 'Claude is analyzing...' : 'Claude is thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Scroll to Bottom Button */}
        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="absolute bottom-16 sm:bottom-20 right-2 sm:right-4 rounded-full shadow-lg z-10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* Chat Input */}
        <div className="border-t p-2 sm:p-4 flex-shrink-0">
          <div className="flex gap-1 sm:gap-2">
            <Input
              placeholder="Ask about your progress, study strategies, or get personalized guidance..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isRecording}
              className="flex-1 min-w-0 text-sm"
            />
            <Button 
              onClick={handleVoiceRecording}
              disabled={isLoading || isProcessing}
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 ${isRecording ? "animate-pulse" : ""}`}
            >
              {isProcessing ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !chatMessage.trim() || isRecording}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          {/* Enhanced status messages */}
          {isNativeListening && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              🎤 Listening... Speak clearly {transcript && `(${transcript})`}
            </p>
          )}
          {isRecording && !isNativeListening && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Recording audio... Click the microphone again to stop
            </p>
          )}
          {isProcessing && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Processing your voice...
            </p>
          )}
          {isSpeaking && !isPaused && (
            <p className="text-xs text-green-600 mt-2 text-center animate-pulse">
              🔊 AI is speaking... Press Ctrl+Space to pause, ESC to stop
            </p>
          )}
          {isPaused && (
            <p className="text-xs text-yellow-600 mt-2 text-center">
              ⏸ Speech paused... Press Ctrl+Space to resume, ESC to stop
            </p>
          )}
          {completedSessions.length > 0 && (
            <p className="text-xs text-purple-600 mt-2 text-center px-2">
              💡 I have access to your {completedSessions.length} study sessions and {flashcards?.length || 0} flashcards for personalized guidance
              {settings.enabled && " • 🔊 Voice responses enabled"}
            </p>
          )}
          {responseTime && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Response time: {responseTime}ms
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
