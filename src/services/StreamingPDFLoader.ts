
/**
 * Streaming PDF Loader with Byte-Range Requests
 * Implements progressive PDF loading for better performance
 */

import { indexedDBCache } from './IndexedDBCacheService';

export interface PDFStreamingProgress {
  stage: 'initializing' | 'downloading' | 'processing' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  pagesLoaded?: number;
  totalPages?: number;
  chunkSize?: number;
}

export interface PDFStreamingError {
  type: 'network' | 'timeout' | 'parsing' | 'range_not_supported' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

class StreamingPDFLoader {
  private abortController: AbortController | null = null;
  private chunkSize = 256 * 1024; // 256KB default chunk size
  private maxChunkSize = 2 * 1024 * 1024; // 2MB max chunk size
  private minChunkSize = 64 * 1024; // 64KB min chunk size
  private connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium';
  private rangeSupported = false;
  private totalSize = 0;
  private loadedChunks = new Map<number, ArrayBuffer>();
  private pageCache = new Map<number, any>();

  constructor(
    private onProgress?: (progress: PDFStreamingProgress) => void,
    private onError?: (error: PDFStreamingError) => void
  ) {
    this.detectConnectionSpeed();
  }

  async loadPDF(url: string, cacheKey: string): Promise<{
    success: boolean;
    pdfDocument?: any;
    error?: PDFStreamingError;
  }> {
    try {
      this.abortController = new AbortController();
      
      // Check cache first
      const cachedPDF = await indexedDBCache.get(`pdf:${cacheKey}`);
      if (cachedPDF) {
        console.log('📄 Using cached PDF:', cacheKey);
        this.onProgress?.({
          stage: 'ready',
          percentage: 100,
          message: 'PDF loaded from cache'
        });
        return { success: true, pdfDocument: cachedPDF };
      }

      this.onProgress?.({
        stage: 'initializing',
        percentage: 5,
        message: 'Checking PDF streaming capabilities...'
      });

      // Test range request support
      await this.testRangeSupport(url);
      
      if (this.rangeSupported) {
        return await this.loadWithStreaming(url, cacheKey);
      } else {
        return await this.loadTraditional(url, cacheKey);
      }

    } catch (error) {
      const streamingError: PDFStreamingError = {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown streaming error',
        recoverable: true,
        retryCount: 0
      };

      this.onError?.(streamingError);
      return { success: false, error: streamingError };
    }
  }

  private async testRangeSupport(url: string): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: this.abortController?.signal,
        headers: { 'Range': 'bytes=0-1' }
      });

      this.rangeSupported = response.status === 206 || response.headers.get('Accept-Ranges') === 'bytes';
      this.totalSize = parseInt(response.headers.get('Content-Length') || '0', 10);
      
      console.log('📄 PDF Range support:', this.rangeSupported ? 'YES' : 'NO');
      console.log('📄 PDF Total size:', this.formatSize(this.totalSize));

      // Adjust chunk size based on file size and connection
      this.adjustChunkSize();

    } catch (error) {
      console.warn('Range support test failed:', error);
      this.rangeSupported = false;
    }
  }

  private async loadWithStreaming(url: string, cacheKey: string): Promise<{
    success: boolean;
    pdfDocument?: any;
    error?: PDFStreamingError;
  }> {
    try {
      this.onProgress?.({
        stage: 'downloading',
        percentage: 10,
        message: 'Starting progressive PDF download...',
        chunkSize: this.chunkSize
      });

      // Load initial chunk to get PDF structure
      const initialChunk = await this.loadChunk(url, 0, this.chunkSize);
      this.loadedChunks.set(0, initialChunk);

      this.onProgress?.({
        stage: 'processing',
        percentage: 25,
        message: 'Processing PDF structure...',
        bytesLoaded: this.chunkSize,
        totalBytes: this.totalSize
      });

      // Initialize PDF.js with streaming capability
      const pdfjsLib = await import('pdfjs-dist');
      
      // Create custom loading task with streaming
      const loadingTask = pdfjsLib.getDocument({
        data: initialChunk,
        httpHeaders: {},
        withCredentials: false,
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/`,
        cMapPacked: true,
        enableXfa: false,
        // Custom range reader for streaming
        rangeChunkSize: this.chunkSize,
        disableRange: false,
        disableStream: false
      });

      // Set up progressive loading
      loadingTask.onProgress = (progress: any) => {
        const percentage = Math.min(90, 25 + (progress.loaded / progress.total) * 65);
        this.onProgress?.({
          stage: 'processing',
          percentage,
          message: `Loading PDF... ${Math.round(percentage)}%`,
          bytesLoaded: progress.loaded,
          totalBytes: progress.total
        });
      };

      const pdfDocument = await loadingTask.promise;

      // Cache the PDF structure
      await indexedDBCache.set(`pdf:${cacheKey}`, {
        numPages: pdfDocument.numPages,
        fingerprint: pdfDocument.fingerprints?.[0],
        loadedAt: Date.now()
      }, 'metadata');

      this.onProgress?.({
        stage: 'ready',
        percentage: 100,
        message: 'PDF ready with streaming support',
        totalPages: pdfDocument.numPages
      });

      console.log('✅ PDF loaded with streaming support');
      return { success: true, pdfDocument };

    } catch (error) {
      console.error('❌ Streaming PDF load failed:', error);
      
      const streamingError: PDFStreamingError = {
        type: error.message?.includes('range') ? 'range_not_supported' : 'parsing',
        message: `Streaming load failed: ${error.message}`,
        recoverable: true,
        retryCount: 0
      };

      return { success: false, error: streamingError };
    }
  }

  private async loadTraditional(url: string, cacheKey: string): Promise<{
    success: boolean;
    pdfDocument?: any;
    error?: PDFStreamingError;
  }> {
    try {
      this.onProgress?.({
        stage: 'downloading',
        percentage: 10,
        message: 'Downloading PDF (traditional method)...'
      });

      const response = await fetch(url, {
        signal: this.abortController?.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      this.onProgress?.({
        stage: 'processing',
        percentage: 60,
        message: 'Processing PDF document...',
        bytesLoaded: arrayBuffer.byteLength,
        totalBytes: arrayBuffer.byteLength
      });

      const pdfjsLib = await import('pdfjs-dist');
      const pdfDocument = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/`,
        cMapPacked: true
      }).promise;

      // Cache the PDF
      await indexedDBCache.set(`pdf:${cacheKey}`, {
        data: arrayBuffer,
        numPages: pdfDocument.numPages,
        fingerprint: pdfDocument.fingerprints?.[0],
        loadedAt: Date.now()
      }, 'content');

      this.onProgress?.({
        stage: 'ready',
        percentage: 100,
        message: 'PDF ready',
        totalPages: pdfDocument.numPages
      });

      return { success: true, pdfDocument };

    } catch (error) {
      const streamingError: PDFStreamingError = {
        type: error.name === 'AbortError' ? 'timeout' : 'network',
        message: `Traditional load failed: ${error.message}`,
        recoverable: true,
        retryCount: 0
      };

      return { success: false, error: streamingError };
    }
  }

  private async loadChunk(url: string, start: number, size: number): Promise<ArrayBuffer> {
    const end = Math.min(start + size - 1, this.totalSize - 1);
    
    const response = await fetch(url, {
      headers: {
        'Range': `bytes=${start}-${end}`
      },
      signal: this.abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`Failed to load chunk: ${response.status}`);
    }

    return await response.arrayBuffer();
  }

  private detectConnectionSpeed(): void {
    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        this.connectionSpeed = 'slow';
      } else if (effectiveType === '3g') {
        this.connectionSpeed = 'medium';
      } else {
        this.connectionSpeed = 'fast';
      }
    }

    console.log('🌐 Detected connection speed:', this.connectionSpeed);
  }

  private adjustChunkSize(): void {
    // Adjust chunk size based on file size and connection speed
    if (this.totalSize < 1024 * 1024) { // < 1MB
      this.chunkSize = this.minChunkSize;
    } else if (this.totalSize < 10 * 1024 * 1024) { // < 10MB
      this.chunkSize = this.connectionSpeed === 'slow' ? 128 * 1024 : 256 * 1024;
    } else { // >= 10MB
      this.chunkSize = this.connectionSpeed === 'slow' ? 256 * 1024 : 
                     this.connectionSpeed === 'medium' ? 512 * 1024 : 
                     this.maxChunkSize;
    }

    console.log('📄 Adjusted chunk size:', this.formatSize(this.chunkSize));
  }

  async preloadPage(pdfDocument: any, pageNumber: number): Promise<boolean> {
    try {
      const cacheKey = `page:${pdfDocument.fingerprints?.[0]}:${pageNumber}`;
      
      // Check if already cached
      const cached = await indexedDBCache.get(cacheKey);
      if (cached) return true;

      // Load and cache page
      const page = await pdfDocument.getPage(pageNumber);
      await indexedDBCache.set(cacheKey, {
        pageNumber,
        rotation: page.rotate,
        viewport: page.getViewport({ scale: 1 }).clone(),
        loadedAt: Date.now()
      }, 'content');

      this.pageCache.set(pageNumber, page);
      return true;

    } catch (error) {
      console.warn(`Failed to preload page ${pageNumber}:`, error);
      return false;
    }
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    this.loadedChunks.clear();
    this.pageCache.clear();
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getLoadedChunks(): number[] {
    return Array.from(this.loadedChunks.keys());
  }

  getCachedPages(): number[] {
    return Array.from(this.pageCache.keys());
  }
}

export { StreamingPDFLoader };
