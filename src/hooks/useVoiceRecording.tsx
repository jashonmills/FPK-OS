import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_RECORDING_TIME = 120; // 2 minutes max

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { toast } = useToast();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
      startTimeRef.current = Date.now();
      setRecordingDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingDuration(elapsed);
        
        // Auto-stop at max time
        if (elapsed >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 1000);

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
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

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

  const cancelRecording = useCallback(() => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop media recorder without processing
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
    setRecordingDuration(0);
  }, [isRecording]);

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
    setRecordingDuration(0);
  }, []);

  const getRemainingTime = useCallback(() => {
    return MAX_RECORDING_TIME - recordingDuration;
  }, [recordingDuration]);

  const getFormattedDuration = useCallback(() => {
    const mins = Math.floor(recordingDuration / 60);
    const secs = recordingDuration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [recordingDuration]);

  const getFormattedRemainingTime = useCallback(() => {
    const remaining = MAX_RECORDING_TIME - recordingDuration;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [recordingDuration]);

  return {
    isRecording,
    isProcessing,
    audioLevel,
    recordingDuration,
    maxRecordingTime: MAX_RECORDING_TIME,
    startRecording,
    stopRecording,
    cancelRecording,
    cleanup,
    getRemainingTime,
    getFormattedDuration,
    getFormattedRemainingTime
  };
};