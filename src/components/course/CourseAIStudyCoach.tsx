import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  GraduationCap,
  Send,
  Bot
} from 'lucide-react';
import { useLessonChat } from '@/hooks/useLessonChat';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CourseAIStudyCoachProps {
  courseId: string;
  courseTitle: string;
  className?: string;
}

export const CourseAIStudyCoach: React.FC<CourseAIStudyCoachProps> = ({
  courseId,
  courseTitle,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userInput, setUserInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useLessonChat({
    courseId,
    lessonId: 0, // Course-level chat
    lessonTitle: courseTitle
  });

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const message = userInput.trim();
    setUserInput('');
    
    // Send message with course context
    await sendMessage(message, `Course: ${courseTitle}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 ${className}`}
        size="lg"
      >
        <GraduationCap className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col ${
      isMinimized ? 'h-14' : 'h-[500px]'
    } ${className}`}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm font-medium">
            Course AI Tutor - {courseTitle}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7 p-0 hover:bg-primary-foreground/20"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 p-0 hover:bg-primary-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm">
                      Hi! I'm your AI study coach for <strong>{courseTitle}</strong>.
                    </p>
                    <p className="text-xs mt-2">
                      Ask me anything about the course content, concepts, or get help with practice problems!
                    </p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs opacity-60">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the course..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!userInput.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Course-level AI tutor using Socratic method to guide your learning
            </p>
          </div>
        </>
      )}
    </Card>
  );
};