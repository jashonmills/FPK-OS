
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, AlertTriangle } from 'lucide-react';
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
      message: "Hi! I'm your AI learning assistant. How can I help you with your studies today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);
    setChatError('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id,
          context: {
            totalSessions: completedSessions.length,
            totalCards: flashcards?.length || 0,
            recentInsights: insights.slice(0, 2)
          }
        }
      });

      if (error) throw error;

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: data.response || "I'm sorry, I'm having trouble responding right now. Please try again."
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatError("I apologize for the inconvenience. I'm experiencing technical difficulties. Please try asking your question again.");
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: "I apologize for the inconvenience. I'm experiencing technical difficulties. Please try asking your question again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Learning Assistant
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
            Here to help with your studies
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
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-3 rounded-lg mr-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {chatError && (
          <div className="px-4 py-2 text-center border-t bg-red-50">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">{chatError}</p>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything about your studies..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !chatMessage.trim()}
              size="icon"
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
