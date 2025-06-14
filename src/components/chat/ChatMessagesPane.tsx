
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Brain, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

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
  const { speak, readAIMessage, isSupported: ttsSupported } = useTextToSpeech();
  const { settings } = useVoiceSettings();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto-read new AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && settings.enabled && settings.autoRead) {
        readAIMessage(lastMessage.content);
      }
    }
  }, [messages, readAIMessage, settings.enabled, settings.autoRead]);

  const handleSpeakMessage = (content: string) => {
    if (ttsSupported && settings.enabled) {
      speak(content, { interrupt: true });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-6 h-6 border border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to AI Learning Coach</h3>
          <p className="text-muted-foreground text-sm">
            I'm here to help you with your studies, provide learning strategies, 
            and answer questions about the platform. How can I assist you today?
          </p>
          {settings.enabled && (
            <p className="text-purple-600 text-xs mt-2">
              🔊 Voice responses are enabled - I'll read my replies aloud!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg text-sm relative group",
              message.role === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto' 
                : 'bg-muted text-foreground mr-auto'
            )}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">AI Coach</span>
                  {ttsSupported && settings.enabled && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      onClick={() => handleSpeakMessage(message.content)}
                      title="Read aloud"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              
              <div className={cn(
                "text-xs mt-2 opacity-70",
                message.role === 'user' ? 'text-right' : 'text-left'
              )}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
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
