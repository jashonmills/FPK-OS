import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeAudioRequest {
  text: string;
  persona: 'AL' | 'BETTY' | 'NITE_OWL';
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

    // Feature flags for TTS providers
    const isGoogleEnabled = Deno.env.get('TTS_PROVIDER_GOOGLE_ENABLED') === 'true';
    const isElevenLabsEnabled = Deno.env.get('TTS_PROVIDER_ELEVENLABS_ENABLED') !== 'false';
    const isOpenAIEnabled = Deno.env.get('TTS_PROVIDER_OPENAI_ENABLED') !== 'false';
    
    const googleKey = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY');
    const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY');
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    
    let audioContent = null;
    let provider = null;

    // Try Google Cloud TTS first (if enabled)
    if (isGoogleEnabled && googleKey && !audioContent) {
      try {
        const googleVoice = persona === 'BETTY' 
          ? 'en-US-Wavenet-F'
          : persona === 'NITE_OWL'
          ? 'en-US-Wavenet-E'
          : 'en-US-Wavenet-D';
        
        console.log(`[WELCOME-AUDIO] Attempting Google TTS with voice ${googleVoice}`)
        
        const googleResponse = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: { text },
              voice: { languageCode: 'en-US', name: googleVoice },
              audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 },
            }),
          }
        );
        
        if (googleResponse.ok) {
          const data = await googleResponse.json();
          if (data.audioContent) {
            audioContent = data.audioContent;
            provider = 'google';
            console.log(`[WELCOME-AUDIO] ✅ Google Cloud TTS success`);
          }
        } else {
          console.warn(`[WELCOME-AUDIO] Google TTS failed (${googleResponse.status})`);
        }
      } catch (googleError) {
        console.warn('[WELCOME-AUDIO] Google TTS error:', googleError);
      }
    }

    // Try ElevenLabs (if enabled and Google failed)
    if (isElevenLabsEnabled && elevenLabsKey && !audioContent) {
      try {
        // Voice mapping: Betty, Al, Nite Owl (Al voice ID corrected for consistency)
        const voiceId = persona === 'BETTY' 
          ? 'uYXf8XasLslADfZ2MB4u' 
          : persona === 'NITE_OWL'
          ? 'wo6udizrrtpIxWGp2qJk'
          : 'wo6udizrrtpIxWGp2qJk';
        
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
          
          // Convert to base64 in chunks to avoid stack overflow
          const uint8Array = new Uint8Array(audioBuffer)
          let binaryString = ''
          const chunkSize = 8192
          
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
            binaryString += String.fromCharCode.apply(null, Array.from(chunk))
          }
          
          audioContent = btoa(binaryString)
          provider = 'elevenlabs'
          
          console.log(`[WELCOME-AUDIO] ✅ ElevenLabs success (${audioBuffer.byteLength} bytes)`)
        } else {
          const errorText = await elevenLabsResponse.text()
          console.warn(`[WELCOME-AUDIO] ElevenLabs failed (${elevenLabsResponse.status}):`, errorText)
        }
      } catch (elevenLabsError) {
        console.warn('[WELCOME-AUDIO] ElevenLabs error:', elevenLabsError)
      }
    }

    // Fallback to OpenAI TTS (if enabled and both Google and ElevenLabs failed)
    if (isOpenAIEnabled && openAIKey && !audioContent) {
      console.log('[WELCOME-AUDIO] Falling back to OpenAI TTS')
      
      const voice = persona === 'BETTY' 
        ? 'nova' 
        : persona === 'NITE_OWL'
        ? 'shimmer'
        : 'onyx';
      
      const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          response_format: 'mp3',
        }),
      })

      if (openAIResponse.ok) {
        const audioBuffer = await openAIResponse.arrayBuffer()
        
        // Convert to base64 in chunks to avoid stack overflow
        const uint8Array = new Uint8Array(audioBuffer)
        let binaryString = ''
        const chunkSize = 8192
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
          binaryString += String.fromCharCode.apply(null, Array.from(chunk))
        }
        
        audioContent = btoa(binaryString)
        provider = 'openai'
        
        console.log(`[WELCOME-AUDIO] ✅ OpenAI TTS success (${audioBuffer.byteLength} bytes)`)
      } else {
        const errorText = await openAIResponse.text()
        console.error('[WELCOME-AUDIO] OpenAI TTS failed:', errorText)
      }
    }
    
    // Return audio if any provider succeeded
    if (audioContent && provider) {
      return new Response(
        JSON.stringify({ 
          audioContent,
          provider
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // All providers failed
    throw new Error('No TTS provider available or all providers failed')
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
