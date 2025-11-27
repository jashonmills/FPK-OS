
export interface TopicKeywords {
  [key: string]: string[];
}

// Define topic keywords for automatic categorization
const TOPIC_KEYWORDS: TopicKeywords = {
  'The Goonies': ['goonies', 'treasure', 'chunk', 'sloth', 'truffle shuffle', 'one-eyed willy', 'astoria'],
  'Learning State': ['learning state', 'cognitive load', 'attention', 'focus', 'memory formation', 'retention', 'metacognition'],
  'Dragon Fire': ['dragon', 'fire', 'fantasy', 'medieval', 'magic', 'spell', 'knight'],
  'Cannabis Agriculture': ['cannabis', 'hemp', 'cbd', 'thc', 'cultivation', 'agriculture', 'growing', 'strain'],
  'Photography': ['photography', 'camera', 'lens', 'exposure', 'aperture', 'shutter', 'iso', 'composition'],
  'Wellness': ['wellness', 'health', 'nutrition', 'exercise', 'mental health', 'mindfulness', 'stress', 'meditation'],
  'Technology': ['technology', 'programming', 'coding', 'software', 'hardware', 'computer', 'algorithm', 'database'],
  'Science': ['science', 'biology', 'chemistry', 'physics', 'research', 'experiment', 'hypothesis', 'theory'],
  'Business': ['business', 'marketing', 'sales', 'finance', 'management', 'strategy', 'entrepreneur', 'revenue'],
  'History': ['history', 'historical', 'ancient', 'civilization', 'war', 'empire', 'culture', 'timeline']
};

export const analyzeFlashcardTopic = (
  frontContent: string, 
  backContent: string, 
  noteId?: string | null,
  createdAt?: string
): string => {
  const combinedContent = `${frontContent} ${backContent}`.toLowerCase();
  
  // Check for topic keywords in content
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (combinedContent.includes(keyword.toLowerCase())) {
        return topic;
      }
    }
  }
  
  // If no topic keywords found, categorize by source
  if (noteId) {
    // Check if it's from a note - could analyze note title if available
    return 'Study Notes';
  }
  
  // Check creation date patterns for batch uploads
  if (createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    
    // If created within last hour, likely from recent upload
    if (diffInHours < 1) {
      return 'Recent Upload';
    }
  }
  
  // Default category for manually created cards
  return 'Manual Cards';
};

export const extractTopicFromContent = (content: string): string | null => {
  const lowerContent = content.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        return topic;
      }
    }
  }
  
  return null;
};

export const suggestFolderName = (cards: any[]): string => {
  if (cards.length === 0) return 'Empty Folder';
  
  // Analyze first few cards to suggest a name
  const sampleCards = cards.slice(0, 3);
  const contentSample = sampleCards
    .map(card => `${card.front_content} ${card.back_content}`)
    .join(' ')
    .toLowerCase();
  
  // Look for common themes
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      contentSample.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount >= 2) {
      return topic;
    }
  }
  
  return 'Mixed Topics';
};
