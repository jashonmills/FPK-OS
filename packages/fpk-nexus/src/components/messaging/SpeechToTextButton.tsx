import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AudioRecorder, blobToBase64 } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";

interface SpeechToTextButtonProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  disabled?: boolean;
}

export const SpeechToTextButton = ({ onTranscript, disabled }: SpeechToTextButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const lastClickTimeRef = useRef<number>(0);

  const toggleRecording = useCallback(async () => {
    // Debounce clicks
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      return;
    }
    lastClickTimeRef.current = now;

    if (isRecording) {
      // Stop recording and process
      setIsRecording(false);
      setIsProcessing(true);
      
      try {
        if (!recorderRef.current) return;
        
        const audioBlob = await recorderRef.current.stop();
        const base64Audio = await blobToBase64(audioBlob);
        
        toast.info("Transcribing audio...");
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });
        
        if (error) throw error;
        
        if (data?.text) {
          onTranscript(data.text, true);
          toast.success("Transcription complete");
        } else {
          toast.error("No transcription received");
        }
      } catch (error) {
        console.error('Transcription error:', error);
        toast.error("Failed to transcribe audio");
      } finally {
        setIsProcessing(false);
        recorderRef.current = null;
      }
    } else {
      // Start recording
      try {
        recorderRef.current = new AudioRecorder();
        await recorderRef.current.start();
        setIsRecording(true);
        toast.info("Recording...", {
          description: "Speak in any language. Click again to stop.",
          duration: 2000
        });
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast.error("Failed to access microphone");
        recorderRef.current = null;
      }
    }
  }, [isRecording, onTranscript]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            className="h-[28px] w-[60px] transition-all"
            disabled={disabled || isProcessing}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isProcessing ? (
            <p>Processing audio...</p>
          ) : isRecording ? (
            <p>Click to stop & transcribe</p>
          ) : (
            <p>Voice input (multi-language)</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
