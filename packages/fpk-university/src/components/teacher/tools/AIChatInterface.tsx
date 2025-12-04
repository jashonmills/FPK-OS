import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import UniversalVoiceInput from '@/components/chat/UniversalVoiceInput';
import TTSPlayButton from '@/components/chat/TTSPlayButton';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatInterfaceProps {
  toolName: string;
  systemPrompt: string;
  onBack?: () => void;
  icon?: LucideIcon;
  accentColor?: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
  toolName,
  systemPrompt,
  onBack,
  icon: Icon = Bot,
  accentColor = 'from-indigo-500 to-purple-600'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: input.trim(),
          systemPrompt: systemPrompt,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data?.response || data?.message || 'I apologize, but I was unable to generate a response.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r ${accentColor} text-white flex items-center gap-3`}>
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">{toolName}</h3>
          <p className="text-xs opacity-80">AI-powered assistance</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Start a conversation with your AI assistant</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className={`p-2 bg-gradient-to-br ${accentColor} rounded-lg h-fit`}>
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {/* TTS Play Button for AI messages */}
              {message.role === 'assistant' && (
                <div className="mt-2 flex justify-end">
                  <TTSPlayButton content={message.content} size="sm" variant="ghost" />
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="p-2 bg-muted rounded-lg h-fit">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className={`p-2 bg-gradient-to-br ${accentColor} rounded-lg h-fit`}>
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-card border border-border p-3 rounded-xl">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-input rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
            disabled={isLoading}
          />
          <UniversalVoiceInput
            onTranscription={(text) => {
              setInput(text);
              // Auto-submit after brief delay
              setTimeout(() => handleSend(), 100);
            }}
            disabled={isLoading}
            variant="minimal"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`bg-gradient-to-r ${accentColor} hover:opacity-90`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
