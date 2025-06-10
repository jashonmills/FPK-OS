
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Hi! I'm your AI study assistant powered by Claude. Ask me anything about studying, learning techniques, or your progress!"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'slow' | 'error'>('good');

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);
    setConnectionStatus('good');

    try {
      // Start with a 5-second timeout for Claude
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setConnectionStatus('slow');
      }, 5000);

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id,
          context: {
            totalSessions: completedSessions.length,
            totalCards: flashcards?.length || 0
          }
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
        message: data?.response || "I'm here to help with your studies!"
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      // Immediate helpful fallback
      const quickTips = [
        "Try the Pomodoro Technique: 25 minutes focused study, 5 minute break!",
        "Active recall beats passive reading. Quiz yourself!",
        "Space out your reviews for better long-term retention.",
        "Teach someone else - it's a great way to test understanding!",
        "Mix up your study topics to improve retention."
      ];
      
      const randomTip = quickTips[Math.floor(Math.random() * quickTips.length)];
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: randomTip
      }]);
    } finally {
      setIsLoading(false);
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
      case 'good': return 'Claude AI Connected';
      case 'slow': return 'Slow connection';
      case 'error': return 'Offline mode';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Study Assistant
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
            Claude
          </Badge>
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
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
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
                  <span className="text-sm text-muted-foreground">Claude is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Claude about study tips, techniques, or your progress..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !chatMessage.trim()}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
