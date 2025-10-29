import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeechToTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (text: string) => void;
}

export const SpeechToTextDialog = ({ open, onOpenChange, onConfirm }: SpeechToTextDialogProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Get one result at a time
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      // Append the new result to existing transcript
      setTranscript(prev => {
        const newText = prev ? prev + ' ' + result : result;
        return newText;
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Try speaking again",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [toast]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak your message",
      });
    } catch (error: any) {
      if (error.message?.includes('already started')) {
        // Ignore if already running
        return;
      }
      console.error('Error starting recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
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
    if (isListening) {
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
            {isListening ? (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="animate-pulse"
              >
                <MicOff className="h-5 w-5 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                variant="default"
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Record
              </Button>
            )}
            {transcript && (
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
            <label className="text-sm font-medium">Transcript</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click Record and speak. Click Stop when done. You can record multiple times to add more text."
              className="min-h-[150px]"
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
