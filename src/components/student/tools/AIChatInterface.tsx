import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Trash2, Bot, User, AlertCircle, Copy, Play, FileCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import type { CodeAction } from './CodeTutor';

interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeActions?: CodeAction[];
}

interface CodeContext {
  code: string;
  output: string;
}

interface AIChatInterfaceProps {
  toolId: string;
  toolName: string;
  welcomeMessage?: string;
  onBack: () => void;
  icon?: LucideIcon;
  accentColor?: string;
  codeContext?: CodeContext;
  onCodeAction?: (action: CodeAction) => void;
}

// Component to render code blocks with action buttons
const CodeBlock: React.FC<{
  code: string;
  language?: string;
  onApply?: () => void;
  onRun?: () => void;
  showApply?: boolean;
  showRun?: boolean;
}> = ({ code, language = 'javascript', onApply, onRun, showApply, showRun }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border bg-slate-900">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-xs text-slate-400">
        <span className="font-mono">{language}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          {showApply && onApply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onApply}
              className="h-6 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-slate-700"
            >
              <FileCode className="h-3 w-3 mr-1" />
              Apply
            </Button>
          )}
          {showRun && onRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRun}
              className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-700"
            >
              <Play className="h-3 w-3 mr-1" />
              Run
            </Button>
          )}
        </div>
      </div>
      <pre className="p-3 text-sm text-slate-300 overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Parse message content and extract code blocks
const parseMessageContent = (
  content: string,
  onApply?: (code: string) => void,
  onRun?: () => void,
  isCodeCompanion?: boolean
) => {
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{content.slice(lastIndex, match.index)}</span>
      );
    }

    const language = match[1] || 'javascript';
    const code = match[2].trim();

    parts.push(
      <CodeBlock
        key={key++}
        code={code}
        language={language}
        onApply={onApply ? () => onApply(code) : undefined}
        onRun={onRun}
        showApply={isCodeCompanion && !!onApply}
        showRun={isCodeCompanion && !!onRun}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : content;
};

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  toolId,
  toolName, 
  welcomeMessage,
  onBack, 
  icon: Icon, 
  accentColor = 'from-indigo-500 to-purple-600',
  codeContext,
  onCodeAction
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const isCodeCompanion = toolId === 'code-companion';

  // Default welcome messages for each tool
  const getWelcomeMessage = () => {
    if (welcomeMessage) return welcomeMessage;
    
    const welcomeMessages: Record<string, string> = {
      'ai-personal-tutor': "Hello! I'm Betty, your personal AI tutor. I use the Socratic method to help you discover answers and develop deep understanding. What would you like to explore today?",
      'math-solver': "Hi there! I'm Al, your math problem solver. Share any math problem with me, and I'll guide you through it step-by-step. What would you like to work on?",
      'essay-coach': "Welcome! I'm your essay writing coach. I'll help you develop your writing skills through constructive feedback. Share your writing or tell me what you're working on!",
      'code-companion': "Hey! 👋 I can see your code editor! I'll analyze your code and help you learn. Try running the factorial function, then ask me anything about it - I can explain concepts, fix bugs, or even update the code directly!",
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

  const getAIResponse = async (userMessage: string): Promise<{ response: string; codeActions?: CodeAction[] }> => {
    if (!user) {
      throw new Error('Please sign in to use the AI tools');
    }

    // Prepare message history (exclude welcome message, last 10 messages)
    const messageHistory = messages
      .filter(m => m.id !== 'init')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    const requestBody: any = {
      toolId,
      message: userMessage,
      sessionId,
      messageHistory
    };

    // Include code context for code-companion
    if (isCodeCompanion && codeContext) {
      requestBody.codeContext = codeContext;
    }

    const { data, error } = await supabase.functions.invoke('ai-learning-hub-chat', {
      body: requestBody
    });

    if (error) {
      console.error('AI API error:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }

    // Update session ID if returned
    if (data.sessionId && !sessionId) {
      setSessionId(data.sessionId);
    }

    return {
      response: data.response,
      codeActions: data.codeActions
    };
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
      const { response: aiResponseContent, codeActions } = await getAIResponse(input);
      
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        codeActions
      };

      setMessages(prev => [...prev, aiMsg]);

      // Auto-execute code actions if present
      if (codeActions && onCodeAction) {
        codeActions.forEach(action => {
          if (action.action === 'highlight_lines' || action.action === 'run_code') {
            onCodeAction(action);
          }
        });
      }
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

  const handleApplyCode = (code: string) => {
    if (onCodeAction) {
      onCodeAction({ action: 'replace_code', code });
      toast({
        title: 'Code Applied',
        description: 'The code has been applied to the editor.',
      });
    }
  };

  const handleRunCode = () => {
    if (onCodeAction) {
      onCodeAction({ action: 'run_code' });
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
              {isCodeCompanion && codeContext ? 'Watching your code' : 'Online'}
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
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.role === 'assistant' 
                  ? parseMessageContent(
                      msg.content, 
                      isCodeCompanion ? handleApplyCode : undefined,
                      isCodeCompanion ? handleRunCode : undefined,
                      isCodeCompanion
                    )
                  : msg.content
                }
              </div>
              {/* Code action buttons for explicit actions */}
              {msg.codeActions && msg.codeActions.length > 0 && onCodeAction && (
                <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                  {msg.codeActions.map((action, idx) => (
                    action.action === 'replace_code' && action.code ? (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => onCodeAction(action)}
                        className="h-7 text-xs bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20"
                      >
                        <FileCode className="h-3 w-3 mr-1" />
                        {action.explanation || 'Apply suggested code'}
                      </Button>
                    ) : action.action === 'highlight_lines' && action.lines ? (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => onCodeAction(action)}
                        className="h-7 text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/20"
                      >
                        Highlight lines {action.lines.join(', ')}
                      </Button>
                    ) : null
                  ))}
                </div>
              )}
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
            placeholder={isCodeCompanion ? "Ask about your code..." : "Type your message here..."}
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
