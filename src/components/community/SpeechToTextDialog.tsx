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
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let newTranscript = '';
      
      // event.resultIndex tells us where the NEW results start
      // Only process from that point forward
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newTranscript += result[0].transcript + ' ';
        }
      }
      
      // Only append if we have new final text
      if (newTranscript.trim()) {
        setTranscript(prev => prev + newTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Please try speaking",
        });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
        title: "🎤 Recording started",
        description: "Speak now...",
      });
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Recording stopped",
        description: "You can now edit the text",
      });
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

  // Auto-start recording when dialog opens
  useEffect(() => {
    if (open && !isListening && !transcript) {
      setTimeout(() => startRecording(), 300);
    }
  }, [open]);

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
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                variant="default"
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transcript</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your speech will appear here... You can edit it before confirming."
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
