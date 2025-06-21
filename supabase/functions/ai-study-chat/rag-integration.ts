
import { EnhancedRAGRetriever } from './enhanced-rag-retriever.ts';

export function buildRAGEnhancedPrompt(
  systemPrompt: string,
  userMessage: string,
  retrievalResult: any,
  chatMode: 'personal' | 'general',
  voiceActive: boolean = false
): string {
  let enhancedPrompt = systemPrompt;

  // Add current date context for time-sensitive queries
  const currentDate = new Date().toISOString().split('T')[0];
  enhancedPrompt += `\n\nCURRENT DATE: ${currentDate}`;

  // Add voice optimization if needed
  if (voiceActive) {
    enhancedPrompt += `\n\nVOICE MODE: Responses will be read aloud. Keep responses:
- Conversational and engaging
- Well-structured with clear breaks
- Under 200 words when possible
- Free of complex formatting that doesn't translate to speech`;
  }

  // Add freshness indicator
  if (retrievalResult.freshness) {
    enhancedPrompt += `\n\nINFORMATION FRESHNESS: ${retrievalResult.freshness.toUpperCase()}`;
    if (retrievalResult.freshness === 'current') {
      enhancedPrompt += ' - Information is up-to-date and verified';
    } else if (retrievalResult.freshness === 'recent') {
      enhancedPrompt += ' - Information is recent but may need verification';
    } else {
      enhancedPrompt += ' - Information may be outdated, recommend checking current sources';
    }
  }

  // Add RAG context based on retrieved knowledge
  if (retrievalResult.personalKnowledge?.length > 0 && chatMode === 'personal') {
    enhancedPrompt += `\n\nPERSONAL STUDY CONTEXT:
${retrievalResult.personalKnowledge.map((item: any, index: number) => 
  `${index + 1}. ${JSON.stringify(item).substring(0, 200)}...`
).join('\n')}`;
  }

  if (retrievalResult.externalKnowledge?.length > 0) {
    enhancedPrompt += `\n\nEXTERNAL KNOWLEDGE CONTEXT:
${retrievalResult.externalKnowledge.map((item: any, index: number) => {
  const freshnessBadge = item.is_current ? '[CURRENT]' : '[CHECK LATEST]';
  return `${index + 1}. ${freshnessBadge} Source: ${item.source_name || 'Unknown'} - ${item.content?.substring(0, 200)}...`;
}).join('\n')}`;
  }

  if (retrievalResult.similarContent?.length > 0) {
    enhancedPrompt += `\n\nSIMILAR CONTENT:
${retrievalResult.similarContent.map((item: any, index: number) => 
  `${index + 1}. (${Math.round((item.metadata?.similarity || 0) * 100)}% match) ${item.text?.substring(0, 150)}...`
).join('\n')}`;
  }

  // Add confidence and source information
  if (retrievalResult.confidence > 0) {
    enhancedPrompt += `\n\nKNOWLEDGE CONFIDENCE: ${Math.round(retrievalResult.confidence * 100)}%`;
    if (retrievalResult.sources?.length > 0) {
      enhancedPrompt += `\nSOURCES: ${retrievalResult.sources.join(', ')}`;
    }
  }

  // Add mode-specific instructions with freshness awareness
  const modeInstruction = chatMode === 'personal' 
    ? '\n\n[🔒 PERSONAL MODE - Prioritize personal study data, supplement with verified external knowledge]'
    : '\n\n[🌐 GENERAL MODE - Use verified external knowledge sources, prioritize current information]';

  enhancedPrompt += modeInstruction;

  // Add special instructions for potentially outdated information
  if (retrievalResult.freshness === 'outdated') {
    enhancedPrompt += '\n\nIMPORTANT: Some information may be outdated. When providing factual answers about current events, presidents, or time-sensitive topics, acknowledge the potential for outdated information and suggest checking current sources.';
  }

  // Add the user message
  enhancedPrompt += `\n\nUSER MESSAGE: ${userMessage}`;

  return enhancedPrompt;
}

export class RAGIntegration {
  private retriever: EnhancedRAGRetriever;

  constructor() {
    this.retriever = new EnhancedRAGRetriever();
  }

  async enhancePromptWithRAG(
    systemPrompt: string,
    userMessage: string,
    userId: string,
    chatMode: 'personal' | 'general',
    voiceActive: boolean = false
  ): Promise<{ enhancedPrompt: string; metadata: any }> {
    console.log('🤖 RAG Integration: Enhancing prompt with current knowledge retrieval');

    try {
      // Retrieve relevant knowledge using enhanced RAG
      const retrievalResult = await this.retriever.retrieveEnhancedKnowledge(
        userMessage,
        userId,
        chatMode
      );

      // Build enhanced prompt with freshness awareness
      const enhancedPrompt = buildRAGEnhancedPrompt(
        systemPrompt,
        userMessage,
        retrievalResult,
        chatMode,
        voiceActive
      );

      const metadata = {
        ragEnabled: true,
        personalItems: retrievalResult.personalKnowledge.length,
        externalItems: retrievalResult.externalKnowledge.length,
        similarItems: retrievalResult.similarContent.length,
        confidence: retrievalResult.confidence,
        sources: retrievalResult.sources,
        cacheHit: retrievalResult.cacheHit,
        freshness: retrievalResult.freshness,
        chatMode
      };

      console.log('✅ RAG Enhancement completed:', metadata);

      return { enhancedPrompt, metadata };
    } catch (error) {
      console.error('❌ Error in RAG integration:', error);
      
      // Fallback to original prompt with current date
      const currentDate = new Date().toISOString().split('T')[0];
      return {
        enhancedPrompt: `${systemPrompt}\n\nCURRENT DATE: ${currentDate}\n\nUSER MESSAGE: ${userMessage}`,
        metadata: {
          ragEnabled: false,
          error: 'RAG enhancement failed',
          fallback: true,
          freshness: 'unknown'
        }
      };
    }
  }

  async processUserContent(userId: string, content: string, contentType: string): Promise<void> {
    await this.retriever.processUserContent(userId, content, contentType);
  }

  async getRAGStats(): Promise<any> {
    return await this.retriever.getCacheStats();
  }

  async cleanupRAGCache(): Promise<void> {
    await this.retriever.cleanupCache();
  }
}
