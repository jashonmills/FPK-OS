
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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

      // Record in smaller chunks for faster processing
      mediaRecorder.start(1000); // 1 second intervals
      setIsRecording(true);
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
          
          // Convert to base64 more efficiently
          const arrayBuffer = await audioBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const base64Audio = btoa(String.fromCharCode(...uint8Array));

          console.log('Audio blob size:', audioBlob.size, 'bytes');
          console.log('Audio format:', mimeType);

          // Call improved speech-to-text function with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: { 
              audio: base64Audio,
              format: mimeType.includes('webm') ? 'webm' : 'wav'
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
          resolve(transcription);
        } catch (error) {
          console.error('Transcription error:', error);
          setIsProcessing(false);
          
          if (error.name === 'AbortError') {
            reject(new Error('Speech recognition timed out. Please try again.'));
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
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording
  };
};
