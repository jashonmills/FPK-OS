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
    console.log('🔍 Enhanced RAG retrieval starting:', { query: query.substring(0, 50), userId, chatMode });

    // For time-sensitive queries, skip cache
    const skipCache = this.shouldSkipCache(query);
    let cached = null;
    
    if (!skipCache) {
      const queryHash = this.cache.generateQueryHash(query, userId, { chatMode });
      cached = await this.cache.get(queryHash);
      
      if (cached && this.isCacheFresh(cached)) {
        console.log('💾 Cache hit for query');
        try {
          const cachedResult = JSON.parse(cached.content) as EnhancedRetrievalResult;
          return { ...cachedResult, cacheHit: true };
        } catch (parseError) {
          console.error('Error parsing cached result:', parseError);
        }
      }
    }

    // Parallel retrieval for better performance
    const retrievalTasks = [];

    // 1. Personal knowledge retrieval (for personal mode)
    if (chatMode === 'personal') {
      retrievalTasks.push(this.ragRetriever.retrievePersonalKnowledge(userId));
    }

    // 2. Enhanced external knowledge retrieval
    retrievalTasks.push(this.externalService.retrieveExternalKnowledge(query));

    // 3. Vector similarity search
    const queryEmbedding = await this.vectorService.generateEmbedding(query);
    if (queryEmbedding.length > 0) {
      retrievalTasks.push(this.vectorService.findSimilarContent(queryEmbedding, 5, 0.7));
    }

    try {
      const results = await Promise.allSettled(retrievalTasks);
      
      const personalKnowledge = chatMode === 'personal' && results[0]?.status === 'fulfilled' 
        ? results[0].value : [];
      
      const externalKnowledge = results[chatMode === 'personal' ? 1 : 0]?.status === 'fulfilled' 
        ? results[chatMode === 'personal' ? 1 : 0].value : [];
      
      const similarContent = queryEmbedding.length > 0 && results[results.length - 1]?.status === 'fulfilled'
        ? results[results.length - 1].value : [];

      // Calculate enhanced confidence and freshness
      const confidence = this.calculateEnhancedConfidence(personalKnowledge, externalKnowledge, similarContent);
      const freshness = this.calculateFreshness(externalKnowledge);
      const sources = this.identifySources(personalKnowledge, externalKnowledge, similarContent);

      const enhancedResult: EnhancedRetrievalResult = {
        personalKnowledge: Array.isArray(personalKnowledge) ? personalKnowledge : [],
        externalKnowledge: Array.isArray(externalKnowledge) ? externalKnowledge : [],
        similarContent: Array.isArray(similarContent) ? similarContent : [],
        cacheHit: false,
        sources,
        confidence,
        freshness
      };

      // Cache the result (with shorter TTL for time-sensitive queries)
      if (!skipCache) {
        const queryHash = this.cache.generateQueryHash(query, userId, { chatMode });
        const ttl = this.shouldSkipCache(query) ? 1 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour vs 24 hours
        
        await this.cache.set(
          queryHash,
          JSON.stringify(enhancedResult),
          chatMode === 'personal' ? 'hybrid' : 'external',
          { 
            query_preview: query.substring(0, 100),
            user_id: userId,
            chat_mode: chatMode,
            confidence,
            sources: sources.length,
            freshness
          },
          ttl
        );
      }

      console.log('✅ Enhanced RAG retrieval completed:', {
        personalItems: enhancedResult.personalKnowledge.length,
        externalItems: enhancedResult.externalKnowledge.length,
        similarItems: enhancedResult.similarContent.length,
        confidence: enhancedResult.confidence,
        freshness: enhancedResult.freshness,
        sources: enhancedResult.sources.length
      });

      return enhancedResult;
    } catch (error) {
      console.error('❌ Error in enhanced RAG retrieval:', error);
      
      // Return fallback result
      return {
        personalKnowledge: [],
        externalKnowledge: [],
        similarContent: [],
        cacheHit: false,
        sources: [],
        confidence: 0,
        freshness: 'outdated'
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
