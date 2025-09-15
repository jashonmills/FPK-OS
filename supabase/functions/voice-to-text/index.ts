import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, mimeType } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log('Processing voice transcription request...')
    console.log('Audio data length:', audio.length)
    console.log('MIME type:', mimeType || 'not specified')

    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio)
    console.log('Processed audio data:', binaryAudio.length, 'bytes')
    
    // Validate audio size
    if (binaryAudio.length < 1000) {
      throw new Error(`Audio data too small: ${binaryAudio.length} bytes. This likely indicates a recording error.`)
    }
    
    // Determine file extension and type based on mimeType
    let filename = 'audio.webm';
    let blobType = 'audio/webm';
    
    if (mimeType) {
      if (mimeType.includes('mp4')) {
        filename = 'audio.mp4';
        blobType = 'audio/mp4';
      } else if (mimeType.includes('wav')) {
        filename = 'audio.wav';
        blobType = 'audio/wav';
      } else if (mimeType.includes('ogg')) {
        filename = 'audio.ogg';
        blobType = 'audio/ogg';
      }
      // Default to webm for opus codec
    }
    
    console.log('Using filename:', filename, 'blob type:', blobType)
    
    // Prepare form data
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: blobType })
    formData.append('file', blob, filename)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')

    console.log('Sending to OpenAI with blob size:', blob.size)

    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${errorText}`)
    }

    const result = await response.json()
    console.log('Transcription successful:', result.text)

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice-to-text error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})