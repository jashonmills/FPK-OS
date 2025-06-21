
import { RAGRetriever } from './rag-retriever.ts';
import { VectorEmbeddingService } from './vector-embeddings.ts';
import { KnowledgeCache } from './knowledge-cache.ts';

export interface EnhancedRetrievalResult {
  personalKnowledge: any[];
  externalKnowledge: any[];
  similarContent: any[];
  cacheHit: boolean;
  sources: string[];
  confidence: number;
}

export class EnhancedRAGRetriever {
  private ragRetriever: RAGRetriever;
  private vectorService: VectorEmbeddingService;
  private cache: KnowledgeCache;

  constructor() {
    this.ragRetriever = new RAGRetriever();
    this.vectorService = new VectorEmbeddingService();
    this.cache = new KnowledgeCache();
  }

  async retrieveEnhancedKnowledge(
    query: string,
    userId: string,
    chatMode: 'personal' | 'general' = 'personal'
  ): Promise<EnhancedRetrievalResult> {
    console.log('🔍 Enhanced RAG retrieval starting:', { query: query.substring(0, 50), userId, chatMode });

    // Generate cache key
    const queryHash = this.cache.generateQueryHash(query, userId, { chatMode });
    
    // Check cache first
    const cached = await this.cache.get(queryHash);
    if (cached && this.isCacheFresh(cached)) {
      console.log('💾 Cache hit for query');
      try {
        const cachedResult = JSON.parse(cached.content) as EnhancedRetrievalResult;
        return { ...cachedResult, cacheHit: true };
      } catch (parseError) {
        console.error('Error parsing cached result:', parseError);
      }
    }

    // Parallel retrieval for better performance
    const retrievalTasks = [];

    // 1. Personal knowledge retrieval (for personal mode)
    if (chatMode === 'personal') {
      retrievalTasks.push(this.ragRetriever.retrievePersonalKnowledge(userId));
    }

    // 2. External knowledge retrieval (for general mode or hybrid)
    if (chatMode === 'general' || chatMode === 'personal') {
      retrievalTasks.push(this.ragRetriever.retrieveExternalKnowledge(query));
    }

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

      // Calculate confidence based on available knowledge
      const confidence = this.calculateConfidence(personalKnowledge, externalKnowledge, similarContent);
      
      // Determine sources
      const sources = this.identifySources(personalKnowledge, externalKnowledge, similarContent);

      const enhancedResult: EnhancedRetrievalResult = {
        personalKnowledge: Array.isArray(personalKnowledge) ? personalKnowledge : [],
        externalKnowledge: Array.isArray(externalKnowledge) ? externalKnowledge : [],
        similarContent: Array.isArray(similarContent) ? similarContent : [],
        cacheHit: false,
        sources,
        confidence
      };

      // Cache the result
      await this.cache.set(
        queryHash,
        JSON.stringify(enhancedResult),
        chatMode === 'personal' ? 'hybrid' : 'external',
        { 
          query_preview: query.substring(0, 100),
          user_id: userId,
          chat_mode: chatMode,
          confidence,
          sources: sources.length
        }
      );

      console.log('✅ Enhanced RAG retrieval completed:', {
        personalItems: enhancedResult.personalKnowledge.length,
        externalItems: enhancedResult.externalKnowledge.length,
        similarItems: enhancedResult.similarContent.length,
        confidence: enhancedResult.confidence,
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
        confidence: 0
      };
    }
  }

  private isCacheFresh(cached: any): boolean {
    const now = new Date();
    const expiresAt = new Date(cached.expires_at);
    return expiresAt > now;
  }

  private calculateConfidence(
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

    // External knowledge adds moderate confidence
    if (externalKnowledge.length > 0) {
      score += Math.min(externalKnowledge.length * 0.2, 0.3);
      maxScore += 0.3;
    }

    // Similar content adds some confidence
    if (similarContent.length > 0) {
      const avgSimilarity = similarContent.reduce((sum, item) => 
        sum + (item.metadata?.similarity || 0), 0) / similarContent.length;
      score += avgSimilarity * 0.3;
      maxScore += 0.3;
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

    if (externalKnowledge.length > 0) {
      sources.add('External Knowledge');
    }

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
