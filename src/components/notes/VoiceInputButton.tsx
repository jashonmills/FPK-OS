
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputButtonProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ 
  onTranscription, 
  placeholder = "voice input" 
}) => {
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { toast } = useToast();

  const handleVoiceInput = async () => {
    if (isRecording) {
      try {
        const transcription = await stopRecording();
        if (transcription) {
          onTranscription(transcription);
          toast({
            title: "🎤 Voice recorded",
            description: "Your speech has been converted to text!",
          });
        }
      } catch (error) {
        console.error('Voice recording error:', error);
        toast({
          title: "❌ Recording failed",
          description: "Could not process voice recording. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await startRecording();
        toast({
          title: "🎤 Recording started",
          description: "Speak now to add text via voice...",
        });
      } catch (error) {
        console.error('Microphone access error:', error);
        toast({
          title: "❌ Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleVoiceInput}
      disabled={isProcessing}
      className="shrink-0"
      title={isRecording ? "Stop recording" : `Start ${placeholder}`}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInputButton;
