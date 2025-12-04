import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GOOGLE_CLOUD_TTS_API_KEY = Deno.env.get('GOOGLE_CLOUD_TTS_API_KEY');

// The official "Showtime" script with SSML voice tags
const SHOWTIME_SSML = `<speak>
  <voice name="en-US-Wavenet-J">
    Alright, let's kick this thing off! Nite Owl's in the house to get the session started. We've got a great show for you tonight!
  </voice>
  <break time="500ms"/>
  <voice name="en-US-Wavenet-J">
    First up, put your hands together for your Socratic guide, the one and only, Betty!
  </voice>
  <break time="300ms"/>
  <voice name="en-US-Wavenet-F">
    Thank you, Nite Owl. It's wonderful to be here. When you're ready to explore the 'why,' I'll be here to help you find the answers within.
  </voice>
  <break time="300ms"/>
  <voice name="en-US-Wavenet-J">
    And on lead facts, we've got the master of the direct answer, the ever-efficient, Al!
  </voice>
  <break time="300ms"/>
  <voice name="en-US-Wavenet-D">
    Greetings. When you require a direct answer, I will provide it.
  </voice>
  <break time="300ms"/>
  <voice name="en-US-Wavenet-J">
    There you have it—your all-star lineup! I've gotta fly the coop and get back to the studio, but you're in great hands. Now, let's make some magic happen!
  </voice>
</speak>`;

async function generateShowtimeAudio() {
  console.log('🎬 Generating Showtime Welcome Audio...');
  
  if (!GOOGLE_CLOUD_TTS_API_KEY) {
    console.error('❌ GOOGLE_CLOUD_TTS_API_KEY environment variable not set');
    Deno.exit(1);
  }
  
  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml: SHOWTIME_SSML },  // ← KEY: Use 'ssml' not 'text'
          voice: { languageCode: 'en-US' },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google TTS failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    
    // Save base64 audio to file
    const audioBase64 = data.audioContent;
    await Deno.writeTextFile(
      './welcome_dialogue_trio_base64.txt',
      audioBase64
    );
    
    // Also decode and save as .mp3
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    await Deno.writeFile('./welcome_dialogue_trio.mp3', audioBytes);
    
    console.log('✅ Audio generated successfully!');
    console.log('📁 Files created:');
    console.log('   - welcome_dialogue_trio.mp3 (ready for upload to Supabase Storage)');
    console.log('   - welcome_dialogue_trio_base64.txt (for verification)');
    console.log('');
    console.log('📤 Next steps:');
    console.log('   1. Upload welcome_dialogue_trio.mp3 to Supabase Storage (audio_assets bucket)');
    console.log('   2. Make the file public');
    console.log('   3. Copy the public URL and update PhoenixLab.tsx WELCOME_MESSAGES');
    
  } catch (error) {
    console.error('❌ Error:', error);
    Deno.exit(1);
  }
}

generateShowtimeAudio();
