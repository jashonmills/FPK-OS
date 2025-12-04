
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced base64 processing with streaming for larger files
function processBase64Stream(base64String: string): Uint8Array {
  try {
    // Process in chunks to handle larger files more efficiently
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks: Uint8Array[] = [];
    
    for (let i = 0; i < base64String.length; i += chunkSize) {
      const chunk = base64String.slice(i, i + chunkSize);
      const binaryString = atob(chunk);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }
      chunks.push(bytes);
    }
    
    // Combine all chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result;
  } catch (error) {
    console.error('Base64 decode error:', error);
    throw new Error('Invalid audio data format');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { audio, format = 'webm', duration = 0 } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing speech-to-text request:', { 
      format, 
      duration: `${duration}s`,
      audioLength: audio.length 
    });

    // Enhanced audio processing for longer recordings
    const binaryAudio = processBase64Stream(audio);
    console.log('Audio size:', binaryAudio.length, 'bytes');
    console.log('Duration:', duration, 'seconds');
    
    // Validate audio size (max ~25MB for Whisper API)
    const maxSizeBytes = 25 * 1024 * 1024;
    if (binaryAudio.length > maxSizeBytes) {
      throw new Error(`Audio file too large (${Math.round(binaryAudio.length / 1024 / 1024)}MB). Maximum size is 25MB.`);
    }
    
    // Determine mime type and file extension
    const mimeType = format.includes('webm') ? 'audio/webm' : 'audio/wav';
    const fileExtension = format.includes('webm') ? 'webm' : 'wav';
    
    // Prepare optimized form data with enhanced settings for longer audio
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType });
    formData.append('file', blob, `audio.${fileExtension}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Specify language for faster processing
    formData.append('response_format', 'json');
    formData.append('temperature', '0'); // More deterministic results
    
    // Add prompt for better accuracy with longer recordings
    if (duration > 30) {
      formData.append('prompt', 'This is a longer recording. Please transcribe all speech accurately.');
    }

    console.log('Sending to OpenAI Whisper API...');

    // Enhanced timeout for longer recordings
    const timeoutDuration = Math.max(30000, duration * 1000); // Minimum 30s, or 1s per recorded second
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    // Send to OpenAI Whisper with optimized settings
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI Whisper API error: ${response.status} - ${errorText}`);
      throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const processingTime = Date.now() - startTime;
    
    console.log(`Speech-to-text completed in ${processingTime}ms`);
    console.log('Transcription length:', result.text?.length || 0, 'characters');
    console.log('Transcription preview:', result.text?.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ 
        text: result.text,
        processing_time_ms: processingTime,
        audio_format: format,
        duration_seconds: duration,
        audio_size_bytes: binaryAudio.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Error in speech-to-text function (${processingTime}ms):`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        processing_time_ms: processingTime
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
