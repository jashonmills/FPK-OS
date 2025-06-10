import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, Send, Wifi, WifiOff, Mic, MicOff, Brain, TrendingUp, MoreVertical, RotateCcw, Download, Archive, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp?: Date;
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
  
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
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

      setChatHistory([{
        role: 'assistant',
        message: personalizedGreeting,
        timestamp: new Date()
      }]);
    }
  }, [user, completedSessions, flashcards]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { 
      role: 'user', 
      message: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setIsAnalyzing(true);
    setConnectionStatus('good');
    setResponseTime(null);

    const startTime = Date.now();

    try {
      // Reduced timeout for faster user feedback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setConnectionStatus('slow');
      }, 5000); // Reduced from 8s to 5s

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id
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
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: data?.response || "I'm here to guide your learning journey!",
        timestamp: new Date()
      }]);

      // Log performance for monitoring
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
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: randomTip,
        timestamp: new Date()
      }]);
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
        await startRecording();
        toast({
          title: "Recording started",
          description: "Speak your message now...",
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

  const handleResetChat = () => {
    setChatHistory([]);
    setResponseTime(null);
    toast({
      title: "Chat reset",
      description: "Your conversation has been cleared.",
    });
  };

  const handleSaveChat = () => {
    const chatData = {
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

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'good': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'slow': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'error': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'good': return responseTime ? `AI Coach Connected (${responseTime}ms)` : 'AI Coach Connected';
      case 'slow': return 'Analyzing your data...';
      case 'error': return 'Coaching mode';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Learning Coach
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
            Claude
          </Badge>
          {completedSessions.length > 0 && (
            <Badge variant="secondary" className="bg-white/20 text-white flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Analyzing your data
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-xs">{getStatusText()}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleResetChat} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveChat} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Save Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchiveChat} className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Archive Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 relative">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onScrollCapture={handleScroll}>
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white ml-4' 
                    : 'bg-muted text-foreground mr-4'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AI Learning Coach</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.timestamp && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-lg mr-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
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
            className="absolute bottom-20 right-4 rounded-full shadow-lg z-10"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your progress, study strategies, or get personalized guidance..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isRecording}
              className="flex-1"
            />
            <Button 
              onClick={handleVoiceRecording}
              disabled={isLoading || isProcessing}
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              className={isRecording ? "animate-pulse" : ""}
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !chatMessage.trim() || isRecording}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {isRecording && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Recording... Click the microphone again to stop
            </p>
          )}
          {isProcessing && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Processing your voice...
            </p>
          )}
          {completedSessions.length > 0 && (
            <p className="text-xs text-purple-600 mt-2 text-center">
              💡 I have access to your {completedSessions.length} study sessions and {flashcards?.length || 0} flashcards for personalized guidance
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
