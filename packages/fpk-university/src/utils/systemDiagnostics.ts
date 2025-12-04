/**
 * Comprehensive System Diagnostics
 * Identifies and fixes performance issues, memory leaks, and system bottlenecks
 */

import { performanceMonitor } from './performanceMonitor';
import { memoryManager, safeLimits } from './memoryManager';
import { timeoutManager, eventListenerManager } from './performanceOptimizer';
import { logger } from './logger';

interface DiagnosticResult {
  category: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'fixed' | 'monitoring';
  details: string;
  recommendation?: string;
}

interface SystemHealth {
  overallScore: number;
  issues: DiagnosticResult[];
  memoryUsage: number;
  performanceScore: number;
  networkHealth: number;
  recommendations: string[];
}

class SystemDiagnosticsService {
  private diagnosticResults: DiagnosticResult[] = [];
  private lastDiagnosticRun: number = 0;
  private isRunning: boolean = false;

  /**
   * Run comprehensive system diagnostics
   */
  async runFullDiagnostics(): Promise<SystemHealth> {
    if (this.isRunning) {
      logger.warn('Diagnostics already running, skipping duplicate run');
      return this.getHealthSummary();
    }

    this.isRunning = true;
    this.diagnosticResults = [];
    this.lastDiagnosticRun = Date.now();

    logger.info('🔍 Starting comprehensive system diagnostics...');

    try {
      // Memory diagnostics
      await this.checkMemoryHealth();
      
      // Performance diagnostics
      await this.checkPerformanceHealth();
      
      // Event listener diagnostics
      await this.checkEventListenerHealth();
      
      // Timer diagnostics
      await this.checkTimerHealth();
      
      // DOM health check
      await this.checkDOMHealth();
      
      // Network diagnostics
      await this.checkNetworkHealth();
      
      // React-specific diagnostics
      await this.checkReactHealth();

      // Auto-fix detected issues
      await this.autoFixIssues();

      logger.info('✅ System diagnostics completed', 'DIAGNOSTICS', {
        issuesFound: this.diagnosticResults.length,
        criticalIssues: this.diagnosticResults.filter(r => r.severity === 'critical').length
      });

    } catch (error) {
      logger.error('❌ System diagnostics failed', 'DIAGNOSTICS', error);
      this.addResult('diagnostics', 'System diagnostics failed to complete', 'critical', 'detected', `Error: ${error}`);
    } finally {
      this.isRunning = false;
    }

    return this.getHealthSummary();
  }

  /**
   * Check memory health and usage patterns
   */
  private async checkMemoryHealth(): Promise<void> {
    const memoryStats = memoryManager.getMemoryStats();
    
    if (!memoryStats) {
      this.addResult('memory', 'Memory monitoring not available', 'low', 'detected', 'Browser does not support memory monitoring');
      return;
    }

    const usagePercent = memoryStats.usagePercentage * 100;
    
    if (usagePercent > 90) {
      this.addResult('memory', 'Critical memory usage', 'critical', 'detected', 
        `Memory usage at ${usagePercent.toFixed(1)}%`, 'Force garbage collection and clear caches');
    } else if (usagePercent > 75) {
      this.addResult('memory', 'High memory usage', 'high', 'detected', 
        `Memory usage at ${usagePercent.toFixed(1)}%`, 'Monitor and cleanup unnecessary data');
    } else if (usagePercent > 50) {
      this.addResult('memory', 'Elevated memory usage', 'medium', 'monitoring', 
        `Memory usage at ${usagePercent.toFixed(1)}%`);
    }

    // Check for memory leaks by analyzing trends
    this.checkForMemoryLeaks();
  }

  /**
   * Check performance metrics and bottlenecks
   */
  private async checkPerformanceHealth(): Promise<void> {
    const report = performanceMonitor.getPerformanceReport();
    
    // Check render performance
    if (report.averageRenderTime > 100) {
      this.addResult('performance', 'Slow component rendering', 'high', 'detected',
        `Average render time: ${report.averageRenderTime.toFixed(2)}ms`, 'Optimize slow components');
    }

    // Check for slow components
    const slowComponents = report.slowestComponents.filter(c => c.renderTime > 50);
    if (slowComponents.length > 0) {
      this.addResult('performance', 'Slow rendering components detected', 'medium', 'detected',
        `${slowComponents.length} components with >50ms render time`, 'Consider memoization or optimization');
    }

    // Check bundle performance
    if (report.totalBundleSize > 5 * 1024 * 1024) { // 5MB
      this.addResult('performance', 'Large bundle size', 'medium', 'detected',
        `Total bundle size: ${(report.totalBundleSize / 1024 / 1024).toFixed(2)}MB`, 'Consider code splitting');
    }
  }

  /**
   * Check event listener management
   */
  private async checkEventListenerHealth(): Promise<void> {
    const listenerCount = eventListenerManager.listeners.size;
    
    if (listenerCount > 100) {
      this.addResult('events', 'Excessive event listeners', 'high', 'detected',
        `${listenerCount} active event listeners`, 'Review and cleanup unused listeners');
    } else if (listenerCount > 50) {
      this.addResult('events', 'High number of event listeners', 'medium', 'monitoring',
        `${listenerCount} active event listeners`);
    }
  }

  /**
   * Check timer management
   */
  private async checkTimerHealth(): Promise<void> {
    const timeoutCount = timeoutManager.timeouts.size;
    const intervalCount = timeoutManager.intervals.size;
    
    if (timeoutCount > 50) {
      this.addResult('timers', 'Excessive timeouts', 'high', 'detected',
        `${timeoutCount} active timeouts`, 'Review timeout usage and cleanup');
    }
    
    if (intervalCount > 20) {
      this.addResult('timers', 'Excessive intervals', 'high', 'detected',
        `${intervalCount} active intervals`, 'Review interval usage and cleanup');
    }
  }

  /**
   * Check DOM health and size
   */
  private async checkDOMHealth(): Promise<void> {
    const domNodeCount = document.querySelectorAll('*').length;
    const domDepth = this.calculateDOMDepth();
    
    if (domNodeCount > 10000) {
      this.addResult('dom', 'Excessive DOM nodes', 'high', 'detected',
        `${domNodeCount} DOM nodes`, 'Optimize rendering and virtualization');
    } else if (domNodeCount > 5000) {
      this.addResult('dom', 'High DOM node count', 'medium', 'monitoring',
        `${domNodeCount} DOM nodes`);
    }
    
    if (domDepth > 20) {
      this.addResult('dom', 'Deep DOM nesting', 'medium', 'detected',
        `DOM depth: ${domDepth} levels`, 'Flatten component structure');
    }
  }

  /**
   * Check network performance
   */
  private async checkNetworkHealth(): Promise<void> {
    // Check if navigator.connection is available (modern browsers)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.addResult('network', 'Slow network connection', 'high', 'detected',
          `Connection type: ${connection.effectiveType}`, 'Optimize for low bandwidth');
      }
      
      if (connection.saveData) {
        this.addResult('network', 'Data saver mode active', 'medium', 'monitoring',
          'User has data saver enabled', 'Reduce data usage where possible');
      }
    }

    // Check for failed requests in performance entries
    const failedRequests = performance.getEntriesByType('navigation').filter(
      (entry: any) => entry.responseStatus >= 400
    );
    
    if (failedRequests.length > 0) {
      this.addResult('network', 'Failed network requests detected', 'medium', 'detected',
        `${failedRequests.length} failed requests`, 'Check network stability and error handling');
    }
  }

  /**
   * Check React-specific issues
   */
  private async checkReactHealth(): Promise<void> {
    // Check for React DevTools to ensure it's not in production
    if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      if (import.meta.env.PROD) {
        this.addResult('react', 'React DevTools in production', 'medium', 'detected',
          'DevTools detected in production build', 'Remove DevTools from production');
      }
    }

    // Check for excessive re-renders (would need custom hook integration)
    this.checkForExcessiveReRenders();
  }

  /**
   * Auto-fix detected issues where possible
   */
  private async autoFixIssues(): Promise<void> {
    for (const result of this.diagnosticResults) {
      if (result.status === 'detected' && result.severity === 'critical') {
        switch (result.category) {
          case 'memory':
            if (result.issue.includes('Critical memory usage')) {
              memoryManager.forceGC();
              timeoutManager.cleanup();
              eventListenerManager.cleanup();
              result.status = 'fixed';
              logger.info('🔧 Auto-fixed critical memory usage');
            }
            break;
            
          case 'timers':
            if (result.issue.includes('Excessive')) {
              timeoutManager.cleanup();
              result.status = 'fixed';
              logger.info('🔧 Auto-cleaned excessive timers');
            }
            break;
            
          case 'events':
            if (result.issue.includes('Excessive')) {
              eventListenerManager.cleanup();
              result.status = 'fixed';
              logger.info('🔧 Auto-cleaned excessive event listeners');
            }
            break;
        }
      }
    }
  }

  /**
   * Check for memory leaks by tracking memory usage over time
   */
  private checkForMemoryLeaks(): void {
    const memoryHistory = this.getMemoryHistory();
    
    if (memoryHistory.length >= 3) {
      const trend = this.calculateMemoryTrend(memoryHistory);
      
      if (trend > 0.1) { // 10% increase trend
        this.addResult('memory', 'Potential memory leak detected', 'high', 'detected',
          `Memory usage trending upward (${(trend * 100).toFixed(1)}% increase)`, 
          'Investigate for memory leaks');
      }
    }
  }

  /**
   * Check for excessive re-renders
   */
  private checkForExcessiveReRenders(): void {
    // This would require integration with React DevTools or custom tracking
    // For now, we'll check for rapid DOM mutations as a proxy
    let mutationCount = 0;
    const observer = new MutationObserver(() => {
      mutationCount++;
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    setTimeout(() => {
      observer.disconnect();
      if (mutationCount > 100) {
        this.addResult('react', 'Excessive DOM mutations detected', 'medium', 'detected',
          `${mutationCount} mutations in 1 second`, 'Check for unnecessary re-renders');
      }
    }, 1000);
  }

  /**
   * Calculate DOM depth
   */
  private calculateDOMDepth(): number {
    let maxDepth = 0;
    
    const calculateDepth = (element: Element, depth: number = 0): void => {
      maxDepth = Math.max(maxDepth, depth);
      for (const child of element.children) {
        calculateDepth(child, depth + 1);
      }
    };
    
    calculateDepth(document.body);
    return maxDepth;
  }

  /**
   * Get memory usage history from localStorage
   */
  private getMemoryHistory(): number[] {
    try {
      const history = localStorage.getItem('memory-history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  /**
   * Calculate memory trend
   */
  private calculateMemoryTrend(history: number[]): number {
    if (history.length < 2) return 0;
    
    const first = history[0];
    const last = history[history.length - 1];
    return (last - first) / first;
  }

  /**
   * Add diagnostic result
   */
  private addResult(category: string, issue: string, severity: 'low' | 'medium' | 'high' | 'critical', 
                   status: 'detected' | 'fixed' | 'monitoring', details: string, recommendation?: string): void {
    this.diagnosticResults.push({
      category,
      issue,
      severity,
      status,
      details,
      recommendation
    });
  }

  /**
   * Get system health summary
   */
  private getHealthSummary(): SystemHealth {
    const criticalIssues = this.diagnosticResults.filter(r => r.severity === 'critical').length;
    const highIssues = this.diagnosticResults.filter(r => r.severity === 'high').length;
    const mediumIssues = this.diagnosticResults.filter(r => r.severity === 'medium').length;
    
    // Calculate overall score (100 = perfect, 0 = critical issues)
    let overallScore = 100;
    overallScore -= criticalIssues * 30;
    overallScore -= highIssues * 15;
    overallScore -= mediumIssues * 5;
    overallScore = Math.max(0, overallScore);

    const memoryStats = memoryManager.getMemoryStats();
    const memoryUsage = memoryStats ? memoryStats.usagePercentage * 100 : 0;

    const performanceReport = performanceMonitor.getPerformanceReport();
    const performanceScore = Math.max(0, 100 - (performanceReport.averageRenderTime / 2));

    const networkHealth = this.calculateNetworkHealth();

    const recommendations = this.generateRecommendations();

    return {
      overallScore,
      issues: this.diagnosticResults,
      memoryUsage,
      performanceScore,
      networkHealth,
      recommendations
    };
  }

  /**
   * Calculate network health score
   */
  private calculateNetworkHealth(): number {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      switch (connection.effectiveType) {
        case '4g': return 100;
        case '3g': return 75;
        case '2g': return 50;
        case 'slow-2g': return 25;
        default: return 75;
      }
    }
    return 75; // Default score when connection info not available
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations = new Set<string>();
    
    this.diagnosticResults.forEach(result => {
      if (result.recommendation) {
        recommendations.add(result.recommendation);
      }
    });

    // Add general recommendations based on patterns
    if (this.diagnosticResults.some(r => r.category === 'memory' && r.severity === 'high')) {
      recommendations.add('Consider implementing lazy loading for large components');
      recommendations.add('Review data structures for memory efficiency');
    }

    if (this.diagnosticResults.some(r => r.category === 'performance' && r.severity === 'high')) {
      recommendations.add('Implement React.memo for expensive components');
      recommendations.add('Consider code splitting for better performance');
    }

    return Array.from(recommendations);
  }

  /**
   * Get diagnostic history
   */
  getLastDiagnosticResults(): SystemHealth {
    return this.getHealthSummary();
  }

  /**
   * Schedule periodic diagnostics
   */
  startPeriodicDiagnostics(intervalMinutes: number = 15): void {
    const interval = intervalMinutes * 60 * 1000;
    
    const periodicCheck = () => {
      this.runFullDiagnostics().then(health => {
        if (health.overallScore < 70) {
          logger.warn('🚨 System health degraded', 'DIAGNOSTICS', health);
          
          // Dispatch custom event for UI notifications
          window.dispatchEvent(new CustomEvent('system-health-alert', { 
            detail: health 
          }));
        }
      });
    };

    // Use timeoutManager for proper cleanup
    timeoutManager.setInterval(periodicCheck, interval);
    
    logger.info(`📋 Scheduled periodic diagnostics every ${intervalMinutes} minutes`);
  }
}

// Global instance
export const systemDiagnostics = new SystemDiagnosticsService();

// Auto-start monitoring in development
if (import.meta.env.DEV) {
  systemDiagnostics.startPeriodicDiagnostics(10); // Every 10 minutes in dev
} else {
  systemDiagnostics.startPeriodicDiagnostics(30); // Every 30 minutes in prod
}