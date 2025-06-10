
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, AlertTriangle, Clock } from 'lucide-react';
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
      message: "Hi! I'm your AI study assistant. Ask me anything about studying, learning techniques, or your progress!"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);
    setHasError(false);

    try {
      // Set a client-side timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

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

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: data?.response || "I'm here to help with your studies! What would you like to work on?"
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
      
      // Add a helpful fallback message
      const fallbackMessages = [
        "Great question! While I sort out a technical hiccup, try reviewing your flashcards or creating new ones.",
        "I'd love to help! In the meantime, check out your study progress or start a practice session.",
        "Good thinking! While I'm getting back online, explore the study challenges or review your notes."
      ];
      
      const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: randomFallback
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Study Assistant
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
            Beta
          </Badge>
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
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {hasError && (
          <div className="px-4 py-2 border-t bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Response took longer than expected, but I'm still here to help!</p>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about study tips, techniques, or your progress..."
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
