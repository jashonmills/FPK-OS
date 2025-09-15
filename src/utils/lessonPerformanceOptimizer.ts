/**
 * Lesson Performance Optimizer
 * Specifically designed to prevent lesson freezing and performance issues
 */

import { memoryManager } from './memoryManager';
import { timeoutManager } from './performanceOptimizer';
import { logger } from './logger';

interface LessonPerformanceMetrics {
  lessonId: string;
  startTime: number;
  renderCount: number;
  memoryUsageStart: number;
  eventListeners: number;
  timers: number;
  lastActivityTime: number;
  isActive: boolean;
}

class LessonPerformanceOptimizer {
  private activeLessons = new Map<string, LessonPerformanceMetrics>();
  private performanceObserver: PerformanceObserver | null = null;
  private freezeDetectionTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializePerformanceObserver();
    this.startFreezeDetection();
    this.setupMemoryPressureHandling();
  }

  /**
   * Register a lesson for performance monitoring
   */
  registerLesson(lessonId: string): void {
    const memoryStats = memoryManager.getMemoryStats();
    
    const metrics: LessonPerformanceMetrics = {
      lessonId,
      startTime: performance.now(),
      renderCount: 0,
      memoryUsageStart: memoryStats?.usedJSHeapSize || 0,
      eventListeners: 0,
      timers: 0,
      lastActivityTime: Date.now(),
      isActive: true
    };

    this.activeLessons.set(lessonId, metrics);
    logger.performance(`Lesson registered for monitoring: ${lessonId}`);
    
    // Proactively clean up memory before starting lesson
    this.optimizeForLesson();
  }

  /**
   * Unregister a lesson and cleanup its resources
   */
  unregisterLesson(lessonId: string): void {
    const metrics = this.activeLessons.get(lessonId);
    if (metrics) {
      metrics.isActive = false;
      
      const duration = performance.now() - metrics.startTime;
      const memoryStats = memoryManager.getMemoryStats();
      const memoryDelta = memoryStats ? memoryStats.usedJSHeapSize - metrics.memoryUsageStart : 0;
      
      logger.performance(`Lesson completed: ${lessonId}`, {
        duration: `${duration.toFixed(2)}ms`,
        renderCount: metrics.renderCount,
        memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`
      });
      
      this.activeLessons.delete(lessonId);
      
      // Force cleanup after lesson ends
      this.cleanupAfterLesson();
    }
  }

  /**
   * Track lesson activity to detect freezes
   */
  trackActivity(lessonId: string): void {
    const metrics = this.activeLessons.get(lessonId);
    if (metrics) {
      metrics.lastActivityTime = Date.now();
      metrics.renderCount++;
      
      // Check if lesson is experiencing performance issues
      this.checkLessonHealth(metrics);
    }
  }

  /**
   * Optimize system for lesson performance
   */
  private optimizeForLesson(): void {
    // Clear unnecessary caches
    if (memoryManager.isMemoryHigh()) {
      logger.performance('High memory detected, optimizing for lesson');
      memoryManager.forceGC();
    }

    // Reduce background activity
    this.pauseNonEssentialServices();
    
    // Pre-warm important resources
    this.prewarmLessonResources();
  }

  /**
   * Cleanup after lesson completion
   */
  private cleanupAfterLesson(): void {
    // Force garbage collection
    memoryManager.forceGC();
    
    // Resume background services
    this.resumeNonEssentialServices();
    
    // Clear lesson-specific caches
    this.clearLessonCaches();
  }

  /**
   * Check individual lesson health
   */
  private checkLessonHealth(metrics: LessonPerformanceMetrics): void {
    const now = Date.now();
    const timeSinceActivity = now - metrics.lastActivityTime;
    const duration = performance.now() - metrics.startTime;
    
    // Detect potential freeze (no activity for 5+ seconds)
    if (timeSinceActivity > 5000 && metrics.isActive) {
      logger.warn(`Potential lesson freeze detected: ${metrics.lessonId}`, 'LESSON_PERFORMANCE', {
        timeSinceActivity: `${timeSinceActivity}ms`,
        duration: `${duration.toFixed(2)}ms`,
        renderCount: metrics.renderCount
      });
      
      this.handleLessonFreeze(metrics.lessonId);
    }
    
    // Detect excessive rendering (potential infinite loop)
    if (metrics.renderCount > 100 && duration < 10000) {
      logger.warn(`Excessive rendering detected: ${metrics.lessonId}`, 'LESSON_PERFORMANCE', {
        renderCount: metrics.renderCount,
        duration: `${duration.toFixed(2)}ms`
      });
      
      this.handleExcessiveRendering(metrics.lessonId);
    }
    
    // Check memory growth
    const memoryStats = memoryManager.getMemoryStats();
    if (memoryStats) {
      const memoryGrowth = memoryStats.usedJSHeapSize - metrics.memoryUsageStart;
      const memoryGrowthMB = memoryGrowth / 1024 / 1024;
      
      if (memoryGrowthMB > 100) { // More than 100MB growth
        logger.warn(`High memory growth in lesson: ${metrics.lessonId}`, 'LESSON_PERFORMANCE', {
          memoryGrowth: `${memoryGrowthMB.toFixed(2)}MB`
        });
        
        this.handleMemoryGrowth(metrics.lessonId);
      }
    }
  }

  /**
   * Handle detected lesson freeze
   */
  private handleLessonFreeze(lessonId: string): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('lesson-freeze-detected', {
      detail: { lessonId, timestamp: Date.now() }
    }));
    
    // Attempt recovery
    this.attemptLessonRecovery(lessonId);
  }

  /**
   * Handle excessive rendering
   */
  private handleExcessiveRendering(lessonId: string): void {
    // Throttle renders by adding small delays
    const metrics = this.activeLessons.get(lessonId);
    if (metrics && metrics.renderCount > 50) {
      // Emit throttling event
      window.dispatchEvent(new CustomEvent('lesson-throttle-requested', {
        detail: { lessonId, renderCount: metrics.renderCount }
      }));
    }
  }

  /**
   * Handle memory growth
   */
  private handleMemoryGrowth(lessonId: string): void {
    // Force aggressive cleanup
    memoryManager.forceGC();
    timeoutManager.cleanup();
    
    // Notify lesson to reduce memory usage
    window.dispatchEvent(new CustomEvent('lesson-memory-pressure', {
      detail: { lessonId }
    }));
  }

  /**
   * Attempt to recover frozen lesson
   */
  private attemptLessonRecovery(lessonId: string): void {
    logger.info(`Attempting recovery for frozen lesson: ${lessonId}`);
    
    // Clear all timers and intervals
    timeoutManager.cleanup();
    
    // Force garbage collection
    memoryManager.forceGC();
    
    // Reset lesson metrics
    const metrics = this.activeLessons.get(lessonId);
    if (metrics) {
      metrics.lastActivityTime = Date.now();
      metrics.renderCount = 0;
    }
    
    // Dispatch recovery event
    window.dispatchEvent(new CustomEvent('lesson-recovery-attempted', {
      detail: { lessonId, timestamp: Date.now() }
    }));
  }

  /**
   * Initialize performance observer for lesson monitoring
   */
  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.startsWith('lesson-')) {
            const lessonId = entry.name.replace('lesson-', '');
            
            if (entry.duration > 100) { // Slow operation
              logger.performance(`Slow lesson operation: ${lessonId}`, {
                operation: entry.name,
                duration: `${entry.duration.toFixed(2)}ms`
              });
            }
          }
        });
      });
      
      try {
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        logger.warn('Failed to initialize performance observer', 'PERFORMANCE', error);
      }
    }
  }

  /**
   * Start freeze detection monitoring
   */
  private startFreezeDetection(): void {
    let lastCheck = performance.now();
    
    const checkForFreezes = () => {
      const now = performance.now();
      const timeDelta = now - lastCheck;
      
      // If more than 1 second has passed since last check, UI might be frozen
      if (timeDelta > 1000) {
        logger.warn('UI freeze detected', 'PERFORMANCE', {
          freezeDuration: `${timeDelta.toFixed(2)}ms`,
          activeLessons: Array.from(this.activeLessons.keys())
        });
        
        // Attempt emergency recovery
        this.emergencyRecovery();
      }
      
      lastCheck = now;
    };
    
    // Check every 100ms using timeoutManager for proper cleanup
    this.freezeDetectionTimer = timeoutManager.setInterval(checkForFreezes, 100);
  }

  /**
   * Emergency recovery when UI freeze is detected
   */
  private emergencyRecovery(): void {
    logger.warn('Initiating emergency recovery');
    
    // Force aggressive cleanup
    timeoutManager.cleanup();
    memoryManager.forceGC();
    
    // Clear all lesson render counts
    this.activeLessons.forEach(metrics => {
      metrics.renderCount = 0;
      metrics.lastActivityTime = Date.now();
    });
    
    // Dispatch emergency event
    window.dispatchEvent(new CustomEvent('ui-freeze-recovery', {
      detail: { timestamp: Date.now(), activeLessons: Array.from(this.activeLessons.keys()) }
    }));
  }

  /**
   * Setup memory pressure handling
   */
  private setupMemoryPressureHandling(): void {
    memoryManager.onMemoryPressure(() => {
      logger.warn('Memory pressure detected during lesson');
      
      // Pause non-essential lesson features
      this.activeLessons.forEach((metrics, lessonId) => {
        window.dispatchEvent(new CustomEvent('lesson-memory-pressure', {
          detail: { lessonId, severity: 'high' }
        }));
      });
      
      // Aggressive cleanup
      this.cleanupAfterLesson();
    });
  }

  /**
   * Pause non-essential services during lessons
   */
  private pauseNonEssentialServices(): void {
    // This would pause background sync, animations, etc.
    window.dispatchEvent(new CustomEvent('pause-background-services'));
  }

  /**
   * Resume non-essential services after lessons
   */
  private resumeNonEssentialServices(): void {
    // This would resume background services
    window.dispatchEvent(new CustomEvent('resume-background-services'));
  }

  /**
   * Pre-warm lesson resources
   */
  private prewarmLessonResources(): void {
    // Pre-load commonly used resources
    // This could include fonts, common images, etc.
    logger.performance('Pre-warming lesson resources');
  }

  /**
   * Clear lesson-specific caches
   */
  private clearLessonCaches(): void {
    // Clear lesson-specific data from caches
    logger.performance('Clearing lesson caches');
  }

  /**
   * Get performance metrics for all active lessons
   */
  getActiveLessonMetrics(): Map<string, LessonPerformanceMetrics> {
    return new Map(this.activeLessons);
  }

  /**
   * Cleanup when optimizer is destroyed
   */
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.freezeDetectionTimer) {
      clearInterval(this.freezeDetectionTimer);
    }
    
    this.activeLessons.clear();
  }
}

// Global instance
export const lessonPerformanceOptimizer = new LessonPerformanceOptimizer();