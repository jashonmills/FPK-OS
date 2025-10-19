import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for text:', text.substring(0, 100) + '...')

    // Generate speech from text
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to generate speech';
      try {
        // Limit error response size to prevent stack overflow
        const errorText = await response.text();
        const truncatedError = errorText.substring(0, 500);
        const error = JSON.parse(truncatedError);
        console.error('OpenAI TTS error:', error);
        errorMessage = error.error?.message || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        console.error('Raw response status:', response.status, response.statusText);
      }
      throw new Error(errorMessage);
    }

    // Convert audio buffer to base64 - use standard approach without chunking for reliability
    const arrayBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    
    // Convert to base64 in one go for smaller audio files (TTS typically < 1MB)
    // This avoids character encoding issues from chunked processing
    const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    const base64Audio = btoa(binaryString);

    console.log('Speech generation successful, audio size:', bytes.length, 'bytes')

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Text-to-voice error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})