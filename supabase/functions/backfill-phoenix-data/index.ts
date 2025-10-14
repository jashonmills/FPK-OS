import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BackfillResult {
  success: boolean;
  totalSessionsFound: number;
  sessionsProcessed: number;
  messagesBackfilled: number;
  learningOutcomesExtracted: number;
  memoriesExtracted: number;
  isComplete: boolean;
  nextBatch?: number;
  errors?: string[];
  message?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[BACKFILL] Starting backfill process...');
    
    // Get request body
    const { user_id, batch_number = 1, batch_size = 10 } = await req.json();
    
    if (!user_id) {
      throw new Error('user_id is required');
    }

    console.log(`[BACKFILL] Processing batch ${batch_number} for user ${user_id}`);

    // Create Supabase client with SERVICE ROLE for full permissions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Step 1: Get total count of sessions to migrate
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('coach_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('source', 'coach_portal');

    if (countError) {
      throw new Error(`Failed to count sessions: ${countError.message}`);
    }

    console.log(`[BACKFILL] Found ${totalCount} total coach_portal sessions to migrate`);

    // Step 2: Get batch of sessions to process
    const offset = (batch_number - 1) * batch_size;
    const { data: sessions, error: fetchError } = await supabaseAdmin
      .from('coach_sessions')
      .select('*')
      .eq('user_id', user_id)
      .eq('source', 'coach_portal')
      .order('created_at', { ascending: true })
      .range(offset, offset + batch_size - 1);

    if (fetchError) {
      throw new Error(`Failed to fetch sessions: ${fetchError.message}`);
    }

    console.log(`[BACKFILL] Processing ${sessions?.length || 0} sessions in this batch`);

    let messagesBackfilled = 0;
    let learningOutcomesExtracted = 0;
    let memoriesExtracted = 0;
    const errors: string[] = [];

    // Step 3: Process each session
    for (const session of sessions || []) {
      try {
        console.log(`[BACKFILL] Processing session ${session.id}`);

        // Check if conversation already exists
        const { data: existingConv } = await supabaseAdmin
          .from('phoenix_conversations')
          .select('id')
          .eq('session_id', session.id)
          .maybeSingle();

        if (existingConv) {
          console.log(`[BACKFILL] Conversation for session ${session.id} already exists, skipping`);
          continue;
        }

        // Create phoenix_conversation
        const { data: conversation, error: convError } = await supabaseAdmin
          .from('phoenix_conversations')
          .insert({
            user_id: session.user_id,
            session_id: session.id,
            metadata: {
              session_start: session.created_at,
              session_end: session.updated_at,
              turn_count: 0,
              source: 'backfill'
            },
            created_at: session.created_at,
            updated_at: session.updated_at,
          })
          .select()
          .single();

        if (convError) {
          errors.push(`Failed to create conversation for session ${session.id}: ${convError.message}`);
          console.error(`[BACKFILL] Error creating conversation:`, convError);
          continue;
        }

        // Extract messages from session_data
        const sessionData = session.session_data || { messages: [] };
        const messages = sessionData.messages || [];
        
        console.log(`[BACKFILL] Found ${messages.length} messages in session ${session.id}`);
        
        // Add detailed logging for first message to verify structure
        if (messages.length > 0) {
          console.log(`[BACKFILL] Sample message structure:`, JSON.stringify(messages[0], null, 2));
        }

        // Insert messages
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          
          // CRITICAL FIX: Convert persona to uppercase to match database enum
          let personaValue = null;
          if (msg.persona) {
            personaValue = msg.persona.toUpperCase();
          } else if (msg.role && msg.role !== 'user') {
            // Fallback: convert role to uppercase if persona is missing
            personaValue = msg.role.toUpperCase();
          }
          
          try {
            const { error: msgError } = await supabaseAdmin
              .from('phoenix_messages')
              .insert({
                conversation_id: conversation.id,
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content || '',
                persona: personaValue,
                intent: msg.intent || null,
                created_at: msg.timestamp || new Date(session.created_at.getTime() + i * 1000).toISOString(),
              });

            if (msgError) {
              errors.push(`Failed to insert message ${i} for session ${session.id}: ${msgError.message}`);
              console.error(`[BACKFILL] ❌ Error inserting message ${i}:`, msgError);
              console.error(`[BACKFILL] ❌ Message data that failed:`, {
                conversation_id: conversation.id,
                role: msg.role === 'user' ? 'user' : 'assistant',
                content_length: msg.content?.length || 0,
                persona: personaValue,
                has_timestamp: !!msg.timestamp
              });
            } else {
              messagesBackfilled++;
              if (i === 0) {
                console.log(`[BACKFILL] ✅ Successfully inserted first message for session ${session.id}`);
              }
            }
          } catch (msgErr) {
            errors.push(`Exception inserting message ${i} for session ${session.id}: ${msgErr.message}`);
            console.error(`[BACKFILL] ❌ Exception inserting message:`, msgErr);
          }
        }
        
        console.log(`[BACKFILL] ✅ Session ${session.id} complete: ${messagesBackfilled} messages backfilled`);

        // Update conversation metadata with turn count
        await supabaseAdmin
          .from('phoenix_conversations')
          .update({ 
            metadata: {
              ...conversation.metadata,
              turn_count: messages.length
            }
          })
          .eq('id', conversation.id);

        // Extract learning outcomes if available
        if (sessionData.learning_outcomes && Array.isArray(sessionData.learning_outcomes)) {
          for (const outcome of sessionData.learning_outcomes) {
            try {
              const { error: outcomeError } = await supabaseAdmin
                .from('phoenix_learning_outcomes')
                .insert({
                  user_id: session.user_id,
                  conversation_id: conversation.id,
                  outcome_text: outcome.text || outcome.outcome_text || '',
                  topic: outcome.topic || sessionData.topic || 'General',
                  mastery_level: outcome.mastery_level || 0.5,
                  evidence: outcome.evidence || null,
                });

              if (!outcomeError) {
                learningOutcomesExtracted++;
              }
            } catch (outcomeErr) {
              console.error(`[BACKFILL] Error extracting outcome:`, outcomeErr);
            }
          }
        }

        // Extract memories if available
        if (sessionData.memories && Array.isArray(sessionData.memories)) {
          for (const memory of sessionData.memories) {
            try {
              const { error: memError } = await supabaseAdmin
                .from('phoenix_memory_fragments')
                .insert({
                  user_id: session.user_id,
                  conversation_id: conversation.id,
                  memory_type: memory.type || 'fact',
                  content: memory.content || '',
                  context: memory.context || {},
                  relevance_score: memory.relevance_score || 0.5,
                });

              if (!memError) {
                memoriesExtracted++;
              }
            } catch (memErr) {
              console.error(`[BACKFILL] Error extracting memory:`, memErr);
            }
          }
        }

      } catch (sessionErr) {
        errors.push(`Failed to process session ${session.id}: ${sessionErr.message}`);
        console.error(`[BACKFILL] Error processing session:`, sessionErr);
      }
    }

    // Calculate progress
    const sessionsProcessed = batch_number * batch_size;
    const isComplete = sessionsProcessed >= (totalCount || 0);
    const nextBatch = isComplete ? undefined : batch_number + 1;

    const result: BackfillResult = {
      success: true,
      totalSessionsFound: totalCount || 0,
      sessionsProcessed: Math.min(sessionsProcessed, totalCount || 0),
      messagesBackfilled,
      learningOutcomesExtracted,
      memoriesExtracted,
      isComplete,
      nextBatch,
      errors: errors.length > 0 ? errors : undefined,
      message: isComplete 
        ? 'Backfill complete!' 
        : `Batch ${batch_number} complete. ${totalCount - sessionsProcessed} sessions remaining.`
    };

    console.log('[BACKFILL] Result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[BACKFILL] Critical error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        totalSessionsFound: 0,
        sessionsProcessed: 0,
        messagesBackfilled: 0,
        learningOutcomesExtracted: 0,
        memoriesExtracted: 0,
        isComplete: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
