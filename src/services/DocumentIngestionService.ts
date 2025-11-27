// Conservative typing-only edits
// Replaced some `any` with `unknown` and local small types where obvious.

import { DocumentMetadata, DocumentSource, DocumentIngestionService } from '@/interfaces/DocumentReader';
import { OPDSService } from './opdsService';

export interface IngestionSource {
  id: string;
  name: string;
  type: 'opds' | 'archive' | 'local';
  config: Record<string, unknown>;
  enabled: boolean;
  processor: SourceProcessor;
}

export interface SourceProcessor {
  validate(config: Record<string, unknown>): Promise<boolean>;
  ingest(config: Record<string, unknown>, filters?: Record<string, unknown>): Promise<DocumentMetadata[]>;
  getMetadata(url: string): Promise<DocumentMetadata | null>;
}

class OPDSProcessor implements SourceProcessor {
  async validate(config: Record<string, unknown>): Promise<boolean> {
    try {
      const feedUrl = (config as any).feedUrl;
      const response = await fetch(feedUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async ingest(config: Record<string, unknown>, filters?: Record<string, unknown>): Promise<DocumentMetadata[]> {
    try {
      const feed = await OPDSService.fetchOPDSFeed();
      let entries = feed.entries as unknown as Array<Record<string, unknown>>;

      // Apply filters
      if (filters && (filters as any).subjects?.length) {
        entries = entries.filter(entry => 
          (entry.subjects as any[])?.some(subject => 
            (filters as any).subjects.includes((subject as string).toLowerCase())
          )
        );
      }

      return entries.map(entry => {
        const book = OPDSService.convertToPublicDomainBook(entry as any);
        if (!book) return null;
        
        return {
          title: book.title,
          author: book.author,
          format: 'epub' as const,
          language: book.language,
          fileSize: book.file_size
        } as DocumentMetadata;
      }).filter(book => book !== null) as DocumentMetadata[];
    } catch (error) {
      console.error('OPDS ingestion failed:', error);
      return [];
    }
  }

  async getMetadata(url: string): Promise<DocumentMetadata | null> {
    return null;
  }
}

class InternetArchiveProcessor implements SourceProcessor {
  async validate(config: Record<string, unknown>): Promise<boolean> {
    try {
      const response = await fetch(`${(config as any).baseUrl}/metadata/${(config as any).identifier}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async ingest(config: Record<string, unknown>, filters?: Record<string, unknown>): Promise<DocumentMetadata[]> {
    try {
      const searchQuery = this.buildSearchQuery(filters);
      const response = await fetch(`${(config as any).baseUrl}/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&output=json`);
      const data = await response.json() as { docs?: any[] };
      
      return data.docs?.map((doc: any) => ({
        title: doc.title,
        author: doc.creator,
        format: this.detectFormat(doc.format),
        fileSize: doc.size,
        language: doc.language
      })) || [];
    } catch (error) {
      console.error('Internet Archive ingestion failed:', error);
      return [];
    }
  }

  async getMetadata(url: string): Promise<DocumentMetadata | null> {
    return null;
  }

  private buildSearchQuery(filters?: Record<string, unknown>): string {
    const conditions = ['mediatype:texts'];
    if (filters && (filters as any).format) {
      conditions.push(`format:${(filters as any).format}`);
    }
    if (filters && (filters as any).subjects?.length) {
      conditions.push(`subject:(${(filters as any).subjects.join(' OR ')})`);
    }
    return conditions.join(' AND ');
  }

  private detectFormat(formats: string | string[]): 'pdf' | 'epub' {
    const formatList = Array.isArray(formats) ? formats : [formats];
    return formatList.some(f => f.toLowerCase().includes('epub')) ? 'epub' : 'pdf';
  }
}

export class ModularIngestionService implements DocumentIngestionService {
  private sources: Map<string, IngestionSource> = new Map();

  constructor() {
    this.initializeDefaultSources();
  }

  private initializeDefaultSources(): void {
    const defaultSources: IngestionSource[] = [
      {
        id: 'gutenberg',
        name: 'Project Gutenberg',
        type: 'opds',
        config: {
          feedUrl: 'https://www.gutenberg.org/ebooks/search.opds/',
          subjects: ['neurodiversity', 'psychology', 'education', 'science']
        },
        enabled: true,
        processor: new OPDSProcessor()
      },
      {
        id: 'internet_archive',
        name: 'Internet Archive',
        type: 'archive',
        config: {
          baseUrl: 'https://archive.org',
          subjects: ['psychology', 'education', 'accessibility']
        },
        enabled: false,
        processor: new InternetArchiveProcessor()
      }
    ];

    defaultSources.forEach(source => this.sources.set(source.id, source));
  }

  getSources(): DocumentSource[] {
    return Array.from(this.sources.values()).map(source => ({
      id: source.id,
      name: source.name,
      type: source.type as 'local' | 'remote' | 'opds' | 'archive',
      baseUrl: (source.config as any).baseUrl,
      authRequired: false
    }));
  }

  async ingestFromSource(sourceId: string, filters?: Record<string, unknown>): Promise<DocumentMetadata[]> {
    const source = this.sources.get(sourceId);
    if (!source || !source.enabled) {
      throw new Error(`Source '${sourceId}' not found or disabled`);
    }

    console.log(`📥 Starting ingestion from ${source.name}...`);
    
    try {
      const isValid = await source.processor.validate(source.config);
      if (!isValid) {
        throw new Error(`Source validation failed for ${source.name}`);
      }

      const documents = await source.processor.ingest(source.config, filters);
      console.log(`📥 Ingested ${documents.length} documents from ${source.name}`);
      
      return documents;
    } catch (error) {
      console.error(`📥 Ingestion failed for ${source.name}:`, error);
      throw error;
    }
  }

  async validateDocument(url: string): Promise<{ isValid: boolean; metadata?: DocumentMetadata; error?: string }> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        return { isValid: false, error: `HTTP ${response.status}` };
      }

      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      let format: 'pdf' | 'epub' = 'pdf';
      if (contentType?.includes('epub') || url.includes('.epub')) {
        format = 'epub';
      }

      const metadata: DocumentMetadata = {
        title: url.split('/').pop() || 'Unknown',
        format,
        fileSize: contentLength ? parseInt(contentLength) : undefined
      };

      return { isValid: true, metadata };
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async cacheDocument(url: string, metadata: DocumentMetadata): Promise<string> {
    const cacheKey = `doc_${this.hashUrl(url)}`;
    
    try {
      if ('caches' in window) {
        const cache = await caches.open('documents-v1');
        await cache.add(url);
        console.log(`💾 Cached document: ${metadata.title}`);
      }
      
      return cacheKey;
    } catch (error) {
      console.warn(`💾 Failed to cache document: ${metadata.title}`, error);
      return cacheKey;
    }
  }

  addSource(source: IngestionSource): void {
    this.sources.set(source.id, source);
    console.log(`➕ Added ingestion source: ${source.name}`);
  }

  removeSource(sourceId: string): void {
    this.sources.delete(sourceId);
    console.log(`➖ Removed ingestion source: ${sourceId}`);
  }

  enableSource(sourceId: string, enabled: boolean = true): void {
    const source = this.sources.get(sourceId);
    if (source) {
      source.enabled = enabled;
      console.log(`${enabled ? '✅' : '❌'} ${enabled ? 'Enabled' : 'Disabled'} source: ${source.name}`);
    }
  }

  private hashUrl(url: string): string {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

export const documentIngestionService = new ModularIngestionService();
