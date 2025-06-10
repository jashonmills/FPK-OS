
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Wifi, WifiOff, Mic, MicOff, Brain, TrendingUp } from 'lucide-react';
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
  
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { toast } = useToast();

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

    try {
      // Start with a 5-second timeout for Claude
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setConnectionStatus('slow');
      }, 8000);

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id
        }
      });

      clearTimeout(timeoutId);

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

    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      // Educational coaching fallback
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
      case 'good': return 'AI Coach Connected';
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    {isAnalyzing ? 'Analyzing your learning data...' : 'Claude is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

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
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
