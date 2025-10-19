/**
 * RAG (Retrieval Augmented Generation) Helper
 * Retrieves relevant knowledge from the institutional knowledge base
 */

export interface RetrievedKnowledge {
  source: string;
  content: string;
  relevance: number;
  document_type: string;
  publication_date?: string;
}

/**
 * Retrieve relevant knowledge from the knowledge base using vector search
 */
export async function retrieveRelevantKnowledge(
  userMessage: string,
  conversationHistory: Array<{ persona: string; content: string }>,
  supabaseClient: any,
  lovableApiKey: string
): Promise<RetrievedKnowledge[]> {
  try {
    console.log('[RAG] 🔍 Starting knowledge retrieval...');
    
    // Step 1: Build context window from recent conversation
    const contextWindow = conversationHistory
      .slice(-4)
      .map(m => m.content)
      .join(' ');
    
    const queryText = `${contextWindow} ${userMessage}`;
    console.log('[RAG] 📝 Query text length:', queryText.length);
    
    // Step 2: Generate embedding via Lovable AI
    const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: queryText.slice(0, 8000) // Limit input size
      })
    });
    
    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('[RAG] ❌ Embedding generation failed:', errorText);
      return [];
    }
    
    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;
    console.log('[RAG] ✅ Embedding generated, dimension:', queryEmbedding.length);
    
    // Step 3: Vector similarity search in kb_embeddings
    const { data: matches, error: searchError } = await supabaseClient.rpc('match_kb_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: 5
    });
    
    if (searchError) {
      console.error('[RAG] ❌ Vector search failed:', searchError);
      return [];
    }
    
    console.log('[RAG] ✅ Found', matches?.length || 0, 'relevant documents');
    
    // Step 4: Return relevant chunks with metadata
    return matches?.map((m: any) => ({
      source: m.source_name,
      content: m.chunk_text,
      relevance: m.similarity,
      document_type: m.document_type,
      publication_date: m.publication_date
    })) || [];
    
  } catch (error) {
    console.error('[RAG] ❌ Retrieval error:', error);
    return [];
  }
}

/**
 * Format retrieved knowledge for prompt injection
 */
export function formatKnowledgeForPrompt(knowledge: RetrievedKnowledge[]): string {
  if (knowledge.length === 0) return '';
  
  const formattedSources = knowledge.map((k, idx) => {
    const excerpt = k.content.slice(0, 300);
    const date = k.publication_date ? ` (${new Date(k.publication_date).getFullYear()})` : '';
    return `[${idx + 1}] ${k.source}${date} (${k.document_type})\n${excerpt}...`;
  }).join('\n\n');
  
  return `# Available Research & Guidelines\n\n${formattedSources}`;
}
