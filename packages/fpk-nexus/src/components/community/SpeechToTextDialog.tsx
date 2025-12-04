import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder, blobToBase64 } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";

interface SpeechToTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (text: string) => void;
}

export const SpeechToTextDialog = ({ open, onOpenChange, onConfirm }: SpeechToTextDialogProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recorderRef = useRef<AudioRecorder | null>(null);

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder();
      await recorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "🎤 Recording...",
        description: "Speak in any language",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      const audioBlob = await recorderRef.current.stop();
      const base64Audio = await blobToBase64(audioBlob);
      
      toast({
        title: "Transcribing...",
        description: "Processing your audio",
      });
      
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      
      if (data?.text) {
        setTranscript(prev => prev ? prev + ' ' + data.text : data.text);
        toast({
          title: "✓ Transcription complete",
        });
      } else {
        toast({
          title: "No speech detected",
          description: "Try speaking again",
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      recorderRef.current = null;
    }
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onConfirm(transcript.trim());
      setTranscript("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    setTranscript("");
    onOpenChange(false);
  };

  const handleClearTranscript = () => {
    setTranscript("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Speech to Text</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {isRecording ? (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="animate-pulse"
                disabled={isProcessing}
              >
                <MicOff className="h-5 w-5 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                variant="default"
                size="lg"
                disabled={isProcessing}
              >
                <Mic className="h-5 w-5 mr-2" />
                {isProcessing ? "Processing..." : "Record"}
              </Button>
            )}
            {transcript && !isRecording && !isProcessing && (
              <Button
                onClick={handleClearTranscript}
                variant="outline"
                size="lg"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transcript (Multi-language supported)</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click Record and speak in any language. Click Stop when done. You can record multiple times to add more text."
              className="min-h-[150px]"
              disabled={isProcessing}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!transcript.trim()}
          >
            <Check className="h-4 w-4 mr-2" />
            Insert Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
