import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain, User, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SimpleChatInterfaceProps {
  user: any;
  fixedHeight?: boolean;
}

const SimpleChatInterface: React.FC<SimpleChatInterfaceProps> = ({ user, fixedHeight = false }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (user?.id) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI Learning Coach. I'm here to help with your studies, answer questions, and provide guidance. How can I assist you today?`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [user?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !user?.id) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Use the new simple AI chat function
      const { data, error } = await supabase.functions.invoke('simple-ai-chat', {
        body: {
          message: userMessage.content,
          userId: user.id
        }
      });

      let aiResponse: ChatMessage;

      if (error || !data?.response) {
        // Fallback response when AI service is unavailable
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you're asking about "${userMessage.content}". While I'm temporarily unable to access my full AI capabilities, I can still help you with:

📚 **Study Tips**: Try active recall, spaced repetition, and the Pomodoro technique
🎯 **Learning Strategies**: Break complex topics into smaller chunks
📝 **Note-taking**: Use the Cornell method or mind mapping
🧠 **Memory**: Create mnemonic devices and visual associations

What specific area would you like guidance on?`,
          timestamp: new Date().toISOString()
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString()
        };
      }

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response for any error
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm experiencing a temporary connection issue, but I'm still here to help! Here are some immediate study tips:

🔬 **Active Learning**: Explain concepts out loud or teach them to someone else
⏰ **Time Management**: Use the 25-minute focused study sessions with 5-minute breaks
📖 **Reading Strategy**: Preview, question, read, reflect, and review
🎨 **Visual Learning**: Create diagrams, charts, or mind maps

What would you like to explore further?`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline coaching mode. Try again later for full AI features.",
        variant: "default"
      });
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
    <Card className={cn("w-full", fixedHeight ? "h-full flex flex-col" : "min-h-[600px]")}>
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="font-semibold text-lg">AI Learning Coach</h2>
        </div>
      </CardHeader>
      
      <CardContent className={cn("flex flex-col", fixedHeight ? "flex-1 min-h-0" : "")}>
        {/* Messages Area */}
        <div className={cn(
          "flex-1 overflow-y-auto mb-4 space-y-4",
          fixedHeight ? "min-h-0" : "min-h-[400px] max-h-[400px]"
        )}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 p-3 rounded-lg",
                msg.role === 'user'
                  ? "bg-purple-50 ml-8"
                  : "bg-gray-50 mr-8"
              )}
            >
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <User className="h-5 w-5 text-purple-600" />
                ) : (
                  <Bot className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
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
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">AI Coach is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 space-y-2">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={user?.id ? "Ask me anything about studying..." : "Please log in to chat"}
              disabled={isLoading || !user?.id}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim() || !user?.id}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>💡 Try: "Help me study better" or "Explain active recall"</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              🔒 My Data Mode
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleChatInterface;