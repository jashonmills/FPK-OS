import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Create service client for audit logging (bypasses RLS)
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

export interface AuditLogParams {
  userId: string;
  orgId?: string | null;
  toolId: string;
  actionType: 'ai_request' | 'ai_request_blocked' | 'socratic_session_start' | 'socratic_session_respond' | 'socratic_session_complete';
  status: 'success' | 'error' | 'blocked';
  details: Record<string, unknown>;
}

export interface SessionTrackingParams {
  userId: string;
  orgId?: string | null;
  toolId: string;
  sessionId?: string | null;
}

/**
 * Creates or updates an AI tool session for monitoring
 */
export async function trackSession(params: SessionTrackingParams): Promise<string | null> {
  const { userId, orgId, toolId } = params;
  
  try {
    // Check for existing active session (within last hour)
    const { data: existingSession } = await serviceClient
      .from('ai_tool_sessions')
      .select('id, message_count')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
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
          metadata: { last_message_at: new Date().toISOString() }
        })
        .eq('id', existingSession.id);
      
      console.log('[AUDIT] 📊 Updated existing session:', existingSession.id);
      return existingSession.id;
    } else {
      // Create new session
      const { data: newSession } = await serviceClient
        .from('ai_tool_sessions')
        .insert({
          user_id: userId,
          tool_id: toolId,
          org_id: orgId || null,
          started_at: new Date().toISOString(),
          message_count: 1,
          metadata: { first_message_at: new Date().toISOString() }
        })
        .select('id')
        .single();
      
      if (newSession) {
        console.log('[AUDIT] 📊 Created new session:', newSession.id);
        return newSession.id;
      }
    }
  } catch (error) {
    console.warn('[AUDIT] ⚠️ Session tracking failed:', error);
  }
  
  return null;
}

/**
 * Updates a session with completion info
 */
export async function updateSessionCompletion(
  sessionId: string, 
  latencyMs: number, 
  modelUsed: string,
  creditCost: number = 1
): Promise<void> {
  try {
    await serviceClient
      .from('ai_tool_sessions')
      .update({ 
        credits_used: creditCost,
        metadata: { 
          last_response_at: new Date().toISOString(),
          last_latency_ms: latencyMs,
          model_used: modelUsed
        }
      })
      .eq('id', sessionId);
    
    console.log('[AUDIT] ✅ Session completion updated:', sessionId);
  } catch (error) {
    console.warn('[AUDIT] ⚠️ Session update failed:', error);
  }
}

/**
 * Logs an AI request to the audit_logs table for governance tracking
 */
export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  const { userId, orgId, toolId, actionType, status, details } = params;
  
  try {
    await serviceClient.from('audit_logs').insert({
      user_id: userId,
      organization_id: orgId || null,
      action_type: actionType,
      resource_type: 'ai_tool',
      resource_id: toolId,
      status: status,
      details: details
    });
    
    console.log('[AUDIT] 📝 Audit log written:', actionType, toolId);
  } catch (error) {
    console.warn('[AUDIT] ⚠️ Audit log failed:', error);
  }
}

/**
 * Combined helper to track both session and audit log
 */
export async function trackAIInteraction(
  params: SessionTrackingParams,
  auditParams: Omit<AuditLogParams, 'userId' | 'orgId' | 'toolId'>
): Promise<string | null> {
  // Track session
  const sessionId = await trackSession(params);
  
  // Log audit event
  await logAuditEvent({
    userId: params.userId,
    orgId: params.orgId,
    toolId: params.toolId,
    ...auditParams
  });
  
  return sessionId;
}
