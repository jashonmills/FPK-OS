
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

  // Add mode detection context
  contextPrompt += `\n\nQUERY MODE: ${queryMode.toUpperCase()}`;
  if (queryMode === 'personal') {
    contextPrompt += ` - Use personal data tools to answer about the user's study progress and flashcards.`;
  } else {
    contextPrompt += ` - Use general knowledge tools or your training to answer this academic/factual question directly.`;
  }

  // Add voice optimization
  if (voiceActive) {
    contextPrompt += `\n\nVOICE MODE: Structure your response for natural speech with appropriate pauses.`;
  }

  contextPrompt += conversationContext;
  contextPrompt += `\n\nStudent's question: "${message}"`;

  return contextPrompt;
}
