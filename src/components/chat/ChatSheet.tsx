
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Plus, Brain, Mic, MicOff, X } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import { usePageContext } from '@/hooks/usePageContext';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ChatSessionsList from './ChatSessionsList';
import ChatMessagesPane from './ChatMessagesPane';

interface ChatSheetProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ChatSheet = ({ trigger, isOpen, onOpenChange }: ChatSheetProps) => {
  const [message, setMessage] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const { 
    sessions, 
    currentSessionId, 
    isLoading: sessionsLoading,
    createSession,
    switchToSession,
    updateSessionTitle,
    deleteSession
  } = useChatSessions();
  
  const { 
    messages, 
    isLoading: messagesLoading,
    isSending,
    sendMessage
  } = useChatMessages(currentSessionId);

  const { getPageContext } = usePageContext();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && open) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isSending]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    console.log('Handling send message...', { message, currentSessionId });
    
    let sessionId = currentSessionId;
    
    // Create new session if none exists
    if (!sessionId) {
      console.log('Creating new session...');
      const newSession = await createSession('Study Coach');
      if (!newSession) {
        console.error('Failed to create new session');
        return;
      }
      sessionId = newSession.id;
      console.log('New session created:', sessionId);
    }
    
    const context = getPageContext();
    console.log('Sending message with context:', { context, sessionId });
    
    const messageToSend = message;
    setMessage(''); // Clear input immediately for better UX
    
    await sendMessage(messageToSend, context);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    console.log('Creating new chat session...');
    const newSession = await createSession('Study Coach');
    if (newSession) {
      switchToSession(newSession.id);
      console.log('Switched to new session:', newSession.id);
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

  const defaultTrigger = (
    <Button
      size="icon"
      className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="h-[100vh] w-full p-0 sm:h-[80vh] sm:max-w-4xl sm:mx-auto"
      >
        <div className="flex h-full">
          {/* Left Sidebar - Sessions List */}
          <div className="w-80 border-r bg-muted/20 flex flex-col">
            <div className="p-4 border-b">
              <Button 
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            <ChatSessionsList
              sessions={sessions}
              currentSessionId={currentSessionId}
              isLoading={sessionsLoading}
              onSessionSelect={switchToSession}
              onSessionDelete={deleteSession}
              onSessionRename={updateSessionTitle}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span className="font-semibold">AI Learning Coach</span>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    Online
                  </Badge>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              <ChatMessagesPane
                messages={messages}
                isLoading={messagesLoading}
                isSending={isSending}
                messagesEndRef={messagesEndRef}
              />

              {/* Input Area */}
              <div className="border-t p-4 bg-background">
                {/* Voice Recording Status */}
                {(isRecording || isProcessing) && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      {isRecording && (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-purple-700 font-medium">Recording...</span>
                        </>
                      )}
                      {isProcessing && (
                        <>
                          <div className="animate-spin w-3 h-3 border border-purple-600 border-t-transparent rounded-full"></div>
                          <span className="text-sm text-purple-700 font-medium">Processing voice...</span>
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
                    disabled={isSending || isRecording || isProcessing}
                    className="flex-1"
                  />
                  
                  {/* Voice Recording Button */}
                  <Button
                    onClick={handleVoiceToggle}
                    disabled={isSending || isProcessing}
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
                    disabled={isSending || !message.trim() || isRecording || isProcessing}
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-purple-600 mt-2 text-center">
                  💡 I provide context-aware help based on your current page • 🎤 Click mic to speak
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
