import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data availability
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Set up audio level monitoring
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      const updateLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [isRecording, toast]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        setAudioLevel(0);

        // Cancel any existing transcription request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
          // Create blob from recorded chunks
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
          );

          // Send to Supabase function with timeout (15 seconds)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transcription timeout')), 15000)
          );

          const transcriptionPromise = supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio },
            signal: abortControllerRef.current.signal
          });

          const { data, error } = await Promise.race([
            transcriptionPromise,
            timeoutPromise
          ]) as any;

          if (error) throw error;

          const transcript = data?.text || '';
          
          if (transcript.trim()) {
            toast({
              title: "Voice Transcribed",
              description: `"${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
            });
          } else {
            toast({
              title: "No Speech Detected",
              description: "Try speaking more clearly or closer to the microphone",
              variant: "destructive"
            });
          }

          resolve(transcript);

        } catch (error: any) {
          console.error('Error processing audio:', error);
          
          // Check if it was a timeout or abort
          if (error.message === 'Transcription timeout') {
            toast({
              title: "Transcription Timeout",
              description: "The recording took too long to process. Try a shorter recording.",
              variant: "destructive"
            });
          } else if (error.name === 'AbortError') {
            console.log('🚫 Transcription cancelled');
          } else {
            toast({
              title: "Transcription Error",
              description: "Could not convert speech to text. Try again.",
              variant: "destructive"
            });
          }
          resolve(null);
        } finally {
          setIsProcessing(false);
          abortControllerRef.current = null;
          cleanup();
        }
      };

      mediaRecorder.stop();
    });
  }, [isRecording, toast]);

  const cleanup = useCallback(() => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset refs
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    
    // Reset state
    setIsRecording(false);
    setIsProcessing(false);
    setAudioLevel(0);
  }, []);

  return {
    isRecording,
    isProcessing,
    audioLevel,
    startRecording,
    stopRecording,
    cleanup
  };
};