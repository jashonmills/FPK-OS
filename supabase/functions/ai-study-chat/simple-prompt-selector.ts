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
  const systemPrompt = context.chatMode === 'personal' 
    ? SYSTEM_PROMPT_PERSONAL 
    : SYSTEM_PROMPT_GENERAL;

  let prompt = systemPrompt;

  // Add voice instructions if needed
  if (context.voiceActive) {
    prompt += `\n\n## VOICE MODE
- Keep responses concise and conversational
- Avoid complex formatting
- Use natural speech patterns`;
  }

  // Add state-specific instructions
  switch (promptType) {
    case 'direct_answer':
      prompt += `\n\n## STATE INSTRUCTIONS\n${STATE_PROMPT_DIRECT_ANSWER}`;
      break;
    case 'proactive_help':
      prompt += `\n\n## STATE INSTRUCTIONS\n${STATE_PROMPT_PROACTIVE_HELP}`;
      break;
    case 'evaluate_refresher':
      const refresherPrompt = STATE_PROMPT_EVALUATE_REFRESHER.replace('[user_input]', context.userInput || '');
      prompt += `\n\n## STATE INSTRUCTIONS\n${refresherPrompt}`;
      break;
    case 'evaluate_quiz_answer':
      const quizEvalPrompt = STATE_PROMPT_EVALUATE_QUIZ_ANSWER.replace('[user_input]', context.userInput || '');
      prompt += `\n\n## STATE INSTRUCTIONS\n${quizEvalPrompt}`;
      break;
    case 'evaluate_answer':
      const evalPrompt = STATE_PROMPT_EVALUATE_ANSWER
        .replace('[user_input]', context.userInput || '')
        .replace('[teaching_history]', context.teachingHistory || 'No previous methods used')
        .replace('[incorrect_answers_count]', (context.incorrectCount || 0).toString());
      prompt += `\n\n## STATE INSTRUCTIONS\n${evalPrompt}`;
      break;
    case 'initiate_quiz':
      const quizPrompt = STATE_PROMPT_INITIATE_QUIZ.replace('[quiz_topic]', context.quizTopic || 'general knowledge');
      prompt += `\n\n## STATE INSTRUCTIONS\n${quizPrompt}`;
      break;
    case 'initiate_session':
    default:
      prompt += `\n\n## STATE INSTRUCTIONS\n${STATE_PROMPT_INITIATE_SESSION}`;
      break;
  }

  return prompt;
}