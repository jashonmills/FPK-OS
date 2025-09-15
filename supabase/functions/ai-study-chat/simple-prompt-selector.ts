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
  | 'direct_teaching'
  | 'end_session'
  | 'topic_transition'
  | 'acknowledgment'
  | 'course_tutor';

export interface SimplePromptContext {
  chatMode: 'personal' | 'general';
  voiceActive: boolean;
  userInput?: string;
  quizTopic?: string;
  teachingHistory?: string;
  incorrectCount?: number;
  originalTopic?: string;
  conversationHistory?: string;
  lessonContent?: string;
  lessonTitle?: string;
  courseId?: string;
  lessonId?: number;
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

  // Add original topic context if available
  if (context.originalTopic) {
    prompt += `## ORIGINAL LEARNING TOPIC\nThe user originally wanted to learn about: "${context.originalTopic}"\nSTAY FOCUSED on this topic throughout the conversation.\n\n`;
  }

  // Add conversation history context if available
  if (context.conversationHistory) {
    prompt += `## CONVERSATION SUMMARY\n${context.conversationHistory}\n\n`;
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
    case 'end_session':
      prompt += `## CONTEXT\nUser wants to end the session: "${context.userInput || ''}"\nProvide a graceful conclusion and encourage future learning.\n`;
      break;
    case 'topic_transition':
      prompt += `## CONTEXT\nUser wants to transition to a new topic: "${context.userInput || ''}"\nAcknowledge the transition and start fresh with the new topic.\n`;
      break;
    case 'acknowledgment':
      prompt += `## CONTEXT\nUser is expressing gratitude: "${context.userInput || ''}"\nAcknowledge graciously and either continue or transition as appropriate.\n`;
      break;
    case 'course_tutor':
      prompt += `## LESSON CONTEXT\n`;
      prompt += `Lesson Title: ${context.lessonTitle || 'Current Lesson'}\n`;
      prompt += `Course: ${context.courseId || 'Unknown Course'}\n`;
      if (context.lessonContent) {
        prompt += `Lesson Content:\n${context.lessonContent}\n\n`;
      }
      prompt += `## INSTRUCTIONS\nYou are a Socratic tutor for this specific lesson. Use ONLY the provided lesson content as your knowledge base. Guide the student through questioning rather than direct answers. If the user types "/answer", then provide a direct answer using only the lesson content.\n\n`;
      prompt += `## USER QUERY\n"${context.userInput || ''}"\n`;
      break;
    case 'evaluate_answer':
      prompt += `## CONTEXT\nUser's response: "${context.userInput || ''}"\n`;
      if (context.originalTopic) {
        prompt += `IMPORTANT: Keep the discussion focused on "${context.originalTopic}". If the user's response is off-topic, acknowledge it briefly and redirect back to the original topic.\n`;
      }
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