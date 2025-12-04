
import { 
  DocumentReader, 
  DocumentMetadata, 
  DocumentLocation, 
  DocumentLoadProgress, 
  DocumentLoadError,
  DocumentTelemetryEvent,
  DocumentReaderConfig 
} from '@/interfaces/DocumentReader';
import { DocumentTelemetryService } from './DocumentTelemetryService';
import { featureFlagService } from './FeatureFlagService';

export class UniversalDocumentReader implements DocumentReader {
  private currentEngine: DocumentReader | null = null;
  private telemetryService: DocumentTelemetryService;
  private config: DocumentReaderConfig;
  private currentMetadata: DocumentMetadata | null = null;
  private loadStartTime: number = 0;
  
  // Event callbacks
  private onLoadProgressCallback?: (progress: DocumentLoadProgress) => void;
  private onLoadErrorCallback?: (error: DocumentLoadError) => void;
  private onLocationChangeCallback?: (location: DocumentLocation) => void;
  private onTelemetryEventCallback?: (event: DocumentTelemetryEvent) => void;

  constructor(config: DocumentReaderConfig) {
    this.config = config;
    this.telemetryService = new DocumentTelemetryService(config);
    
    console.log(`📖 Universal Document Reader initialized (v${config.readerVersion})`);
  }

  async loadDocument(url: string, metadata: DocumentMetadata): Promise<void> {
    this.loadStartTime = performance.now();
    this.currentMetadata = metadata;
    
    this.telemetryService.trackEvent({
      type: 'load_start',
      timestamp: Date.now(),
      metadata: {
        format: metadata.format,
        fileSize: metadata.fileSize,
        title: metadata.title
      }
    });

    try {
      // Determine which engine to use
      const engine = await this.selectEngine(metadata.format);
      
      // Clean up previous engine
      if (this.currentEngine) {
        this.currentEngine.destroy();
      }
      
      this.currentEngine = engine;
      this.setupEngineCallbacks();
      
      await this.currentEngine.loadDocument(url, metadata);
      
      this.telemetryService.trackPerformance(
        'document_load', 
        this.loadStartTime,
        { format: metadata.format, engine: this.getEngineType() }
      );
      
    } catch (error) {
      this.telemetryService.trackError(
        error instanceof Error ? error : new Error(String(error)),
        'document_load',
        { format: metadata.format, url }
      );
      throw error;
    }
  }

  unloadDocument(): void {
    if (this.currentEngine) {
      this.currentEngine.unloadDocument();
      this.telemetryService.trackEvent({
        type: 'load_complete',
        timestamp: Date.now(),
        metadata: { action: 'unload' }
      });
    }
  }

  async goToLocation(location: DocumentLocation): Promise<void> {
    if (!this.currentEngine) throw new Error('No document loaded');
    
    this.telemetryService.trackEvent({
      type: 'page_turn',
      timestamp: Date.now(),
      metadata: { 
        navigationType: 'goto',
        targetLocation: location
      }
    });
    
    return this.currentEngine.goToLocation(location);
  }

  async nextPage(): Promise<void> {
    if (!this.currentEngine) throw new Error('No document loaded');
    
    this.telemetryService.trackEvent({
      type: 'page_turn',
      timestamp: Date.now(),
      metadata: { navigationType: 'next' }
    });
    
    return this.currentEngine.nextPage();
  }

  async previousPage(): Promise<void> {
    if (!this.currentEngine) throw new Error('No document loaded');
    
    this.telemetryService.trackEvent({
      type: 'page_turn',
      timestamp: Date.now(),
      metadata: { navigationType: 'previous' }
    });
    
    return this.currentEngine.previousPage();
  }

  setFontSize(size: number): void {
    if (!this.currentEngine) return;
    
    this.telemetryService.trackEvent({
      type: 'zoom',
      timestamp: Date.now(),
      metadata: { type: 'font_size', value: size }
    });
    
    this.currentEngine.setFontSize(size);
  }

  setZoom(scale: number): void {
    if (!this.currentEngine) return;
    
    this.telemetryService.trackEvent({
      type: 'zoom',
      timestamp: Date.now(),
      metadata: { type: 'scale', value: scale }
    });
    
    this.currentEngine.setZoom(scale);
  }

  getCurrentLocation(): DocumentLocation | null {
    return this.currentEngine?.getCurrentLocation() || null;
  }

  getProgress(): number {
    return this.currentEngine?.getProgress() || 0;
  }

  isReady(): boolean {
    return this.currentEngine?.isReady() || false;
  }

  onLoadProgress(callback: (progress: DocumentLoadProgress) => void): void {
    this.onLoadProgressCallback = callback;
  }

  onLoadError(callback: (error: DocumentLoadError) => void): void {
    this.onLoadErrorCallback = callback;
  }

  onLocationChange(callback: (location: DocumentLocation) => void): void {
    this.onLocationChangeCallback = callback;
  }

  onTelemetryEvent(callback: (event: DocumentTelemetryEvent) => void): void {
    this.onTelemetryEventCallback = callback;
  }

  destroy(): void {
    if (this.currentEngine) {
      this.currentEngine.destroy();
      this.currentEngine = null;
    }
    
    this.telemetryService.trackEvent({
      type: 'load_complete',
      timestamp: Date.now(),
      metadata: { action: 'destroy' }
    });
  }

  private async selectEngine(format: 'pdf' | 'epub'): Promise<DocumentReader> {
    if (format === 'pdf') {
      // Check feature flags for PDF engine selection
      if (featureFlagService.isEnabled('enhanced_pdf_viewer')) {
        const { EnhancedPDFReader } = await import('./engines/EnhancedPDFReader');
        return new EnhancedPDFReader(this.config);
      } else {
        const { StandardPDFReader } = await import('./engines/StandardPDFReader');
        return new StandardPDFReader(this.config);
      }
    } else {
      // Check feature flags for EPUB engine selection
      if (featureFlagService.isEnabled('optimized_epub_renderer')) {
        const { OptimizedEPUBReader } = await import('./engines/OptimizedEPUBReader');
        return new OptimizedEPUBReader(this.config);
      } else {
        const { StandardEPUBReader } = await import('./engines/StandardEPUBReader');
        return new StandardEPUBReader(this.config);
      }
    }
  }

  private setupEngineCallbacks(): void {
    if (!this.currentEngine) return;

    this.currentEngine.onLoadProgress((progress) => {
      this.onLoadProgressCallback?.(progress);
    });

    this.currentEngine.onLoadError((error) => {
      this.onLoadErrorCallback?.(error);
    });

    this.currentEngine.onLocationChange((location) => {
      this.onLocationChangeCallback?.(location);
    });

    this.currentEngine.onTelemetryEvent((event) => {
      this.telemetryService.trackEvent(event);
      this.onTelemetryEventCallback?.(event);
    });
  }

  private getEngineType(): string {
    if (!this.currentMetadata) return 'unknown';
    
    const format = this.currentMetadata.format;
    if (format === 'pdf') {
      return featureFlagService.isEnabled('enhanced_pdf_viewer') ? 'enhanced_pdf' : 'standard_pdf';
    } else {
      return featureFlagService.isEnabled('optimized_epub_renderer') ? 'optimized_epub' : 'standard_epub';
    }
  }
}
