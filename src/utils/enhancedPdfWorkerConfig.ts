
import { pdfjs } from 'react-pdf';

interface WorkerStatus {
  isInitialized: boolean;
  currentUrl: string | null;
  lastError: string | null;
  retryCount: number;
}

class PDFWorkerManager {
  private status: WorkerStatus = {
    isInitialized: false,
    currentUrl: null,
    lastError: null,
    retryCount: 0
  };

  private readonly PDFJS_VERSION = '4.8.69';
  private readonly MAX_RETRIES = 3;
  private readonly WORKER_URLS = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${this.PDFJS_VERSION}/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${this.PDFJS_VERSION}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.PDFJS_VERSION}/pdf.worker.min.js`,
    // Fallback to bundled worker if CDNs fail
    '/pdf.worker.min.js'
  ];

  async initialize(): Promise<boolean> {
    if (this.status.isInitialized && pdfjs.GlobalWorkerOptions.workerSrc) {
      return true;
    }

    console.log('🔄 Initializing enhanced PDF worker...');
    this.status.retryCount = 0;

    for (const url of this.WORKER_URLS) {
      try {
        const isValid = await this.validateWorkerUrl(url);
        if (isValid) {
          pdfjs.GlobalWorkerOptions.workerSrc = url;
          this.status.isInitialized = true;
          this.status.currentUrl = url;
          this.status.lastError = null;
          console.log(`✅ PDF worker initialized with: ${url}`);
          return true;
        }
      } catch (error) {
        console.warn(`❌ Worker URL failed: ${url}`, error);
        this.status.lastError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    console.error('❌ All PDF worker URLs failed');
    this.status.isInitialized = false;
    return false;
  }

  private async validateWorkerUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async reinitialize(): Promise<boolean> {
    if (this.status.retryCount >= this.MAX_RETRIES) {
      console.error('❌ Max retries exceeded for PDF worker initialization');
      return false;
    }

    this.status.retryCount++;
    this.status.isInitialized = false;
    console.log(`🔄 Reinitializing PDF worker (attempt ${this.status.retryCount}/${this.MAX_RETRIES})`);
    
    // Wait with exponential backoff
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, this.status.retryCount) * 1000));
    
    return this.initialize();
  }

  getStatus(): WorkerStatus {
    return { ...this.status };
  }

  isReady(): boolean {
    return this.status.isInitialized && !!pdfjs.GlobalWorkerOptions.workerSrc;
  }
}

export const pdfWorkerManager = new PDFWorkerManager();

// Auto-initialize on import
pdfWorkerManager.initialize().catch(console.error);
