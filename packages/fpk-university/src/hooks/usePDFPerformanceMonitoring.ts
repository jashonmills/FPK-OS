
import { useCallback, useRef } from 'react';

interface PerformanceMetrics {
  loadStartTime: number;
  loadEndTime?: number;
  totalLoadTime?: number;
  pageRenderTimes: { [page: number]: number };
  memoryUsage?: number;
  errors: string[];
}

// Declare gtag function if it exists
declare global {
  function gtag(...args: any[]): void;
}

export const usePDFPerformanceMonitoring = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadStartTime: 0,
    pageRenderTimes: {},
    errors: []
  });

  const startLoadTimer = useCallback(() => {
    metricsRef.current = {
      loadStartTime: performance.now(),
      pageRenderTimes: {},
      errors: []
    };
    console.log('🕒 PDF load timer started');
  }, []);

  const endLoadTimer = useCallback(() => {
    const endTime = performance.now();
    metricsRef.current.loadEndTime = endTime;
    metricsRef.current.totalLoadTime = endTime - metricsRef.current.loadStartTime;
    
    console.log(`✅ PDF loaded in ${metricsRef.current.totalLoadTime.toFixed(2)}ms`);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pdf_load_time', {
        custom_parameter_1: metricsRef.current.totalLoadTime,
        event_category: 'performance'
      });
    }
  }, []);

  const recordPageRenderTime = useCallback((pageNumber: number) => {
    const renderTime = performance.now();
    metricsRef.current.pageRenderTimes[pageNumber] = renderTime;
    console.log(`📄 Page ${pageNumber} rendered at ${renderTime.toFixed(2)}ms`);
  }, []);

  const recordError = useCallback((error: string) => {
    metricsRef.current.errors.push(error);
    console.error('❌ PDF Error recorded:', error);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pdf_error', {
        custom_parameter_1: error,
        event_category: 'errors'
      });
    }
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }, []);

  const logPerformanceReport = useCallback(() => {
    const memory = getMemoryUsage();
    const report = {
      ...metricsRef.current,
      memoryUsage: memory,
      averagePageRenderTime: Object.keys(metricsRef.current.pageRenderTimes).length > 0
        ? Object.values(metricsRef.current.pageRenderTimes).reduce((a, b) => a + b, 0) / Object.keys(metricsRef.current.pageRenderTimes).length
        : 0
    };

    console.log('📊 PDF Performance Report:', report);
    return report;
  }, [getMemoryUsage]);

  return {
    startLoadTimer,
    endLoadTimer,
    recordPageRenderTime,
    recordError,
    getMemoryUsage,
    logPerformanceReport,
    getMetrics: () => metricsRef.current
  };
};
