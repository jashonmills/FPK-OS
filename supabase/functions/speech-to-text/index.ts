
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Optimized base64 processing with streaming
function processBase64Stream(base64String: string): Uint8Array {
  try {
    // Use built-in atob for better performance
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
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
    const { audio, format = 'webm' } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing speech-to-text request, format:', format);

    // Process audio efficiently
    const binaryAudio = processBase64Stream(audio);
    console.log('Audio size:', binaryAudio.length, 'bytes');
    
    // Determine mime type and file extension
    const mimeType = format.includes('webm') ? 'audio/webm' : 'audio/wav';
    const fileExtension = format.includes('webm') ? 'webm' : 'wav';
    
    // Prepare optimized form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType });
    formData.append('file', blob, `audio.${fileExtension}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Specify language for faster processing
    formData.append('response_format', 'json');
    formData.append('temperature', '0'); // More deterministic results

    console.log('Sending to OpenAI Whisper API...');

    // Send to OpenAI Whisper with optimized settings
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI Whisper API error: ${response.status} - ${errorText}`);
      throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const processingTime = Date.now() - startTime;
    
    console.log(`Speech-to-text completed in ${processingTime}ms`);
    console.log('Transcription:', result.text);

    return new Response(
      JSON.stringify({ 
        text: result.text,
        processing_time_ms: processingTime,
        audio_format: format
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
