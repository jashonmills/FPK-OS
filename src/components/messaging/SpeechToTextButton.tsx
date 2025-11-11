import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isStoppingRef = useRef(false);
  const finalTranscriptRef = useRef<string>("");
  const silenceTimerRef = useRef<NodeJS.Timeout>();
  const onTranscriptRef = useRef(onTranscript);

  // Keep onTranscriptRef updated without recreating the recognition instance
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const cleanup = useCallback(() => {
    console.log('[SpeechToText] Cleanup called');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = undefined;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('[SpeechToText] Recognition stopped');
      } catch (e) {
        console.log('[SpeechToText] Recognition already stopped');
      }
    }
    isStoppingRef.current = false;
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    console.log('[SpeechToText] Creating new recognition instance');
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[SpeechToText] Recognition started');
      setIsListening(true);
      setIsInitializing(false);
      isStoppingRef.current = false;
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (event: any) => {
      console.log('[SpeechToText] Got result');
      // Reset silence timer on new speech
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      let currentFinalTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinalTranscript += transcript + ' ';
        }
      }

      if (currentFinalTranscript) {
        finalTranscriptRef.current += currentFinalTranscript;
        onTranscriptRef.current(currentFinalTranscript.trim());
      }

      // Auto-stop after 2 seconds of silence
      silenceTimerRef.current = setTimeout(() => {
        // Check if recognition is still active instead of relying on captured isListening value
        if (recognitionRef.current && !isStoppingRef.current) {
          console.log('[SpeechToText] Auto-stopping due to silence');
          cleanup();
          setIsListening(false);
          if (finalTranscriptRef.current.trim()) {
            toast.success("Transcription complete");
          }
        }
      }, 2000);
    };

    recognition.onerror = (event: any) => {
      console.error('[SpeechToText] Recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied");
        setIsListening(false);
        setIsInitializing(false);
      } else if (event.error === 'no-speech') {
        // Silently handle no-speech, let silence timer handle it
      } else if (event.error !== 'aborted') {
        toast.error("Speech recognition error");
        setIsListening(false);
        setIsInitializing(false);
      }
    };

    recognition.onend = () => {
      console.log('[SpeechToText] Recognition ended');
      if (!isStoppingRef.current) {
        setIsListening(false);
        setIsInitializing(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      console.log('[SpeechToText] Component unmounting, cleaning up');
      cleanup();
    };
  }, [cleanup]);

  const toggleListening = useCallback(() => {
    // Prevent rapid clicks
    if (isInitializing) {
      console.log('[SpeechToText] Still initializing, ignoring click');
      return;
    }
    
    if (!recognitionRef.current) {
      toast.error("Speech recognition not available", {
        description: "Please use Chrome, Edge, or Safari"
      });
      return;
    }

    if (isListening) {
      console.log('[SpeechToText] User clicked stop');
      isStoppingRef.current = true;
      cleanup();
      setIsListening(false);
      if (finalTranscriptRef.current.trim()) {
        toast.success("Transcription saved");
      }
    } else {
      console.log('[SpeechToText] User clicked start');
      setIsInitializing(true);
      try {
        recognitionRef.current.start();
        toast.info("Listening...", {
          description: "Speak clearly into your microphone",
          duration: 1500
        });
      } catch (error) {
        console.error('[SpeechToText] Failed to start recognition:', error);
        setIsInitializing(false);
        toast.error("Failed to start microphone");
      }
    }
  }, [isListening, isInitializing, cleanup]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className="h-[28px] w-[60px] transition-all"
            disabled={disabled || isInitializing}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInitializing ? (
            <p>Starting microphone...</p>
          ) : isListening ? (
            <p>Click to stop • Auto-stops after silence</p>
          ) : (
            <p>Voice input</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
