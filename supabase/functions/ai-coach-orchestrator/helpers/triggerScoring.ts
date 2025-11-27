/**
 * Database-Driven Trigger Scoring System
 * 
 * Replaces hardcoded if/else intent detection with flexible,
 * database-driven keyword scoring for persona routing.
 */

interface TriggerRecord {
  persona: string;
  intent: string;
  category: string;
  trigger_phrase: string;
  weight: number;
  priority: number;
  is_regex: boolean;
}

interface IntentScore {
  intent: string;
  score: number;
  priority: number;
  matchedTriggers: string[];
  confidence: number;
}

interface IntentDetectionResult {
  intent: string;
  confidence: number;
  reasoning: string;
  matchedTriggers: string[];
}

/**
 * Fetch all trigger phrases from database (cached per request)
 */
let triggerCache: TriggerRecord[] | null = null;

export async function fetchTriggers(supabaseClient: any): Promise<TriggerRecord[]> {
  if (triggerCache) {
    return triggerCache;
  }

  const { data, error } = await supabaseClient
    .from('ai_persona_triggers')
    .select('*')
    .order('priority', { ascending: false }); // Highest priority first

  if (error) {
    console.error('[TRIGGER_SCORING] Failed to fetch triggers:', error);
    return [];
  }

  triggerCache = data || [];
  console.log(`[TRIGGER_SCORING] Loaded ${triggerCache.length} trigger phrases from database`);
  return triggerCache;
}

/**
 * Score a user message against all triggers using keyword matching
 */
export async function detectIntentFromTriggers(
  message: string,
  conversationHistory: Array<{ persona: string; content: string }>,
  supabaseClient: any
): Promise<IntentDetectionResult> {
  const triggers = await fetchTriggers(supabaseClient);
  const messageLower = message.toLowerCase();
  
  // Track scores per intent
  const intentScores = new Map<string, IntentScore>();
  
  // Check if this is the first user message
  const isFirstUserMessage = conversationHistory.filter(m => m.persona === 'USER').length === 0;
  
  // Score each trigger phrase
  for (const trigger of triggers) {
    let matched = false;
    
    if (trigger.is_regex) {
      // Regex matching
      try {
        const regex = new RegExp(trigger.trigger_phrase, 'i');
        matched = regex.test(messageLower);
      } catch (e) {
        console.error('[TRIGGER_SCORING] Invalid regex:', trigger.trigger_phrase);
      }
    } else {
      // Simple substring matching
      matched = messageLower.includes(trigger.trigger_phrase.toLowerCase());
    }
    
    if (matched) {
      const existingScore = intentScores.get(trigger.intent);
      const scoreContribution = trigger.weight * (trigger.priority / 100); // Normalize priority
      
      if (existingScore) {
        existingScore.score += scoreContribution;
        existingScore.matchedTriggers.push(trigger.trigger_phrase);
        // Keep highest priority for this intent
        existingScore.priority = Math.max(existingScore.priority, trigger.priority);
      } else {
        intentScores.set(trigger.intent, {
          intent: trigger.intent,
          score: scoreContribution,
          priority: trigger.priority,
          matchedTriggers: [trigger.trigger_phrase],
          confidence: 0 // Will calculate below
        });
      }
    }
  }
  
  // Special case: First message + any greeting trigger = conversation_opener
  if (isFirstUserMessage && intentScores.has('conversation_opener')) {
    const openerScore = intentScores.get('conversation_opener')!;
    openerScore.score *= 1.5; // Boost for first message
  }
  
  // Convert to array and sort by score
  const scoredIntents = Array.from(intentScores.values()).sort((a, b) => {
    // First by priority, then by score
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.score - a.score;
  });
  
  // If no matches, return default
  if (scoredIntents.length === 0) {
    console.log('[TRIGGER_SCORING] No trigger matches - defaulting to direct_answer');
    return {
      intent: 'direct_answer',
      confidence: 0.5,
      reasoning: 'No trigger patterns matched - default to direct answer',
      matchedTriggers: []
    };
  }
  
  // Get top intent
  const topIntent = scoredIntents[0];
  
  // Calculate confidence based on score gap between top and second
  const secondScore = scoredIntents.length > 1 ? scoredIntents[1].score : 0;
  const scoreGap = topIntent.score - secondScore;
  const confidence = Math.min(0.95, 0.6 + (scoreGap * 0.2)); // 0.6-0.95 range
  
  console.log('[TRIGGER_SCORING] Top intent:', topIntent.intent, 
              'Score:', topIntent.score.toFixed(2),
              'Confidence:', confidence.toFixed(2),
              'Matches:', topIntent.matchedTriggers.join(', '));
  
  return {
    intent: topIntent.intent,
    confidence,
    reasoning: `Matched triggers: ${topIntent.matchedTriggers.slice(0, 3).join(', ')}`,
    matchedTriggers: topIntent.matchedTriggers
  };
}

/**
 * Fallback to Phase 1 hardcoded logic if database is unavailable
 */
export function detectIntentFallback(
  message: string,
  conversationHistory: Array<{ persona: string; content: string }>
): IntentDetectionResult {
  console.warn('[TRIGGER_SCORING] Using fallback hardcoded intent detection');
  
  const messageLower = message.toLowerCase();
  const isFirstUserMessage = conversationHistory.filter(m => m.persona === 'USER').length === 0;
  
  // Priority 0: Greetings (from Phase 1)
  const isGreeting = /^(hi|hey|hello|yo|sup|greetings?|good (morning|afternoon|evening))/i.test(messageLower);
  const isReadyPhrase = /\b(ready|let's|can you help|you ready|wanna|want to)\b/i.test(messageLower);
  const isStudyStarter = messageLower.includes('study') && (isReadyPhrase || isGreeting);
  
  if (isFirstUserMessage || isGreeting || isStudyStarter) {
    return {
      intent: 'conversation_opener',
      confidence: 0.95,
      reasoning: 'Greeting or conversation starter detected',
      matchedTriggers: ['greeting pattern']
    };
  }
  
  // Priority 1: Escape hatch
  if (messageLower.includes('just tell me') || 
      messageLower.includes('give me the answer') ||
      messageLower.includes('stop asking')) {
    return {
      intent: 'escape_hatch',
      confidence: 0.95,
      reasoning: 'Explicit escape hatch request',
      matchedTriggers: ['escape hatch']
    };
  }
  
  // Priority 2: Socratic guidance (expanded from Phase 1)
  const socraticPhrases = [
    'why', 'how', 'explain', 
    'break it down', 'break down',
    'help me understand',
    'not sure', 'unsure',
    'confused', 'don\'t get',
    'could you', 'can you',
    'tell me more', 'elaborate'
  ];
  
  if (socraticPhrases.some(phrase => messageLower.includes(phrase))) {
    return {
      intent: 'socratic_guidance',
      confidence: 0.85,
      reasoning: 'Socratic exploration pattern detected',
      matchedTriggers: ['socratic phrase']
    };
  }
  
  // Default
  return {
    intent: 'direct_answer',
    confidence: 0.8,
    reasoning: 'No specific pattern matched - default intent',
    matchedTriggers: []
  };
}
