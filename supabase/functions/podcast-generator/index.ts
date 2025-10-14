import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PodcastRequest {
  conversationId: string;
  sessionId: string;
  transcript: Array<{ role: string; content: string }>;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, sessionId, transcript, userId }: PodcastRequest = await req.json();
    
    console.log('[PODCAST-PRODUCER] Analyzing conversation for Aha! moments...');
    
    // Step 1: Detect if there's an "Aha!" moment
    const ahaMoment = await detectAhaMoment(transcript);
    
    if (!ahaMoment.detected) {
      console.log('[PODCAST-PRODUCER] No Aha! moment detected');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No significant learning breakthrough detected' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[PODCAST-PRODUCER] Aha! moment detected:', ahaMoment.topic);

    // Step 2: Generate podcast script
    const script = await generatePodcastScript(transcript, ahaMoment);
    
    console.log('[PODCAST-PRODUCER] Script generated, creating audio with ElevenLabs...');

    // Step 3: Generate multi-speaker audio with ElevenLabs
    const audioBuffer = await generateMultiSpeakerAudio(script);

    // Step 4: Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `${userId}/${conversationId}_${Date.now()}.mp3`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('podcast-episodes')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('podcast-episodes')
      .getPublicUrl(fileName);

    console.log('[PODCAST-PRODUCER] Audio uploaded successfully');

    // Step 5: Create podcast episode record
    const { data: episode, error: dbError } = await supabase
      .from('podcast_episodes')
      .insert({
        user_id: userId,
        session_id: sessionId,
        topic: ahaMoment.topic,
        transcript_excerpt: script.excerpt,
        audio_url: publicUrl,
        duration_seconds: Math.ceil(audioBuffer.byteLength / 16000), // Rough estimate
        host_persona: 'BETTY',
        guest_persona: 'STUDENT',
        metadata: {
          conversation_id: conversationId,
          turns_analyzed: transcript.length,
          breakthrough_type: ahaMoment.type,
          generated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Failed to create episode record: ${dbError.message}`);
    }

    console.log('[PODCAST-PRODUCER] Episode created:', episode.id);

    // Step 6: Send real-time notification to frontend
    try {
      console.log('[PODCAST-PRODUCER] Sending real-time notification...');
      const notificationChannel = supabase.channel(`podcast_ready_${userId}`);
      await notificationChannel.send({
        type: 'broadcast',
        event: 'podcast_ready',
        payload: {
          episodeId: episode.id,
          topic: ahaMoment.topic,
          audioUrl: publicUrl,
          shareToken: episode.share_token
        }
      });
      console.log('[PODCAST-PRODUCER] Real-time notification sent');
    } catch (notificationError) {
      console.error('[PODCAST-PRODUCER] Failed to send notification:', notificationError);
      // Non-blocking - continue even if notification fails
    }

    // Step 7: Trigger Nite Owl presentation message
    const niteOwlMessage = await generateNiteOwlMessage(episode);

    return new Response(
      JSON.stringify({
        success: true,
        episode: {
          id: episode.id,
          audioUrl: publicUrl,
          shareToken: episode.share_token,
          topic: ahaMoment.topic
        },
        niteOwlPresentation: niteOwlMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[PODCAST-PRODUCER] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function detectAhaMoment(transcript: Array<{ role: string; content: string }>) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const conversationText = transcript
    .map(t => `${t.role}: ${t.content}`)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at identifying significant learning breakthroughs in educational conversations. 
          Analyze the transcript and determine if there's a clear "Aha!" moment where the student progresses from confusion to understanding.
          
          Return JSON with:
          - detected: boolean (true if significant breakthrough found)
          - topic: string (concise topic of the breakthrough)
          - type: string (e.g., "conceptual_understanding", "problem_solving", "connection_made")
          - confidence: number (0-1)
          - excerpt: string (the key exchange showing the breakthrough, max 3 turns)`
        },
        {
          role: 'user',
          content: conversationText
        }
      ],
      response_format: { type: "json_object" }
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generatePodcastScript(
  transcript: Array<{ role: string; content: string }>,
  ahaMoment: any
) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const conversationText = transcript
    .map(t => `${t.role}: ${t.content}`)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a podcast script writer for "FPK Learning Moments" - a podcast celebrating breakthrough moments in education.
          
          Create a natural, conversational podcast script with two speakers:
          - HOST (Betty): Warm, encouraging educator who guides the discussion
          - STUDENT: The learner who had the breakthrough
          
          Format the script as a natural conversation (30-60 seconds total) that:
          1. Opens with the HOST introducing the learning moment
          2. Has the STUDENT explain their initial confusion
          3. Shows the HOST asking the guiding question that led to the breakthrough
          4. Has the STUDENT express their "Aha!" moment
          5. Closes with the HOST celebrating the achievement
          
          Return JSON with:
          - script: Array of { speaker: "HOST" | "STUDENT", text: string }
          - excerpt: string (2-3 sentence summary for display)
          
          Keep it authentic and conversational - this should sound like a real moment, not scripted.`
        },
        {
          role: 'user',
          content: `Topic: ${ahaMoment.topic}\n\nOriginal Conversation:\n${conversationText}`
        }
      ],
      response_format: { type: "json_object" }
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateMultiSpeakerAudio(script: any): Promise<ArrayBuffer> {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  
  // Voice IDs
  const BETTY_VOICE = '21m00Tcm4TlvDq8ikWAM'; // Betty's voice ID
  const STUDENT_VOICE = 'SOYHLrjzK2X1ezoPC6cr'; // Student voice ID from user

  // Generate SSML-style script for ElevenLabs
  const audioSegments: ArrayBuffer[] = [];

  for (const line of script.script) {
    const voiceId = line.speaker === 'HOST' ? BETTY_VOICE : STUDENT_VOICE;
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: line.text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: line.speaker === 'HOST' ? 0.5 : 0.3,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${await response.text()}`);
    }

    const audioChunk = await response.arrayBuffer();
    audioSegments.push(audioChunk);
  }

  // Concatenate audio segments
  const totalLength = audioSegments.reduce((sum, seg) => sum + seg.byteLength, 0);
  const combinedAudio = new Uint8Array(totalLength);
  let offset = 0;

  for (const segment of audioSegments) {
    combinedAudio.set(new Uint8Array(segment), offset);
    offset += segment.byteLength;
  }

  return combinedAudio.buffer;
}

async function generateNiteOwlMessage(episode: any) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Nite Owl, the enthusiastic mascot of FPK Podcast. You're wise, playful, and love celebrating learning achievements.
          
          Generate a short, enthusiastic message (2-3 sentences) announcing this new podcast episode.
          Use phrases like "Hoo-hoo!" and maintain a warm, encouraging tone.
          Reference the topic briefly and invite the user to listen.`
        },
        {
          role: 'user',
          content: `Topic: ${episode.topic}`
        }
      ],
    }),
  });

  const data = await response.json();
  return {
    persona: 'NITE_OWL',
    content: data.choices[0].message.content,
    episodeId: episode.id,
    audioUrl: episode.audio_url,
    shareToken: episode.share_token
  };
}
