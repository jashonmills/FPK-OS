
export interface DocumentMetadata {
  title: string;
  author?: string;
  pageCount?: number;
  fileSize?: number;
  format: 'pdf' | 'epub';
  language?: string;
}

export interface DocumentLocation {
  page?: number;
  cfi?: string; // For EPUB
  percentage?: number;
}

export interface DocumentLoadProgress {
  stage: 'downloading' | 'processing' | 'rendering' | 'ready' | 'error';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

export interface DocumentLoadError {
  type: 'network' | 'timeout' | 'parsing' | 'rendering' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

export interface DocumentTelemetryEvent {
  type: 'load_start' | 'load_complete' | 'load_error' | 'page_turn' | 'zoom' | 'search' | 'bookmark';
  timestamp: number;
  metadata: Record<string, any>;
  performance?: {
    loadTime?: number;
    renderTime?: number;
    memoryUsage?: number;
  };
}

export interface DocumentReaderConfig {
  enableTelemetry: boolean;
  enableOfflineCache: boolean;
  maxCacheSize: number; // MB
  telemetryEndpoint?: string;
  featureFlags: Record<string, boolean>;
  readerVersion: string;
}

export interface DocumentReader {
  // Core functionality
  loadDocument(url: string, metadata: DocumentMetadata): Promise<void>;
  unloadDocument(): void;
  
  // Navigation
  goToLocation(location: DocumentLocation): Promise<void>;
  nextPage(): Promise<void>;
  previousPage(): Promise<void>;
  
  // Rendering
  setFontSize(size: number): void;
  setZoom(scale: number): void;
  
  // State
  getCurrentLocation(): DocumentLocation | null;
  getProgress(): number;
  isReady(): boolean;
  
  // Events
  onLoadProgress(callback: (progress: DocumentLoadProgress) => void): void;
  onLoadError(callback: (error: DocumentLoadError) => void): void;
  onLocationChange(callback: (location: DocumentLocation) => void): void;
  onTelemetryEvent(callback: (event: DocumentTelemetryEvent) => void): void;
  
  // Cleanup
  destroy(): void;
}

export interface DocumentSource {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'opds' | 'archive';
  baseUrl?: string;
  authRequired: boolean;
}

export interface DocumentIngestionService {
  getSources(): DocumentSource[];
  ingestFromSource(sourceId: string, filters?: Record<string, any>): Promise<DocumentMetadata[]>;
  validateDocument(url: string): Promise<{ isValid: boolean; metadata?: DocumentMetadata; error?: string }>;
  cacheDocument(url: string, metadata: DocumentMetadata): Promise<string>; // Returns cache key
}
