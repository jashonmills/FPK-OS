import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Create service client for audit logging (bypasses RLS)
const getServiceClient = () => createClient(supabaseUrl, supabaseServiceKey);

/**
 * Track Phoenix AI session for governance monitoring
 */
export async function trackPhoenixSession(
  userId: string,
  orgId?: string | null,
  conversationId?: string | null
): Promise<string | null> {
  const serviceClient = getServiceClient();
  
  try {
    // Check for existing active session (within last hour)
    const { data: existingSession } = await serviceClient
      .from('ai_tool_sessions')
      .select('id, message_count')
      .eq('user_id', userId)
      .eq('tool_id', 'phoenix-ai-coach')
      .eq('org_id', orgId || null)
      .is('ended_at', null)
      .gte('started_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .single();

    if (existingSession) {
      // Update existing session
      await serviceClient
        .from('ai_tool_sessions')
        .update({ 
          message_count: (existingSession.message_count || 0) + 1,
          metadata: { 
            last_message_at: new Date().toISOString(),
            conversation_id: conversationId
          }
        })
        .eq('id', existingSession.id);
      
      console.log('[PHOENIX-AUDIT] 📊 Updated existing session:', existingSession.id);
      return existingSession.id;
    } else {
      // Create new session
      const { data: newSession } = await serviceClient
        .from('ai_tool_sessions')
        .insert({
          user_id: userId,
          tool_id: 'phoenix-ai-coach',
          org_id: orgId || null,
          started_at: new Date().toISOString(),
          message_count: 1,
          metadata: { 
            first_message_at: new Date().toISOString(),
            conversation_id: conversationId
          }
        })
        .select('id')
        .single();
      
      if (newSession) {
        console.log('[PHOENIX-AUDIT] 📊 Created new session:', newSession.id);
        return newSession.id;
      }
    }
  } catch (error) {
    console.warn('[PHOENIX-AUDIT] ⚠️ Session tracking failed:', error);
  }
  
  return null;
}

/**
 * Log Phoenix AI request to audit_logs for governance
 */
export async function logPhoenixAuditEvent(params: {
  userId: string;
  orgId?: string | null;
  sessionId?: string | null;
  conversationId?: string | null;
  persona: string;
  messageLength: number;
  responseLength: number;
  latencyMs: number;
  status: 'success' | 'error' | 'blocked';
  additionalDetails?: Record<string, unknown>;
}): Promise<void> {
  const serviceClient = getServiceClient();
  
  try {
    // Note: resource_id is UUID type, so store tool_id in details instead
    const { error } = await serviceClient.from('audit_logs').insert({
      user_id: params.userId,
      organization_id: params.orgId || null,
      action_type: 'ai_request',
      resource_type: 'ai_tool',
      status: params.status,
      details: {
        tool_id: 'phoenix-ai-coach',
        session_id: params.sessionId,
        conversation_id: params.conversationId,
        persona: params.persona,
        message_length: params.messageLength,
        response_length: params.responseLength,
        latency_ms: params.latencyMs,
        model_used: 'anthropic/claude-3-opus',
        ...params.additionalDetails
      }
    });
    
    if (error) {
      console.error('[PHOENIX-AUDIT] ❌ Audit log insert error:', error.message);
    } else {
      console.log('[PHOENIX-AUDIT] 📝 Audit log written for persona:', params.persona);
    }
  } catch (error) {
    console.warn('[PHOENIX-AUDIT] ⚠️ Audit log failed:', error);
  }
}

/**
 * Update session completion info
 */
export async function updatePhoenixSessionCompletion(
  sessionId: string,
  latencyMs: number,
  creditCost: number = 2
): Promise<void> {
  const serviceClient = getServiceClient();
  
  try {
    await serviceClient
      .from('ai_tool_sessions')
      .update({ 
        credits_used: creditCost,
        metadata: { 
          last_response_at: new Date().toISOString(),
          last_latency_ms: latencyMs,
          model_used: 'anthropic/claude-3-opus'
        }
      })
      .eq('id', sessionId);
    
    console.log('[PHOENIX-AUDIT] ✅ Session completion updated:', sessionId);
  } catch (error) {
    console.warn('[PHOENIX-AUDIT] ⚠️ Session update failed:', error);
  }
}
