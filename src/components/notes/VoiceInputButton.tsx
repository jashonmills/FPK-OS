
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Square, Clock } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ 
  onTranscription, 
  placeholder = "voice input",
  disabled = false
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
  } = useVoiceRecording();
  const { toast } = useToast();

  const handleVoiceInput = async () => {
    if (disabled) return;

    if (isRecording) {
      try {
        const transcription = await stopRecording();
        if (transcription.trim()) {
          onTranscription(transcription);
          // Only show success toast for very short transcriptions (user might not see what was transcribed)
          if (transcription.length < 30) {
            toast({
              title: "Voice recorded",
              description: `"${transcription}"`,
              duration: 2000,
            });
          }
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
        await startRecording();
        // No toast for recording start - visual feedback is enough
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

  const handleCancel = () => {
    cancelRecording();
    // No toast needed - visual feedback is sufficient
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs hidden sm:inline">Processing</span>
        </div>
      );
    }
    if (isRecording) {
      return (
        <div className="flex items-center gap-1">
          <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="text-xs hidden sm:inline">Stop</span>
        </div>
      );
    }
    return <Mic className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (isRecording) return "destructive";
    if (isProcessing) return "secondary";
    return "outline";
  };

  const getTitle = () => {
    if (isProcessing) return "Processing your speech...";
    if (isRecording) return "Click to stop recording";
    return `Start ${placeholder}`;
  };

  const isNearTimeLimit = () => {
    return isRecording && getRemainingTime() <= 10;
  };

  return (
    <div className="flex gap-1 items-center">
      <Button
        type="button"
        variant={getButtonVariant()}
        size="sm"
        onClick={handleVoiceInput}
        disabled={disabled || isProcessing}
        className={cn(
          "shrink-0 transition-all duration-200",
          isRecording && "ring-2 ring-red-500 ring-opacity-50"
        )}
        title={getTitle()}
      >
        {getButtonContent()}
      </Button>
      
      {isRecording && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="shrink-0"
            title="Cancel recording"
          >
            <Square className="h-3 w-3" />
          </Button>
          
          {/* Recording Timer */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            isNearTimeLimit() 
              ? 'bg-red-100 text-red-700 animate-pulse' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="h-3 w-3" />
            <span>{getFormattedDuration()}</span>
            <span className="text-gray-500">/{getFormattedRemainingTime()}</span>
          </div>
        </>
      )}
      
      {isProcessing && (
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
