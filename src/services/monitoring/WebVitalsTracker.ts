
/**
 * Web Vitals Performance Tracking
 * Tracks Core Web Vitals and custom performance metrics
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: number;
}

export class WebVitalsTracker {
  private metrics: Map<string, WebVitalMetric> = new Map();
  private alerts: PerformanceAlert[] = [];
  private observer: PerformanceObserver | null = null;
  private alertCallback?: (alert: PerformanceAlert) => void;

  // SLO thresholds
  private readonly SLO_THRESHOLDS = {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
    FCP: 1800, // First Contentful Paint
    INP: 200   // Interaction to Next Paint
  };

  constructor(alertCallback?: (alert: PerformanceAlert) => void) {
    this.alertCallback = alertCallback;
    this.initializeTracking();
  }

  /**
   * Initialize Web Vitals tracking
   */
  private initializeTracking(): void {
    // Track Core Web Vitals using the web-vitals library pattern
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackTTFB();
    this.trackFCP();
    this.trackINP();

    // Track custom performance metrics
    this.trackResourceTiming();
    this.trackNavigationTiming();

    console.log('🔍 Web Vitals tracking initialized');
  }

  /**
   * Track Largest Contentful Paint
   */
  private trackLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      
      this.recordMetric('LCP', lastEntry.startTime);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  /**
   * Track First Input Delay
   */
  private trackFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  /**
   * Track Cumulative Layout Shift
   */
  private trackCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.recordMetric('CLS', clsValue);
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  }

  /**
   * Track Time to First Byte
   */
  private trackTTFB(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.recordMetric('TTFB', ttfb);
    }
  }

  /**
   * Track First Contentful Paint
   */
  private trackFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  }

  /**
   * Track Interaction to Next Paint
   */
  private trackINP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        const inp = entry.processingEnd - entry.startTime;
        this.recordMetric('INP', inp);
      });
    });

    observer.observe({ type: 'event', buffered: true });
  }

  /**
   * Track resource loading performance
   */
  private trackResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: PerformanceResourceTiming) => {
        // Track specific resource types
        if (entry.name.includes('.epub') || entry.name.includes('.pdf')) {
          const loadTime = entry.responseEnd - entry.startTime;
          this.recordCustomMetric(`${entry.initiatorType}_load_time`, loadTime);
        }
      });
    });

    observer.observe({ type: 'resource', buffered: true });
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const domLoad = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      const windowLoad = navigation.loadEventEnd - navigation.navigationStart;
      
      this.recordCustomMetric('dom_load_time', domLoad);
      this.recordCustomMetric('window_load_time', windowLoad);
    }
  }

  /**
   * Record a Web Vital metric
   */
  private recordMetric(name: string, value: number): void {
    const rating = this.getRating(name, value);
    const metric: WebVitalMetric = {
      name,
      value,
      rating,
      delta: value - (this.metrics.get(name)?.value || 0),
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.metrics.set(name, metric);
    
    // Check SLO and trigger alerts
    this.checkSLOCompliance(name, value);
    
    console.log(`📊 ${name}: ${value.toFixed(2)}ms (${rating})`);
  }

  /**
   * Record custom performance metric
   */
  recordCustomMetric(name: string, value: number): void {
    const metric: WebVitalMetric = {
      name,
      value,
      rating: 'good', // Custom metrics don't have standard ratings
      delta: 0,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.metrics.set(name, metric);
    console.log(`📈 Custom metric ${name}: ${value.toFixed(2)}ms`);
  }

  /**
   * Get performance rating for a metric
   */
  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25],
      TTFB: [800, 1800],
      FCP: [1800, 3000],
      INP: [200, 500]
    };

    const [good, poor] = thresholds[name] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Check SLO compliance and trigger alerts
   */
  private checkSLOCompliance(metric: string, value: number): void {
    const threshold = this.SLO_THRESHOLDS[metric as keyof typeof this.SLO_THRESHOLDS];
    
    if (threshold && value > threshold) {
      const severity: 'warning' | 'critical' = value > threshold * 1.5 ? 'critical' : 'warning';
      
      const alert: PerformanceAlert = {
        metric,
        value,
        threshold,
        severity,
        timestamp: Date.now()
      };

      this.alerts.push(alert);
      
      if (this.alertCallback) {
        this.alertCallback(alert);
      }

      console.warn(`🚨 SLO Alert: ${metric} = ${value.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): WebVitalMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get recent alerts
   */
  getAlerts(): PerformanceAlert[] {
    return this.alerts.slice(-10); // Return last 10 alerts
  }

  /**
   * Get SLO compliance report
   */
  getSLOReport(): Record<string, { compliant: boolean; value: number; threshold: number }> {
    const report: Record<string, { compliant: boolean; value: number; threshold: number }> = {};
    
    Object.entries(this.SLO_THRESHOLDS).forEach(([metric, threshold]) => {
      const current = this.metrics.get(metric);
      report[metric] = {
        compliant: current ? current.value <= threshold : true,
        value: current?.value || 0,
        threshold
      };
    });

    return report;
  }

  /**
   * Clear metrics and alerts
   */
  reset(): void {
    this.metrics.clear();
    this.alerts.length = 0;
  }
}
