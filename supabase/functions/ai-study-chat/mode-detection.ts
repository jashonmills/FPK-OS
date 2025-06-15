
import { QueryMode } from './types.ts';

// Detect if query is personal or general knowledge
export function detectQueryMode(message: string): QueryMode {
  const personalKeywords = [
    'my flashcards', 'my cards', 'my progress', 'my stats', 'my xp', 'my streak',
    'recent cards', 'last session', 'my performance', 'my accuracy', 'my goals',
    'cards i', 'flashcards i', 'sessions i', 'studied', 'my learning'
  ];
  
  const generalKeywords = [
    'what is', 'what are', 'what causes', 'what caused', 'how does', 'how do', 'explain', 'define',
    'history', 'science', 'math', 'physics', 'chemistry', 'biology', 'geography',
    'causes of', 'civil war', 'world war', 'definition of', 'american revolution',
    'french revolution', 'industrial revolution', 'great depression', 'cold war',
    'renaissance', 'enlightenment', 'reformation', 'constitution', 'declaration',
    'who was', 'when did', 'where did', 'why did', 'how did', 'tell me about'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for personal keywords first (higher priority for user data)
  if (personalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'personal';
  }
  
  // Check for general knowledge keywords (most academic questions)
  if (generalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'general';
  }
  
  // Additional pattern matching for academic questions
  if (lowerMessage.match(/\b(causes?|reasons?|factors?|start|beginning|origins?)\b.*\b(war|conflict|revolution|crisis|event)\b/)) {
    return 'general';
  }
  
  // Default to general knowledge for questions
  return 'general';
}
