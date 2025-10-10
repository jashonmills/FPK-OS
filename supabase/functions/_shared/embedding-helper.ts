// Centralized embedding helper for all knowledge base ingestion functions
// Uses Lovable AI's supported embedding models

const LOVABLE_AI_API_URL = 'https://ai.gateway.lovable.dev/v1/embeddings';
const EMBEDDING_MODEL = "text-embedding-3-small"; // OpenAI embedding model

interface EmbeddingOptions {
  retries?: number;
  retryDelay?: number;
}

export async function createEmbedding(
  text: string, 
  options: EmbeddingOptions = {}
): Promise<number[]> {
  const { retries = 3, retryDelay = 1000 } = options;
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  
  if (!lovableApiKey) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff: wait longer on each retry
        const delay = retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

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

      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      if (response.status === 402) {
        throw new Error('Payment required - add credits to Lovable AI workspace');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lovable AI API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.data?.[0]?.embedding) {
        throw new Error('Invalid embedding response format');
      }

      return data.data[0].embedding;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Embedding attempt ${attempt + 1} failed:`, lastError.message);
      
      // Don't retry on non-retryable errors
      if (lastError.message.includes('Payment required')) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('All embedding attempts failed');
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

// Validate extracted content before embedding
export function validateContent(text: string, source: string, minLength = 200): boolean {
  const length = text.trim().length;
  
  if (length < minLength) {
    console.warn(`⚠️ Skipping ${source} - insufficient content (${length} chars, need ${minLength}+)`);
    return false;
  }
  
  console.log(`✅ Validated ${source} - ${length} characters extracted`);
  return true;
}
