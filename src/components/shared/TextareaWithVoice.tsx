import { useState, forwardRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TextareaWithVoiceProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVoiceTranscript?: (transcript: string) => void;
}

export const TextareaWithVoice = forwardRef<HTMLTextAreaElement, TextareaWithVoiceProps>(({
  value,
  onChange,
  onVoiceTranscript,
  ...props
}, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            setIsTranscribing(true);
            toast.loading('Transcribing audio...', { id: 'transcription' });

            // Call the transcription edge function
            const { data, error } = await supabase.functions.invoke('transcribe-audio', {
              body: { audio: base64Audio },
            });

            if (error) throw error;

            if (data?.text) {
              // Append transcribed text to current value
              const newValue = value ? `${value}\n${data.text}` : data.text;
              
              // Create a synthetic event to trigger onChange
              if (onChange) {
                const syntheticEvent = {
                  target: { value: newValue },
                } as React.ChangeEvent<HTMLTextAreaElement>;
                onChange(syntheticEvent);
              }

              // Call optional callback
              if (onVoiceTranscript) {
                onVoiceTranscript(data.text);
              }

              toast.success('Audio transcribed successfully!', { id: 'transcription' });
            }
          } catch (error) {
            console.error('Transcription error:', error);
            toast.error('Failed to transcribe audio', { id: 'transcription' });
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <Textarea ref={ref} value={value} onChange={onChange} {...props} className="pr-12" />
      <Button
        type="button"
        size="icon"
        variant={isRecording ? 'destructive' : 'ghost'}
        className="absolute bottom-2 right-2"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
});

TextareaWithVoice.displayName = 'TextareaWithVoice';
