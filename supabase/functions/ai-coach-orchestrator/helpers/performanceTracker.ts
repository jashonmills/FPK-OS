// Performance tracking utility for Phoenix AI orchestrator

interface PerformanceTimings {
  total_duration: number;
  time_to_first_token?: number;
  intent_detection_duration?: number;
  context_loading_duration?: number;
  llm_response_duration?: number;
  governor_check_duration?: number;
  tts_generation_duration?: number;
}

export async function logPerformance(
  supabaseClient: any,
  conversationId: string,
  userId: string,
  messageId: string,
  timings: PerformanceTimings,
  metadata: {
    persona: string;
    intent?: string;
    featureFlags: any;
    errorOccurred?: boolean;
    errorMessage?: string;
  }
) {
  try {
    await supabaseClient.from('phoenix_performance_logs').insert({
      conversation_id: conversationId,
      message_id: messageId,
      user_id: userId,
      ...timings,
      persona: metadata.persona,
      intent: metadata.intent,
      feature_flags_snapshot: metadata.featureFlags,
      error_occurred: metadata.errorOccurred || false,
      error_message: metadata.errorMessage
    });
    console.log('[PERF] Performance logged successfully');
  } catch (error) {
    console.error('[PERF] Failed to log performance (non-blocking):', error);
  }
}

export async function logFrustration(
  supabaseClient: any,
  conversationId: string,
  userId: string,
  messageId: string,
  feedbackType: string,
  userMessage: string,
  previousAiMessage?: string,
  context?: any
) {
  try {
    await supabaseClient.from('phoenix_user_feedback').insert({
      conversation_id: conversationId,
      user_id: userId,
      message_id: messageId,
      feedback_type: feedbackType,
      user_message: userMessage,
      previous_ai_message: previousAiMessage,
      persona_before_feedback: context?.previousPersona,
      session_turn_count: context?.turnCount,
      context: context
    });
    console.log('[FRUSTRATION] Logged:', feedbackType);
  } catch (error) {
    console.error('[FRUSTRATION] Failed to log (non-blocking):', error);
  }
}

export async function logNiteOwlEvent(
  supabaseClient: any,
  conversationId: string,
  userId: string,
  messageId: string,
  triggerReason: string,
  context: {
    socraticTurnCount: number;
    turnsSinceLastNiteOwl: number;
    frustrationScore?: number;
    contextSnapshot: any;
  }
) {
  try {
    const { data } = await supabaseClient.from('phoenix_nite_owl_events').insert({
      conversation_id: conversationId,
      user_id: userId,
      message_id: messageId,
      trigger_reason: triggerReason,
      socratic_turn_count: context.socraticTurnCount,
      turns_since_last_nite_owl: context.turnsSinceLastNiteOwl,
      user_frustration_score: context.frustrationScore,
      context_snapshot: context.contextSnapshot
    }).select('id').single();
    
    console.log('[NITE-OWL] Event logged:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('[NITE-OWL] Failed to log event (non-blocking):', error);
    return null;
  }
}

export async function logFeatureUsage(
  supabaseClient: any,
  conversationId: string,
  userId: string,
  messageId: string,
  featureName: string,
  usage: {
    wasEnabled: boolean;
    wasTriggered: boolean;
    wasExecuted: boolean;
    wasSuccessful?: boolean;
    errorMessage?: string;
    executionDurationMs?: number;
    configSnapshot: any;
  }
) {
  try {
    await supabaseClient.from('phoenix_feature_usage').insert({
      conversation_id: conversationId,
      user_id: userId,
      message_id: messageId,
      feature_name: featureName,
      was_enabled: usage.wasEnabled,
      was_triggered: usage.wasTriggered,
      was_executed: usage.wasExecuted,
      was_successful: usage.wasSuccessful,
      error_message: usage.errorMessage,
      execution_duration_ms: usage.executionDurationMs,
      config_snapshot: usage.configSnapshot
    });
    console.log('[FEATURE] Usage logged:', featureName);
  } catch (error) {
    console.error('[FEATURE] Failed to log usage (non-blocking):', error);
  }
}