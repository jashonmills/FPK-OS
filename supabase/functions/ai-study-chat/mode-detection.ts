
import { QueryMode } from './types.ts';

// Precise query classification based on explicit personal data references
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
  if (personalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'personal';
  }
  
  // All other queries are general knowledge by default
  // This includes: "What caused...", "Define...", "Explain...", "Who was...", etc.
  return 'general';
}
