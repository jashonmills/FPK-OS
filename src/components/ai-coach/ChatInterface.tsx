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
import { featureFlagService } from '@/services/FeatureFlagService';
import { useChatMode } from '@/hooks/useChatMode';
import RecentSavesMenu from '@/components/ai-coach/RecentSavesMenu';
import ChatMessagesPane from '@/components/chat/ChatMessagesPane';
import ChatModeToggle from '@/components/ai-coach/ChatModeToggle';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  id?: string;
  chatMode?: 'personal' | 'general';
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
  // Separate chat histories for each mode
  const [personalChatHistory, setPersonalChatHistory] = useState<ChatMessage[]>([]);
  const [generalChatHistory, setGeneralChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'slow' | 'error'>('good');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [lastReadMessageId, setLastReadMessageId] = useState<string>('');
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { isRecording, isProcessing, startRecording, stopRecording, isNativeListening, transcript } = useEnhancedVoiceInput();
  const { speak, stopSpeech, togglePauseSpeech, readAIMessage, isSupported: ttsSupported, isSpeaking, isPaused } = useTextToSpeech();
  const { settings, toggle: toggleVoice, isSupported: voiceSupported } = useVoiceSettings();
  const { chatMode, changeChatMode } = useChatMode();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if dual AI mode is enabled
  const isDualAIModeEnabled = featureFlagService.isEnabled('dualAIMode');

  // Get current chat history based on mode
  const currentChatHistory = chatMode === 'personal' ? personalChatHistory : generalChatHistory;
  const setCurrentChatHistory = chatMode === 'personal' ? setPersonalChatHistory : setGeneralChatHistory;

  // Calculate study metrics
  const overallAccuracy = completedSessions.length > 0 
    ? Math.round((completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0) / 
        completedSessions.reduce((sum, s) => sum + (s.total_cards || 1), 0)) * 100)
    : 0;

  const currentStreak = completedSessions.length > 0 
    ? Math.max(0, completedSessions.filter(s => {
        const sessionDate = new Date(s.created_at);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 1;
      }).length)
    : 0;

  // Handle mode switching with immediate feedback
  const handleModeChange = (newMode: 'personal' | 'general') => {
    console.log('🔄 Chat mode changing from', chatMode, 'to', newMode);
    
    if (settings.enabled && isSpeaking) {
      console.log('🔊 Stopping speech before mode change');
      stopSpeech();
    }

    changeChatMode(newMode);
    
    // Immediate feedback message
    const modeMessage = newMode === 'personal' 
      ? "🔒 Switched to **My Data** mode—I'll answer only from your study data. Ask me about your flashcards, sessions, or XP!"
      : "🌐 Switched to **General Knowledge** mode—I'm ready to research any topic. What would you like to know? 🌟";
    
    const feedbackMessage: ChatMessage = {
      role: 'assistant',
      content: modeMessage,
      timestamp: new Date(),
      id: `mode-switch-${Date.now()}`,
      chatMode: newMode
    };

    // Add feedback to the new mode's history
    if (newMode === 'personal') {
      setPersonalChatHistory(prev => [...prev, feedbackMessage]);
    } else {
      setGeneralChatHistory(prev => [...prev, feedbackMessage]);
    }

    setUserScrolledUp(false);
    
    // Auto-read the mode switch message
    if (settings.enabled && settings.autoRead) {
      setTimeout(() => readAIMessage(modeMessage), 300);
    }

    toast({
      title: `Switched to ${newMode === 'personal' ? 'My Data' : 'General Knowledge'} mode`,
      description: newMode === 'personal' 
        ? "I can now access your study data and performance metrics."
        : "I can now research general topics and provide educational content on any subject.",
    });
  };

  // Improved scroll handling
  const scrollToBottom = () => {
    if (messagesEndRef.current && !userScrolledUp) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      });
    }
  };

  // Monitor user scroll behavior
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setUserScrolledUp(!isAtBottom);
  };

  // Only auto-scroll when appropriate
  useEffect(() => {
    if (currentChatHistory.length > 0 && !userScrolledUp) {
      setTimeout(scrollToBottom, 100);
    }
  }, [currentChatHistory, userScrolledUp]);

  // Create a new chat session when the interface loads
  useEffect(() => {
    if (user && !currentSessionId) {
      createNewSession();
    }
  }, [user]);

  // Auto-read new AI messages with better duplicate prevention
  useEffect(() => {
    if (currentChatHistory.length > 0) {
      const lastMessage = currentChatHistory[currentChatHistory.length - 1];
      if (lastMessage.role === 'assistant' && settings.enabled && settings.autoRead) {
        const messageId = lastMessage.id || `${lastMessage.timestamp?.getTime()}-${lastMessage.content.substring(0, 20)}`;
        
        if (messageId !== lastReadMessageId) {
          console.log('🔊 New AI message detected, preparing to speak:', lastMessage.content.substring(0, 50) + '...');
          setLastReadMessageId(messageId);
          
          if (!settings.hasInteracted) {
            console.log('🔊 Warning: User has not interacted yet, speech may be blocked');
          }
          
          setTimeout(() => {
            readAIMessage(lastMessage.content);
          }, 500);
        }
      }
    }
  }, [currentChatHistory, readAIMessage, settings.enabled, settings.autoRead, settings.hasInteracted, lastReadMessageId]);

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: `AI Coach Session (${chatMode})`,
          context_tag: `AI Coaching - ${chatMode}`
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setSessionStartTime(Date.now());
      
      console.log('📊 AI Coach Session Started:', {
        sessionId: data.id,
        userId: user.id,
        chatMode,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  // Generate personalized greeting based on mode and user data
  useEffect(() => {
    if (user && currentChatHistory.length === 0) {
      const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'there';
      const totalSessions = completedSessions.length;
      const totalCards = flashcards?.length || 0;
      
      let personalizedGreeting = `Hi ${userName}! I'm Claude, your AI Learning Coach. `;
      
      if (chatMode === 'personal') {
        if (totalSessions > 0) {
          personalizedGreeting += `I've been analyzing your ${totalSessions} study sessions and ${totalCards} flashcards. Your overall accuracy is ${overallAccuracy}%! `;
          
          if (overallAccuracy >= 80) {
            personalizedGreeting += "You're doing excellent work! Let's discuss strategies to maintain this momentum.";
          } else if (overallAccuracy >= 60) {
            personalizedGreeting += "You're making solid progress! I have some specific suggestions to help boost your performance.";
          } else {
            personalizedGreeting += "I see opportunities to strengthen your learning approach. Let's work together to identify what methods work best for you.";
          }
        } else {
          personalizedGreeting += "I'm here to help guide your learning journey with personalized insights and strategies. Take a few study sessions and I'll analyze your learning patterns to provide tailored coaching!";
        }
      } else {
        personalizedGreeting = `Hi ${userName}! I'm your AI Research Assistant. I'm here to help you explore any topic with comprehensive research and analysis. What would you like to learn about today? 🌟`;
      }

      const greetingMessage: ChatMessage = {
        role: 'assistant',
        content: personalizedGreeting,
        timestamp: new Date(),
        id: 'initial-greeting',
        chatMode
      };

      setCurrentChatHistory([greetingMessage]);
    }
  }, [user, completedSessions, flashcards, chatMode]);

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

    if (settings.enabled && isSpeaking) {
      console.log('🔊 Stopping speech before sending message');
      stopSpeech();
    }

    const userMessage = chatMessage;
    setChatMessage('');
    const userMessageObj: ChatMessage = { 
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`,
      chatMode
    };
    
    setCurrentChatHistory(prev => [...prev, userMessageObj]);
    setIsLoading(true);
    setIsSending(true);
    setIsAnalyzing(true);
    setConnectionStatus('good');
    setResponseTime(null);
    setUserScrolledUp(false);

    await saveMessageToSession(userMessage, 'user');

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setConnectionStatus('slow');
      }, 8000);

      console.log('🎙️ Sending message with chat mode:', chatMode);

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id,
          sessionId: currentSessionId,
          chatMode: isDualAIModeEnabled ? chatMode : 'personal',
          voiceActive: settings.enabled && settings.autoRead,
          metadata: {
            hasInteracted: settings.hasInteracted,
            timestamp: new Date().toISOString(),
            sessionLength: currentChatHistory.length,
            userAgent: navigator.userAgent,
            voiceEnabled: settings.enabled,
            autoRead: settings.autoRead,
            dualAIMode: isDualAIModeEnabled
          }
        }
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      setResponseTime(responseTimeMs);

      if (error) {
        console.error('Enhanced AI coach error:', error);
        throw error;
      }

      setConnectionStatus('good');
      const aiResponse = data?.response || (chatMode === 'personal' 
        ? "I'm here to guide your personalized learning journey with your own study data! 🌟"
        : "I'm here to help you explore any topic with comprehensive research and analysis! 🌟");
      
      console.log('🎙️ AI response received for voice processing:', {
        hasVoiceActive: data?.voiceEnabled,
        responseLength: aiResponse.length,
        willAutoRead: settings.enabled && settings.autoRead,
        chatMode,
        aiProvider: data?.aiProvider
      });
      
      const aiMessageObj: ChatMessage = { 
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        id: `ai-${Date.now()}`,
        chatMode
      };
      
      setCurrentChatHistory(prev => [...prev, aiMessageObj]);

      await saveMessageToSession(aiResponse, 'assistant');

      console.log('📊 Enhanced AI Coach Interaction:', {
        sessionId: currentSessionId,
        userMessage: userMessage,
        responseTime: responseTimeMs,
        voiceEnabled: settings.enabled,
        hasPersonalData: data?.hasPersonalData,
        toolsUsed: data?.toolsUsed,
        chatMode,
        aiProvider: data?.aiProvider,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Enhanced AI coach error:', error);
      setConnectionStatus('error');
      
      const personalizedFallbacks = chatMode === 'personal' ? [
        "I'm getting ready to analyze your personal study data! 🎯 While I connect, try asking about study strategies or specific topics you're working on.",
        "Your personalized learning coach is warming up! 📚 I'll soon have access to your flashcards and performance data for tailored guidance.",
      ] : [
        "I'm here to help with general knowledge questions! 🌐 While I connect to external sources, feel free to ask about any topic you'd like to explore.",
        "Your research assistant is getting ready! ✨ I can help with explanations, facts, and educational content on any subject.",
      ];
      
      const randomFallback = personalizedFallbacks[Math.floor(Math.random() * personalizedFallbacks.length)];
      
      const fallbackMessageObj: ChatMessage = { 
        role: 'assistant',
        content: randomFallback,
        timestamp: new Date(),
        id: `fallback-${Date.now()}`,
        chatMode
      };
      
      setCurrentChatHistory(prev => [...prev, fallbackMessageObj]);
      await saveMessageToSession(randomFallback, 'assistant');
    } finally {
      setIsLoading(false);
      setIsSending(false);
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
        messageCount: currentChatHistory.length,
        chatMode,
        timestamp: new Date().toISOString()
      });
    }

    setCurrentChatHistory([]);
    setResponseTime(null);
    setCurrentSessionId(null);
    setSessionStartTime(null);
    setUserScrolledUp(false);
    
    // Create a new session for the next conversation
    createNewSession();
    
    toast({
      title: "Chat reset",
      description: `Your ${chatMode} conversation has been cleared.`,
    });
  };

  const handleSaveChat = () => {
    const chatData = {
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      messages: currentChatHistory,
      chatMode,
      user: user?.email || 'unknown'
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-coach-${chatMode}-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat saved",
      description: `Your ${chatMode} conversation has been downloaded.`,
    });
  };

  const handleArchiveChat = () => {
    const archiveKey = `ai-coach-archive-${chatMode}-${Date.now()}`;
    const chatData = {
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      messages: currentChatHistory,
      chatMode,
      user: user?.email || 'unknown'
    };
    
    localStorage.setItem(archiveKey, JSON.stringify(chatData));
    
    toast({
      title: "Chat archived",
      description: `Your ${chatMode} conversation has been saved to local archive.`,
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
    const aiProvider = chatMode === 'personal' ? 'Claude' : 'GPT-4';
    switch (connectionStatus) {
      case 'good': return responseTime ? `${aiProvider} Connected (${responseTime}ms)` : `${aiProvider} Connected`;
      case 'slow': return 'Analyzing your data...';
      case 'error': return 'Coaching mode';
    }
  };

  // Get current mode badge info
  const getCurrentModeBadge = () => {
    if (!isDualAIModeEnabled) return null;
    
    if (chatMode === 'personal') {
      return {
        text: 'My Data Active',
        className: 'bg-green-500/90 text-white'
      };
    } else {
      return {
        text: 'General Knowledge Active',
        className: 'bg-blue-500/90 text-white'
      };
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

  const handleOpenNote = (noteId: string) => {
    // Navigate to notes page with the specific note
    // This would typically use React Router to navigate
    console.log('Opening note:', noteId);
    toast({
      title: "Note opened",
      description: "Navigating to your saved note...",
    });
  };

  // Convert currentChatHistory to the format expected by ChatMessagesPane
  const formattedMessages = currentChatHistory.map(msg => ({
    id: msg.id || `${msg.timestamp?.getTime()}-${msg.role}`,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp?.toISOString() || new Date().toISOString()
  }));

  const currentModeBadge = getCurrentModeBadge();

  return (
    <Card className="h-[400px] sm:h-[500px] md:h-[600px] flex flex-col w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-3 sm:p-4 lg:p-6 flex-shrink-0">
        <CardTitle className="flex flex-col space-y-3">
          {/* Top row - Title, Chat Mode Toggle, and Controls */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-semibold truncate">AI Learning Coach</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium border border-white/30 flex-shrink-0 shadow-sm">
                Enhanced
              </Badge>
            </div>
            
            {/* Chat Mode Toggle - Prominent placement */}
            {isDualAIModeEnabled && (
              <div className="flex-shrink-0 order-first sm:order-none w-full sm:w-auto mb-2 sm:mb-0">
                <ChatModeToggle
                  mode={chatMode}
                  onModeChange={handleModeChange}
                  className="w-full sm:w-auto"
                />
              </div>
            )}
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Status indicator */}
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                <span className="text-xs hidden lg:inline">Connected</span>
              </div>
              
              {/* Recent Saves Menu */}
              <RecentSavesMenu onOpenNote={handleOpenNote} />
              
              {/* Smart Pause/Resume/Stop Speech Controls */}
              {isSpeaking && (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handlePauseResumeSpeech}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                    title={isPaused ? "Resume speaking (Ctrl+Space)" : "Pause speaking (Ctrl+Space)"}
                  >
                    {isPaused ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      <Pause className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    onClick={handleStopSpeech}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                    title="Stop speaking (ESC)"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </Button>
                </div>
              )}
              
              {/* Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleResetChat}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSaveChat}>
                    <Download className="h-4 w-4 mr-2" />
                    Save Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchiveChat}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleVoice}>
                    {settings.enabled ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                    {settings.enabled ? 'Disable Voice' : 'Enable Voice'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Second row - Status badges and mode indicator */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {/* Mode badge - more prominent */}
              {currentModeBadge && (
                <Badge variant="secondary" className={`${currentModeBadge.className} text-xs px-2 py-1 rounded-full font-medium border border-white/30 flex-shrink-0 shadow-sm`}>
                  {currentModeBadge.text}
                </Badge>
              )}
              
              {chatMode === 'personal' && completedSessions.length > 0 && (
                <Badge variant="secondary" className="bg-green-500/90 text-white flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border border-green-400/50 shadow-sm flex-shrink-0">
                  <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">Personal Data</span>
                  <span className="sm:hidden">Data ✓</span>
                </Badge>
              )}
              
              {chatMode === 'general' && (
                <Badge variant="secondary" className="bg-blue-500/90 text-white flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border border-blue-400/50 shadow-sm flex-shrink-0">
                  <Brain className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">Web Research</span>
                  <span className="sm:hidden">Web ✓</span>
                </Badge>
              )}
              
              {settings.enabled && (
                <Badge variant="secondary" className="bg-purple-500/90 text-white flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border border-purple-400/50 shadow-sm flex-shrink-0">
                  <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden lg:inline">Voice Active</span>
                  <span className="lg:hidden">Voice</span>
                </Badge>
              )}
              
              {isSpeaking && !isPaused && (
                <Badge variant="secondary" className="bg-green-500/90 text-white flex items-center gap-1 text-xs animate-pulse px-2 py-1 rounded-full font-medium border border-green-400/50 shadow-sm flex-shrink-0">
                  <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">Speaking</span>
                  <span className="sm:hidden">🔊</span>
                </Badge>
              )}
              
              {isPaused && (
                <Badge variant="secondary" className="bg-yellow-500/90 text-white flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border border-yellow-400/50 shadow-sm flex-shrink-0">
                  <Pause className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">Paused</span>
                  <span className="sm:hidden">⏸</span>
                </Badge>
              )}
            </div>
            
            {/* Accuracy stats - only for personal mode */}
            {chatMode === 'personal' && completedSessions.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold flex-shrink-0">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{overallAccuracy}% Accuracy</span>
                <div className="hidden sm:block w-px h-4 bg-white/30 mx-1"></div>
                <span className="text-purple-200 text-xs sm:text-sm">
                  {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak'}
                </span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        <ChatMessagesPane
          messages={formattedMessages}
          isLoading={isLoading}
          isSending={isSending}
          messagesEndRef={messagesEndRef}
        />

        {/* Scroll to Bottom Button */}
        {userScrolledUp && (
          <Button
            onClick={() => {
              setUserScrolledUp(false);
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-14 sm:bottom-16 md:bottom-20 right-2 sm:right-4 rounded-full shadow-lg z-10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* Chat Input */}
        <div className="border-t p-2 sm:p-3 md:p-4 flex-shrink-0 bg-background">
          <div className="flex gap-1 sm:gap-2">
            <Input
              placeholder={chatMode === 'personal' 
                ? "Ask about your flashcards, study progress, or get personalized guidance..."
                : "Ask any question - I can research topics and provide comprehensive answers..."
              }
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isRecording}
              className="flex-1 min-w-0 text-sm rounded-lg border-2 border-gray-200 focus:border-purple-500 transition-colors"
            />
            <Button 
              onClick={handleVoiceRecording}
              disabled={isLoading || isProcessing}
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${isRecording ? "animate-pulse border-red-400" : "border-gray-200 hover:border-purple-400"}`}
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Status messages with responsive text */}
          {isNativeListening && (
            <p className="text-xs text-muted-foreground mt-2 text-center break-words">
              🎤 Listening... Speak clearly {transcript && `(${transcript})`}
            </p>
          )}
          {isRecording && !isNativeListening && (
            <p className="text-xs text-muted-foreground mt-2 text-center break-words">
              Recording audio... Click the microphone again to stop
            </p>
          )}
          {isProcessing && (
            <p className="text-xs text-muted-foreground mt-2 text-center break-words">
              Processing your voice...
            </p>
          )}
          {isSpeaking && !isPaused && (
            <p className="text-xs text-green-600 mt-2 text-center animate-pulse break-words">
              🔊 AI is speaking... Press Ctrl+Space to pause, ESC to stop
            </p>
          )}
          {isPaused && (
            <p className="text-xs text-yellow-600 mt-2 text-center break-words">
              ⏸ Speech paused... Press Ctrl+Space to resume, ESC to stop
            </p>
          )}
          {chatMode === 'personal' && completedSessions.length > 0 && (
            <p className="text-xs text-purple-600 mt-2 text-center break-words px-1">
              🎯 I have access to your {completedSessions.length} study sessions and {flashcards?.length || 0} flashcards for personalized guidance
              {settings.enabled && " • 🔊 Voice responses enabled"}
              • Ask about your recent cards, study stats, or specific topics!
            </p>
          )}
          {chatMode === 'general' && (
            <p className="text-xs text-blue-600 mt-2 text-center break-words px-1">
              🌐 General knowledge mode active - I can research any topic and provide comprehensive answers
              {settings.enabled && " • 🔊 Voice responses enabled"}
              • Ask me anything!
            </p>
          )}
          {responseTime && (
            <p className="text-xs text-muted-foreground mt-1 text-center break-words">
              Response time: {responseTime}ms
              {chatMode === 'personal' && completedSessions.length > 0 && " • Enhanced with personal data"}
              {chatMode === 'general' && " • Enhanced with external knowledge"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
