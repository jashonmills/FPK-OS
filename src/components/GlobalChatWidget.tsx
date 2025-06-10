
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageCircle, Send, Brain, X, MoreVertical, RotateCcw, Minimize2, Maximize2, Mic, MicOff } from 'lucide-react';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { usePageContext } from '@/hooks/usePageContext';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const GlobalChatWidget = () => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const { 
    chatHistory, 
    isLoading, 
    isOpen, 
    hasUnreadMessages, 
    sendMessage, 
    clearHistory, 
    toggleChat 
  } = useGlobalChat();
  const { getPageContext, getQuickActions } = usePageContext();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const context = getPageContext();
    await sendMessage(message, context);
    setMessage('');
  };

  const handleQuickAction = async (action: string) => {
    const context = getPageContext();
    await sendMessage(action, context);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        setMessage(transcribedText);
        toast({
          title: "Voice recorded",
          description: "Your voice has been transcribed. You can edit it before sending.",
        });
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast({
          title: "Recording failed",
          description: "There was an error processing your voice. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await startRecording();
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone. Click the mic button again to stop.",
        });
      } catch (error) {
        console.error('Error starting recording:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full" />
            </div>
          )}
        </Button>
      </div>
    );
  }

  const quickActions = getQuickActions();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "w-96 shadow-2xl border-2",
        isMinimized ? "h-16" : "h-[500px]"
      )}>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-semibold">AI Learning Coach</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={clearHistory} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[436px] p-0">
            {/* Quick Actions */}
            {quickActions.length > 0 && chatHistory.length <= 1 && (
              <div className="p-3 border-b bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Quick actions for this page:</p>
                <div className="flex flex-wrap gap-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs h-7"
                      disabled={isLoading}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mb-1">
                          <Brain className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">AI Coach</span>
                        </div>
                      )}
                      <p className="break-words">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="border-t p-3">
              {/* Voice Recording Status */}
              {(isRecording || isProcessing) && (
                <div className="mb-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    {isRecording && (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-purple-700 font-medium">Recording...</span>
                      </>
                    )}
                    {isProcessing && (
                      <>
                        <div className="animate-spin w-3 h-3 border border-purple-600 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-purple-700 font-medium">Processing voice...</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask for help, study tips, or platform guidance..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || isRecording || isProcessing}
                  className="text-sm"
                />
                
                {/* Voice Recording Button */}
                <Button
                  onClick={handleVoiceToggle}
                  disabled={isLoading || isProcessing}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  className={cn(
                    "transition-all duration-200",
                    isRecording && "animate-pulse bg-red-500 hover:bg-red-600"
                  )}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim() || isRecording || isProcessing}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-purple-600 mt-1 text-center">
                💡 I provide context-aware help based on your current page • 🎤 Click mic to speak
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default GlobalChatWidget;
