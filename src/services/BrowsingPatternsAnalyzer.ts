
/**
 * Browsing patterns analyzer for intelligent background prefetching
 */

import { PublicDomainBook } from '@/types/publicDomainBooks';
import { performanceService } from './PerformanceOptimizationService';
import { indexedDBCache } from './IndexedDBCacheService';

interface BrowsingSession {
  sessionId: string;
  startTime: number;
  books: BrowsingEvent[];
  patterns: string[];
}

interface BrowsingEvent {
  bookId: string;
  action: 'view' | 'click' | 'read' | 'search';
  timestamp: number;
  duration?: number;
  metadata?: any;
}

interface PrefetchPrediction {
  bookId: string;
  confidence: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

class BrowsingPatternsAnalyzer {
  private currentSession: BrowsingSession;
  private sessionHistory: BrowsingSession[] = [];
  private behaviorPatterns: Map<string, number> = new Map();
  private prefetchQueue: Set<string> = new Set();
  private isAnalyzing = false;

  constructor() {
    this.currentSession = this.createNewSession();
    this.loadBrowsingHistory();
  }

  private createNewSession(): BrowsingSession {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      books: [],
      patterns: []
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record a browsing event for pattern analysis
   */
  recordEvent(bookId: string, action: 'view' | 'click' | 'read' | 'search', metadata?: any): void {
    const event: BrowsingEvent = {
      bookId,
      action,
      timestamp: Date.now(),
      metadata
    };

    this.currentSession.books.push(event);
    
    // Trigger pattern analysis if we have enough events
    if (this.currentSession.books.length >= 3) {
      this.analyzeCurrentSession();
    }

    console.log('📊 Recorded browsing event:', { bookId, action, sessionLength: this.currentSession.books.length });
  }

  /**
   * Analyze current session for patterns and trigger prefetching
   */
  private async analyzeCurrentSession(): Promise<void> {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    try {
      const patterns = this.extractSessionPatterns();
      this.currentSession.patterns = patterns;

      // Generate prefetch predictions
      const predictions = await this.generatePrefetchPredictions();
      
      // Execute high-priority prefetches
      const highPriorityBooks = predictions
        .filter(p => p.priority === 'high' && p.confidence > 0.7)
        .slice(0, 3); // Limit to avoid overwhelming the network

      await this.executePrefetching(highPriorityBooks);
      
      // Update behavior patterns for future sessions
      this.updateBehaviorPatterns(patterns);

    } catch (error) {
      console.error('Pattern analysis error:', error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  private extractSessionPatterns(): string[] {
    const events = this.currentSession.books;
    const patterns: string[] = [];

    // Pattern 1: Author preference
    const authors = new Map<string, number>();
    events.forEach(event => {
      if (event.metadata?.author) {
        authors.set(event.metadata.author, (authors.get(event.metadata.author) || 0) + 1);
      }
    });

    const favoriteAuthor = Array.from(authors.entries())
      .sort(([, a], [, b]) => b - a)[0];
    
    if (favoriteAuthor && favoriteAuthor[1] >= 2) {
      patterns.push(`author:${favoriteAuthor[0]}`);
    }

    // Pattern 2: Subject interest
    const subjects = new Map<string, number>();
    events.forEach(event => {
      if (event.metadata?.subjects) {
        event.metadata.subjects.forEach((subject: string) => {
          subjects.set(subject, (subjects.get(subject) || 0) + 1);
        });
      }
    });

    const topSubject = Array.from(subjects.entries())
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topSubject && topSubject[1] >= 2) {
      patterns.push(`subject:${topSubject[0]}`);
    }

    // Pattern 3: Reading behavior
    const readingEvents = events.filter(e => e.action === 'read');
    if (readingEvents.length >= 2) {
      patterns.push('active_reader');
    }

    // Pattern 4: Search behavior
    const searchEvents = events.filter(e => e.action === 'search');
    if (searchEvents.length >= 3) {
      patterns.push('active_searcher');
    }

    return patterns;
  }

  private async generatePrefetchPredictions(): Promise<PrefetchPrediction[]> {
    const predictions: PrefetchPrediction[] = [];
    const recentEvents = this.currentSession.books.slice(-5); // Last 5 events

    // Prediction 1: Similar books by same author
    const viewedBooks = recentEvents.filter(e => e.action === 'view' || e.action === 'read');
    for (const event of viewedBooks) {
      if (event.metadata?.author) {
        predictions.push({
          bookId: `similar_author:${event.metadata.author}`,
          confidence: 0.8,
          reason: `User showed interest in ${event.metadata.author}`,
          priority: 'high'
        });
      }
    }

    // Prediction 2: Books in same subject areas
    const subjectInterests = this.extractSubjectInterests(recentEvents);
    subjectInterests.forEach(subject => {
      predictions.push({
        bookId: `subject:${subject}`,
        confidence: 0.6,
        reason: `User browsing ${subject} books`,
        priority: 'medium'
      });
    });

    // Prediction 3: Sequential reading patterns
    if (this.detectSequentialReading(recentEvents)) {
      predictions.push({
        bookId: 'next_in_series',
        confidence: 0.9,
        reason: 'Sequential reading pattern detected',
        priority: 'high'
      });
    }

    return predictions;
  }

  private extractSubjectInterests(events: BrowsingEvent[]): string[] {
    const subjectCounts = new Map<string, number>();
    
    events.forEach(event => {
      if (event.metadata?.subjects) {
        event.metadata.subjects.forEach((subject: string) => {
          subjectCounts.set(subject, (subjectCounts.get(subject) || 0) + 1);
        });
      }
    });

    return Array.from(subjectCounts.entries())
      .filter(([, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);
  }

  private detectSequentialReading(events: BrowsingEvent[]): boolean {
    const readEvents = events.filter(e => e.action === 'read');
    return readEvents.length >= 2 && 
           readEvents.every(e => e.duration && e.duration > 60000); // More than 1 minute reading
  }

  private async executePrefetching(predictions: PrefetchPrediction[]): Promise<void> {
    console.log('🚀 Executing intelligent prefetching for', predictions.length, 'predictions');

    for (const prediction of predictions) {
      try {
        // Skip if already prefetched
        if (this.prefetchQueue.has(prediction.bookId)) continue;

        this.prefetchQueue.add(prediction.bookId);
        
        // Use performance service for actual prefetching
        // This is a simplified version - in practice, you'd match predictions to actual books
        console.log(`📚 Prefetching based on: ${prediction.reason} (confidence: ${prediction.confidence})`);
        
        // Add small delay between prefetches to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.warn('Prefetch failed for:', prediction.bookId, error);
      }
    }
  }

  private updateBehaviorPatterns(patterns: string[]): void {
    patterns.forEach(pattern => {
      const current = this.behaviorPatterns.get(pattern) || 0;
      this.behaviorPatterns.set(pattern, current + 1);
    });

    // Save to persistent storage
    this.saveBrowsingHistory();
  }

  /**
   * Get intelligent prefetch suggestions for the current user
   */
  async getPrefetchSuggestions(availableBooks: PublicDomainBook[]): Promise<PublicDomainBook[]> {
    const patterns = Array.from(this.behaviorPatterns.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const suggestions: PublicDomainBook[] = [];

    for (const [pattern, frequency] of patterns) {
      if (pattern.startsWith('author:')) {
        const author = pattern.replace('author:', '');
        const authorBooks = availableBooks.filter(book => 
          book.author.toLowerCase().includes(author.toLowerCase())
        ).slice(0, 2);
        suggestions.push(...authorBooks);
      }
      
      if (pattern.startsWith('subject:')) {
        const subject = pattern.replace('subject:', '');
        const subjectBooks = availableBooks.filter(book =>
          book.subjects?.some(s => s.toLowerCase().includes(subject.toLowerCase()))
        ).slice(0, 2);
        suggestions.push(...subjectBooks);
      }
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions.filter((book, index, array) =>
      array.findIndex(b => b.id === book.id) === index
    );

    return uniqueSuggestions.slice(0, 8);
  }

  /**
   * Start a new browsing session
   */
  startNewSession(): void {
    if (this.currentSession.books.length > 0) {
      this.sessionHistory.push(this.currentSession);
      this.saveBrowsingHistory();
    }
    
    this.currentSession = this.createNewSession();
    console.log('📊 Started new browsing session:', this.currentSession.sessionId);
  }

  /**
   * Get browsing analytics
   */
  getAnalytics() {
    return {
      currentSession: {
        id: this.currentSession.sessionId,
        duration: Date.now() - this.currentSession.startTime,
        eventCount: this.currentSession.books.length,
        patterns: this.currentSession.patterns
      },
      historicalSessions: this.sessionHistory.length,
      totalEvents: this.sessionHistory.reduce((sum, session) => sum + session.books.length, 0) + this.currentSession.books.length,
      behaviorPatterns: Object.fromEntries(this.behaviorPatterns),
      prefetchQueue: this.prefetchQueue.size
    };
  }

  private async loadBrowsingHistory(): Promise<void> {
    try {
      const saved = await indexedDBCache.get('browsing:history');
      if (saved) {
        this.sessionHistory = saved.sessions || [];
        this.behaviorPatterns = new Map(saved.patterns || []);
      }
    } catch (error) {
      console.warn('Failed to load browsing history:', error);
    }
  }

  private async saveBrowsingHistory(): Promise<void> {
    try {
      await indexedDBCache.set('browsing:history', {
        sessions: this.sessionHistory.slice(-10), // Keep last 10 sessions
        patterns: Array.from(this.behaviorPatterns.entries()),
        lastUpdated: Date.now()
      }, 'metadata');
    } catch (error) {
      console.warn('Failed to save browsing history:', error);
    }
  }

  /**
   * Clear browsing history and patterns
   */
  clearHistory(): void {
    this.sessionHistory = [];
    this.behaviorPatterns.clear();
    this.prefetchQueue.clear();
    this.currentSession = this.createNewSession();
    this.saveBrowsingHistory();
    console.log('🧹 Browsing history cleared');
  }
}

// Global browsing patterns analyzer instance
export const browsingPatternsAnalyzer = new BrowsingPatternsAnalyzer();
