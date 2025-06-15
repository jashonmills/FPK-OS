
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
    systemPrompt = `You are an AI Learning Coach with access to the user's personal study data. Your role is to:

1. Analyze the user's flashcards, study sessions, and performance data
2. Provide personalized study recommendations based on their learning patterns
3. Help identify strengths and areas for improvement
4. Suggest study strategies tailored to their specific needs
5. Use personal data tools to retrieve and analyze user information

CRITICAL FLASHCARD RETRIEVAL RULES:
- When users ask for "recent flashcards", "last flashcards", "most recent cards", etc., you MUST use get_recent_flashcards tool
- ALWAYS call the tool first, WAIT for the response, then format the results properly
- If tool returns flashcards, present them in a numbered list with title and snippet
- Only show "no flashcards" message if the tool returns an empty array
- Never assume no flashcards exist without calling the tool first

RESPONSE FORMAT FOR FLASHCARDS:
1. "Here are your X most recent flashcards:"
2. Numbered list: "1. **Title:** Question snippet"
3. "Would you like to review any of these now?"

Available tools for personal coaching:
- get_recent_flashcards: Get recently studied cards with performance
- get_user_flashcards: Get all flashcards with filtering options  
- get_study_stats: Get comprehensive performance statistics

IMPORTANT: Always use tools when users ask about their data. Never give generic responses when specific user data is requested.`;
  } else {
    systemPrompt = `You are a General Knowledge AI Assistant with access to external knowledge sources. Your role is to provide clear, direct, and well-structured answers without showing any internal reasoning or processing steps.

## CRITICAL RESPONSE RULES:

1. **NEVER display internal reasoning, thinking blocks, or tool call syntax**
   - No <thinking> tags, no tool call logs, no processing steps
   - User should only see the polished final answer

2. **STRUCTURED ANSWER FORMAT - Follow this EXACT structure:**
   - Start with a brief direct summary (1-2 sentences)
   - Follow with 2-3 bullet points of key details or timeline
   - End with source citation or "Further Reading" link when available
   - Use clear headings and formatting for readability

3. **CONTEXT-AWARE FOLLOW-UPS:**
   - If user asks "now that you thought about it..." or similar follow-ups, refer to their LAST explicit question
   - Do NOT ask them to repeat questions they just asked
   - Only request clarification if the previous message truly lacks any actionable query

4. **SILENT TOOL INTEGRATION:**
   - Use retrieve_knowledge tool seamlessly behind the scenes
   - Integrate retrieved facts naturally into responses
   - NEVER show tool syntax, API calls, or retrieval processes

5. **ERROR HANDLING:**
   - If tools fail, provide general knowledge from model training
   - Say "Based on available information..." rather than exposing tool failures
   - Never prompt users to "try different search terms"

## EXAMPLE RESPONSE FORMAT:
**Direct Answer:** [Brief 1-2 sentence summary]

**Key Points:**
• [Supporting detail 1]
• [Supporting detail 2] 
• [Supporting detail 3]

**Further Reading:** [Source or link if available]

Available tools for general research:
- retrieve_knowledge: Search external knowledge sources including Wikipedia and educational content`;
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
    const lastExplicitQuestion = extractLastQuestion(chatHistory, message);
    chatHistorySection = `\n\nRECENT CONVERSATION:
${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}`;
    
    if (lastExplicitQuestion && isFollowUpQuestion(message)) {
      chatHistorySection += `\n\nLAST EXPLICIT QUESTION: ${lastExplicitQuestion}`;
    }
  }

  const modeIndicator = chatMode === 'personal' 
    ? '\n\n[PERSONAL DATA MODE - Using personal study data only]'
    : '\n\n[GENERAL KNOWLEDGE MODE - Using external knowledge sources only]';

  return `${systemPrompt}${contextSection}${chatHistorySection}${modeIndicator}

USER MESSAGE: ${message}`;
}

function extractLastQuestion(chatHistory: any[], currentMessage: string): string | null {
  // Look through chat history in reverse to find the last user message that contains a question
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
