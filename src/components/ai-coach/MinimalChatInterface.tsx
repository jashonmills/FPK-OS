import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain, User, Bot } from 'lucide-react';

interface MinimalChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any;
  fixedHeight?: boolean;
}

const MinimalChatInterface: React.FC<MinimalChatInterfaceProps> = ({ 
  user, 
  completedSessions, 
  flashcards, 
  insights, 
  fixedHeight = false 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Learning Coach. I can help you with your ${completedSessions.length} study sessions and ${flashcards.length} flashcards.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !user?.id) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simple fallback response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I received your message: "${userMessage.content}". I'm here to help with your learning journey!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <Card className="w-full min-h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Please log in to use the AI Coach</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="font-semibold text-lg">AI Learning Coach (Minimal)</h2>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[300px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 p-3 rounded-lg ${
                msg.role === 'user'
                  ? "bg-purple-50 ml-8"
                  : "bg-gray-50 mr-8"
              }`}
            >
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <User className="h-5 w-5 text-purple-600" />
                ) : (
                  <Bot className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
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
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
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

export default MinimalChatInterface;