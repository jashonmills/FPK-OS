
import { QueryMode } from './types.ts';

export function buildContextPrompt(
  learningContext: any,
  chatHistory: any[],
  queryMode: QueryMode,
  voiceActive: boolean,
  message: string,
  chatMode: 'personal' | 'general' = 'personal'
): string {
  let systemPrompt = '';
  
  if (chatMode === 'personal') {
    systemPrompt = `You are an AI Learning Coach with access only to the user's personal study data. Your role is to:

1. Analyze the user's flashcards, study sessions, and performance data
2. Provide personalized study recommendations based on their learning patterns
3. Help identify strengths and areas for improvement
4. Suggest study strategies tailored to their specific needs
5. Use only personal data tools: get_recent_flashcards, get_user_flashcards, get_study_stats

IMPORTANT: In personal mode, you MUST NOT query external sources or general knowledge APIs. Focus only on the user's study data and provide coaching based on their personal learning journey.

Available tools for personal coaching:
- get_recent_flashcards: Get recently studied cards with performance
- get_user_flashcards: Get all flashcards with filtering options  
- get_study_stats: Get comprehensive performance statistics

If the user asks about topics not in their study data, encourage them to switch to General Knowledge mode for broader research.`;
  } else {
    systemPrompt = `You are a General Knowledge AI Assistant with access to external knowledge sources. Your role is to:

1. Research any topic using external APIs and knowledge bases
2. Provide comprehensive, well-sourced information
3. Answer broad questions across all domains of knowledge
4. Help with research, definitions, explanations, and learning about new topics
5. Use external knowledge tools: retrieve_knowledge, and other research APIs

IMPORTANT: In general mode, you DO NOT have access to personal user data. Do not attempt to access flashcards, study sessions, or personal statistics. Focus on providing general knowledge and research capabilities.

Available tools for general research:
- retrieve_knowledge: Search Wikipedia, research papers, and educational content

If the user asks about their personal study data, direct them to switch to Personal Data mode.`;
  }

  // Add voice-specific instructions
  if (voiceActive) {
    systemPrompt += `\n\nVOICE MODE: Responses will be read aloud. Keep responses:
- Conversational and engaging
- Well-structured with clear breaks
- Under 200 words when possible
- Free of complex formatting that doesn't translate to speech`;
  }

  let contextSection = '';
  
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
    chatHistorySection = `\n\nRECENT CONVERSATION:
${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}`;
  }

  const modeIndicator = chatMode === 'personal' 
    ? '\n\n[PERSONAL DATA MODE - Using personal study data only]'
    : '\n\n[GENERAL KNOWLEDGE MODE - Using external knowledge sources only]';

  return `${systemPrompt}${contextSection}${chatHistorySection}${modeIndicator}

USER MESSAGE: ${message}`;
}
