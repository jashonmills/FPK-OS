// Simple Blueprint v7.0 Prompt Selector - Streamlined Architecture
// No legacy imports needed - SOCRATIC_BLUEPRINT_V7 handles all behavioral logic

export type PromptType = 
  | 'initiate_session'
  | 'initiate_quiz' 
  | 'evaluate_answer'
  | 'evaluate_quiz_answer'
  | 'proactive_help'
  | 'evaluate_refresher'
  | 'direct_answer'
  | 'direct_teaching';

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
    case 'direct_teaching':
      prompt += `## CONTEXT\nUser asked a simple, foundational question: "${context.userInput || ''}"\nThis requires direct teaching followed by Socratic follow-up.\n`;
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