/**
 * Iframe Analytics Bridge
 * Handles analytics communication between iframe content and parent window
 */

export interface IframeAnalyticsEvent {
  type: 'analytics_event';
  event_name: string;
  parameters: Record<string, any>;
  timestamp: string;
  source: 'iframe_content';
}

export class IframeAnalyticsBridge {
  private parentOrigin: string;
  private isInIframe: boolean;
  private eventQueue: IframeAnalyticsEvent[] = [];

  constructor(parentOrigin = '*') {
    this.parentOrigin = parentOrigin;
    this.isInIframe = window !== window.parent;
    
    if (this.isInIframe) {
      this.initializeIframeMode();
    } else {
      this.initializeParentMode();
    }
  }

  private initializeIframeMode() {
    console.log('📊 Analytics Bridge: Running in iframe mode');
    
    // Listen for initialization from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'analytics_init') {
        console.log('📊 Analytics Bridge: Received init from parent');
        this.parentOrigin = event.origin;
        this.processEventQueue();
      }
    });

    // Notify parent that iframe is ready
    this.sendToParent({
      type: 'analytics_ready',
      timestamp: new Date().toISOString()
    });
  }

  private initializeParentMode() {
    console.log('📊 Analytics Bridge: Running in parent mode');
    
    // Listen for analytics events from iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'analytics_event') {
        this.handleIframeAnalyticsEvent(event.data as IframeAnalyticsEvent);
      } else if (event.data.type === 'analytics_ready') {
        // Send initialization to iframe
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'analytics_init',
            timestamp: new Date().toISOString()
          }, '*');
        }
      }
    });
  }

  private sendToParent(data: any) {
    if (this.isInIframe && this.parentOrigin) {
      try {
        window.parent.postMessage(data, this.parentOrigin);
      } catch (error) {
        console.warn('Error sending message to parent:', error);
      }
    }
  }

  private processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.sendToParent(event);
      }
    }
  }

  private handleIframeAnalyticsEvent(event: IframeAnalyticsEvent) {
    console.log('📊 Analytics Bridge: Received event from iframe:', event);
    
    // Import and use the analytics system
    import('@/utils/analytics').then(({ analytics }) => {
      // Forward the event to the main analytics system
      switch (event.event_name) {
        case 'module_viewed':
          analytics.trackModuleViewed(
            event.parameters.module_id,
            event.parameters.course_id,
            event.parameters.user_id
          );
          break;
        
        case 'audio_played':
          analytics.trackAudioPlayed(
            event.parameters.module_id,
            event.parameters.course_id,
            event.parameters.duration_seconds,
            event.parameters.user_id
          );
          break;
        
        case 'video_played':
          analytics.trackVideoPlayed(
            event.parameters.module_id,
            event.parameters.course_id,
            event.parameters.duration_seconds,
            event.parameters.user_id
          );
          break;
        
        case 'media_interaction':
          analytics.trackMediaInteraction(
            event.parameters.action,
            event.parameters.media_type,
            event.parameters.module_id,
            event.parameters.course_id,
            event.parameters.current_time,
            event.parameters.user_id
          );
          break;
        
        case 'module_completed':
          analytics.trackModuleCompleted(
            event.parameters.module_id,
            event.parameters.course_id,
            event.parameters.time_spent_seconds,
            event.parameters.user_id
          );
          break;
        
        default:
          // Generic event forwarding
          console.log(`📊 Forwarding custom event: ${event.event_name}`, event.parameters);
      }
    });
  }

  // Methods for iframe content to track events
  public trackEvent(eventName: string, parameters: Record<string, any>) {
    const event: IframeAnalyticsEvent = {
      type: 'analytics_event',
      event_name: eventName,
      parameters,
      timestamp: new Date().toISOString(),
      source: 'iframe_content'
    };

    if (this.isInIframe) {
      if (this.parentOrigin && this.parentOrigin !== '*') {
        this.sendToParent(event);
      } else {
        // Queue until parent origin is known
        this.eventQueue.push(event);
      }
    } else {
      // Direct tracking if not in iframe
      console.log('📊 Direct analytics tracking:', event);
    }
  }

  public trackModuleView(moduleId: string, courseId: string, userId?: string) {
    this.trackEvent('module_viewed', {
      module_id: moduleId,
      course_id: courseId,
      user_id: userId
    });
  }

  public trackMediaPlay(
    mediaType: 'audio' | 'video',
    moduleId: string,
    courseId: string,
    duration: number,
    userId?: string
  ) {
    this.trackEvent(`${mediaType}_played`, {
      module_id: moduleId,
      course_id: courseId,
      duration_seconds: duration,
      user_id: userId
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
    this.trackEvent('media_interaction', {
      action,
      media_type: mediaType,
      module_id: moduleId,
      course_id: courseId,
      current_time: currentTime,
      user_id: userId
    });
  }

  public trackScrollDepth(depth: number, moduleId: string, courseId: string, userId?: string) {
    this.trackEvent('scroll_depth', {
      depth_percentage: depth,
      module_id: moduleId,
      course_id: courseId,
      user_id: userId
    });
  }

  public trackTimeSpent(timeSpent: number, moduleId: string, courseId: string, userId?: string) {
    this.trackEvent('time_spent', {
      time_spent_seconds: timeSpent,
      module_id: moduleId,
      course_id: courseId,
      user_id: userId
    });
  }
}

// Global instance for iframe analytics
export const iframeAnalytics = new IframeAnalyticsBridge();