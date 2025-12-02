import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Trash2, Bot, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';

interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatInterfaceProps {
  toolId: string;
  toolName: string;
  welcomeMessage?: string;
  onBack: () => void;
  icon?: LucideIcon;
  accentColor?: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  toolId,
  toolName, 
  welcomeMessage,
  onBack, 
  icon: Icon, 
  accentColor = 'from-indigo-500 to-purple-600' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Default welcome messages for each tool
  const getWelcomeMessage = () => {
    if (welcomeMessage) return welcomeMessage;
    
    const welcomeMessages: Record<string, string> = {
      'ai-personal-tutor': "Hello! I'm Betty, your personal AI tutor. I use the Socratic method to help you discover answers and develop deep understanding. What would you like to explore today?",
      'math-solver': "Hi there! I'm Al, your math problem solver. Share any math problem with me, and I'll guide you through it step-by-step. What would you like to work on?",
      'essay-coach': "Welcome! I'm your essay writing coach. I'll help you develop your writing skills through constructive feedback. Share your writing or tell me what you're working on!",
      'code-companion': "Hey! 👋 I see you have a factorial function loaded - I just ran it and got 120 (that's 5!). Try changing the number and running it again! Ask me anything about recursion, debugging, or any coding concept you want to explore.",
      'language-practice': "¡Hola! Bonjour! I'm your language practice partner. Let's have a conversation! Which language would you like to practice today?",
      'research-assistant': "Hello! I'm your research assistant. I'll help you develop strong research and critical thinking skills. What topic are you exploring?"
    };
    
    return welcomeMessages[toolId] || `Hello! I'm your ${toolName}. How can I help you today?`;
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem(`chat_history_${toolId}`);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setMessages(parsed.messages || []);
      setSessionId(parsed.sessionId || null);
    } else {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString()
      }]);
    }
  }, [toolId]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${toolId}`, JSON.stringify({
        messages,
        sessionId
      }));
    }
    scrollToBottom();
  }, [messages, toolId, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (!user) {
      throw new Error('Please sign in to use the AI tools');
    }

    // Prepare message history (exclude welcome message, last 10 messages)
    const messageHistory = messages
      .filter(m => m.id !== 'init')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    const { data, error } = await supabase.functions.invoke('ai-learning-hub-chat', {
      body: {
        toolId,
        message: userMessage,
        sessionId,
        messageHistory
      }
    });

    if (error) {
      console.error('AI API error:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }

    // Update session ID if returned
    if (data.sessionId && !sessionId) {
      setSessionId(data.sessionId);
    }

    return data.response;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponseContent = await getAIResponse(input);
      
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Error getting AI response:', err);
      setError(err.message || 'Failed to get response');
      toast({
        title: 'Error',
        description: err.message || 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear this chat history?")) {
      const initialMsg: Message = {
        id: Date.now(),
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString()
      };
      setMessages([initialMsg]);
      setSessionId(null);
      setError(null);
      localStorage.removeItem(`chat_history_${toolId}`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${accentColor}`}>
            {Icon ? <Icon className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{toolName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={clearHistory} title="Clear History">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="ml-auto text-xs"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-primary/20' : 'bg-card border border-border'
            }`}>
              {msg.role === 'user' ? <User className="h-5 w-5 text-primary" /> : <Bot className="h-5 w-5 text-purple-600" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-card border border-border text-foreground rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-600" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
          <Button type="submit" disabled={!input.trim() || isTyping} className="bg-primary hover:bg-primary/90 h-auto px-6 rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;
