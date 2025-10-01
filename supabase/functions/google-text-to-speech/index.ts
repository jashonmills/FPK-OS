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
    const { text, voice, speakingRate, pitch } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    const apiKey = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Cloud TTS API key not configured')
    }

    console.log('Google TTS request:', { 
      textLength: text.length, 
      voice: voice || 'en-US-Journey-D',
      speakingRate: speakingRate || 1.0,
      pitch: pitch || 0
    })

    // Use Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voice?.split('-').slice(0, 2).join('-') || 'en-US',
            name: voice || 'en-US-Journey-D', // Journey voices are very natural
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speakingRate || 1.0,
            pitch: pitch || 0,
            effectsProfileId: ['small-bluetooth-speaker-class-device'],
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google TTS API error:', error)
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    const data = await response.json()
    
    if (!data.audioContent) {
      throw new Error('No audio content received from Google TTS')
    }

    console.log('Google TTS success, audio content length:', data.audioContent.length)

    return new Response(
      JSON.stringify({ audioContent: data.audioContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Google TTS error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
