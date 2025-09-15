import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const maxRecordingTime = 60; // seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000, // Lower sample rate for better compatibility
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Check supported MIME types and use the best available
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        } else {
          mimeType = ''; // Use default
        }
      }

      console.log('Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= maxRecordingTime) {
            // Auto-stop when max time reached
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available, size:', event.data.size);
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      // Start with larger intervals to ensure we get data
      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      
      console.log('Recording started with type:', mediaRecorder.mimeType);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  }, [maxRecordingTime]);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsProcessing(true);
          
          console.log('Recording stopped, chunks collected:', chunksRef.current.length);
          
          // Check if we have any audio data
          if (chunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }
          
          // Get the recorded MIME type
          const recordedMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          console.log('Recorded MIME type:', recordedMimeType);
          
          // Create audio blob with proper type
          const audioBlob = new Blob(chunksRef.current, { type: recordedMimeType });
          console.log('Audio blob created, size:', audioBlob.size, 'type:', audioBlob.type);

          // Validate minimum audio size (should be at least a few KB for meaningful audio)
          if (audioBlob.size < 1000) {
            throw new Error(`Audio recording too short or corrupted (${audioBlob.size} bytes). Please try recording for at least 1-2 seconds.`);
          }

          // Convert to base64
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              console.log('Base64 audio length:', base64Audio.length);
              
              if (!base64Audio || base64Audio.length < 100) {
                throw new Error('Audio conversion failed - no valid data');
              }
              
              // Send to Supabase Edge Function for transcription
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { 
                  audio: base64Audio,
                  mimeType: recordedMimeType 
                }
              });

              if (error) {
                console.error('Transcription error:', error);
                reject(new Error('Transcription failed: ' + error.message));
                return;
              }

              console.log('Transcription result:', data);
              setIsProcessing(false);
              setRecordingDuration(0);
              resolve(data.text || '');
            } catch (transcriptionError) {
              console.error('Transcription processing error:', transcriptionError);
              setIsProcessing(false);
              setRecordingDuration(0);
              reject(transcriptionError);
            }
          };

          reader.onerror = () => {
            setIsProcessing(false);
            setRecordingDuration(0);
            reject(new Error('Failed to process audio file'));
          };

          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Stop recording error:', error);
          setIsProcessing(false);
          setRecordingDuration(0);
          reject(error);
        }
      };

      // Stop recording
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      chunksRef.current = [];
    });
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingDuration(0);
      chunksRef.current = [];
      console.log('Recording cancelled');
    }
  }, [isRecording]);

  const getRemainingTime = useCallback(() => {
    return Math.max(0, maxRecordingTime - recordingDuration);
  }, [maxRecordingTime, recordingDuration]);

  const getFormattedDuration = useCallback(() => {
    const minutes = Math.floor(recordingDuration / 60);
    const seconds = recordingDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [recordingDuration]);

  const getFormattedRemainingTime = useCallback(() => {
    const remaining = getRemainingTime();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [getRemainingTime]);

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