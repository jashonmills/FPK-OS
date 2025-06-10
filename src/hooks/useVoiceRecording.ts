
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone');
    }
  };

  const stopRecording = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result?.toString().split(',')[1];
              
              if (!base64Audio) {
                throw new Error('Failed to convert audio to base64');
              }

              // Call speech-to-text edge function
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });

              if (error) {
                console.error('Speech-to-text error:', error);
                throw new Error('Failed to transcribe audio');
              }

              const transcription = data?.transcription || '';
              setIsProcessing(false);
              resolve(transcription);
            } catch (error) {
              console.error('Transcription error:', error);
              setIsProcessing(false);
              reject(error);
            }
          };

          reader.onerror = () => {
            setIsProcessing(false);
            reject(new Error('Failed to read audio file'));
          };

          reader.readAsDataURL(audioBlob);
        } catch (error) {
          setIsProcessing(false);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
      
      // Stop all tracks to release microphone
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
    });
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording
  };
};
