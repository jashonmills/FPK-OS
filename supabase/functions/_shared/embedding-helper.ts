// Centralized embedding helper for all knowledge base ingestion functions
// Uses Lovable AI's supported embedding models

const LOVABLE_AI_API_URL = Deno.env.get('LOVABLE_API_KEY') 
  ? 'https://api.lovable.app/v1/embeddings'
  : null;

// Use google/gemini-2.5-flash-lite for embeddings (fast & cost-effective)
const EMBEDDING_MODEL = "google/gemini-2.5-flash-lite";

export async function createEmbedding(text: string): Promise<number[]> {
  if (!LOVABLE_AI_API_URL) {
    throw new Error('Lovable AI API key not configured');
  }

  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  
  try {
    const response = await fetch(LOVABLE_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: EMBEDDING_MODEL,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lovable AI embedding failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.data?.[0]?.embedding) {
      throw new Error('Invalid embedding response format');
    }

    return data.data[0].embedding;
  } catch (error) {
    console.error('Embedding API error:', error);
    throw error;
  }
}

// Helper to chunk text for embedding (max ~8000 chars per chunk)
export function chunkText(text: string, maxChunkSize = 8000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // If single paragraph is too large, split by sentences
      if (para.length > maxChunkSize) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > maxChunkSize) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
      } else {
        currentChunk = para;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}
