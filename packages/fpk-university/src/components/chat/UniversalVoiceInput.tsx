import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Square, Clock } from 'lucide-react';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UniversalVoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showTimer?: boolean;
  variant?: 'default' | 'minimal';
}

/**
 * Universal Voice Input component for all chat interfaces
 * Uses native Speech Recognition with MediaRecorder + Whisper API fallback
 */
const UniversalVoiceInput: React.FC<UniversalVoiceInputProps> = ({
  onTranscription,
  disabled = false,
  className,
  size = 'icon',
  showTimer = true,
  variant = 'default'
}) => {
  const {
    isRecording,
    isProcessing,
    recordingDuration,
    maxRecordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
    getRemainingTime,
    getFormattedDuration,
    getFormattedRemainingTime
  } = useEnhancedVoiceInput();
  const { toast } = useToast();

  const handleVoiceInput = async () => {
    if (disabled) return;

    if (isRecording) {
      try {
        const transcription = await stopRecording();
        if (transcription && transcription.trim()) {
          onTranscription(transcription);
        } else {
          toast({
            title: "No speech detected",
            description: "Please try speaking more clearly.",
            variant: "destructive",
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Voice recording error:', error);
        toast({
          title: "Recording failed",
          description: "Please try again.",
          variant: "destructive",
          duration: 3000
        });
      }
    } else {
      try {
        await startRecording(onTranscription);
      } catch (error) {
        console.error('Microphone access error:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access in your browser.",
          variant: "destructive",
          duration: 4000
        });
      }
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelRecording();
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isRecording) {
      return <MicOff className="h-4 w-4 text-red-500 animate-pulse" />;
    }
    return <Mic className="h-4 w-4" />;
  };

  const getTitle = () => {
    if (isProcessing) return "Processing your speech...";
    if (isRecording) return "Click to stop recording";
    return "Start voice input";
  };

  const isNearTimeLimit = () => {
    return isRecording && getRemainingTime() <= 10;
  };

  if (variant === 'minimal') {
    return (
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size={size}
        onClick={handleVoiceInput}
        disabled={disabled || isProcessing}
        className={cn(
          "transition-all duration-200",
          isRecording && "ring-2 ring-red-500 ring-opacity-50 animate-pulse",
          className
        )}
        title={getTitle()}
      >
        {getButtonContent()}
      </Button>
    );
  }

  return (
    <div className="flex gap-1 items-center">
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size={size}
        onClick={handleVoiceInput}
        disabled={disabled || isProcessing}
        className={cn(
          "shrink-0 transition-all duration-200",
          isRecording && "ring-2 ring-red-500 ring-opacity-50",
          className
        )}
        title={getTitle()}
      >
        {getButtonContent()}
      </Button>
      
      {isRecording && showTimer && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="shrink-0 h-8 w-8 p-0"
            title="Cancel recording"
          >
            <Square className="h-3 w-3" />
          </Button>
          
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
            isNearTimeLimit() 
              ? 'bg-destructive/10 text-destructive animate-pulse' 
              : 'bg-primary/10 text-primary'
          )}>
            <Clock className="h-3 w-3" />
            <span>{getFormattedDuration()}</span>
            <span className="text-muted-foreground">/{getFormattedRemainingTime()}</span>
          </div>
        </>
      )}
      
      {isProcessing && (
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default UniversalVoiceInput;
