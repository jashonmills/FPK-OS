
export type QueryMode = 'personal' | 'general' | 'mixed';

export function detectQueryMode(message: string): QueryMode {
  const lowerMessage = message.toLowerCase();
  
  // Enhanced personal data keywords - more comprehensive detection
  const personalDataKeywords = [
    // Flashcard-specific patterns
    'my flashcards', 'my cards', 'recent flashcards', 'recent cards',
    'last flashcards', 'last cards', 'newest flashcards', 'newest cards',
    'recently created', 'just created', 'latest flashcards', 'latest cards',
    'flashcards i created', 'cards i created', 'flashcards i made', 'cards i made',
    'most recent flashcards', 'most recent cards', 'last 5 flashcards', 'last 10 flashcards',
    
    // Study data patterns
    'my study', 'my sessions', 'my performance', 'my progress',
    'my accuracy', 'my streak', 'my stats', 'my xp',
    'recent study', 'last session', 'study history',
    'cards i studied', 'sessions i completed',
    
    // Performance patterns
    'how am i doing', 'my results', 'my scores',
    'struggling with', 'need practice', 'review my'
  ];
  
  // Check for personal data keywords
  const hasPersonalKeywords = personalDataKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Enhanced general knowledge patterns
  const generalKeywords = [
    'what is', 'what are', 'what was', 'what were',
    'who is', 'who was', 'who are', 'who were',
    'when did', 'when was', 'when were',
    'where is', 'where was', 'where are',
    'how does', 'how did', 'how do', 'how to',
    'why does', 'why did', 'why is', 'why are',
    'explain', 'define', 'tell me about',
    'history of', 'meaning of', 'examples of'
  ];
  
  const hasGeneralKeywords = generalKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Prioritize personal data detection
  if (hasPersonalKeywords) {
    return 'personal';
  }
  
  if (hasGeneralKeywords) {
    return 'general';
  }
  
  // Default to personal for ambiguous queries in personal mode
  return 'personal';
}

// Enhanced detection for recent flashcards specifically
export function detectRecentFlashcardsRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const recentFlashcardPatterns = [
    'recent flashcards', 'recent cards', 'most recent flashcards', 'most recent cards',
    'last flashcards', 'last cards', 'latest flashcards', 'latest cards',
    'newest flashcards', 'newest cards', 'recently created',
    'flashcards i created', 'cards i created', 'flashcards i made',
    'last 5 flashcards', 'last 10 flashcards', 'last few flashcards',
    'show me my flashcards', 'what flashcards do i have'
  ];
  
  return recentFlashcardPatterns.some(pattern => lowerMessage.includes(pattern));
}
