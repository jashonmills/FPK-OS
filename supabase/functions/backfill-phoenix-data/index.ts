import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[BACKFILL] Starting backfill for user:', user_id);

    // Step 1: Fetch all historical coach_sessions
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('coach_sessions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true });

    if (sessionsError) {
      throw sessionsError;
    }

    console.log('[BACKFILL] Found', sessions?.length || 0, 'historical sessions');

    let totalMessagesBackfilled = 0;
    let totalOutcomesExtracted = 0;
    let totalMemoriesExtracted = 0;

    // Step 2: Process each session
    for (const session of sessions || []) {
      const sessionData = session.session_data as any;
      const messages = sessionData?.messages || [];
      
      if (messages.length === 0) {
        console.log('[BACKFILL] Skipping empty session:', session.id);
        continue;
      }

      console.log('[BACKFILL] Processing session:', session.id, 'with', messages.length, 'messages');

      // Step 2a: Create or get phoenix_conversations record
      let conversationUuid: string;
      
      const { data: existingConv } = await supabaseClient
        .from('phoenix_conversations')
        .select('id')
        .eq('session_id', session.id)
        .maybeSingle();
      
      if (existingConv) {
        conversationUuid = existingConv.id;
        console.log('[BACKFILL] Using existing conversation:', conversationUuid);
      } else {
        const { data: newConv, error: createError } = await supabaseClient
          .from('phoenix_conversations')
          .insert({
            user_id: session.user_id,
            session_id: session.id,
            created_at: session.created_at,
            metadata: {
              backfilled: true,
              originalSource: 'coach_sessions'
            }
          })
          .select('id')
          .single();
        
        if (createError || !newConv) {
          console.error('[BACKFILL] Failed to create conversation:', createError);
          continue;
        }
        
        conversationUuid = newConv.id;
        console.log('[BACKFILL] Created new conversation:', conversationUuid);
      }

      // Step 2b: Insert all messages into phoenix_messages
      for (const msg of messages) {
        const { error: msgError } = await supabaseClient
          .from('phoenix_messages')
          .insert({
            conversation_id: conversationUuid,
            persona: msg.role === 'user' ? 'USER' : (msg.persona || 'AL'),
            content: msg.content,
            created_at: session.created_at, // Use session timestamp
            metadata: {
              backfilled: true,
              originalSessionId: session.id
            }
          });
        
        if (msgError) {
          console.error('[BACKFILL] Error inserting message:', msgError);
        } else {
          totalMessagesBackfilled++;
        }
      }

      // Step 2c: Extract learning outcomes and memories from conversation
      if (messages.length >= 4) {
        console.log('[BACKFILL] Extracting outcomes and memories for session:', session.id);
        
        const transcript = messages
          .map((msg: any) => `${msg.role === 'user' ? 'USER' : msg.persona || 'AL'}: ${msg.content}`)
          .join('\n\n');

        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (!LOVABLE_API_KEY) {
          console.warn('[BACKFILL] No LOVABLE_API_KEY - skipping extraction');
          continue;
        }

        try {
          const extractionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  content: `Extract learning outcomes and memories from this conversation transcript. Focus on what the student learned and key moments worth remembering.`
                },
                {
                  role: 'user',
                  content: `Analyze this conversation:\n\n${transcript}`
                }
              ],
              tools: [
                {
                  type: 'function',
                  function: {
                    name: 'extract_data',
                    description: 'Extract memories and learning outcomes',
                    parameters: {
                      type: 'object',
                      properties: {
                        memories: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              memory_type: { type: 'string', enum: ['commitment', 'confusion', 'breakthrough', 'question', 'preference', 'goal', 'connection'] },
                              content: { type: 'string' },
                              relevance_score: { type: 'number' }
                            }
                          }
                        },
                        learning_outcomes: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              topic: { type: 'string' },
                              outcome_type: { type: 'string', enum: ['concept_learned', 'skill_practiced', 'misconception_corrected', 'question_resolved'] },
                              mastery_level: { type: 'number' },
                              evidence: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              ],
              tool_choice: { type: 'function', function: { name: 'extract_data' } }
            })
          });

          if (extractionResponse.ok) {
            const extractionData = await extractionResponse.json();
            const toolCall = extractionData.choices?.[0]?.message?.tool_calls?.[0];
            
            if (toolCall) {
              const extracted = JSON.parse(toolCall.function.arguments);
              
              // Store memories
              for (const memory of extracted.memories || []) {
                await supabaseClient.from('phoenix_memory_fragments').insert({
                  user_id: session.user_id,
                  conversation_id: session.id,
                  memory_type: memory.memory_type,
                  content: memory.content,
                  relevance_score: memory.relevance_score,
                  created_at: session.created_at,
                  context: { backfilled: true }
                });
                totalMemoriesExtracted++;
              }

              // Store learning outcomes
              for (const outcome of extracted.learning_outcomes || []) {
                // Try to match to concept
                const { data: matchingConcepts } = await supabaseClient
                  .from('phoenix_learning_concepts')
                  .select('id')
                  .ilike('concept_name', `%${outcome.topic}%`)
                  .limit(1);
                
                await supabaseClient.from('phoenix_learning_outcomes').insert({
                  user_id: session.user_id,
                  session_id: session.id,
                  topic: outcome.topic,
                  outcome_type: outcome.outcome_type,
                  mastery_level: outcome.mastery_level,
                  concept_id: matchingConcepts?.[0]?.id || null,
                  created_at: session.created_at,
                  metadata: {
                    evidence: outcome.evidence,
                    backfilled: true
                  }
                });
                totalOutcomesExtracted++;
              }
              
              console.log('[BACKFILL] Extracted', extracted.memories?.length || 0, 'memories and', extracted.learning_outcomes?.length || 0, 'outcomes');
            }
          }
        } catch (extractError) {
          console.error('[BACKFILL] Extraction error (non-critical):', extractError);
        }
      }
    }

    const summary = {
      success: true,
      sessionsProcessed: sessions?.length || 0,
      messagesBackfilled: totalMessagesBackfilled,
      learningOutcomesExtracted: totalOutcomesExtracted,
      memoriesExtracted: totalMemoriesExtracted
    };

    console.log('[BACKFILL] Complete:', summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[BACKFILL] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
