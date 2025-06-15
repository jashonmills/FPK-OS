
export interface EPUBStreamingProgress {
  stage: 'metadata' | 'structure' | 'preloading' | 'streaming' | 'ready';
  percentage: number;
  message: string;
  chaptersLoaded?: number;
  totalChapters?: number;
  bytesLoaded?: number;
  totalBytes?: number;
  readingSpeed?: number;
  estimatedTimeRemaining?: number;
}

export interface EPUBStreamingError {
  type: 'network' | 'timeout' | 'parsing' | 'metadata' | 'streaming' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
  context?: string;
}

export interface EPUBMetadata {
  title: string;
  author: string;
  identifier: string;
  language: string;
  description?: string;
  subjects?: string[];
  rights?: string;
  publisher?: string;
  coverHref?: string;
  toc: any[];
  spine: any[];
  resources: { [key: string]: any };
  loadedAt: number;
}
