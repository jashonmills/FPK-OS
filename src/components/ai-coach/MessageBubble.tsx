import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CommandCenterMessage } from '@/hooks/useCommandCenterChat';
import { User, Sparkles, Brain, Podcast, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface MessageBubbleProps {
  message: CommandCenterMessage;
  hideAudioControls?: boolean;
  isPartOfGroup?: boolean;
}

export function MessageBubble({ 
  message,
  hideAudioControls = false,
  isPartOfGroup = false
}: MessageBubbleProps) {
  const isUser = message.persona === 'USER';
  const isBetty = message.persona === 'BETTY';
  const isAl = message.persona === 'AL';
  const isNiteOwl = message.persona === 'NITE_OWL';

  const { speak, stop, isSpeaking, isAvailable } = useTextToSpeech();
  const [isThisMessageSpeaking, setIsThisMessageSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (isThisMessageSpeaking) {
      stop();
      setIsThisMessageSpeaking(false);
    } else {
      // Single message audio using backend-generated audio or TTS fallback
      if (message.audioUrl) {
        // Play backend-generated audio
        console.log('[MessageBubble] 🎵 Playing backend-generated audio for', message.persona);
        setIsThisMessageSpeaking(true);
        await playAudioFile(message.audioUrl);
        setIsThisMessageSpeaking(false);
      } else if (message.persona === 'BETTY' || message.persona === 'AL' || message.persona === 'NITE_OWL') {
        // Fallback to browser TTS
        console.log('[MessageBubble] 🔊 Falling back to browser TTS for', message.persona);
        speak(message.content, message.persona);
        setIsThisMessageSpeaking(true);
        
        // Auto-reset when speech ends
        const checkEnd = setInterval(() => {
          if (!isSpeaking) {
            setIsThisMessageSpeaking(false);
            clearInterval(checkEnd);
          }
        }, 100);
      }
    }
  };

  const playAudioFile = (audioUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.error('Audio playback error for URL:', audioUrl);
        resolve();
      };
      audio.play().catch(() => resolve());
    });
  };

  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4" />;
    if (isBetty) return <Sparkles className="h-4 w-4" />;
    if (isNiteOwl) return <Podcast className="h-4 w-4" />;
    if (isAl) return <Brain className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  const getPersonaLabel = () => {
    if (isBetty) return 'Betty - Socratic Guide';
    if (isAl) return 'Al - Direct Expert';
    if (isNiteOwl) return 'Nite Owl - Fun Facts';
    return 'AI';
  };

  const getStyles = () => {
    if (isUser) {
      return {
        container: 'justify-end',
        bubble: 'bg-primary text-primary-foreground',
        icon: 'bg-primary text-primary-foreground'
      };
    }
    if (isBetty) {
      return {
        container: 'justify-start',
        bubble: 'bg-muted',
        icon: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
      };
    }
    if (isNiteOwl) {
      return {
        container: 'justify-start',
        bubble: 'bg-muted border-2 border-amber-500/30',
        icon: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
      };
    }
    if (isAl) {
      return {
        container: 'justify-start',
        bubble: 'bg-muted',
        icon: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
      };
    }
    return {
      container: 'justify-start',
      bubble: 'bg-muted',
      icon: 'bg-muted'
    };
  };

  const styles = getStyles();

  return (
    <div className={cn('flex gap-3 mb-4', styles.container)}>
      {!isUser && (
        <div className={cn('flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center', styles.icon)}>
          {getIcon()}
        </div>
      )}
      
      <div className="flex flex-col gap-1 max-w-[70%]">
        {!isUser && (
          <div className="text-xs text-muted-foreground font-medium px-2">
            {getPersonaLabel()}
          </div>
        )}
        <div className="flex items-start gap-2">
          <div className={cn('rounded-2xl px-4 py-3 flex-1', styles.bubble)}>
            <div className={cn('text-sm prose prose-sm max-w-none', isUser ? 'prose-invert' : 'dark:prose-invert')}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Text-to-Speech button for AI messages (hidden for grouped messages) */}
          {!isUser && !hideAudioControls && isAvailable && !message.isStreaming && (
            <button
              onClick={handleSpeak}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
              title={isThisMessageSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isThisMessageSpeaking ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className={cn('flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center', styles.icon)}>
          {getIcon()}
        </div>
      )}
    </div>
  );
}
