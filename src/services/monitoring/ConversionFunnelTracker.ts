
/**
 * User Experience Analytics - Conversion Funnel Tracking
 * Tracks search-to-read conversion funnel and user journey
 */

interface FunnelStep {
  step: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ConversionEvent {
  userId?: string;
  sessionId: string;
  eventType: 'search' | 'view_results' | 'book_detail' | 'start_reading' | 'complete_reading';
  bookId?: string;
  query?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface FunnelMetrics {
  totalSearches: number;
  searchToView: number;
  viewToDetail: number;
  detailToRead: number;
  readToComplete: number;
  conversionRates: {
    searchToRead: number;
    searchToComplete: number;
    viewToRead: number;
  };
}

export class ConversionFunnelTracker {
  private sessions: Map<string, FunnelStep[]> = new Map();
  private events: ConversionEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  /**
   * Initialize conversion tracking
   */
  private initializeTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('session_pause', {});
      } else {
        this.trackEvent('session_resume', {});
      }
    });

    // Track beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {});
    });

    console.log('🔄 Conversion funnel tracking initialized');
  }

  /**
   * Track search initiation
   */
  trackSearch(query: string, searchType: 'instant' | 'full' = 'full'): void {
    this.addFunnelStep('search', { query, searchType });
    this.recordEvent('search', { query, searchType });
  }

  /**
   * Track search results viewing
   */
  trackSearchResults(query: string, resultCount: number, loadTime?: number): void {
    this.addFunnelStep('view_results', { query, resultCount, loadTime });
    this.recordEvent('view_results', { query, resultCount, loadTime });
  }

  /**
   * Track book detail viewing
   */
  trackBookDetail(bookId: string, source: 'search' | 'recommendation' | 'browse' = 'search'): void {
    this.addFunnelStep('book_detail', { bookId, source });
    this.recordEvent('book_detail', { bookId, source });
  }

  /**
   * Track reading session start
   */
  trackReadingStart(bookId: string, format: 'epub' | 'pdf', loadTime?: number): void {
    this.addFunnelStep('start_reading', { bookId, format, loadTime });
    this.recordEvent('start_reading', { bookId, format, loadTime });
  }

  /**
   * Track reading session progress
   */
  trackReadingProgress(bookId: string, progress: number, timeSpent: number): void {
    this.addFunnelStep('reading_progress', { bookId, progress, timeSpent });
  }

  /**
   * Track reading completion
   */
  trackReadingComplete(bookId: string, totalTime: number, completionRate: number): void {
    this.addFunnelStep('complete_reading', { bookId, totalTime, completionRate });
    this.recordEvent('complete_reading', { bookId, totalTime, completionRate });
  }

  /**
   * Track drop-off points
   */
  trackDropOff(step: string, reason?: string): void {
    this.addFunnelStep('drop_off', { step, reason });
  }

  /**
   * Track user engagement events
   */
  trackEngagement(action: string, metadata: Record<string, any> = {}): void {
    this.addFunnelStep('engagement', { action, ...metadata });
  }

  /**
   * Add funnel step
   */
  private addFunnelStep(step: string, metadata: Record<string, any> = {}): void {
    const currentSteps = this.sessions.get(this.sessionId) || [];
    currentSteps.push({
      step,
      timestamp: Date.now(),
      metadata
    });
    this.sessions.set(this.sessionId, currentSteps);
  }

  /**
   * Record conversion event
   */
  private recordEvent(eventType: ConversionEvent['eventType'], metadata: Record<string, any> = {}): void {
    const event: ConversionEvent = {
      sessionId: this.sessionId,
      eventType,
      timestamp: Date.now(),
      metadata,
      ...metadata // Include bookId, query etc. from metadata
    };

    this.events.push(event);
    console.log(`📊 Funnel event: ${eventType}`, metadata);
  }

  /**
   * Track generic event
   */
  trackEvent(eventType: string, metadata: Record<string, any>): void {
    this.addFunnelStep(eventType, metadata);
  }

  /**
   * Calculate conversion metrics
   */
  getConversionMetrics(): FunnelMetrics {
    const searchEvents = this.events.filter(e => e.eventType === 'search');
    const viewEvents = this.events.filter(e => e.eventType === 'view_results');
    const detailEvents = this.events.filter(e => e.eventType === 'book_detail');
    const readEvents = this.events.filter(e => e.eventType === 'start_reading');
    const completeEvents = this.events.filter(e => e.eventType === 'complete_reading');

    const totalSearches = searchEvents.length;
    const searchToView = viewEvents.length;
    const viewToDetail = detailEvents.length;
    const detailToRead = readEvents.length;
    const readToComplete = completeEvents.length;

    return {
      totalSearches,
      searchToView,
      viewToDetail,
      detailToRead,
      readToComplete,
      conversionRates: {
        searchToRead: totalSearches > 0 ? (detailToRead / totalSearches) * 100 : 0,
        searchToComplete: totalSearches > 0 ? (readToComplete / totalSearches) * 100 : 0,
        viewToRead: searchToView > 0 ? (detailToRead / searchToView) * 100 : 0
      }
    };
  }

  /**
   * Get funnel visualization data
   */
  getFunnelData(): { step: string; count: number; conversionRate: number }[] {
    const metrics = this.getConversionMetrics();
    const steps = [
      { step: 'Search', count: metrics.totalSearches, conversionRate: 100 },
      { step: 'View Results', count: metrics.searchToView, conversionRate: metrics.totalSearches > 0 ? (metrics.searchToView / metrics.totalSearches) * 100 : 0 },
      { step: 'Book Detail', count: metrics.viewToDetail, conversionRate: metrics.searchToView > 0 ? (metrics.viewToDetail / metrics.searchToView) * 100 : 0 },
      { step: 'Start Reading', count: metrics.detailToRead, conversionRate: metrics.viewToDetail > 0 ? (metrics.detailToRead / metrics.viewToDetail) * 100 : 0 },
      { step: 'Complete Reading', count: metrics.readToComplete, conversionRate: metrics.detailToRead > 0 ? (metrics.readToComplete / metrics.detailToRead) * 100 : 0 }
    ];

    return steps;
  }

  /**
   * Get session timeline
   */
  getSessionTimeline(sessionId: string = this.sessionId): FunnelStep[] {
    return this.sessions.get(sessionId) || [];
  }

  /**
   * Get drop-off analysis
   */
  getDropOffAnalysis(): Record<string, number> {
    const dropOffs: Record<string, number> = {};
    
    this.sessions.forEach((steps) => {
      for (let i = 0; i < steps.length - 1; i++) {
        const currentStep = steps[i].step;
        const nextStep = steps[i + 1].step;
        
        // If there's a significant time gap, consider it a drop-off
        const timeDiff = steps[i + 1].timestamp - steps[i].timestamp;
        if (timeDiff > 300000) { // 5 minutes
          dropOffs[currentStep] = (dropOffs[currentStep] || 0) + 1;
        }
      }
    });

    return dropOffs;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all events
   */
  getEvents(): ConversionEvent[] {
    return [...this.events];
  }

  /**
   * Clear session data
   */
  clearSession(): void {
    this.sessions.clear();
    this.events.length = 0;
    this.sessionId = this.generateSessionId();
  }
}
