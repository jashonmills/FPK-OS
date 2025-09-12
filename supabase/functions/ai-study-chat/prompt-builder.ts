
import { QueryMode } from './types.ts';
import {
  SYSTEM_PROMPT_PERSONAL,
  SYSTEM_PROMPT_GENERAL,
  STATE_PROMPT_INITIATE_SESSION,
  STATE_PROMPT_INITIATE_QUIZ,
  STATE_PROMPT_EVALUATE_ANSWER,
  STATE_PROMPT_EVALUATE_QUIZ_ANSWER,
  STATE_PROMPT_PROACTIVE_HELP,
  STATE_PROMPT_EVALUATE_REFRESHER,
  STATE_PROMPT_DIRECT_ANSWER
} from './constants.ts';
 
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

  // Inject state-specific instructions with enhanced logic
  const trimmed = message.trim();
  const sessionContext = analyzeSessionContext(chatHistory, conversationContext);
  
  if (trimmed.startsWith('/answer')) {
    prompt += `\n\n## STATE INSTRUCTIONS (Direct Answer Exception)\n${STATE_PROMPT_DIRECT_ANSWER}`;
  } else if (isStruggleIndicator(trimmed)) {
    prompt += `\n\n## STATE INSTRUCTIONS (Proactive Help)\n${STATE_PROMPT_PROACTIVE_HELP}`;
  } else if (sessionContext.inRefresherMode) {
    const refresherBlock = STATE_PROMPT_EVALUATE_REFRESHER.replace('[user_input]', trimmed);
    prompt += `\n\n## STATE INSTRUCTIONS (Evaluate Refresher)\n${refresherBlock}`;
  } else if (conversationContext.isAnswering && conversationContext.lastAIQuestion) {
    // Check if we're in a quiz session by looking for quiz indicators in chat history
    const inQuizSession = isInQuizSession(chatHistory);
    
    if (inQuizSession) {
      const quizEvalBlock = STATE_PROMPT_EVALUATE_QUIZ_ANSWER.replace('[user_input]', trimmed);
      prompt += `\n\n## STATE INSTRUCTIONS (Evaluate Quiz Answer)\n${quizEvalBlock}`;
    } else {
      const teachingHistory = extractTeachingHistory(chatHistory);
      const evalBlock = STATE_PROMPT_EVALUATE_ANSWER
        .replace('[user_input]', trimmed)
        .replace('[teaching_history]', teachingHistory.join(', ') || 'No previous methods used')
        .replace('[incorrect_answers_count]', sessionContext.incorrectAnswersCount.toString());
      prompt += `\n\n## STATE INSTRUCTIONS (Evaluate Answer)\n${evalBlock}`;
    }
  } else if (isQuizRequest(trimmed)) {
    const quizTopic = extractQuizTopic(trimmed);
    const quizBlock = STATE_PROMPT_INITIATE_QUIZ.replace('[quiz_topic]', quizTopic);
    prompt += `\n\n## STATE INSTRUCTIONS (Initiate Quiz)\n${quizBlock}`;
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
  messageType: 'new_question' | 'answer_response' | 'platform_query' | 'quiz_request' | 'unclear';
  isAnswering: boolean;
  lastAIQuestion: string | null;
  topicContinuity: 'same_topic' | 'new_topic' | 'platform_help' | 'quiz_topic';
}

interface SessionContext {
  incorrectAnswersCount: number;
  inRefresherMode: boolean;
  currentTopic: string | null;
}

function analyzeConversationContext(chatHistory: any[], currentMessage: string): ConversationContext {
  const lastAIMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
  const lastAIQuestion = lastAIMessage?.role === 'assistant' ? extractLastQuestion([lastAIMessage], currentMessage) : null;
  
  // Check if it's a quiz request first
  if (isQuizRequest(currentMessage)) {
    return {
      messageType: 'quiz_request',
      isAnswering: false,
      lastAIQuestion,
      topicContinuity: 'quiz_topic'
    };
  }
  
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

function extractTeachingHistory(chatHistory: any[]): string[] {
  const teachingMethods: string[] = [];
  
  for (const msg of chatHistory) {
    if (msg.role === 'assistant') {
      const content = msg.content.toLowerCase();
      
      // Identify teaching methods used
      if (content.includes('add') && content.includes('times')) {
        teachingMethods.push('addition breakdown');
      }
      if (content.includes('analogy') || content.includes('like') || content.includes('imagine')) {
        teachingMethods.push('analogy method');
      }
      if (content.includes('break down') || content.includes('step by step')) {
        teachingMethods.push('step-by-step breakdown');
      }
      if (content.includes('example') || content.includes('for instance')) {
        teachingMethods.push('example illustration');
      }
      if (content.includes('visual') || content.includes('picture') || content.includes('draw')) {
        teachingMethods.push('visual approach');
      }
      if (content.includes('simpler') || content.includes('easier')) {
        teachingMethods.push('simplification method');
      }
      if (content.includes('pattern') || content.includes('sequence')) {
        teachingMethods.push('pattern recognition');
      }
      if (content.includes('group') || content.includes('set')) {
        teachingMethods.push('grouping method');
      }
    }
  }
  
  // Remove duplicates
  return [...new Set(teachingMethods)];
}

function analyzeSessionContext(chatHistory: any[], conversationContext: ConversationContext): SessionContext {
  let incorrectAnswersCount = 0;
  let inRefresherMode = false;
  let currentTopic: string | null = null;
  
  // Count recent consecutive incorrect answers
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const msg = chatHistory[i];
    if (msg.role === 'assistant') {
      const content = msg.content.toLowerCase();
      // Check if AI indicated incorrect answer
      if (content.includes('not quite') || content.includes('try again') || content.includes('incorrect')) {
        incorrectAnswersCount++;
      } else if (content.includes('correct') || content.includes('exactly') || content.includes('that\'s it')) {
        // Reset count on correct answer
        break;
      } else if (content.includes('refresher') || content.includes('foundational')) {
        inRefresherMode = true;
        break;
      }
    }
  }
  
  return {
    incorrectAnswersCount,
    inRefresherMode,
    currentTopic
  };
}

function isStruggleIndicator(message: string): boolean {
  const struggleKeywords = [
    /i need more help/i,
    /can you help/i,
    /i don't know/i,
    /i'm stuck/i,
    /i need to go back to the basics/i,
    /i'm confused/i,
    /this is hard/i,
    /i don't understand/i
  ];
  
  return struggleKeywords.some(pattern => pattern.test(message.trim()));
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

function isQuizRequest(message: string): boolean {
  const quizPatterns = [
    /quiz me on/i,
    /give me a quiz on/i,
    /test me on/i,
    /can you quiz me/i,
    /i want a quiz on/i,
    /quiz about/i,
    /test my knowledge/i
  ];
  
  return quizPatterns.some(pattern => pattern.test(message));
}

function extractQuizTopic(message: string): string {
  // Extract topic from patterns like "quiz me on [topic]", "test me on [topic]", etc.
  const patterns = [
    /(?:quiz me on|give me a quiz on|test me on|can you quiz me (?:on|about)|i want a quiz on|quiz about|test my knowledge (?:of|on|about))\s+(.+)/i
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/[?.!]*$/, ''); // Remove trailing punctuation
    }
  }
  
  // Fallback: return the whole message if no pattern matches
  return message.trim();
}

function isInQuizSession(chatHistory: any[]): boolean {
  // Look for recent quiz indicators in the chat history
  for (let i = chatHistory.length - 1; i >= Math.max(0, chatHistory.length - 5); i--) {
    const msg = chatHistory[i];
    if (msg.role === 'assistant') {
      const content = msg.content.toLowerCase();
      // Check for quiz-specific language patterns
      if (content.includes('quiz') || 
          content.includes('test') ||
          content.includes('let\'s start') ||
          content.includes('great idea! let\'s begin') ||
          content.includes('absolutely! let\'s start')) {
        return true;
      }
    } else if (msg.role === 'user') {
      // Check if user initiated a quiz recently
      if (isQuizRequest(msg.content)) {
        return true;
      }
    }
  }
  return false;
}
