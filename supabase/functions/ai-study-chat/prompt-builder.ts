
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

  // Enhanced mode-specific instructions
  contextPrompt += `\n\nQUERY MODE: ${queryMode.toUpperCase()}`;
  if (queryMode === 'personal') {
    contextPrompt += `
- This is about the user's personal study data
- REQUIRED: Use personal data tools (get_recent_flashcards, get_user_flashcards, get_study_stats)
- Reference specific user data in your response`;
  } else {
    contextPrompt += `
- This is a general knowledge/academic question
- REQUIRED: Use retrieve_knowledge tool to get authoritative information
- Provide comprehensive factual answer with sources
- DO NOT give generic responses - answer the specific question asked`;
  }

  // Add voice optimization
  if (voiceActive) {
    contextPrompt += `\n\nVOICE MODE: Structure your response for natural speech with appropriate pauses.`;
  }

  contextPrompt += conversationContext;
  contextPrompt += `\n\nStudent's question: "${message}"`;
  
  // Add explicit instruction for current query
  if (queryMode === 'general') {
    contextPrompt += `\n\nIMPORTANT: This is a factual question that requires a substantive answer. Use the retrieve_knowledge tool to get accurate information and provide a comprehensive response.`;
  }

  return contextPrompt;
}
