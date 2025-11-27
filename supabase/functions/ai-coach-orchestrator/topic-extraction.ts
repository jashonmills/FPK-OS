/**
 * PHASE 3: Topic Keyword Extraction Utility
 * 
 * Simple, fast topic extraction without requiring LLM calls.
 * Used for proactive handoff detection.
 */

// Common learning topics and their aliases
const TOPIC_PATTERNS: Record<string, string[]> = {
  'typescript': ['typescript', 'ts', 'type script'],
  'javascript': ['javascript', 'js', 'ecmascript'],
  'programming': ['programming', 'coding', 'software', 'development'],
  'python': ['python', 'py'],
  'react': ['react', 'reactjs', 'jsx'],
  'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm'],
  'database': ['database', 'sql', 'postgres', 'mysql', 'db'],
  'web development': ['web', 'frontend', 'backend', 'fullstack'],
  'data structures': ['data structure', 'algorithm', 'array', 'linked list'],
  'math': ['math', 'mathematics', 'algebra', 'calculus', 'geometry'],
  'physics': ['physics', 'mechanics', 'quantum'],
  'chemistry': ['chemistry', 'chemical', 'molecule'],
  'biology': ['biology', 'cell', 'organism', 'dna'],
};

// Stop words to ignore
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'can', 'could',
  'should', 'would', 'will', 'do', 'does', 'did', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'tell', 'me', 'about', 'more',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than',
  'too', 'very', 'can', 'just', 'should', 'now', 'use', 'using', 'learn'
]);

/**
 * Extract topic keywords from user messages
 * @param messages - Array of lowercase user message content
 * @returns Array of detected topic keywords (most relevant first)
 */
export function extractTopicKeywords(messages: string[]): string[] {
  const combinedText = messages.join(' ').toLowerCase();
  const detectedTopics: Array<{ topic: string; count: number }> = [];
  
  // Check for known topic patterns
  for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
    let matchCount = 0;
    for (const pattern of patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      const matches = combinedText.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    }
    if (matchCount > 0) {
      detectedTopics.push({ topic, count: matchCount });
    }
  }
  
  // Sort by frequency and return top 3
  detectedTopics.sort((a, b) => b.count - a.count);
  const topicKeywords = detectedTopics.slice(0, 3).map(t => t.topic);
  
  // If no patterns matched, extract significant words
  if (topicKeywords.length === 0) {
    const words = combinedText
      .split(/\s+/)
      .filter(word => 
        word.length > 4 && // At least 5 characters
        !STOP_WORDS.has(word) &&
        /^[a-z]+$/.test(word) // Only letters
      );
    
    // Count word frequency
    const wordCounts = new Map<string, number>();
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    // Get most frequent words
    const sortedWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
    
    return sortedWords;
  }
  
  return topicKeywords;
}
