
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRecordingTime = 60; // 60 seconds

  // Timer effect for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          // Auto-stop at 60 seconds
          if (newDuration >= maxRecordingTime) {
            // Stop recording safely without circular dependency
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return maxRecordingTime;
          }
          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Request high-quality audio for better transcription
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for speech recognition
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      
      // Use webm codec for better compression and quality
      const options = {
        mimeType: 'audio/webm;codecs=opus'
      };
      
      // Fallback for browsers that don't support webm
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/wav';
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Record in smaller chunks for better memory management
      mediaRecorder.start(500); // 500ms intervals for smoother recording
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !streamRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        try {
          // Stop all tracks immediately to release microphone
          streamRef.current?.getTracks().forEach(track => track.stop());
          streamRef.current = null;

          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          console.log('Audio blob size:', audioBlob.size, 'bytes');
          console.log('Recording duration:', recordingDuration, 'seconds');
          console.log('Audio format:', mimeType);

          // Enhanced base64 conversion for larger files
          const arrayBuffer = await audioBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Process in chunks to prevent memory issues with large files
          const chunkSize = 1024 * 1024; // 1MB chunks
          let base64Audio = '';
          
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            const chunkString = String.fromCharCode(...chunk);
            base64Audio += btoa(chunkString);
          }

          // Call enhanced speech-to-text function with extended timeout for longer audio
          const controller = new AbortController();
          const timeoutDuration = Math.max(20000, recordingDuration * 1000); // Minimum 20s, or 1s per recorded second
          const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: { 
              audio: base64Audio,
              format: mimeType.includes('webm') ? 'webm' : 'wav',
              duration: recordingDuration
            }
          });

          clearTimeout(timeoutId);

          if (error) {
            console.error('Speech-to-text error:', error);
            throw new Error(`Failed to transcribe audio: ${error.message}`);
          }

          const transcription = data?.text || '';
          console.log('Transcription result:', transcription);
          
          setIsProcessing(false);
          setRecordingDuration(0);
          
          // Clear audio chunks to free memory
          audioChunksRef.current = [];
          
          resolve(transcription);
        } catch (error) {
          console.error('Transcription error:', error);
          setIsProcessing(false);
          setRecordingDuration(0);
          audioChunksRef.current = [];
          
          if (error.name === 'AbortError') {
            reject(new Error('Speech recognition timed out. Please try again with a shorter recording.'));
          } else {
            reject(error);
          }
        }
      };

      mediaRecorderRef.current.stop();
    });
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsRecording(false);
      setIsProcessing(false);
      setRecordingDuration(0);
      audioChunksRef.current = [];
    }
  };

  const getRemainingTime = () => {
    return Math.max(0, maxRecordingTime - recordingDuration);
  };

  const getFormattedDuration = () => {
    const minutes = Math.floor(recordingDuration / 60);
    const seconds = recordingDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getFormattedRemainingTime = () => {
    const remaining = getRemainingTime();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    isProcessing,
    recordingDuration,
    maxRecordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
    getRemainingTime,
    getFormattedDuration,
    getFormattedRemainingTime
  };
};
