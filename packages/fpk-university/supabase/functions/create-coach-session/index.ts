import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * PHASE 1.2: SERVER-SIDE SESSION CREATION
 * 
 * Security-hardened session initialization that:
 * 1. Generates UUIDs server-side (never trust client-generated IDs)
 * 2. Immediately creates conversation record to establish ownership
 * 3. Returns both session_id and conversation_uuid to client
 * 4. Prevents session hijacking by guaranteeing user_id association
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SESSION_CREATOR] 🔐 New session creation request');

    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[SESSION_CREATOR] ❌ Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[SESSION_CREATOR] ❌ Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[SESSION_CREATOR] ✅ User authenticated:', user.id);

    // 2. Parse request body for optional metadata
    const body = await req.json().catch(() => ({}));
    const { source = 'ai_command_center_v2', contextData = {} } = body;

    // 3. Generate secure server-side session ID
    const sessionId = crypto.randomUUID();
    console.log('[SESSION_CREATOR] 🎲 Generated session ID:', sessionId);

    // 4. Immediately create conversation record to establish ownership
    const { data: conversation, error: convError } = await supabaseClient
      .from('phoenix_conversations')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        metadata: {
          source,
          contextData,
          created_by: 'create-coach-session',
          created_at: new Date().toISOString()
        }
      })
      .select('id, session_id, user_id, created_at')
      .single();

    if (convError) {
      console.error('[SESSION_CREATOR] ❌ Failed to create conversation:', convError);
      throw new Error('Failed to initialize session: Database error');
    }

    console.log('[SESSION_CREATOR] ✅ Conversation record created:', {
      conversation_uuid: conversation.id,
      session_id: conversation.session_id,
      user_id: conversation.user_id
    });

    // 5. Return session data to client
    return new Response(
      JSON.stringify({
        success: true,
        session_id: conversation.session_id,
        conversation_uuid: conversation.id,
        user_id: conversation.user_id,
        created_at: conversation.created_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('[SESSION_CREATOR] ❌ Session creation failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create session',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
