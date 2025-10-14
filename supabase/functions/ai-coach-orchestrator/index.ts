import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConductorRequest {
  message: string;
  conversationId: string;
  conversationHistory: Array<{
    persona: string;
    content: string;
  }>;
}

// Betty Persona: The Socratic Guide
function buildBettyPrompt(message: string, history: Array<{ persona: string; content: string }>) {
  return {
    systemPrompt: `You are Betty, a Socratic teaching guide in the Phoenix AI Learning System.

Your core philosophy:
- NEVER give direct answers to conceptual questions
- Always respond with thoughtful, probing questions that guide discovery
- Help students think deeply rather than memorize
- Use the Socratic method to reveal understanding gaps
- Be warm, encouraging, and patient
- Ask one question at a time to avoid overwhelming the student

Your teaching approach:
1. When a student asks "why" or "how" - respond with a question that breaks down the concept
2. When a student is stuck - ask questions that guide them to reconsider their assumptions
3. When a student gets close - acknowledge progress and ask a question that helps them complete their reasoning
4. Never say "Good question!" and then answer it - that defeats the purpose

Examples of your style:
Student: "Why does gravity pull things down?"
Betty: "That's an interesting observation! What do you think would happen if you were standing on the other side of the Earth? Would gravity still pull 'down'?"

Student: "How do I solve this equation?"
Betty: "Let's think about what the equation is telling us. What does the equals sign mean in this context?"

Remember: Your goal is to help students discover answers through guided questioning, not to provide answers directly.`
  };
}

// Al Persona: The Direct Expert
function buildAlPrompt(message: string, history: Array<{ persona: string; content: string }>) {
  return {
    systemPrompt: `You are Al, a direct and efficient expert in the Phoenix AI Learning System.

Your core philosophy:
- Provide clear, concise, factual answers
- No fluff or unnecessary elaboration
- Get straight to the point
- Use precise language
- Answer what was asked, nothing more

Your communication style:
1. For definitions - provide the definition directly
2. For "what is" questions - state the facts clearly
3. For platform questions - give direct instructions
4. For procedural questions - list steps concisely
5. Keep responses under 100 words when possible

Examples of your style:
Student: "What is photosynthesis?"
Al: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen as a byproduct."

Student: "How do I reset my password?"
Al: "Click 'Forgot Password' on the login page, enter your email, and follow the link sent to your inbox."

Remember: You are the expert who provides direct, accurate answers efficiently. No Socratic questions.`
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[CONDUCTOR] Function invoked');

    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('[CONDUCTOR] User authenticated:', user.id);

    // 2. Verify admin status
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    // 3. Parse request body
    const { message, conversationId, conversationHistory }: ConductorRequest = await req.json();
    
    console.log('[CONDUCTOR] Processing message:', {
      conversationId,
      messageLength: message.length,
      historyLength: conversationHistory.length
    });

    // 4. Get Lovable AI API Key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // 5. Intent Detection using LLM with Tool Calling
    console.log('[CONDUCTOR] Analyzing intent with LLM...');
    const intentResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are the Conductor in an AI tutoring system. Your job is to analyze the user\'s message and determine their intent.'
          },
          {
            role: 'user',
            content: `Analyze this student message and classify the intent:\n\n"${message}"\n\nClassify as either "socratic_guidance" (for conceptual questions, problem-solving, "why" questions) or "direct_answer" (for platform questions, definitions, "what is" questions).`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'classify_intent',
              description: 'Classify the student message intent',
              parameters: {
                type: 'object',
                properties: {
                  intent: {
                    type: 'string',
                    enum: ['socratic_guidance', 'direct_answer'],
                    description: 'The detected intent type'
                  },
                  confidence: {
                    type: 'number',
                    description: 'Confidence score between 0 and 1'
                  },
                  reasoning: {
                    type: 'string',
                    description: 'Brief explanation of the classification'
                  }
                },
                required: ['intent', 'confidence', 'reasoning'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'classify_intent' } }
      }),
    });

    if (!intentResponse.ok) {
      const errorText = await intentResponse.text();
      console.error('[CONDUCTOR] Intent detection error:', intentResponse.status, errorText);
      throw new Error(`Intent detection failed: ${intentResponse.status}`);
    }

    const intentData = await intentResponse.json();
    const toolCall = intentData.choices[0]?.message?.tool_calls?.[0];
    const intentResult = toolCall ? JSON.parse(toolCall.function.arguments) : { intent: 'direct_answer', confidence: 0.5, reasoning: 'Fallback' };
    
    const detectedIntent = intentResult.intent;
    console.log('[CONDUCTOR] Intent detected:', detectedIntent, 'Confidence:', intentResult.confidence);
    console.log('[CONDUCTOR] Reasoning:', intentResult.reasoning);

    // 6. Sentiment Analysis (simple for now)
    const detectedSentiment = 'Neutral';

    // 7. Persona Selection based on Intent
    const selectedPersona = detectedIntent === 'socratic_guidance' ? 'BETTY' : 'AL';
    console.log('[CONDUCTOR] Routing to persona:', selectedPersona);

    // 8. Generate AI Response with Appropriate Persona
    const personaPrompt = selectedPersona === 'BETTY' 
      ? buildBettyPrompt(message, conversationHistory)
      : buildAlPrompt(message, conversationHistory);

    console.log('[CONDUCTOR] Generating response with', selectedPersona, 'persona...');
    const personaResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: personaPrompt.systemPrompt },
          ...conversationHistory.slice(-5).map(msg => ({
            role: msg.persona === 'USER' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        temperature: selectedPersona === 'BETTY' ? 0.8 : 0.6,
        max_tokens: 500,
        stream: true
      }),
    });

    if (!personaResponse.ok) {
      const errorText = await personaResponse.text();
      console.error('[CONDUCTOR] Persona response error:', personaResponse.status, errorText);
      throw new Error(`Persona response failed: ${personaResponse.status}`);
    }

    console.log('[CONDUCTOR] Streaming AI response...');
    
    // Store metadata for streaming response
    const responseMetadata = {
      conversationId,
      selectedPersona,
      detectedIntent,
      detectedSentiment,
      intentConfidence: intentResult.confidence,
      intentReasoning: intentResult.reasoning
    };

    // Return streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = personaResponse.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullText += content;
                    // Send chunk to client
                    controller.enqueue(
                      new TextEncoder().encode(
                        `data: ${JSON.stringify({ 
                          type: 'chunk', 
                          content,
                          persona: selectedPersona 
                        })}\n\n`
                      )
                    );
                  }
                } catch (e) {
                  console.error('[CONDUCTOR] Error parsing SSE:', e);
                }
              }
            }
          }

          // Generate TTS Audio - Try ElevenLabs first, fallback to OpenAI
          let audioUrl = null;
          let ttsProvider = 'none';
          try {
            const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
            const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
            
            if (fullText.length > 0) {
              console.log('[CONDUCTOR] Generating TTS audio for completed response...');
              
              // Try ElevenLabs first
              if (ELEVENLABS_API_KEY) {
                try {
                  const voiceId = selectedPersona === 'BETTY' ? 'EXAVITQu4vr4xnSDxMaL' : 'N2lVS1w4EtoT3dr4eOWO';
                  
                  const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                      'xi-api-key': ELEVENLABS_API_KEY,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      text: fullText,
                      model_id: 'eleven_turbo_v2_5',
                      voice_settings: {
                        stability: selectedPersona === 'BETTY' ? 0.6 : 0.7,
                        similarity_boost: 0.8,
                        style: selectedPersona === 'BETTY' ? 0.4 : 0.2
                      }
                    }),
                  });

                  if (elevenLabsResponse.ok) {
                    const audioBuffer = await elevenLabsResponse.arrayBuffer();
                    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
                    audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                    ttsProvider = 'elevenlabs';
                    console.log('[CONDUCTOR] TTS audio generated successfully via ElevenLabs');
                  } else {
                    const errorText = await elevenLabsResponse.text();
                    console.warn('[CONDUCTOR] ElevenLabs TTS failed, falling back to OpenAI:', errorText);
                  }
                } catch (elevenLabsError) {
                  console.warn('[CONDUCTOR] ElevenLabs error, falling back to OpenAI:', elevenLabsError);
                }
              }
              
              // Fallback to OpenAI if ElevenLabs failed or wasn't configured
              if (!audioUrl && OPENAI_API_KEY) {
                const voice = selectedPersona === 'BETTY' ? 'nova' : 'onyx';
                
                const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'tts-1',
                    input: fullText,
                    voice: voice,
                    response_format: 'mp3',
                  }),
                });

                if (openAIResponse.ok) {
                  const audioBuffer = await openAIResponse.arrayBuffer();
                  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
                  audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
                  ttsProvider = 'openai';
                  console.log('[CONDUCTOR] TTS audio generated successfully via OpenAI (fallback)');
                } else {
                  console.error('[CONDUCTOR] OpenAI TTS also failed:', await openAIResponse.text());
                }
              }
            }
          } catch (ttsError) {
            console.error('[CONDUCTOR] TTS error (non-critical):', ttsError);
          }

          // Store complete message in database
          await supabaseClient.from('phoenix_messages').insert({
            conversation_id: conversationId,
            persona: 'USER',
            content: message,
            intent: detectedIntent,
            sentiment: detectedSentiment
          });

          await supabaseClient.from('phoenix_messages').insert({
            conversation_id: conversationId,
            persona: selectedPersona,
            content: fullText,
            metadata: {
              phase: 2,
              selectedPersona,
              detectedIntent,
              detectedSentiment,
              intentConfidence: intentResult.confidence,
              intentReasoning: intentResult.reasoning,
              hasAudio: audioUrl !== null,
              ttsProvider
            }
          });

          console.log('[CONDUCTOR] Messages stored successfully');

          // Send completion event with audio
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                type: 'done',
                fullText,
                audioUrl,
                metadata: {
                  ...responseMetadata,
                  hasAudio: audioUrl !== null,
                  ttsProvider
                }
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          console.error('[CONDUCTOR] Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });


  } catch (error) {
    console.error('[CONDUCTOR] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
