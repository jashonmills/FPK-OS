import { supabase } from '@/integrations/supabase/client';

export interface PDFLoadingProgress {
  stage: 'validating' | 'downloading' | 'processing' | 'ready';
  percentage: number;
  message: string;
  estimatedTimeRemaining?: number;
  bytesLoaded?: number;
  totalBytes?: number;
}

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
  processedUrl?: string;
  metadata?: {
    size?: number;
    contentType?: string;
    lastModified?: string;
    supportsRangeRequests?: boolean;
  };
}

export class EnhancedPDFLoader {
  private progressCallback?: (progress: PDFLoadingProgress) => void;
  private abortController?: AbortController;

  constructor(onProgress?: (progress: PDFLoadingProgress) => void) {
    this.progressCallback = onProgress;
  }

  async validateAndLoad(url: string): Promise<PDFValidationResult> {
    this.abortController = new AbortController();
    
    try {
      this.updateProgress('validating', 10, 'Validating PDF URL...');
      
      const validation = await this.validatePDFUrl(url);
      if (!validation.isValid) {
        return validation;
      }

      this.updateProgress('validating', 30, 'Checking PDF accessibility...');
      
      const metadata = await this.getPDFMetadata(validation.processedUrl!);
      
      this.updateProgress('ready', 100, 'PDF ready to load');
      
      return {
        ...validation,
        metadata
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Enhanced PDF validation failed:', errorMessage);
      return {
        isValid: false,
        error: `Enhanced validation failed: ${errorMessage}`
      };
    }
  }

  private async validatePDFUrl(url: string): Promise<PDFValidationResult> {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Invalid URL provided' };
    }

    let processedUrl = url.trim();

    // Add protocol if missing
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    // Validate URL format
    try {
      new URL(processedUrl);
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Test accessibility with timeout
    try {
      const timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, 10000);

      const response = await fetch(processedUrl, {
        method: 'HEAD',
        signal: this.abortController?.signal,
        mode: 'cors',
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try with CORS proxy for external URLs
        if (!processedUrl.includes(window.location.hostname)) {
          console.log('🔄 Trying CORS proxy for external PDF...');
          processedUrl = await this.tryWithProxy(processedUrl);
        } else {
          return {
            isValid: false,
            error: `File not accessible: ${response.status} ${response.statusText}`
          };
        }
      }

      return { isValid: true, processedUrl };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          isValid: false,
          error: 'Request timed out. The file may be too large or server is slow.'
        };
      }

      // Try with proxy as fallback
      if (!url.includes(window.location.hostname)) {
        try {
          processedUrl = await this.tryWithProxy(url);
          return { isValid: true, processedUrl };
        } catch (proxyError) {
          return {
            isValid: false,
            error: 'Unable to access PDF through direct connection or proxy'
          };
        }
      }

      return {
        isValid: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  private async tryWithProxy(url: string): Promise<string> {
    // Implement a simple CORS proxy using Supabase edge function
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/pdf-proxy?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'HEAD',
      signal: this.abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`Proxy failed: ${response.status}`);
    }

    return proxyUrl;
  }

  private async getPDFMetadata(url: string) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: this.abortController?.signal
      });

      return {
        size: parseInt(response.headers.get('content-length') || '0'),
        contentType: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified'),
        supportsRangeRequests: response.headers.get('accept-ranges') === 'bytes'
      };
    } catch (error) {
      console.warn('⚠️ Could not fetch PDF metadata:', error);
      return undefined;
    }
  }

  private updateProgress(stage: PDFLoadingProgress['stage'], percentage: number, message: string) {
    this.progressCallback?.({
      stage,
      percentage,
      message,
      estimatedTimeRemaining: this.calculateETA(percentage)
    });
  }

  private calculateETA(percentage: number): number | undefined {
    if (percentage <= 0) return undefined;
    
    // Simple ETA calculation based on progress
    const elapsed = Date.now() - (this.startTime || Date.now());
    const remaining = (elapsed / percentage) * (100 - percentage);
    return Math.round(remaining / 1000);
  }

  private startTime = Date.now();

  abort() {
    this.abortController?.abort();
  }
}
