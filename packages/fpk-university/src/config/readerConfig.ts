
import { DocumentReaderConfig } from '@/interfaces/DocumentReader';

export const READER_VERSION = '2.0.0';

export const defaultReaderConfig: DocumentReaderConfig = {
  enableTelemetry: true,
  enableOfflineCache: true,
  maxCacheSize: 100, // MB
  telemetryEndpoint: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/document-telemetry',
  featureFlags: {
    enhanced_pdf_viewer: true,
    optimized_epub_renderer: true,
    offline_cache: true,
    advanced_telemetry: true,
    experimental_reader_ui: false
  },
  readerVersion: READER_VERSION
};

export const readerEndpoints = {
  telemetry: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/document-telemetry',
  ingestion: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/document-ingestion',
  validation: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/document-validation',
  cache: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/document-cache'
};

export const supportedFormats = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 50 * 1024 * 1024, // 50MB
    engines: ['enhanced_pdf', 'standard_pdf']
  },
  epub: {
    mimeTypes: ['application/epub+zip', 'application/epub'],
    extensions: ['.epub'],
    maxSize: 20 * 1024 * 1024, // 20MB
    engines: ['optimized_epub', 'standard_epub']
  }
};

export const cacheConfig = {
  maxDocuments: 50,
  maxTotalSize: 100 * 1024 * 1024, // 100MB
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  compressionEnabled: true,
  prefetchEnabled: true
};

export const telemetryConfig = {
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  includePerformance: true,
  includeUserInteractions: true,
  includeErrors: true
};

export const ingestionConfig = {
  batchSize: 20,
  maxConcurrentDownloads: 3,
  timeout: 30000, // 30 seconds
  retryAttempts: 2,
  enableValidation: true,
  enableMetadataExtraction: true
};
