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
  userRole?: string;
  message: string;
  systemPromptOverride?: string;
  messageHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  additionalContext?: string;
  temperature?: number;
  temperatureOverride?: number;
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
  id: string;
  name: string;
  description: string;
  category: string;
  capability: string;
  allowed: boolean;
  applicable_roles: string[];
}

// Map tools to capabilities for governance enforcement
const TOOL_CAPABILITY_MAP: Record<string, string> = {
  // Image generation tools
  'image-generator': 'image_generation',
  'ai-image-creator': 'image_generation',
  
  // Code generation tools
  'code-learning-companion': 'code_generation',
  'code-tutor': 'code_generation',
  'code-assistant': 'code_generation',
  
  // Document creation tools
  'lesson-planner': 'document_creation',
  'rubric-creator': 'document_creation',
  'course-builder': 'document_creation',
  'worksheet-generator': 'document_creation',
  
  // Research tools
  'research-assistant': 'research_web_search',
  'web-search': 'research_web_search',
  
  // Summarization tools
  'summarizer': 'content_summarization',
  'notes-summarizer': 'content_summarization',
  
  // Math tools
  'math-problem-solver': 'math_calculations',
  'calculator': 'math_calculations',
  
  // Creative writing tools
  'essay-writing-helper': 'creative_writing',
  'creative-writer': 'creative_writing',
  'story-generator': 'creative_writing',
  
  // Data analysis tools
  'data-analyzer': 'data_analysis',
  'chart-generator': 'data_analysis',
  'performance-analyzer': 'data_analysis',
  
  // General chat/tutoring tools
  'ai-personal-tutor': 'general_chat',
  'ai-study-coach': 'general_chat',
  'language-practice': 'general_chat',
  'quiz-generator': 'general_chat',
  'grading-assistant': 'general_chat',
  'ai-chat': 'general_chat',
};

// Tools that benefit from knowledge base context
const KB_ENABLED_TOOLS = ['lesson-planner', 'quiz-generator', 'research-assistant', 'course-builder', 'ai-personal-tutor'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let sessionId: string | null = null;
  
  try {
    console.log('[UNIFIED-GATEWAY] 🚀 Request received');

    // Get API keys
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create service client early for BYOK and KB lookups
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    // COPPA COMPLIANCE: Check parental consent for minors before any AI processing
    const { data: userProfile } = await serviceClient
      .from('profiles')
      .select('parental_consent_status, is_minor')
      .eq('id', user.id)
      .single();

    if (userProfile?.is_minor && userProfile.parental_consent_status === 'pending') {
      console.log('[UNIFIED-GATEWAY] 🚫 Blocked: Parental consent required for minor user');
      
      return new Response(
        JSON.stringify({ 
          error: 'Access denied: Parental consent required',
          code: 'PARENTAL_CONSENT_REQUIRED',
          message: 'Your parent or guardian needs to approve your account before you can use AI features.'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { toolId, userId, orgId, userRole, message, systemPromptOverride, messageHistory = [], additionalContext, temperature, temperatureOverride, maxTokens, tools, toolChoice } = requestBody;

    if (!toolId || !message) {
      return new Response(
        JSON.stringify({ error: 'toolId and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[UNIFIED-GATEWAY] 📋 Tool:', toolId, '| Org:', orgId || 'platform', '| Role:', userRole || 'unknown', '| Message length:', message.length);

    // STEP 1: Create or update session for monitoring
    try {
      // Check for existing active session (within last hour)
      const { data: existingSession } = await serviceClient
        .from('ai_tool_sessions')
        .select('id, message_count')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .eq('org_id', orgId || null)
        .is('ended_at', null)
        .gte('started_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .single();

      if (existingSession) {
        // Update existing session
        sessionId = existingSession.id;
        await serviceClient
          .from('ai_tool_sessions')
          .update({ 
            message_count: (existingSession.message_count || 0) + 1,
            metadata: { last_message_at: new Date().toISOString() }
          })
          .eq('id', sessionId);
        console.log('[UNIFIED-GATEWAY] 📊 Updated existing session:', sessionId);
      } else {
        // Create new session
        const { data: newSession } = await serviceClient
          .from('ai_tool_sessions')
          .insert({
            user_id: user.id,
            tool_id: toolId,
            org_id: orgId || null,
            started_at: new Date().toISOString(),
            message_count: 1,
            metadata: { first_message_at: new Date().toISOString() }
          })
          .select('id')
          .single();
        
        if (newSession) {
          sessionId = newSession.id;
          console.log('[UNIFIED-GATEWAY] 📊 Created new session:', sessionId);
        }
      }
    } catch (sessionError) {
      console.warn('[UNIFIED-GATEWAY] ⚠️ Session tracking failed:', sessionError);
      // Continue without session tracking
    }

    // STEP 2: Fetch tool configuration
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

    // STEP 3: Fetch model assignment (org-specific or global default)
    let modelConfig: ModelConfig | null = null;
    
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

    const finalModel = modelConfig?.model_id || toolConfig.model || 'google/gemini-2.5-flash';
    console.log('[UNIFIED-GATEWAY] 🤖 Final model:', finalModel);

    // STEP 4: Fetch governance rules and check capability-based blocking
    let governanceRules: GovernanceRule[] = [];
    let blockedByCapability = false;
    let blockingRules: GovernanceRule[] = [];
    
    if (orgId) {
      const { data: rules } = await supabaseClient
        .from('ai_governance_rules')
        .select('id, name, description, category, capability, allowed, applicable_roles')
        .or(`org_id.eq.${orgId},org_id.is.null`);

      if (rules && rules.length > 0) {
        governanceRules = rules as GovernanceRule[];
        console.log('[UNIFIED-GATEWAY] ⚖️ Loaded', rules.length, 'governance rules');
        
        // Get the capability for this tool
        const toolCapability = TOOL_CAPABILITY_MAP[toolId] || 'general_chat';
        console.log('[UNIFIED-GATEWAY] 🔍 Tool capability:', toolCapability);
        
        // Check if any rule blocks this capability for the user's role
        const effectiveRole = userRole || 'student';
        
        for (const rule of governanceRules) {
          // Rule must be blocking (allowed = false)
          if (rule.allowed) continue;
          
          // Rule must match the tool's capability
          if (rule.capability !== toolCapability) continue;
          
          // Rule must apply to the user's role
          if (!rule.applicable_roles.includes(effectiveRole)) continue;
          
          // This rule blocks the user
          blockedByCapability = true;
          blockingRules.push(rule);
          console.log('[UNIFIED-GATEWAY] 🚫 Blocked by rule:', rule.name, '| Capability:', rule.capability, '| Role:', effectiveRole);
        }
      }
    }

    // If blocked by capability-based rule, create approval request and return blocked response
    if (blockedByCapability && blockingRules.length > 0 && orgId) {
      console.log('[UNIFIED-GATEWAY] 🚫 Request blocked by', blockingRules.length, 'capability rules');
      
      // Create approval request
      try {
        await serviceClient
          .from('ai_governance_approvals')
          .insert({
            user_id: user.id,
            org_id: orgId,
            task: message.substring(0, 500),
            category: blockingRules[0].category,
            priority: 'medium',
            status: 'pending',
            details: JSON.stringify({
              tool_id: toolId,
              tool_capability: TOOL_CAPABILITY_MAP[toolId] || 'general_chat',
              user_role: userRole || 'student',
              blocking_rules: blockingRules.map(r => ({ id: r.id, name: r.name, capability: r.capability })),
              message_preview: message.substring(0, 200)
            })
          });
        console.log('[UNIFIED-GATEWAY] 📝 Created approval request for blocked capability');
      } catch (approvalError) {
        console.warn('[UNIFIED-GATEWAY] ⚠️ Failed to create approval request:', approvalError);
      }

      // Log the blocked request
      await serviceClient.from('audit_logs').insert({
        user_id: user.id,
        organization_id: orgId,
        action_type: 'ai_request_blocked',
        resource_type: 'ai_tool',
        status: 'blocked',
        details: {
          tool_id: toolId,
          tool_capability: TOOL_CAPABILITY_MAP[toolId] || 'general_chat',
          user_role: userRole || 'student',
          blocking_rules: blockingRules.map(r => r.name),
          message_preview: message.substring(0, 100)
        }
      });

      // Update session as ended due to blocked request
      if (sessionId) {
        await serviceClient
          .from('ai_tool_sessions')
          .update({ 
            ended_at: new Date().toISOString(),
            metadata: { ended_reason: 'blocked_by_governance' }
          })
          .eq('id', sessionId);
      }

      return new Response(
        JSON.stringify({
          response: `This action is blocked by your organization's policy.\n\n${blockingRules.map(r => `• **${r.name}**: ${r.description || 'Not permitted for your role'}`).join('\n')}\n\nAn approval request has been submitted to your organization administrators. You will be notified when it's reviewed.`,
          blocked: true,
          blockedCapability: TOOL_CAPABILITY_MAP[toolId] || 'general_chat',
          blockingRules: blockingRules.map(r => ({ id: r.id, name: r.name, capability: r.capability })),
          approvalRequested: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // STEP 5: Fetch knowledge base context for relevant tools
    let knowledgeBaseContext = '';
    
    if (orgId && KB_ENABLED_TOOLS.includes(toolId)) {
      const { data: kbDocs } = await serviceClient
        .from('org_knowledge_base')
        .select('title, content_chunks')
        .eq('org_id', orgId)
        .eq('is_active', true)
        .limit(5);

      if (kbDocs && kbDocs.length > 0) {
        // Simple retrieval: take first few chunks from each doc (in production, use embeddings)
        const contextChunks: string[] = [];
        for (const doc of kbDocs) {
          const chunks = doc.content_chunks as string[];
          if (chunks && chunks.length > 0) {
            // Take first 2 chunks from each doc
            contextChunks.push(`### ${doc.title}\n${chunks.slice(0, 2).join('\n\n')}`);
          }
        }
        
        if (contextChunks.length > 0) {
          knowledgeBaseContext = `## ORGANIZATION KNOWLEDGE BASE
The following documents are from this organization's knowledge base. Use this information to provide context-aware responses:

${contextChunks.join('\n\n---\n\n')}

---

`;
          console.log('[UNIFIED-GATEWAY] 📚 Loaded KB context from', kbDocs.length, 'documents');
        }
      }
    }

    // STEP 6: Build system prompt with governance + KB injection
    let systemPrompt = systemPromptOverride || toolConfig.system_prompt;
    
    // Prepend knowledge base context
    if (knowledgeBaseContext) {
      systemPrompt = knowledgeBaseContext + systemPrompt;
    }
    
    // Prepend blocked capability rules as policy guidance
    const blockedRules = governanceRules.filter(r => !r.allowed);
    if (blockedRules.length > 0) {
      const rulesBlock = blockedRules
        .map(r => `- ${r.name} (${r.capability}): ${r.description || 'Not allowed'}`)
        .join('\n');
      
      systemPrompt = `## ORGANIZATION POLICIES (MANDATORY)
The following AI capabilities are restricted for certain roles:
${rulesBlock}

If a user request would violate these policies, politely decline and explain that this capability is not available per organization guidelines.

---

${systemPrompt}`;
    }

    // Append additional context if provided
    if (additionalContext) {
      systemPrompt += '\n\n' + additionalContext;
    }

    // STEP 7: Build messages array
    const llmMessages = [
      { role: 'system', content: systemPrompt },
      ...messageHistory.slice(-10),
      { role: 'user', content: message }
    ];

    // STEP 8: Prepare AI request
    const finalTemperature = temperatureOverride ?? temperature ?? modelConfig?.config?.temperature ?? toolConfig.temperature ?? 0.7;
    
    const aiRequestBody: any = {
      model: finalModel,
      messages: llmMessages,
      max_tokens: maxTokens || modelConfig?.config?.maxTokens || toolConfig.max_tokens || 4000,
      temperature: finalTemperature,
    };

    if (tools && tools.length > 0) {
      aiRequestBody.tools = tools;
      aiRequestBody.tool_choice = toolChoice || "auto";
    }

    // STEP 9: Check for BYOK (Bring Your Own Key)
    let apiKey = LOVABLE_API_KEY;
    let apiEndpoint = 'https://ai.gateway.lovable.dev/v1/chat/completions';
    let usingBYOK = false;
    
    if (orgId) {
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
          try {
            apiKey = atob(byokKey.encrypted_key);
            usingBYOK = true;
            
            if (provider === 'openai') {
              apiEndpoint = 'https://api.openai.com/v1/chat/completions';
              aiRequestBody.model = finalModel.replace('openai/', '');
            } else if (provider === 'anthropic') {
              apiEndpoint = 'https://api.anthropic.com/v1/messages';
              aiRequestBody.model = finalModel.replace('anthropic/', '');
            }
            
            console.log('[UNIFIED-GATEWAY] 🔑 Using BYOK for provider:', provider);
          } catch (e) {
            console.warn('[UNIFIED-GATEWAY] ⚠️ Failed to decode BYOK key, using platform key');
          }
        }
      }
    }

    // STEP 10: Call AI provider
    console.log('[UNIFIED-GATEWAY] 📤 Calling AI with model:', finalModel, '| BYOK:', usingBYOK, '| KB:', !!knowledgeBaseContext);
    
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

    // STEP 11: Update session with completion info
    if (sessionId) {
      try {
        await serviceClient
          .from('ai_tool_sessions')
          .update({ 
            credits_used: toolConfig.credit_cost || 1,
            metadata: { 
              last_response_at: new Date().toISOString(),
              last_latency_ms: latency,
              model_used: finalModel
            }
          })
          .eq('id', sessionId);
      } catch (sessionUpdateError) {
        console.warn('[UNIFIED-GATEWAY] ⚠️ Session update failed:', sessionUpdateError);
      }
    }

    // STEP 12: Log to audit table
    try {
      const { error: auditError } = await serviceClient.from('audit_logs').insert({
        user_id: user.id,
        organization_id: orgId || null,
        action_type: 'ai_request',
        resource_type: 'ai_tool',
        status: 'success',
        details: {
          tool_id: toolId,
          tool_capability: TOOL_CAPABILITY_MAP[toolId] || 'general_chat',
          session_id: sessionId,
          model_used: finalModel,
          message_length: message.length,
          response_length: responseContent.length,
          latency_ms: latency,
          governance_rules_applied: governanceRules.length,
          knowledge_base_used: !!knowledgeBaseContext,
          using_byok: usingBYOK,
          tool_calls_count: toolCalls.length
        }
      });
      
      if (auditError) {
        console.error('[UNIFIED-GATEWAY] ❌ Audit log insert error:', auditError.message, auditError.details, auditError.hint);
      } else {
        console.log('[UNIFIED-GATEWAY] 📝 Audit log written successfully');
      }
    } catch (auditCatchError: any) {
      console.error('[UNIFIED-GATEWAY] ❌ Audit log exception:', auditCatchError.message);
    }

    // STEP 13: Return response
    return new Response(
      JSON.stringify({
        response: responseContent,
        toolCalls,
        model: finalModel,
        latencyMs: latency,
        governanceRulesApplied: governanceRules.length,
        knowledgeBaseUsed: !!knowledgeBaseContext,
        sessionId
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
