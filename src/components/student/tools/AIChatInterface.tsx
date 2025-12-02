import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Trash2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatInterfaceProps {
  toolName: string;
  systemPrompt: string;
  onBack: () => void;
  icon?: LucideIcon;
  accentColor?: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  toolName, 
  systemPrompt, 
  onBack, 
  icon: Icon, 
  accentColor = 'from-indigo-500 to-purple-600' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem(`chat_history_${toolName}`);
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: systemPrompt || `Hello! I'm your ${toolName}. How can I help you today?`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [toolName, systemPrompt]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${toolName}`, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, toolName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateAIResponse = async (userQuery: string): Promise<string> => {
    setIsTyping(true);
    const delay = Math.floor(Math.random() * 1500) + 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    let response = "I understand what you're asking. Could you provide more specific details so I can help you better?";
    
    const q = userQuery.toLowerCase();
    if (toolName.includes('Math')) {
      if (q.includes('solve') || q.match(/\d+/)) response = "Let's break this down step-by-step.\n\n1. First, identify the variables.\n2. Apply the formula.\n3. Calculate the result.\n\nWould you like me to show the specific calculation for this problem?";
    } else if (toolName.includes('Language')) {
      if (q.includes('spanish')) response = "¡Hola! ¿Cómo estás hoy? Podemos practicar español. ¿De qué te gustaría hablar?";
      else if (q.includes('french')) response = "Bonjour! Comment ça va? Parlons un peu en français.";
    } else if (toolName.includes('Tutor')) {
      if (q.includes('history')) response = "History is fascinating. Are we discussing a specific era, like the Renaissance or World War II?";
      else if (q.includes('science')) response = "Science allows us to understand the universe. Is this about Biology, Chemistry, or Physics?";
    }

    setIsTyping(false);
    return response;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const aiResponseContent = await simulateAIResponse(input);
    
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: aiResponseContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear this chat history?")) {
      const initialMsg: Message = {
        id: Date.now(),
        role: 'assistant',
        content: systemPrompt || `Hello! I'm your ${toolName}. How can I help you today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([initialMsg]);
      localStorage.removeItem(`chat_history_${toolName}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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
            className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-foreground placeholder:text-muted-foreground"
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
