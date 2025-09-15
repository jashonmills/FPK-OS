import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  GraduationCap,
  Send,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { useLessonChat } from '@/hooks/useLessonChat';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

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
  const [autoReadback, setAutoReadback] = useState(false);
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

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useVoiceRecording();

  const {
    isSpeaking,
    isGenerating,
    speak,
    stop: stopSpeech
  } = useTextToSpeech();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const message = userInput.trim();
    setUserInput('');
    
    // Send message with course context
    await sendMessage(message, `Course: ${courseTitle}`);
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        if (transcribedText.trim()) {
          setUserInput(transcribedText);
        }
      } catch (error) {
        console.error('Voice recording error:', error);
        cancelRecording();
      }
    } else {
      await startRecording();
    }
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      setAutoReadback(!autoReadback);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-readback for assistant messages
  useEffect(() => {
    if (autoReadback && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading) {
        speak(lastMessage.content);
      }
    }
  }, [messages, autoReadback, isLoading, speak]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-20 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 ${className}`}
        size="lg"
      >
        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed inset-x-2 bottom-2 sm:bottom-6 sm:right-6 sm:left-auto 
      w-auto sm:w-96 
      max-h-[calc(100vh-120px)] sm:h-[500px]
      shadow-xl z-50 flex flex-col ${
      isMinimized ? 'h-14' : 'max-h-[calc(100vh-120px)] sm:h-[500px]'
    } ${className}`}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg shrink-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          <CardTitle className="text-xs sm:text-sm font-medium truncate">
            Course AI Tutor - {courseTitle}
          </CardTitle>
          {(isGenerating || isSpeaking) && (
            <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse shrink-0" />
          )}
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-primary-foreground/20"
          >
            {isMinimized ? <Maximize2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Minimize2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-primary-foreground/20"
          >
            <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 p-3 sm:p-4 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full pr-2 sm:pr-4">
              <div className="space-y-3 sm:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-4 sm:py-8">
                    <GraduationCap className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-muted-foreground/50" />
                    <p className="text-xs sm:text-sm">
                      Hi! I'm your AI study coach for <strong>{courseTitle}</strong>.
                    </p>
                    <p className="text-xs mt-1 sm:mt-2">
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
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${
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
                    <div className="bg-muted text-foreground rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs opacity-60">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-3 sm:p-4 border-t shrink-0">
            {/* Auto-readback toggle */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b">
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-readback" className="text-xs sm:text-sm">Auto-readback</Label>
                <Switch
                  id="auto-readback"
                  checked={autoReadback}
                  onCheckedChange={setAutoReadback}
                />
              </div>
              {(isSpeaking || isGenerating) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeech}
                  className="p-1"
                >
                  <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>

            {/* Input area */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about the course..."
                  disabled={isLoading || isProcessing}
                  className="pr-10 sm:pr-12 text-xs sm:text-sm"
                />
                <Button
                  type="button"
                  onClick={handleVoiceRecording}
                  disabled={isLoading || isProcessing}
                  className={`absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 p-0 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-transparent hover:bg-muted'
                  }`}
                  variant={isRecording ? "default" : "ghost"}
                >
                  {isProcessing ? (
                    <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  ) : (
                    <Mic className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  )}
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={!userInput.trim() || isLoading || isProcessing}
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {isRecording 
                  ? "Recording... Click mic to stop" 
                  : isProcessing 
                    ? "Processing voice..." 
                    : "Course-level AI tutor using Socratic method"
                }
              </p>
              {(isRecording || isProcessing) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelRecording}
                  className="text-xs h-5 sm:h-6 px-1.5 sm:px-2"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};