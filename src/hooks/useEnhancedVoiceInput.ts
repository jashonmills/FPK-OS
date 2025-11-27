
import { useState, useRef, useCallback } from 'react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useEnhancedVoiceInput = () => {
  const [isNativeListening, setIsNativeListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [useNativeFirst, setUseNativeFirst] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
  // Fallback to existing MediaRecorder approach
  const mediaRecorderHook = useVoiceRecording();
  
  // Check if native Speech Recognition is supported
  const isNativeSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const startNativeRecognition = useCallback((onResult: (text: string) => void) => {
    if (!isNativeSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Falling back to audio recording...",
      });
      return false;
    }

    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRec();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsNativeListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          onResult(finalTranscript.trim());
          stopNativeRecognition();
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsNativeListening(false);
        
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast({
            title: "Microphone Permission Denied",
            description: "Please allow microphone access and try again.",
            variant: "destructive"
          });
        } else if (event.error === 'no-speech') {
          toast({
            title: "No Speech Detected",
            description: "Please try speaking again.",
          });
        } else {
          toast({
            title: "Speech Recognition Error",
            description: "There was an issue with speech recognition. Falling back to audio recording.",
          });
        }
      };

      recognition.onend = () => {
        setIsNativeListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start native speech recognition:', error);
      setIsNativeListening(false);
      return false;
    }
  }, [isNativeSupported, toast]);

  const stopNativeRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsNativeListening(false);
    setTranscript('');
  }, []);

  // Enhanced start recording that tries native first, then falls back
  const startRecording = useCallback(async (onResult: (text: string) => void) => {
    if (useNativeFirst && isNativeSupported) {
      const nativeStarted = startNativeRecognition(onResult);
      if (nativeStarted) return;
    }
    
    // Fallback to MediaRecorder approach
    try {
      await mediaRecorderHook.startRecording();
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [useNativeFirst, isNativeSupported, startNativeRecognition, mediaRecorderHook, toast]);

  const stopRecording = useCallback(async (): Promise<string> => {
    if (isNativeListening) {
      stopNativeRecognition();
      return transcript;
    } else {
      return await mediaRecorderHook.stopRecording();
    }
  }, [isNativeListening, stopNativeRecognition, transcript, mediaRecorderHook]);

  const cancelRecording = useCallback(() => {
    if (isNativeListening) {
      stopNativeRecognition();
    } else {
      mediaRecorderHook.cancelRecording();
    }
  }, [isNativeListening, stopNativeRecognition, mediaRecorderHook]);

  const isRecording = isNativeListening || mediaRecorderHook.isRecording;
  const isProcessing = mediaRecorderHook.isProcessing;

  return {
    isRecording,
    isProcessing,
    isNativeListening,
    transcript,
    startRecording,
    stopRecording,
    cancelRecording,
    isNativeSupported,
    useNativeFirst,
    setUseNativeFirst,
    // Pass through MediaRecorder properties for compatibility
    recordingDuration: mediaRecorderHook.recordingDuration,
    maxRecordingTime: mediaRecorderHook.maxRecordingTime,
    getRemainingTime: mediaRecorderHook.getRemainingTime,
    getFormattedDuration: mediaRecorderHook.getFormattedDuration,
    getFormattedRemainingTime: mediaRecorderHook.getFormattedRemainingTime
  };
};
