import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const SpeechToTextButton = ({ onTranscript, disabled }: SpeechToTextButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef<string>("");

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      interimTranscriptRef.current = "";
      toast.info("Listening... Speak now", {
        description: "Click the microphone again to stop",
        duration: 2000,
      });
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
      
      interimTranscriptRef.current = interimTranscript;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied", {
          description: "Please allow microphone access in your browser settings"
        });
      } else if (event.error === 'no-speech') {
        toast.info("No speech detected", {
          description: "Try speaking closer to your microphone"
        });
      } else {
        toast.error("Speech recognition error", {
          description: event.error
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interimTranscriptRef.current) {
        onTranscript(interimTranscriptRef.current.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported", {
        description: "Please use Chrome, Edge, or Safari browser"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      toast.success("Transcription complete!");
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className="h-[28px] w-[60px]"
            disabled={disabled}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isListening ? (
            <p>Click to stop listening</p>
          ) : (
            <p>Click to start voice input</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
