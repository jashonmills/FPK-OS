import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningHubRequest {
  toolId: string;
  message: string;
  sessionId?: string;
  messageHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[AI-LEARNING-HUB] 🚀 Request received');

    // Get Lovable API key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
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
      console.error('[AI-LEARNING-HUB] ❌ Auth failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AI-LEARNING-HUB] ✅ User authenticated:', user.id);

    // Parse request
    const { toolId, message, sessionId, messageHistory = [] }: LearningHubRequest = await req.json();

    if (!toolId || !message) {
      return new Response(
        JSON.stringify({ error: 'toolId and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AI-LEARNING-HUB] 📋 Tool:', toolId, '| Message length:', message.length);

    // Fetch tool configuration from database
    const { data: toolConfig, error: toolError } = await supabaseClient
      .from('ai_tools')
      .select('*')
      .eq('id', toolId)
      .eq('is_active', true)
      .single();

    if (toolError || !toolConfig) {
      console.error('[AI-LEARNING-HUB] ❌ Tool not found:', toolId);
      return new Response(
        JSON.stringify({ error: `Tool "${toolId}" not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AI-LEARNING-HUB] ✅ Tool config loaded:', toolConfig.display_name);

    // Build messages array for LLM
    const llmMessages = [
      { role: 'system', content: toolConfig.system_prompt },
      ...messageHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Call Lovable AI Gateway
    console.log('[AI-LEARNING-HUB] 🤖 Calling Lovable AI Gateway...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: toolConfig.model || 'google/gemini-2.5-flash',
        messages: llmMessages,
        max_tokens: toolConfig.max_tokens || 4000,
        temperature: Number(toolConfig.temperature) || 0.7,
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[AI-LEARNING-HUB] ❌ AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const responseContent = aiData.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    console.log('[AI-LEARNING-HUB] ✅ AI response received, length:', responseContent.length);

    // Generate or use existing session ID
    const currentSessionId = sessionId || `session_${Date.now()}_${user.id.substring(0, 8)}`;

    // Log session to database (upsert)
    const { error: sessionError } = await supabaseClient
      .from('ai_tool_sessions')
      .upsert({
        user_id: user.id,
        tool_id: toolId,
        session_id: currentSessionId,
        message_count: messageHistory.length + 2, // +2 for user message and AI response
        credits_used: toolConfig.credit_cost || 1,
        metadata: {
          last_message_at: new Date().toISOString(),
          model_used: toolConfig.model
        }
      }, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      });

    if (sessionError) {
      console.warn('[AI-LEARNING-HUB] ⚠️ Session logging failed:', sessionError.message);
      // Don't fail the request, just log the warning
    }

    // Return response
    return new Response(
      JSON.stringify({
        response: responseContent,
        sessionId: currentSessionId,
        toolId: toolId,
        creditsUsed: toolConfig.credit_cost || 1,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('[AI-LEARNING-HUB] ❌ Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
