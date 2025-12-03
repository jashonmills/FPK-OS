
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Plus, Brain, Mic, MicOff, X, Menu, ChevronLeft, Trash2 } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useWidgetChatMessages } from '@/hooks/useWidgetChatMessages';
import { usePageContext } from '@/hooks/usePageContext';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { featureFlagService } from '@/services/FeatureFlagService';
import ChatSessionsList from './ChatSessionsList';
import ChatMessagesPane from './ChatMessagesPane';
import { usePIIDetection } from '@/hooks/usePIIDetection';
import { PIIWarningBanner } from './PIIWarningBanner';

interface ChatSheetProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isWidget?: boolean;
}

const ChatSheet = ({ trigger, isOpen, onOpenChange, isWidget = false }: ChatSheetProps) => {
  const [message, setMessage] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPIIWarning, setShowPIIWarning] = useState(false);
  const [showMaskedPreview, setShowMaskedPreview] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { checkMessage, lastResult, clearResult, acknowledgeWarning, warningAcknowledged } = usePIIDetection();
  
  // Use different hooks based on widget mode
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
    messages: dbMessages, 
    isLoading: messagesLoading,
    isSending: dbSending,
    sendMessage: sendDbMessage
  } = useChatMessages(currentSessionId);

  const {
    messages: widgetMessages,
    isSending: widgetSending,
    sendMessage: sendWidgetMessage,
    deleteMessage: deleteWidgetMessage,
    clearAllMessages: clearWidgetMessages
  } = useWidgetChatMessages(user?.id);

  // Use appropriate data based on widget mode
  const messages = isWidget ? widgetMessages : dbMessages;
  const isSending = isWidget ? widgetSending : dbSending;
  const isLoading = isWidget ? false : messagesLoading;

  const { getPageContext } = usePageContext();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const widgetDeletionEnabled = featureFlagService.isEnabled('widgetChatDeletion');

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

  // Close sidebar when switching sessions on mobile
  useEffect(() => {
    if (isMobile && currentSessionId) {
      setShowSidebar(false);
    }
  }, [currentSessionId, isMobile]);

  const handleSendMessage = async (bypassPII = false) => {
    if (!message.trim() || isSending) return;
    
    // Check for PII unless bypassed
    if (!bypassPII && !warningAcknowledged) {
      const piiResult = checkMessage(message);
      if (piiResult.hasPII && piiResult.severity !== 'low') {
        setShowPIIWarning(true);
        return;
      }
    }
    
    console.log('Handling send message...', { message, isWidget });
    
    const context = getPageContext();
    const messageToSend = message;
    setMessage(''); // Clear input immediately for better UX
    setShowPIIWarning(false);
    clearResult();
    
    if (isWidget) {
      await sendWidgetMessage(messageToSend, context);
    } else {
      let sessionId = currentSessionId;
      
      // Create new session if none exists (only for non-widget)
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
      
      console.log('Sending message with context:', { context, sessionId });
      await sendDbMessage(messageToSend, context);
    }
  };

  const handlePIIDismiss = () => {
    setShowPIIWarning(false);
    // Focus back on input for editing
  };

  const handlePIISendAnyway = () => {
    acknowledgeWarning();
    setShowPIIWarning(false);
    handleSendMessage(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    if (isWidget) {
      // For widget, just clear the messages
      clearWidgetMessages();
      toast({
        title: "Chat cleared",
        description: "Widget chat history has been cleared.",
      });
      return;
    }

    console.log('Creating new chat session...');
    const newSession = await createSession('Study Coach');
    if (newSession) {
      switchToSession(newSession.id);
      console.log('Switched to new session:', newSession.id);
      if (isMobile) {
        setShowSidebar(false);
      }
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    switchToSession(sessionId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleClearWidgetChat = () => {
    if (isWidget && widgetDeletionEnabled) {
      clearWidgetMessages();
      toast({
        title: "Chat cleared",
        description: "All widget messages have been cleared.",
      });
    }
  };

  const handleDeleteWidgetMessage = (messageId: string) => {
    if (isWidget && widgetDeletionEnabled) {
      deleteWidgetMessage(messageId);
      toast({
        title: "Message deleted",
        description: "Message has been removed from chat history.",
      });
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
      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg touch-target"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className={cn(
          "w-full p-0 overflow-hidden border-0",
          isMobile ? "h-[100vh] rounded-none" : "h-[85vh] max-w-6xl mx-auto rounded-t-lg"
        )}
      >
        <div className="flex h-full overflow-hidden">
          {/* Mobile Sidebar Overlay */}
          {isMobile && showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Left Sidebar - Sessions List (Hidden for widget mode) */}
          {!isWidget && (
            <div className={cn(
              "border-r bg-muted/20 flex flex-col transition-all duration-300 flex-shrink-0",
              isMobile 
                ? cn(
                    "fixed left-0 top-0 h-full z-50 w-72 sm:w-80 transform",
                    showSidebar ? "translate-x-0" : "-translate-x-full"
                  )
                : "w-72 sm:w-80"
            )}>
              {/* Mobile sidebar header */}
              {isMobile && (
                <div className="p-3 sm:p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base">Chat Sessions</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowSidebar(false)}
                    className="touch-target"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className={cn("p-3 sm:p-4 border-b", isMobile && "pt-2")}>
                <Button 
                  onClick={handleNewChat}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 touch-target"
                  size="default"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
              
              <ChatSessionsList
                sessions={sessions}
                currentSessionId={currentSessionId}
                isLoading={sessionsLoading}
                onSessionSelect={handleSessionSelect}
                onSessionDelete={deleteSession}
                onSessionRename={updateSessionTitle}
              />
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {!isWidget && isMobile && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowSidebar(true)}
                      className="text-white hover:bg-white/20 mr-2 touch-target flex-shrink-0"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base truncate">
                    {isWidget ? 'Quick Chat' : 'AI Learning Coach'}
                  </span>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs flex-shrink-0">
                    Online
                  </Badge>
                </div>
                
                {/* Widget-specific header actions */}
                {isWidget && widgetDeletionEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearWidgetChat}
                    className="text-white hover:bg-white/20 touch-target"
                    title="Clear chat history"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Chat
                  </Button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <ChatMessagesPane
                messages={messages}
                isLoading={isLoading}
                isSending={isSending}
                messagesEndRef={messagesEndRef}
                isWidget={isWidget}
                onDeleteMessage={isWidget && widgetDeletionEnabled ? handleDeleteWidgetMessage : undefined}
                showDeleteButtons={isWidget && widgetDeletionEnabled}
              />

              {/* Input Area */}
              <div className="border-t p-2 sm:p-3 md:p-4 bg-background flex-shrink-0">
                {/* Voice Recording Status */}
                {(isRecording || isProcessing) && (
                  <div className="mb-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      {isRecording && (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                          <span className="text-sm text-purple-700 font-medium">Recording...</span>
                        </>
                      )}
                      {isProcessing && (
                        <>
                          <div className="animate-spin w-3 h-3 border border-purple-600 border-t-transparent rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-purple-700 font-medium">Processing voice...</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* PII Warning Banner */}
                {showPIIWarning && lastResult && (
                  <PIIWarningBanner
                    result={lastResult}
                    originalText={message}
                    onDismiss={handlePIIDismiss}
                    onSendAnyway={handlePIISendAnyway}
                    showMasked={showMaskedPreview}
                    onToggleMask={() => setShowMaskedPreview(!showMaskedPreview)}
                  />
                )}

                <div className="flex gap-1 sm:gap-2">
                  <Input
                    ref={inputRef}
                    placeholder={isMobile ? "Ask me anything..." : isWidget ? "Quick question..." : "Ask for help, study tips, or platform guidance..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending || isRecording || isProcessing}
                    className="flex-1 text-sm min-w-0 safe-text"
                  />
                  
                  {/* Voice Recording Button */}
                  <Button
                    onClick={handleVoiceToggle}
                    disabled={isSending || isProcessing}
                    size="icon"
                    variant={isRecording ? "destructive" : "outline"}
                    className={cn(
                      "transition-all duration-200 flex-shrink-0 touch-target",
                      isRecording && "animate-pulse bg-red-500 hover:bg-red-600"
                    )}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>

                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={isSending || !message.trim() || isRecording || isProcessing}
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700 flex-shrink-0 touch-target"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-purple-600 mt-2 text-center text-xs break-words">
                  {isWidget 
                    ? "💡 Quick AI assistance • 🎤 Click mic to speak"
                    : "💡 I provide context-aware help based on your current page • 🎤 Click mic to speak"
                  }
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
