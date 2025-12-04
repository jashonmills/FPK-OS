/**
 * Google Analytics 4 Setup for FPK University Platform
 * Initialize GA4 with custom dimensions and events for course analytics
 */

// Global types handled in analytics.ts

export class GA4Setup {
  private measurementId: string;
  private isInitialized = false;

  constructor(measurementId: string = 'G-DISABLED') { // Analytics disabled until configured
    this.measurementId = measurementId;
  }

  /**
   * Initialize Google Analytics 4
   */
  public initialize(): void {
    // Skip initialization if analytics is disabled
    if (this.measurementId === 'G-DISABLED' || this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];

      // Define gtag function
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Set initial timestamp
      window.gtag('js', new Date());

      // Configure GA4 with custom dimensions
      window.gtag('config', this.measurementId, {
        // Custom dimensions for course analytics
        custom_map: {
          'dimension1': 'course_id',
          'dimension2': 'module_id', 
          'dimension3': 'user_id',
          'dimension4': 'content_type',
          'dimension5': 'engagement_level'
        },
        
        // Enhanced ecommerce for course enrollment tracking
        send_page_view: true,
        
        // Privacy settings
        anonymize_ip: true,
        respect_dnt: true,
        
        // Course-specific settings
        content_group1: 'Course Content',
        content_group2: 'Learning Platform'
      });

      // Load GA4 script
      this.loadScript();
      this.isInitialized = true;

      console.log('📊 GA4 initialized with measurement ID:', this.measurementId);
    } catch (error) {
      console.error('Error initializing GA4:', error);
    }
  }

  private loadScript(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);
  }

  /**
   * Track course enrollment
   */
  public trackCourseEnrollment(courseId: string, courseName: string, userId?: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'course_enrollment', {
      course_id: courseId,
      course_name: courseName,
      user_id: userId,
      event_category: 'Course',
      event_label: courseName,
      value: 1
    });
  }

  /**
   * Track module completion
   */
  public trackModuleCompletion(
    moduleId: string, 
    courseId: string, 
    timeSpent: number,
    userId?: string
  ): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'module_completion', {
      module_id: moduleId,
      course_id: courseId,
      user_id: userId,
      time_spent: timeSpent,
      event_category: 'Learning',
      event_label: `${courseId}-${moduleId}`,
      value: timeSpent
    });
  }

  /**
   * Track video/audio engagement
   */
  public trackMediaEngagement(
    action: 'play' | 'pause' | 'complete',
    mediaType: 'video' | 'audio',
    moduleId: string,
    courseId: string,
    progress: number,
    userId?: string
  ): void {
    if (!this.isInitialized) return;

    window.gtag('event', `${mediaType}_${action}`, {
      module_id: moduleId,
      course_id: courseId,
      user_id: userId,
      progress_percentage: progress,
      content_type: mediaType,
      event_category: 'Media Engagement',
      event_label: `${courseId}-${moduleId}`,
      value: Math.round(progress)
    });
  }

  /**
   * Track quiz/assessment results
   */
  public trackAssessmentResult(
    assessmentId: string,
    courseId: string,
    score: number,
    maxScore: number,
    userId?: string
  ): void {
    if (!this.isInitialized) return;

    const percentage = (score / maxScore) * 100;

    window.gtag('event', 'assessment_completed', {
      assessment_id: assessmentId,
      course_id: courseId,
      user_id: userId,
      score: score,
      max_score: maxScore,
      percentage: Math.round(percentage),
      event_category: 'Assessment',
      event_label: `${courseId}-${assessmentId}`,
      value: Math.round(percentage)
    });
  }

  /**
   * Track user study streaks
   */
  public trackStudyStreak(streakDays: number, userId?: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'study_streak', {
      user_id: userId,
      streak_days: streakDays,
      event_category: 'User Engagement',
      event_label: `${streakDays} days`,
      value: streakDays
    });
  }

  /**
   * Track custom learning events
   */
  public trackCustomEvent(
    eventName: string,
    parameters: Record<string, any>
  ): void {
    if (!this.isInitialized) return;

    window.gtag('event', eventName, {
      event_category: 'Custom Learning Event',
      ...parameters
    });
  }

  /**
   * Set user properties for better analytics
   */
  public setUserProperties(userId: string, properties: Record<string, any>): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId, {
      user_id: userId,
      user_properties: properties
    });
  }

  /**
   * Track page views with course context
   */
  public trackPageView(
    pagePath: string,
    pageTitle: string,
    courseId?: string,
    moduleId?: string
  ): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      course_id: courseId,
      module_id: moduleId,
      event_category: 'Navigation'
    });
  }
}

// Environment-specific setup
const getGA4MeasurementId = (): string => {
  // In production, this should come from environment variables
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production environments - use actual GA4 Measurement ID
    if (hostname.includes('lovableproject.com') || hostname.includes('lovable.app') || hostname.includes('fpkuniversity.com')) {
      return 'G-RFMWCWD8CV'; // FPK University GA4 Measurement ID
    }
    
    // Development environment - disable analytics to avoid noise
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'G-DISABLED'; // Disabled in development
    }
    
    return 'G-DISABLED'; // Disabled by default for other environments
  }
  
  return 'G-DISABLED';
};

// Global GA4 instance
export const ga4 = new GA4Setup(getGA4MeasurementId());

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  ga4.initialize();
}