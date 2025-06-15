
import { QueryMode } from './types.ts';
import { SYSTEM_PROMPT_PERSONAL, SYSTEM_PROMPT_GENERAL } from './constants.ts';

export function buildContextPrompt(
  learningContext: any,
  chatHistory: any[],
  queryMode: QueryMode,
  voiceActive: boolean,
  message: string,
  chatMode: 'personal' | 'general' = 'personal'
): string {
  // Use mode-specific system prompts with strict isolation
  let systemPrompt = chatMode === 'personal' ? SYSTEM_PROMPT_PERSONAL : SYSTEM_PROMPT_GENERAL;

  // Add voice-specific instructions
  if (voiceActive) {
    systemPrompt += `\n\nVOICE MODE: Responses will be read aloud. Keep responses:
- Conversational and engaging
- Well-structured with clear breaks
- Under 200 words when possible
- Free of complex formatting that doesn't translate to speech`;
  }

  let contextSection = '';
  
  // Only include personal context in personal mode
  if (chatMode === 'personal' && learningContext) {
    contextSection = `\n\nUSER CONTEXT:
- Total flashcards: ${learningContext.flashcards?.length || 0}
- Completed sessions: ${learningContext.sessions?.length || 0}
- Recent performance: ${learningContext.recentSessions?.slice(0, 3)?.map(s => 
    `Session ${s.id}: ${s.correct_answers}/${s.total_cards} correct`
  ).join(', ') || 'No recent sessions'}`;

    if (learningContext.strugglingTopics?.length > 0) {
      contextSection += `\n- Topics needing attention: ${learningContext.strugglingTopics.join(', ')}`;
    }
  }

  let chatHistorySection = '';
  if (chatHistory.length > 0) {
    const lastExplicitQuestion = extractLastQuestion(chatHistory, message);
    chatHistorySection = `\n\nRECENT CONVERSATION:
${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}`;
    
    if (lastExplicitQuestion && isFollowUpQuestion(message)) {
      chatHistorySection += `\n\nLAST EXPLICIT QUESTION: ${lastExplicitQuestion}`;
    }
  }

  // Clear mode indicators with strict access rules
  const modeIndicator = chatMode === 'personal' 
    ? '\n\n[🔒 PERSONAL DATA MODE - Access ONLY user study data. Redirect general questions to General Knowledge mode.]'
    : '\n\n[🌐 GENERAL KNOWLEDGE MODE - Access ONLY external knowledge. Redirect personal data questions to My Data mode.]';

  return `${systemPrompt}${contextSection}${chatHistorySection}${modeIndicator}

USER MESSAGE: ${message}`;
}

function extractLastQuestion(chatHistory: any[], currentMessage: string): string | null {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const msg = chatHistory[i];
    if (msg.role === 'user' && (msg.content.includes('?') || 
        msg.content.toLowerCase().includes('what') ||
        msg.content.toLowerCase().includes('how') ||
        msg.content.toLowerCase().includes('why') ||
        msg.content.toLowerCase().includes('when') ||
        msg.content.toLowerCase().includes('where') ||
        msg.content.toLowerCase().includes('tell me about') ||
        msg.content.toLowerCase().includes('explain'))) {
      return msg.content;
    }
  }
  return null;
}

function isFollowUpQuestion(message: string): boolean {
  const followUpPatterns = [
    'now that you thought about it',
    'what is your answer',
    'what do you think',
    'your thoughts',
    'reconsider',
    'think again',
    'on second thought'
  ];
  
  const lowerMessage = message.toLowerCase();
  return followUpPatterns.some(pattern => lowerMessage.includes(pattern));
}
