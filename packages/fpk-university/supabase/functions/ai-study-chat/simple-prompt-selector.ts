// Simple Blueprint v7.0 Prompt Selector - Streamlined Architecture
// No legacy imports needed - SOCRATIC_BLUEPRINT_V7 handles all behavioral logic

export type PromptType = 
  | 'initiate_session'
  | 'initiate_quiz' 
  | 'evaluate_answer'
  | 'evaluate_quiz_answer'
  | 'proactive_help'
  | 'evaluate_refresher'
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

  // Only add topic context if it's a legitimate learning topic (not greetings)
  if (context.originalTopic && isLegitimateTopicContext(context.originalTopic)) {
    prompt += `## LEARNING TOPIC\nFocus: "${context.originalTopic}"\n\n`;
  }

  // Add conversation history context if available
  if (context.conversationHistory) {
    prompt += `## CONVERSATION SUMMARY\n${context.conversationHistory}\n\n`;
  }

  // Add minimal context based on conversation state  
  switch (promptType) {
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
      prompt += `## INSTRUCTIONS\nYou are a Socratic tutor for this specific lesson. Use ONLY the provided lesson content as your knowledge base. Guide the student through questioning. Remember the Golden Rule: NEVER provide direct answers, even if explicitly requested.\n\n`;
      prompt += `## USER QUERY\n"${context.userInput || ''}"\n`;
      break;
    case 'evaluate_answer':
      prompt += `## CONTEXT\nUser's response: "${context.userInput || ''}"\n`;
      if (context.originalTopic && isLegitimateTopicContext(context.originalTopic)) {
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

function isLegitimateTopicContext(topic: string): boolean {
  const lowercaseTopic = topic.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'ok', 'okay', 'yes', 'no', 'yeah', 'yep', 'sure'];
  
  // Filter out greetings and very short topics
  if (greetings.includes(lowercaseTopic) || lowercaseTopic.length <= 3) {
    return false;
  }
  
  // Require topics to have some substance
  return lowercaseTopic.length > 3 && (lowercaseTopic.includes(' ') || lowercaseTopic.includes('?'));
}