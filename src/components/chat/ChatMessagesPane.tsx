import React, { useEffect, useCallback, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Brain, Volume2, VolumeX, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useTextSelection } from '@/hooks/useTextSelection';
import { featureFlagService } from '@/services/FeatureFlagService';
import SaveToNotesButton from '@/components/ai-coach/SaveToNotesButton';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatMessagesPaneProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessagesPane = ({ 
  messages, 
  isLoading, 
  isSending, 
  messagesEndRef 
}: ChatMessagesPaneProps) => {
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { settings } = useVoiceSettings();
  const voicePlayButtonEnabled = featureFlagService.isEnabled('voicePlayButton');

  // Text selection for the entire messages container
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { selectedText, hasSelection, clearSelection } = useTextSelection(messagesContainerRef);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSpeakMessage = (content: string) => {
    if (ttsSupported && settings.enabled) {
      speak(content, { interrupt: true });
    }
  };

  const handlePlayVoice = useCallback((messageId: string, content: string) => {
    if (ttsSupported) {
      // Stop any current speech
      stop();
      // Start speaking the specific message
      speak(content, { interrupt: true });
    }
  }, [speak, stop, ttsSupported]);

  // Improved auto-scroll logic that respects user scroll position
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      });
    }
  }, [messagesEndRef]);

  // Only auto-scroll when new messages arrive and user is near bottom
  useEffect(() => {
    if (messages.length > 0) {
      // Check if user is near the bottom before auto-scrolling
      const scrollArea = messagesEndRef.current?.parentElement?.parentElement;
      if (scrollArea) {
        const { scrollTop, scrollHeight, clientHeight } = scrollArea;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        // Only auto-scroll if user is near bottom or this is the first message
        if (isNearBottom || messages.length === 1) {
          setTimeout(scrollToBottom, 100);
        }
      }
    }
  }, [messages.length, scrollToBottom]);

  // Auto-scroll for loading states only if user is at bottom
  useEffect(() => {
    if (isSending || isLoading) {
      const scrollArea = messagesEndRef.current?.parentElement?.parentElement;
      if (scrollArea) {
        const { scrollTop, scrollHeight, clientHeight } = scrollArea;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        if (isAtBottom) {
          setTimeout(scrollToBottom, 50);
        }
      }
    }
  }, [isSending, isLoading, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-6 h-6 border border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Welcome to AI Learning Coach</h3>
          <p className="text-muted-foreground text-xs sm:text-sm break-words leading-relaxed">
            I'm here to help you with your studies, provide learning strategies, 
            and answer questions about the platform. How can I assist you today?
          </p>
          {settings.enabled && (
            <p className="text-purple-600 text-xs mt-2 break-words">
              🔊 Voice responses are enabled - I'll read my replies aloud!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-2 sm:p-3 md:p-4">
      <div ref={messagesContainerRef} className="space-y-2 sm:space-y-3 md:space-y-4">
        {messages.map((message) => {
          // Find the corresponding user question for context
          const messageIndex = messages.findIndex(msg => msg.id === message.id);
          const previousMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
          const originalQuestion = previousMessage?.role === 'user' ? previousMessage.content : undefined;

          return (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
              )}
              
              <div className={cn(
                "rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[75%] relative group safe-text",
                message.role === 'user' 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto" 
                  : "bg-muted/50 border text-foreground mr-auto"
              )}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-purple-600 truncate">AI Coach</span>
                    
                    {/* Action buttons for AI messages */}
                    <div className="flex items-center gap-1 ml-auto">
                      {/* Voice Play Button - Feature Flagged */}
                      {voicePlayButtonEnabled && ttsSupported && message.role === 'assistant' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity touch-target p-0"
                          onClick={() => handlePlayVoice(message.id, message.content)}
                          aria-label="Play voice response"
                          title="Play voice response"
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-2 w-2 sm:h-3 sm:w-3" />
                          ) : (
                            <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      )}

                      {/* Legacy TTS button when feature flag is disabled */}
                      {!voicePlayButtonEnabled && ttsSupported && settings.enabled && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                          onClick={() => handleSpeakMessage(message.content)}
                          title="Read aloud"
                        >
                          <Volume2 className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      )}
                      
                      <SaveToNotesButton
                        content={message.content}
                        selectedText={hasSelection ? selectedText : undefined}
                        originalQuestion={originalQuestion}
                        aiMode="AI Learning Coach"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity touch-target p-0"
                      />
                    </div>
                  </div>
                )}
                
                <div className="break-words leading-relaxed">
                  {message.content}
                </div>
                
                <div className={cn(
                  "text-xs mt-1 sm:mt-2 opacity-70",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          );
        })}
        
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">AI Coach</span>
              </div>
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
  );
};

export default ChatMessagesPane;
