
import { QueryMode } from './types.ts';

// Detect if query is personal or general knowledge
export function detectQueryMode(message: string): QueryMode {
  const personalKeywords = [
    'my flashcards', 'my cards', 'my progress', 'my stats', 'my xp', 'my streak',
    'recent cards', 'last session', 'my performance', 'my accuracy', 'my goals',
    'cards i', 'flashcards i', 'sessions i', 'studied', 'learning'
  ];
  
  const generalKeywords = [
    'what is', 'what are', 'what causes', 'how does', 'explain', 'define',
    'history', 'science', 'math', 'physics', 'chemistry', 'biology',
    'causes of', 'civil war', 'world war', 'definition of'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for personal keywords first (higher priority)
  if (personalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'personal';
  }
  
  // Check for general knowledge keywords
  if (generalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'general';
  }
  
  // Default to general knowledge for ambiguous cases
  return 'general';
}
