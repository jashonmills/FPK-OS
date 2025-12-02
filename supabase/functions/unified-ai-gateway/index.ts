import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GatewayRequest {
  toolId: string;
  userId?: string;
  orgId?: string | null;
  message: string;
  systemPromptOverride?: string;
  messageHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  additionalContext?: string; // Extra context to append to system prompt
  temperature?: number;
  temperatureOverride?: number; // Takes precedence over all other temperature settings
  maxTokens?: number;
  tools?: any[];
  toolChoice?: string;
}

interface ModelConfig {
  model_id: string;
  provider: string;
  config: {
    temperature?: number;
    maxTokens?: number;
  };
}

interface GovernanceRule {
  name: string;
  description: string;
  category: string;
  allowed: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    console.log('[UNIFIED-GATEWAY] 🚀 Request received');

    // Get API keys
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
      console.error('[UNIFIED-GATEWAY] ❌ Auth failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[UNIFIED-GATEWAY] ✅ User authenticated:', user.id);

    // Parse request
    const requestBody: GatewayRequest = await req.json();
    const { toolId, userId, orgId, message, systemPromptOverride, messageHistory = [], additionalContext, temperature, temperatureOverride, maxTokens, tools, toolChoice } = requestBody;

    if (!toolId || !message) {
      return new Response(
        JSON.stringify({ error: 'toolId and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[UNIFIED-GATEWAY] 📋 Tool:', toolId, '| Org:', orgId || 'platform', '| Message length:', message.length);

    // STEP 1: Fetch tool configuration
    const { data: toolConfig, error: toolError } = await supabaseClient
      .from('ai_tools')
      .select('*')
      .eq('id', toolId)
      .eq('is_active', true)
      .single();

    if (toolError || !toolConfig) {
      console.error('[UNIFIED-GATEWAY] ❌ Tool not found:', toolId);
      return new Response(
        JSON.stringify({ error: `Tool "${toolId}" not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[UNIFIED-GATEWAY] ✅ Tool config loaded:', toolConfig.display_name);

    // STEP 2: Fetch model assignment (org-specific or global default)
    let modelConfig: ModelConfig | null = null;
    
    // Try org-specific assignment first
    if (orgId) {
      const { data: orgAssignment } = await supabaseClient
        .from('ai_tool_model_assignments')
        .select(`
          model_config_id,
          ai_governance_model_configs (
            model_id,
            provider,
            config
          )
        `)
        .eq('tool_id', toolId)
        .eq('org_id', orgId)
        .eq('is_active', true)
        .single();

      if (orgAssignment?.ai_governance_model_configs) {
        modelConfig = orgAssignment.ai_governance_model_configs as unknown as ModelConfig;
        console.log('[UNIFIED-GATEWAY] ✅ Using org-specific model:', modelConfig.model_id);
      }
    }

    // Fall back to global default
    if (!modelConfig) {
      const { data: globalAssignment } = await supabaseClient
        .from('ai_tool_model_assignments')
        .select(`
          model_config_id,
          ai_governance_model_configs (
            model_id,
            provider,
            config
          )
        `)
        .eq('tool_id', toolId)
        .is('org_id', null)
        .eq('is_active', true)
        .single();

      if (globalAssignment?.ai_governance_model_configs) {
        modelConfig = globalAssignment.ai_governance_model_configs as unknown as ModelConfig;
        console.log('[UNIFIED-GATEWAY] ✅ Using global default model:', modelConfig.model_id);
      }
    }

    // Ultimate fallback to tool's configured model
    const finalModel = modelConfig?.model_id || toolConfig.model || 'google/gemini-2.5-flash';
    console.log('[UNIFIED-GATEWAY] 🤖 Final model:', finalModel);

    // STEP 3: Fetch governance rules for the org
    let governanceRules: GovernanceRule[] = [];
    
    if (orgId) {
      const { data: rules } = await supabaseClient
        .from('ai_governance_rules')
        .select('name, description, category, allowed')
        .or(`org_id.eq.${orgId},org_id.is.null`)
        .eq('allowed', false); // Only fetch blocking rules

      if (rules && rules.length > 0) {
        governanceRules = rules;
        console.log('[UNIFIED-GATEWAY] ⚖️ Loaded', rules.length, 'governance rules');
      }
    }

    // STEP 4: Build system prompt with governance injection
    let systemPrompt = systemPromptOverride || toolConfig.system_prompt;
    
    if (governanceRules.length > 0) {
      const rulesBlock = governanceRules
        .map(r => `- ${r.name}: ${r.description || 'Not allowed'}`)
        .join('\n');
      
      systemPrompt = `## ORGANIZATION POLICIES (MANDATORY)
The following activities are NOT PERMITTED:
${rulesBlock}

If a user request violates these policies, politely decline and explain that this is not allowed per organization guidelines.

---

${systemPrompt}`;
    }

    // Append additional context if provided (e.g., code context for code-companion)
    if (additionalContext) {
      systemPrompt += '\n\n' + additionalContext;
    }

    // STEP 5: Build messages array
    const llmMessages = [
      { role: 'system', content: systemPrompt },
      ...messageHistory.slice(-10),
      { role: 'user', content: message }
    ];

    // STEP 6: Prepare AI request
    // Temperature precedence: temperatureOverride > temperature > modelConfig > toolConfig > default
    const finalTemperature = temperatureOverride ?? temperature ?? modelConfig?.config?.temperature ?? toolConfig.temperature ?? 0.7;
    
    const aiRequestBody: any = {
      model: finalModel,
      messages: llmMessages,
      max_tokens: maxTokens || modelConfig?.config?.maxTokens || toolConfig.max_tokens || 4000,
      temperature: finalTemperature,
    };

    // Add tool calling if specified
    if (tools && tools.length > 0) {
      aiRequestBody.tools = tools;
      aiRequestBody.tool_choice = toolChoice || "auto";
    }

    // STEP 7: Check for BYOK (Bring Your Own Key)
    let apiKey = LOVABLE_API_KEY;
    let apiEndpoint = 'https://ai.gateway.lovable.dev/v1/chat/completions';
    let usingBYOK = false;
    
    if (orgId) {
      // Determine provider from model
      let provider: string | null = null;
      if (finalModel.startsWith('openai/') || finalModel.startsWith('gpt-')) {
        provider = 'openai';
      } else if (finalModel.startsWith('anthropic/') || finalModel.startsWith('claude-')) {
        provider = 'anthropic';
      } else if (finalModel.startsWith('google/') || finalModel.startsWith('gemini-')) {
        provider = 'google';
      }

      if (provider) {
        const { data: byokKey } = await serviceClient
          .from('org_api_keys')
          .select('encrypted_key')
          .eq('org_id', orgId)
          .eq('provider', provider)
          .eq('is_active', true)
          .single();

        if (byokKey?.encrypted_key) {
          // Decode the key (simple base64 for now)
          try {
            apiKey = atob(byokKey.encrypted_key);
            usingBYOK = true;
            
            // Set appropriate endpoint based on provider
            if (provider === 'openai') {
              apiEndpoint = 'https://api.openai.com/v1/chat/completions';
              // Adjust model name for direct OpenAI API
              aiRequestBody.model = finalModel.replace('openai/', '');
            } else if (provider === 'anthropic') {
              apiEndpoint = 'https://api.anthropic.com/v1/messages';
              aiRequestBody.model = finalModel.replace('anthropic/', '');
            }
            // For Google, we still use Lovable gateway as it handles the translation
            
            console.log('[UNIFIED-GATEWAY] 🔑 Using BYOK for provider:', provider);
          } catch (e) {
            console.warn('[UNIFIED-GATEWAY] ⚠️ Failed to decode BYOK key, using platform key');
          }
        }
      }
    }

    // STEP 8: Call AI provider
    console.log('[UNIFIED-GATEWAY] 📤 Calling AI Gateway with model:', finalModel, '| BYOK:', usingBYOK);
    
    const aiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(usingBYOK && apiEndpoint.includes('anthropic') ? { 'anthropic-version': '2023-06-01' } : {}),
      },
      body: JSON.stringify(aiRequestBody)
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[UNIFIED-GATEWAY] ❌ AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const choice = aiData.choices?.[0];
    const responseContent = choice?.message?.content || 'I apologize, but I could not generate a response.';
    const toolCalls = choice?.message?.tool_calls || [];

    const latency = Date.now() - startTime;
    console.log('[UNIFIED-GATEWAY] ✅ Response received in', latency, 'ms | Length:', responseContent.length);

    // STEP 8: Log to audit table
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await serviceClient.from('audit_logs').insert({
      user_id: user.id,
      organization_id: orgId || null,
      action_type: 'ai_request',
      resource_type: 'ai_tool',
      resource_id: toolId,
      details: {
        model_used: finalModel,
        message_length: message.length,
        response_length: responseContent.length,
        latency_ms: latency,
        governance_rules_applied: governanceRules.length,
        tool_calls_count: toolCalls.length
      }
    }).then(() => {
      console.log('[UNIFIED-GATEWAY] 📝 Audit log written');
    }).catch((err) => {
      console.warn('[UNIFIED-GATEWAY] ⚠️ Audit log failed:', err.message);
    });

    // STEP 9: Return response
    return new Response(
      JSON.stringify({
        response: responseContent,
        toolCalls,
        model: finalModel,
        latencyMs: latency,
        governanceRulesApplied: governanceRules.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('[UNIFIED-GATEWAY] ❌ Error:', error.message);
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
