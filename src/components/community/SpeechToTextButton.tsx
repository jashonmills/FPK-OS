import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { pipeline } from "@huggingface/transformers";

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const SpeechToTextButton = ({ onTranscript, className }: SpeechToTextButtonProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriberRef = useRef<any>(null);

  const initializeTranscriber = async () => {
    if (transcriberRef.current) return;
    
    setIsInitializing(true);
    try {
      console.log("Initializing Whisper model...");
      transcriberRef.current = await pipeline(
        "automatic-speech-recognition",
        "onnx-community/whisper-tiny.en",
        { device: "webgpu" }
      );
      console.log("Whisper model loaded successfully");
    } catch (error) {
      console.error("Error loading Whisper model:", error);
      // Fallback to WASM if WebGPU fails
      try {
        transcriberRef.current = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny.en"
        );
        console.log("Whisper model loaded with WASM fallback");
      } catch (fallbackError) {
        console.error("Error loading Whisper model with fallback:", fallbackError);
        throw fallbackError;
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const startRecording = async () => {
    try {
      // Initialize model if not already done
      if (!transcriberRef.current) {
        await initializeTranscriber();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log("Processing audio blob, size:", audioBlob.size);
          
          // Convert blob to array buffer
          const arrayBuffer = await audioBlob.arrayBuffer();
          
          // Transcribe using Whisper
          const output = await transcriberRef.current(arrayBuffer);
          console.log("Transcription result:", output);
          
          if (output?.text) {
            onTranscript(output.text.trim());
            toast({
              title: "Transcription complete",
              description: "Your speech has been converted to text",
            });
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: "Transcription failed",
            description: "Please try again",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording...",
        description: "Click again when you're done speaking",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use speech-to-text",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const isLoading = isInitializing || isProcessing;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleRecording}
      disabled={isLoading}
      className={cn(
        "transition-smooth",
        isRecording && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        className
      )}
      title={isRecording ? "Stop recording" : isLoading ? "Loading..." : "Start speech-to-text"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
