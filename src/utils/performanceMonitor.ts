/**
 * Performance monitoring utilities
 * Tracks bundle sizes, component performance, and optimization metrics
 */

import React from 'react';
import { logger } from '@/utils/logger';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  propsSize: number;
  timestamp: number;
}

interface BundleMetrics {
  chunkName: string;
  size: number;
  loadTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private bundleMetrics: BundleMetrics[] = [];
  private renderTimes = new Map<string, number>();

  // Track component render performance
  startRender(componentName: string): void {
    if (import.meta.env.DEV) {
      this.renderTimes.set(componentName, performance.now());
    }
  }

  endRender(componentName: string, props?: any): void {
    if (import.meta.env.DEV) {
      const startTime = this.renderTimes.get(componentName);
      if (startTime) {
        const renderTime = performance.now() - startTime;
        const propsSize = props ? JSON.stringify(props).length : 0;
        
        const metric: PerformanceMetrics = {
          componentName,
          renderTime,
          propsSize,
          timestamp: Date.now()
        };

        this.metrics.push(metric);
        this.renderTimes.delete(componentName);

        // Log slow renders
        if (renderTime > 100) {
          logger.performance(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`, {
            componentName,
            renderTime,
            propsSize
          });
        }
      }
    }
  }

  // Track bundle loading performance
  trackBundleLoad(chunkName: string, size: number, loadTime: number): void {
    const metric: BundleMetrics = {
      chunkName,
      size,
      loadTime
    };

    this.bundleMetrics.push(metric);
    
    logger.performance(`Bundle loaded: ${chunkName}`, {
      size: `${(size / 1024).toFixed(2)}KB`,
      loadTime: `${loadTime.toFixed(2)}ms`
    });
  }

  // Get performance report
  getPerformanceReport(): {
    averageRenderTime: number;
    slowestComponents: PerformanceMetrics[];
    totalBundleSize: number;
    slowestBundles: BundleMetrics[];
  } {
    const averageRenderTime = this.metrics.length > 0 
      ? this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length 
      : 0;

    const slowestComponents = [...this.metrics]
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 10);

    const totalBundleSize = this.bundleMetrics.reduce((sum, m) => sum + m.size, 0);
    
    const slowestBundles = [...this.bundleMetrics]
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 10);

    return {
      averageRenderTime,
      slowestComponents,
      totalBundleSize,
      slowestBundles
    };
  }

  // Clear old metrics (keep only last 100 entries)
  cleanup(): void {
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50);
    }
    if (this.bundleMetrics.length > 100) {
      this.bundleMetrics = this.bundleMetrics.slice(-50);
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React component performance wrapper
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const PerformanceWrappedComponent = (props: T) => {
    const name = componentName || Component.displayName || Component.name || 'UnknownComponent';
    
    React.useEffect(() => {
      performanceMonitor.startRender(name);
      return () => {
        performanceMonitor.endRender(name, props);
      };
    });

    return React.createElement(Component, props);
  };

  PerformanceWrappedComponent.displayName = `WithPerformance(${componentName || Component.displayName || Component.name})`;
  
  return PerformanceWrappedComponent;
}

// Hook for tracking custom performance metrics
export function usePerformanceTracking(name: string) {
  const startTime = React.useRef<number>();

  const startTracking = React.useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endTracking = React.useCallback((metadata?: any) => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      logger.performance(`Custom metric: ${name}`, {
        duration: `${duration.toFixed(2)}ms`,
        metadata
      });
      startTime.current = undefined;
    }
  }, [name]);

  return { startTracking, endTracking };
}
