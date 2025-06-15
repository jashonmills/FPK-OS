
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
  contextPrompt += `\n\n=== MANDATORY EXECUTION PROTOCOL ===`;
  
  if (queryMode === 'personal') {
    contextPrompt += `
QUERY TYPE: Personal Data Request
REQUIRED ACTION: You MUST immediately use personal data tools:
- get_recent_flashcards: For recent cards/study history
- get_user_flashcards: For specific searches/filters  
- get_study_stats: For performance/progress data

DO NOT provide generic responses. USE THE TOOLS.`;
  } else {
    contextPrompt += `
QUERY TYPE: General Knowledge Question
REQUIRED ACTION: You MUST immediately use retrieve_knowledge tool with topic: "${message}"
- Extract the core topic from the question
- Call retrieve_knowledge with that topic
- Wait for external knowledge response
- Answer with source citation

DO NOT provide generic responses. USE THE RETRIEVE_KNOWLEDGE TOOL.`;
  }

  // Add voice optimization if needed
  if (voiceActive) {
    contextPrompt += `\n\nVOICE MODE: Structure response naturally with pauses (*pause*) before key facts.`;
  }

  contextPrompt += conversationContext;
  contextPrompt += `\n\nStudent's question: "${message}"`;
  
  // Final execution reminder
  contextPrompt += `\n\nCRITICAL: You MUST use the specified tools above. Generic responses are FORBIDDEN.`;

  return contextPrompt;
}
