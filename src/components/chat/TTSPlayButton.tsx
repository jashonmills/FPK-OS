import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';
import type { Persona } from '@/types/aiCoach';

interface TTSPlayButtonProps {
  content: string;
  persona?: Persona;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
}

/**
 * Universal Text-to-Speech play button for AI responses
 * Supports persona-specific voices and user voice settings
 */
const TTSPlayButton: React.FC<TTSPlayButtonProps> = ({
  content,
  persona,
  className,
  size = 'icon',
  variant = 'ghost',
  showLabel = false
}) => {
  const { speak, stop, isSpeaking, isGenerating, isSupported } = useTextToSpeech();

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSpeaking || isGenerating) {
      stop();
    } else {
      if (persona) {
        await speak(content, persona);
      } else {
        await speak(content, { interrupt: true });
      }
    }
  }, [content, persona, speak, stop, isSpeaking, isGenerating]);

  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (isGenerating) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }
    if (isSpeaking) {
      return <VolumeX className="h-3 w-3" />;
    }
    return <Volume2 className="h-3 w-3" />;
  };

  const getTitle = () => {
    if (isGenerating) return "Preparing audio...";
    if (isSpeaking) return "Stop playing";
    return "Play response";
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        isSpeaking && "text-primary",
        className
      )}
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
      {showLabel && (
        <span className="ml-1 text-xs">
          {isSpeaking ? 'Stop' : 'Play'}
        </span>
      )}
    </Button>
  );
};

export default TTSPlayButton;
