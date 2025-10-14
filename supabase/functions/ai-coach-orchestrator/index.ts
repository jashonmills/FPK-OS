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

    // 4. PLACEHOLDER: Intent Analysis
    // TODO: In Phase 2, this will call an LLM to determine intent
    const detectedIntent = 'socratic_exploration';
    console.log('[CONDUCTOR] Detected intent:', detectedIntent);

    // 5. PLACEHOLDER: Sentiment Analysis
    // TODO: In Phase 2, this will call an LLM to analyze sentiment
    const detectedSentiment = 'Neutral';
    console.log('[CONDUCTOR] Detected sentiment:', detectedSentiment);

    // 6. PLACEHOLDER: Persona Selection
    // TODO: In Phase 2, this will route to Betty or Al based on intent
    const selectedPersona = detectedIntent === 'socratic_exploration' ? 'BETTY' : 'AL';
    console.log('[CONDUCTOR] Selected persona:', selectedPersona);

    // 7. Generate placeholder response
    const placeholderResponse = `[🎭 CONDUCTOR - Phase 1 Sandbox]

📥 Received: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"
🎯 Detected Intent: ${detectedIntent}
😊 Sentiment: ${detectedSentiment}
🤖 Routing to: ${selectedPersona}

---

This is a Phase 1 placeholder response. In Phase 2, ${selectedPersona} will provide a real AI-generated response.

Conversation ID: ${conversationId}
History length: ${conversationHistory.length} messages`;

    // 8. Store message in database
    await supabaseClient.from('phoenix_messages').insert({
      conversation_id: conversationId,
      persona: 'USER',
      content: message,
      intent: detectedIntent,
      sentiment: detectedSentiment
    });

    await supabaseClient.from('phoenix_messages').insert({
      conversation_id: conversationId,
      persona: 'CONDUCTOR',
      content: placeholderResponse,
      metadata: {
        phase: 1,
        selectedPersona,
        detectedIntent,
        detectedSentiment
      }
    });

    console.log('[CONDUCTOR] Messages stored successfully');

    // 9. Return response
    return new Response(
      JSON.stringify({ 
        success: true,
        response: placeholderResponse,
        metadata: {
          intent: detectedIntent,
          sentiment: detectedSentiment,
          persona: selectedPersona,
          phase: 1
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

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
