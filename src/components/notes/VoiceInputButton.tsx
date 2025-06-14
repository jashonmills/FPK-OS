
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Square, Clock } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';

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
          toast({
            title: "🎤 Voice recorded successfully",
            description: `Transcribed: "${transcription.substring(0, 50)}${transcription.length > 50 ? '...' : ''}"`,
          });
        } else {
          toast({
            title: "🔇 No speech detected",
            description: "Please try speaking more clearly or check your microphone.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Voice recording error:', error);
        toast({
          title: "❌ Recording failed",
          description: error.message || "Could not process voice recording. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await startRecording();
        toast({
          title: "🎤 Recording started",
          description: `Speak clearly now. You have up to ${maxRecordingTime} seconds. Click the button again to stop.`,
        });
      } catch (error) {
        console.error('Microphone access error:', error);
        toast({
          title: "❌ Microphone access denied",
          description: "Please allow microphone access and try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleCancel = () => {
    cancelRecording();
    toast({
      title: "🚫 Recording cancelled",
      description: "Voice recording was stopped.",
    });
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isRecording) {
      return <MicOff className="h-4 w-4 text-red-500" />;
    }
    return <Mic className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (isRecording) return "destructive";
    if (isProcessing) return "outline";
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
    <div className="flex gap-1">
      <Button
        type="button"
        variant={getButtonVariant()}
        size="sm"
        onClick={handleVoiceInput}
        disabled={disabled || isProcessing}
        className="shrink-0"
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
