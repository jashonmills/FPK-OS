
export type QueryMode = 'personal' | 'general' | 'platform' | 'mixed';

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
  
  // Study session keywords (highest priority for academic study)
  const studySessionKeywords = [
    'help me study', 'teach me about', 'can you teach me', 'i want to study',
    'study with me', 'let\'s study', 'i need to learn', 'teach me'
  ];

  // Platform-specific keywords for how-to guides
  const platformKeywords = [
    // Flashcard creation and management
    'how do i make flashcards', 'how to create flashcards', 'create new flashcard',
    'add flashcards', 'make flashcards', 'create cards', 'how to make cards',
    'flashcard creation', 'creating flashcards', 'add new cards',
    
    // Platform navigation and features
    'how do i use', 'how to use', 'navigate to', 'find the', 'where is',
    'how to study', 'start studying', 'begin study session',
    'dashboard', 'library', 'goals', 'progress tracking',
    'how to track progress', 'view my stats', 'check my progress',
    
    // Study session guidance
    'start a quiz', 'how to quiz', 'study session', 'practice mode',
    'how to review', 'study my cards', 'practice flashcards',
    
    // Account and settings
    'profile settings', 'account settings', 'change my', 'update my',
    'upload files', 'import cards', 'export data',
    
    // General platform help
    'how does this work', 'getting started', 'tutorial', 'guide me',
    'show me how', 'help me', 'instructions for'
  ];
  
  // Enhanced general knowledge patterns (external facts)
  const generalKeywords = [
    'what is photosynthesis', 'who was napoleon', 'what caused',
    'history of', 'capital of', 'meaning of', 'examples of',
    'define quantum', 'explain relativity', 'tell me about world war',
    'what happened in', 'who invented', 'when was discovered',
    'scientific method', 'periodic table', 'shakespeare wrote',
    'mathematical concept', 'biology definition', 'chemistry equation'
  ];
  
  // Check for personal data keywords (highest priority)
  const hasPersonalKeywords = personalDataKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for study session keywords (second priority)
  const hasStudySessionKeywords = studySessionKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for platform keywords (third priority)
  const hasPlatformKeywords = platformKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for general knowledge keywords (fourth priority)
  const hasGeneralKeywords = generalKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Prioritize: Personal > Study Session > Platform > General
  if (hasPersonalKeywords) {
    return 'personal';
  }
  
  if (hasStudySessionKeywords) {
    return 'general'; // Study sessions use general mode but with special handling
  }
  
  if (hasPlatformKeywords) {
    return 'platform';
  }
  
  if (hasGeneralKeywords) {
    return 'general';
  }
  
  // Heuristic fallback: question-like or math-like inputs are general knowledge
  const looksLikeQuestion = /\b(what|who|why|how|when|where)\b|\?/i.test(lowerMessage);
  const looksLikeMath = /\b\d+\s*([x*×+\/-])\s*\d+\b/.test(lowerMessage);
  if (looksLikeQuestion || looksLikeMath) {
    return 'general';
  }
  
  // Default to platform for ambiguous navigation/help-like inputs
  return 'platform';
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

// Detection for study session requests
export function detectStudySessionRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const studySessionPatterns = [
    'help me study', 'teach me about', 'can you teach me', 'i want to study',
    'study with me', 'let\'s study', 'i need to learn', 'teach me'
  ];
  
  return studySessionPatterns.some(pattern => lowerMessage.includes(pattern));
}
