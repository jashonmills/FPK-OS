import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const SpeechToTextButton = ({ onTranscript, className }: SpeechToTextButtonProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Changed to false to avoid duplication
    recognition.interimResults = false; // Changed to false to only get final results
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        finalTranscriptRef.current = transcript;
        onTranscript(transcript);
        toast({
          title: "Speech converted!",
          description: "Your message has been transcribed",
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use speech-to-text",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Please try again and speak clearly",
          variant: "destructive",
        });
      } else if (event.error !== 'aborted') {
        toast({
          title: "Speech recognition error",
          description: "Please try again",
          variant: "destructive",
        });
      }
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
  }, [onTranscript, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        finalTranscriptRef.current = "";
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "🎤 Listening...",
          description: "Speak now. The recording will stop automatically when you're done.",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      onClick={toggleListening}
      className={cn(
        "transition-smooth",
        isListening && "animate-pulse",
        className
      )}
      title={isListening ? "Click to stop recording" : "Click to start recording"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
