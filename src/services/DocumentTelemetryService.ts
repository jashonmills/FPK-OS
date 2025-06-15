
import { DocumentTelemetryEvent, DocumentReaderConfig } from '@/interfaces/DocumentReader';

export class DocumentTelemetryService {
  private config: DocumentReaderConfig;
  private eventQueue: DocumentTelemetryEvent[] = [];
  private sessionId: string;
  private isOnline: boolean = navigator.onLine;
  private maxQueueSize = 100;

  constructor(config: DocumentReaderConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEventQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Auto-flush queue periodically
    setInterval(() => {
      if (this.isOnline && this.eventQueue.length > 0) {
        this.flushEventQueue();
      }
    }, 30000); // Every 30 seconds
  }

  trackEvent(event: DocumentTelemetryEvent): void {
    if (!this.config.enableTelemetry) return;

    const enrichedEvent = {
      ...event,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink
      } : undefined
    };

    this.eventQueue.push(enrichedEvent);
    
    // Immediate flush for critical events
    if (event.type === 'load_error' || this.eventQueue.length >= this.maxQueueSize) {
      this.flushEventQueue();
    }
  }

  trackPerformance(name: string, startTime: number, metadata?: Record<string, any>): void {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.trackEvent({
      type: 'load_complete',
      timestamp: Date.now(),
      metadata: {
        performanceName: name,
        duration,
        ...metadata
      },
      performance: {
        loadTime: duration,
        memoryUsage: this.getMemoryUsage()
      }
    });
  }

  trackError(error: Error, context: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      type: 'load_error',
      timestamp: Date.now(),
      metadata: {
        error: error.message,
        stack: error.stack,
        context,
        ...metadata
      }
    });
  }

  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.config.telemetryEndpoint) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.config.telemetryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          timestamp: Date.now(),
          version: this.config.readerVersion
        })
      });
      
      console.log(`📊 Flushed ${events.length} telemetry events`);
    } catch (error) {
      // Put events back in queue if send failed
      this.eventQueue.unshift(...events);
      console.warn('📊 Failed to send telemetry events:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize;
    }
    return undefined;
  }
}
