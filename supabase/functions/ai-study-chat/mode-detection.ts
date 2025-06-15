
import { QueryMode } from './types.ts';

// Precise query classification with strict personal data detection
export function detectQueryMode(message: string): QueryMode {
  const personalKeywords = [
    // Explicit personal possessive references
    'my flashcards', 'my cards', 'my xp', 'my streak', 'my goals',
    'my performance', 'my accuracy', 'my progress', 'my stats',
    
    // Personal study history references
    'recent study', 'last session', 'sessions i', 'cards i',
    'flashcards i', 'my learning', 'recent cards',
    
    // Personal activity references
    'studied today', 'completed today', 'reviewed today',
    'my recent', 'my latest', 'my current'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for explicit personal data references FIRST
  const hasPersonalKeyword = personalKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (hasPersonalKeyword) {
    console.log('🔍 Personal data query detected with keyword match');
    return 'personal';
  }
  
  // All other queries are general knowledge by default
  console.log('🔍 General knowledge query detected - no personal keywords found');
  return 'general';
}
