// Simple Blueprint v6.0 Prompt Selector - Hybrid Architecture
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

export type PromptType = 
  | 'initiate_session'
  | 'initiate_quiz' 
  | 'evaluate_answer'
  | 'evaluate_quiz_answer'
  | 'proactive_help'
  | 'evaluate_refresher'
  | 'direct_answer';

export interface SimplePromptContext {
  chatMode: 'personal' | 'general';
  voiceActive: boolean;
  userInput?: string;
  quizTopic?: string;
  teachingHistory?: string;
  incorrectCount?: number;
}

export function buildSimplePrompt(promptType: PromptType, context: SimplePromptContext): string {
  // Only include user context and message - let SOCRATIC_BLUEPRINT_V7 handle all behavioral logic
  let prompt = '';

  // Add voice instructions if needed
  if (context.voiceActive) {
    prompt += `## VOICE MODE
- Keep responses concise and conversational
- Avoid complex formatting
- Use natural speech patterns

`;
  }

  // Add minimal context based on conversation state
  switch (promptType) {
    case 'direct_answer':
      prompt += `## CONTEXT\nUser is asking for a direct answer to: "${context.userInput || ''}"\n`;
      break;
    case 'proactive_help':
      prompt += `## CONTEXT\nUser may need encouragement or guidance.\n`;
      break;
    case 'evaluate_refresher':
      prompt += `## CONTEXT\nUser's response to refresher: "${context.userInput || ''}"\n`;
      break;
    case 'evaluate_quiz_answer':
      prompt += `## CONTEXT\nUser's quiz answer: "${context.userInput || ''}"\n`;
      break;
    case 'evaluate_answer':
      prompt += `## CONTEXT\nUser's response: "${context.userInput || ''}"\n`;
      break;
    case 'initiate_quiz':
      prompt += `## CONTEXT\nUser wants a quiz on: ${context.quizTopic || 'general knowledge'}\n`;
      break;
    case 'initiate_session':
    default:
      prompt += `## CONTEXT\nUser's question: "${context.userInput || ''}"\n`;
      break;
  }

  return prompt;
}