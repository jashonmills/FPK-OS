import { RAGRetriever } from './rag-retriever.ts';
import { VectorEmbeddingService } from './vector-embeddings.ts';
import { KnowledgeCache } from './knowledge-cache.ts';
import { ExternalKnowledgeService } from './external-knowledge-service.ts';

export interface EnhancedRetrievalResult {
  personalKnowledge: any[];
  externalKnowledge: any[];
  similarContent: any[];
  cacheHit: boolean;
  sources: string[];
  confidence: number;
  freshness: 'current' | 'recent' | 'outdated';
}

export class EnhancedRAGRetriever {
  private ragRetriever: RAGRetriever;
  private vectorService: VectorEmbeddingService;
  private cache: KnowledgeCache;
  private externalService: ExternalKnowledgeService;

  constructor() {
    this.ragRetriever = new RAGRetriever();
    this.vectorService = new VectorEmbeddingService();
    this.cache = new KnowledgeCache();
    this.externalService = new ExternalKnowledgeService();
  }

  private calculateFreshness(results: any[]): 'current' | 'recent' | 'outdated' {
    const now = new Date();
    const hasCurrentInfo = results.some(r => r.is_current === true);
    const hasRecentInfo = results.some(r => {
      if (!r.date_retrieved) return false;
      const retrievedDate = new Date(r.date_retrieved);
      const hoursDiff = (now.getTime() - retrievedDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });

    if (hasCurrentInfo) return 'current';
    if (hasRecentInfo) return 'recent';
    return 'outdated';
  }

  private shouldSkipCache(query: string): boolean {
    const timeKeywords = ['current', 'now', 'today', 'recent', 'latest', 'president', '2025'];
    return timeKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  async retrieveEnhancedKnowledge(
    query: string,
    userId: string,
    chatMode: 'personal' | 'general' = 'personal'
  ): Promise<EnhancedRetrievalResult> {
    console.log('🔍 Enhanced RAG retrieval starting (simplified mode):', { query: query.substring(0, 50), userId, chatMode });

    try {
      // Simplified retrieval - only try personal knowledge for personal mode
      let personalKnowledge = [];
      
      if (chatMode === 'personal') {
        try {
          personalKnowledge = await this.ragRetriever.retrievePersonalKnowledge(userId);
        } catch (error) {
          console.log('Personal knowledge retrieval failed, continuing:', error.message);
          personalKnowledge = [];
        }
      }

      // Return simplified result to avoid hanging on missing services
      const enhancedResult: EnhancedRetrievalResult = {
        personalKnowledge: Array.isArray(personalKnowledge) ? personalKnowledge : [],
        externalKnowledge: [],
        similarContent: [],
        cacheHit: false,
        sources: personalKnowledge.length > 0 ? ['Personal Study Data'] : [],
        confidence: personalKnowledge.length > 0 ? 0.8 : 0.1,
        freshness: 'current'
      };

      console.log('✅ Enhanced RAG retrieval completed (simplified):', {
        personalItems: enhancedResult.personalKnowledge.length,
        confidence: enhancedResult.confidence
      });

      return enhancedResult;
    } catch (error) {
      console.error('❌ Error in enhanced RAG retrieval:', error);
      
      // Return minimal fallback result
      return {
        personalKnowledge: [],
        externalKnowledge: [],
        similarContent: [],
        cacheHit: false,
        sources: [],
        confidence: 0.1,
        freshness: 'current'
      };
    }
  }

  private isCacheFresh(cached: any): boolean {
    const now = new Date();
    const expiresAt = new Date(cached.expires_at);
    return expiresAt > now;
  }

  private calculateEnhancedConfidence(
    personalKnowledge: any[],
    externalKnowledge: any[],
    similarContent: any[]
  ): number {
    let score = 0;
    let maxScore = 0;

    // Personal knowledge adds significant confidence
    if (personalKnowledge.length > 0) {
      score += Math.min(personalKnowledge.length * 0.3, 0.4);
      maxScore += 0.4;
    }

    // External knowledge confidence varies by freshness and source
    if (externalKnowledge.length > 0) {
      const avgConfidence = externalKnowledge.reduce((sum, item) => 
        sum + (item.confidence || 0.5), 0) / externalKnowledge.length;
      score += avgConfidence * 0.4;
      maxScore += 0.4;
    }

    // Similar content adds some confidence
    if (similarContent.length > 0) {
      const avgSimilarity = similarContent.reduce((sum, item) => 
        sum + (item.metadata?.similarity || 0), 0) / similarContent.length;
      score += avgSimilarity * 0.2;
      maxScore += 0.2;
    }

    return maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  }

  private identifySources(
    personalKnowledge: any[],
    externalKnowledge: any[],
    similarContent: any[]
  ): string[] {
    const sources = new Set<string>();

    if (personalKnowledge.length > 0) {
      sources.add('Personal Study Data');
    }

    externalKnowledge.forEach(item => {
      if (item.source_name) {
        sources.add(item.source_name);
      }
    });

    if (similarContent.length > 0) {
      sources.add('Similar Content');
    }

    return Array.from(sources);
  }

  async processUserContent(userId: string, content: string, contentType: string): Promise<void> {
    await this.vectorService.processUserContent(userId, content, contentType);
  }

  async getCacheStats(): Promise<any> {
    return await this.cache.getStats();
  }

  async cleanupCache(): Promise<void> {
    await this.cache.cleanup();
  }
}
