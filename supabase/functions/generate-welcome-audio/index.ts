import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeAudioRequest {
  text: string;
  persona: 'AL' | 'BETTY';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, persona }: WelcomeAudioRequest = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log(`[WELCOME-AUDIO] Generating audio for ${persona}:`, text.substring(0, 50) + '...')

    // Try ElevenLabs first
    const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (elevenLabsKey) {
      try {
        // Betty = Sarah (warm, encouraging), Al = Callum (direct, efficient)
        const voiceId = persona === 'BETTY' ? 'EXAVITQu4vr4xnSDxMaL' : 'N2lVS1w4EtoT3dr4eOWO'
        
        console.log(`[WELCOME-AUDIO] Attempting ElevenLabs with voice ${voiceId}`)
        
        const elevenLabsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': elevenLabsKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_turbo_v2_5',
              voice_settings: {
                stability: persona === 'BETTY' ? 0.6 : 0.7,
                similarity_boost: 0.8,
                style: persona === 'BETTY' ? 0.4 : 0.2,
              },
            }),
          }
        )

        if (elevenLabsResponse.ok) {
          const audioBuffer = await elevenLabsResponse.arrayBuffer()
          const base64Audio = btoa(
            String.fromCharCode(...new Uint8Array(audioBuffer))
          )
          
          console.log(`[WELCOME-AUDIO] ✅ ElevenLabs success (${audioBuffer.byteLength} bytes)`)
          
          return new Response(
            JSON.stringify({ 
              audioContent: base64Audio,
              provider: 'elevenlabs'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        } else {
          const errorText = await elevenLabsResponse.text()
          console.warn(`[WELCOME-AUDIO] ElevenLabs failed (${elevenLabsResponse.status}):`, errorText)
        }
      } catch (elevenLabsError) {
        console.warn('[WELCOME-AUDIO] ElevenLabs error:', elevenLabsError)
      }
    } else {
      console.warn('[WELCOME-AUDIO] ELEVENLABS_API_KEY not configured')
    }

    // Fallback to OpenAI TTS
    console.log('[WELCOME-AUDIO] Falling back to OpenAI TTS')
    
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('No TTS provider available (missing API keys)')
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: persona === 'BETTY' ? 'nova' : 'onyx',
        response_format: 'mp3',
      }),
    })

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      console.error('[WELCOME-AUDIO] OpenAI TTS failed:', errorText)
      throw new Error(`OpenAI TTS failed: ${openAIResponse.status}`)
    }

    const audioBuffer = await openAIResponse.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    )

    console.log(`[WELCOME-AUDIO] ✅ OpenAI TTS success (${audioBuffer.byteLength} bytes)`)

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        provider: 'openai'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[WELCOME-AUDIO] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
