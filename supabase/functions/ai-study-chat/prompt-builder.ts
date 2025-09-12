
import { QueryMode } from './types.ts';
import { SYSTEM_PROMPT_PERSONAL, SYSTEM_PROMPT_GENERAL, STATE_PROMPT_INITIATE_SESSION, STATE_PROMPT_EVALUATE_ANSWER, STATE_PROMPT_DIRECT_ANSWER } from './constants.ts';
 
export function buildContextPrompt(
  learningContext: any,
  chatHistory: any[],
  queryMode: QueryMode,
  voiceActive: boolean,
  message: string,
  chatMode: 'personal' | 'general' = 'personal'
): string {
  // Select system prompt based on mode
  const systemPrompt = chatMode === 'personal' 
    ? SYSTEM_PROMPT_PERSONAL 
    : SYSTEM_PROMPT_GENERAL;

  let prompt = systemPrompt;

  // Add voice-specific instructions
  if (voiceActive) {
    prompt += `\n\n## VOICE MODE ACTIVE
- Keep responses concise and conversational
- Avoid complex formatting or lists
- Use natural speech patterns
- Limit responses to 2-3 sentences when possible`;
  }

  // Add user context for personal mode only
  if (chatMode === 'personal' && learningContext) {
    prompt += `\n\n## USER CONTEXT
- Total flashcards: ${learningContext.flashcards?.length || 0}
- Completed sessions: ${learningContext.sessions?.length || 0}
- Recent performance: ${learningContext.recentSessions?.slice(0, 3)?.map(s => 
    `Session ${s.id}: ${s.correct_answers}/${s.total_cards} correct`
  ).join(', ') || 'No recent sessions'}`;

    if (learningContext.strugglingTopics?.length > 0) {
      prompt += `\n- Topics needing attention: ${learningContext.strugglingTopics.join(', ')}`;
    }
  }

  // Enhanced conversation analysis
  const conversationContext = analyzeConversationContext(chatHistory, message);
  
  // Add chat history context
  if (chatHistory.length > 0) {
    prompt += `\n\n## RECENT CONVERSATION:`;
    chatHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'Student' : 'Coach';
      prompt += `\n${role}: ${msg.content}`;
    });

    // Add conversation analysis
    prompt += `\n\n## CONVERSATION ANALYSIS:
- Message Type: ${conversationContext.messageType}
- Is Answering Previous Question: ${conversationContext.isAnswering}
- Last AI Question: ${conversationContext.lastAIQuestion || 'None'}
- Topic Continuity: ${conversationContext.topicContinuity}`;
  }

  // Add current user message with enhanced context
  prompt += `\n\n## CURRENT STUDENT MESSAGE: "${message}"`;

  // Inject state-specific instructions
  const trimmed = message.trim();
  if (trimmed.startsWith('/answer')) {
    prompt += `\n\n## STATE INSTRUCTIONS (Direct Answer Exception)\n${STATE_PROMPT_DIRECT_ANSWER}`;
  } else if (conversationContext.isAnswering && conversationContext.lastAIQuestion) {
    const evalBlock = STATE_PROMPT_EVALUATE_ANSWER.replace('[user_input]', trimmed);
    prompt += `\n\n## STATE INSTRUCTIONS (Evaluate Answer)\n${evalBlock}`;
  } else {
    prompt += `\n\n## STATE INSTRUCTIONS (Initiate Session)\n${STATE_PROMPT_INITIATE_SESSION}`;
  }

  // General guardrails
  prompt += `\n\n## RESPONSE INSTRUCTIONS:\n- Maintain conversational context and topic persistence\n- Apply the appropriate mode rules (${chatMode} mode)\n- Use Socratic method; do not give direct answers unless '/answer' is used\n- Be concise, supportive, and encouraging`;
  
  return prompt;
}

function extractLastQuestion(chatHistory: any[], currentMessage: string): string | null {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const msg = chatHistory[i];
    if (msg.role === 'assistant' && (msg.content.includes('?') || 
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

interface ConversationContext {
  messageType: 'new_question' | 'answer_response' | 'platform_query' | 'unclear';
  isAnswering: boolean;
  lastAIQuestion: string | null;
  topicContinuity: 'same_topic' | 'new_topic' | 'platform_help';
}

function analyzeConversationContext(chatHistory: any[], currentMessage: string): ConversationContext {
  const lastAIMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
  const lastAIQuestion = lastAIMessage?.role === 'assistant' ? extractLastQuestion([lastAIMessage], currentMessage) : null;
  
  // Check if it's a platform query
  const platformKeywords = /how do i|how to|where is|getting started|make flashcards|study sessions|dashboard|progress/i;
  if (platformKeywords.test(currentMessage)) {
    return {
      messageType: 'platform_query',
      isAnswering: false,
      lastAIQuestion,
      topicContinuity: 'platform_help'
    };
  }

  // Check if user is answering a previous question
  const answerPatterns = [
    /^(yes|no|maybe|i think|i believe|is it|that's|this is|it's|the answer is)/i,
    /^(because|since|due to|as a result)/i,
    /^[a-zA-Z\s]{1,50}$/i, // Short responses likely to be answers
  ];
  
  // Include numeric-only responses and simple math expressions as likely answers
  const numericAnswer = /^\s*[-+]?\d+(?:\.\d+)?\s*$/; // e.g., 54, 3.14
  const simpleMathExpr = /\b\d+\s*([x*×+\/-])\s*\d+\b/;

  const isLikelyAnswer = !!lastAIQuestion && (
    answerPatterns.some(pattern => pattern.test(currentMessage.trim())) ||
    numericAnswer.test(currentMessage) ||
    simpleMathExpr.test(currentMessage) ||
    currentMessage.trim().length < 50 // Short responses are often answers
  );

  if (isLikelyAnswer) {
    return {
      messageType: 'answer_response',
      isAnswering: true,
      lastAIQuestion,
      topicContinuity: 'same_topic'
    };
  }

  // Check if it's a new academic question
  const questionPatterns = /what is|explain|how does|why|tell me about|\?/i;
  if (questionPatterns.test(currentMessage)) {
    return {
      messageType: 'new_question',
      isAnswering: false,
      lastAIQuestion,
      topicContinuity: 'new_topic'
    };
  }

  return {
    messageType: 'unclear',
    isAnswering: false,
    lastAIQuestion,
    topicContinuity: 'same_topic'
  };
}

function isFollowUpQuestion(message: string): boolean {
  const followUpPatterns = [
    /^(yes|no|maybe|i think|i believe|is it)/i,
    /^(that|this|it|the)/i,
    /\?$/,
    /^(what about|how about|what if)/i
  ];
  
  return followUpPatterns.some(pattern => pattern.test(message.trim()));
}
