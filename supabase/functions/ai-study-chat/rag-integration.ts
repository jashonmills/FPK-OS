
import { EnhancedRAGRetriever } from './enhanced-rag-retriever.ts';

export function buildRAGEnhancedPrompt(
  systemPrompt: string,
  userMessage: string,
  retrievalResult: any,
  chatMode: 'personal' | 'general',
  voiceActive: boolean = false
): string {
  let enhancedPrompt = systemPrompt;

  // Add voice optimization if needed
  if (voiceActive) {
    enhancedPrompt += `\n\nVOICE MODE: Responses will be read aloud. Keep responses:
- Conversational and engaging
- Well-structured with clear breaks
- Under 200 words when possible
- Free of complex formatting that doesn't translate to speech`;
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
${retrievalResult.externalKnowledge.map((item: any, index: number) => 
  `${index + 1}. Source: ${item.source_name || 'Unknown'} - ${item.content?.substring(0, 200)}...`
).join('\n')}`;
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

  // Add mode-specific instructions
  const modeInstruction = chatMode === 'personal' 
    ? '\n\n[🔒 PERSONAL MODE - Prioritize personal study data when available, supplement with external knowledge as needed]'
    : '\n\n[🌐 GENERAL MODE - Use external knowledge sources, avoid referencing personal data]';

  enhancedPrompt += modeInstruction;

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
    console.log('🤖 RAG Integration: Enhancing prompt with retrieved knowledge');

    try {
      // Retrieve relevant knowledge using RAG
      const retrievalResult = await this.retriever.retrieveEnhancedKnowledge(
        userMessage,
        userId,
        chatMode
      );

      // Build enhanced prompt
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
        chatMode
      };

      console.log('✅ RAG Enhancement completed:', metadata);

      return { enhancedPrompt, metadata };
    } catch (error) {
      console.error('❌ Error in RAG integration:', error);
      
      // Fallback to original prompt
      return {
        enhancedPrompt: `${systemPrompt}\n\nUSER MESSAGE: ${userMessage}`,
        metadata: {
          ragEnabled: false,
          error: 'RAG enhancement failed',
          fallback: true
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
