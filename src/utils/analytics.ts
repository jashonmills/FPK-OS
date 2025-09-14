/**
 * External Analytics Integration (GA4 + Custom Events)
 * Provides unified interface for tracking user interactions
 */

interface AnalyticsEvent {
  event_name: string;
  parameters: Record<string, any>;
}

interface AnalyticsProvider {
  track: (eventName: string, properties: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (pageName: string, properties?: Record<string, any>) => void;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    analytics?: AnalyticsProvider;
    dataLayer?: any[];
  }
}

export class ExternalAnalytics {
  private isGA4Loaded = false;
  private isCustomAnalyticsLoaded = false;
  private eventQueue: AnalyticsEvent[] = [];

  constructor() {
    this.checkAnalyticsAvailability();
    this.processEventQueue();
  }

  private checkAnalyticsAvailability() {
    // Check for Google Analytics 4
    this.isGA4Loaded = typeof window !== 'undefined' && typeof window.gtag === 'function';
    
    // Check for custom analytics (Mixpanel, Segment, etc.)
    this.isCustomAnalyticsLoaded = typeof window !== 'undefined' && typeof window.analytics === 'object';

    if (!this.isGA4Loaded && !this.isCustomAnalyticsLoaded) {
      console.warn('📊 No analytics providers detected. Events will be queued locally.');
    }
  }

  private processEventQueue() {
    let processedCount = 0;
    const maxProcessed = 50; // Limit batch size to prevent blocking
    
    // Process events with safety limits
    while (this.eventQueue.length > 0 && processedCount < maxProcessed) {
      const event = this.eventQueue.shift();
      if (event) {
        try {
          this.sendEvent(event.event_name, event.parameters);
          processedCount++;
        } catch (error) {
          console.warn('Error processing queued event:', error);
          break; // Stop processing if errors occur
        }
      }
      
      // Yield to browser periodically
      if (processedCount % 10 === 0) {
        setTimeout(() => this.processEventQueue(), 0);
        break;
      }
    }
    
    // Clear excessive queue to prevent memory buildup
    if (this.eventQueue.length > 1000) {
      console.warn('Event queue too large, clearing oldest events');
      this.eventQueue.splice(0, this.eventQueue.length - 500);
    }
  }

  public sendEvent(eventName: string, properties: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const eventData = {
      ...properties,
      timestamp,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      page_title: document.title
    };

    console.log(`📊 [Analytics] ${eventName}:`, eventData);

    // Send to Google Analytics 4
    if (this.isGA4Loaded && window.gtag) {
      try {
        window.gtag('event', eventName, {
          custom_map: { dimension1: 'course_analytics' },
          ...eventData
        });
      } catch (error) {
        console.warn('Error sending to GA4:', error);
      }
    }

    // Send to custom analytics
    if (this.isCustomAnalyticsLoaded && window.analytics) {
      try {
        window.analytics.track(eventName, eventData);
      } catch (error) {
        console.warn('Error sending to custom analytics:', error);
      }
    }

    // Store locally for offline processing
    this.storeEventLocally(eventName, eventData);
  }

  private storeEventLocally(eventName: string, properties: Record<string, any>) {
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({ event_name: eventName, parameters: properties });
      
      // Keep only last 200 events
      if (events.length > 200) {
        events.splice(0, events.length - 200);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Error storing analytics event locally:', error);
    }
  }

  // Course-specific event tracking methods
  public trackModuleViewed(moduleId: string, courseId: string, userId?: string) {
    this.sendEvent('module_viewed', {
      module_id: moduleId,
      course_id: courseId,
      user_id: userId,
      category: 'course_engagement'
    });
  }

  public trackAudioPlayed(moduleId: string, courseId: string, duration: number, userId?: string) {
    this.sendEvent('audio_played', {
      module_id: moduleId,
      course_id: courseId,
      duration_seconds: duration,
      user_id: userId,
      category: 'media_engagement'
    });
  }

  public trackVideoPlayed(moduleId: string, courseId: string, duration: number, userId?: string) {
    this.sendEvent('video_played', {
      module_id: moduleId,
      course_id: courseId,
      duration_seconds: duration,
      user_id: userId,
      category: 'media_engagement'
    });
  }

  public trackPDFDownloaded(moduleId: string, courseId: string, fileName: string, userId?: string) {
    this.sendEvent('pdf_downloaded', {
      module_id: moduleId,
      course_id: courseId,
      file_name: fileName,
      user_id: userId,
      category: 'content_interaction'
    });
  }

  public trackModuleCompleted(moduleId: string, courseId: string, timeSpent: number, userId?: string) {
    this.sendEvent('module_completed', {
      module_id: moduleId,
      course_id: courseId,
      time_spent_seconds: timeSpent,
      user_id: userId,
      category: 'course_progress'
    });
  }

  public trackCourseProgress(courseId: string, percentage: number, userId?: string) {
    this.sendEvent('course_progress_updated', {
      course_id: courseId,
      completion_percentage: percentage,
      user_id: userId,
      category: 'course_progress'
    });
  }

  public trackMediaInteraction(
    action: 'play' | 'pause' | 'seek' | 'speed_change',
    mediaType: 'audio' | 'video',
    moduleId: string,
    courseId: string,
    currentTime: number,
    userId?: string
  ) {
    this.sendEvent('media_interaction', {
      action,
      media_type: mediaType,
      module_id: moduleId,
      course_id: courseId,
      current_time: currentTime,
      user_id: userId,
      category: 'media_engagement'
    });
  }

  public trackPageView(pageName: string, properties?: Record<string, any>) {
    this.sendEvent('page_view', {
      page_name: pageName,
      ...properties,
      category: 'navigation'
    });

    // Also send to page tracking if available
    if (this.isCustomAnalyticsLoaded && window.analytics) {
      window.analytics.page(pageName, properties);
    }
  }

  public identifyUser(userId: string, traits?: Record<string, any>) {
    if (this.isCustomAnalyticsLoaded && window.analytics) {
      window.analytics.identify(userId, traits);
    }

    if (this.isGA4Loaded && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        custom_map: { dimension2: 'identified_user' }
      });
    }
  }

  // Get stored analytics events for debugging
  public getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored events
  public clearStoredEvents() {
    localStorage.removeItem('analytics_events');
  }
}

// Global analytics instance
export const analytics = new ExternalAnalytics();
