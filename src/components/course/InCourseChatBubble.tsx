import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractReadableText, extractCourseContent } from '@/utils/courseTextExtractor';
import { useLessonChat } from '@/hooks/useLessonChat';
import { timeoutManager } from '@/utils/performanceOptimizer';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface InCourseChatBubbleProps {
  courseId: string;
  lessonId: number;
  lessonTitle: string;
  lessonContentRef: React.RefObject<HTMLElement>;
  className?: string;
}

export const InCourseChatBubble: React.FC<InCourseChatBubbleProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  lessonContentRef,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    sendMessage: sendLessonMessage
  } = useLessonChat({
    courseId,
    lessonId,
    lessonTitle
  });

  // Debounced content extraction to avoid excessive DOM parsing
  const extractLessonContent = useCallback((): string => {
    if (!lessonContentRef.current) return '';
    
    try {
      const sections = extractCourseContent(lessonContentRef.current);
      const readableText = extractReadableText(lessonContentRef.current);
      
      // Combine structured sections with readable text
      const structuredContent = sections
        .map(section => `${section.title}: ${section.content}`)
        .join('\n\n');
      
      // Limit content to prevent memory issues
      const content = structuredContent || readableText || '';
      return content.slice(0, 10000); // Limit to 10k characters
    } catch (error) {
      console.error('Error extracting lesson content:', error);
      return '';
    }
  }, [lessonContentRef]);

  const debouncedExtractRef = useRef<NodeJS.Timeout>();

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');

    // Clear any pending extraction
    if (debouncedExtractRef.current) {
      timeoutManager.timeouts.delete(debouncedExtractRef.current);
      clearTimeout(debouncedExtractRef.current);
    }

    // Debounce content extraction by 200ms to reduce DOM queries
    debouncedExtractRef.current = timeoutManager.setTimeout(() => {
      const lessonContent = extractLessonContent();
      sendLessonMessage(userMessage, lessonContent);
    }, 200);
  }, [message, isLoading, extractLessonContent, sendLessonMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup debounced timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedExtractRef.current) {
        timeoutManager.timeouts.delete(debouncedExtractRef.current);
        clearTimeout(debouncedExtractRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90"
          aria-label="Open lesson tutor chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]",
      className
    )}>
      <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Lesson Tutor</h4>
                <p className="text-xs text-muted-foreground">{lessonTitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="pt-0">
            {/* Messages */}
            <div className="h-80 overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Ask me anything about this lesson!</p>
                  <p className="text-xs mt-1">I'll guide you through the concepts using questions.</p>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground ml-4"
                      : "bg-muted mr-4"
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.role === 'assistant' && (
                    <div className="text-xs opacity-70 mt-1">
                      Use "/answer" for direct answers
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-muted mr-4 p-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animation-delay-200"></div>
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animation-delay-400"></div>
                    </div>
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this lesson..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 text-center">
              I use the Socratic method - I'll guide you with questions!
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};