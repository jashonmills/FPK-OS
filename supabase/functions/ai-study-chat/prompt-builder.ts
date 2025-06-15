
import { LearningContext, ChatMessage, QueryMode } from './types.ts';

export function buildContextPrompt(
  learningContext: LearningContext | null,
  chatHistory: ChatMessage[],
  queryMode: QueryMode,
  voiceActive: boolean,
  message: string
): string {
  // Build conversation context
  let conversationContext = '';
  if (chatHistory.length > 0) {
    conversationContext = '\n\nRecent conversation:\n' + 
      chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
  }

  // Build user context
  let contextPrompt = `\nStudent: ${learningContext?.profile.name || 'Student'}`;
  
  if (learningContext) {
    contextPrompt += `
Current streak: ${learningContext.profile.currentStreak} days
Total XP: ${learningContext.profile.totalXP}
Recent sessions: ${learningContext.recentActivity.sessionCount}
Recent accuracy: ${learningContext.recentActivity.recentAccuracy}%`;

    if (learningContext.recentActivity.lastSession) {
      const daysSince = Math.floor((Date.now() - new Date(learningContext.recentActivity.lastSession).getTime()) / (1000 * 60 * 60 * 24));
      contextPrompt += `\nLast study session: ${daysSince === 0 ? 'Today' : `${daysSince} days ago`}`;
    }
  }

  // Strict execution protocol based on query mode
  contextPrompt += `\n\n=== EXECUTION PROTOCOL ===`;
  
  if (queryMode === 'personal') {
    contextPrompt += `
CLASSIFICATION: Personal-Data Query
MANDATORY ACTIONS:
1. IMMEDIATELY use appropriate personal data tool:
   - get_recent_flashcards (for recent cards/study history)
   - get_user_flashcards (for specific searches/filters)  
   - get_study_stats (for performance/progress data)
2. WAIT for tool response
3. Use actual returned data in your response
4. Be encouraging and offer specific next steps

DO NOT give generic responses - use the tools available to you.`;
  } else {
    contextPrompt += `
CLASSIFICATION: General-Knowledge Query
MANDATORY ACTIONS:
1. IMMEDIATELY use retrieve_knowledge tool with topic: "${message}"
2. WAIT for external knowledge response
3. Answer directly with source citation
4. Offer to explore deeper aspects

This is an academic/factual question that requires substantive information.
DO NOT give generic responses - retrieve actual knowledge.`;
  }

  // Add voice optimization if needed
  if (voiceActive) {
    contextPrompt += `\n\nVOICE MODE: Structure response naturally with pauses (*pause*) before key facts.`;
  }

  contextPrompt += conversationContext;
  contextPrompt += `\n\nStudent's question: "${message}"`;
  
  // Final execution reminder
  contextPrompt += `\n\nREMEMBER: You MUST use the specified tools above. No generic fallback responses allowed.`;

  return contextPrompt;
}
