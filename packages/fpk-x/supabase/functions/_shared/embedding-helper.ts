// Centralized embedding helper using OpenAI's dedicated embeddings API
// This is the industry-standard approach for generating vector embeddings

const OPENAI_EMBEDDINGS_API = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, $0.00002/1k tokens

interface EmbeddingOptions {
  retries?: number;
  retryDelay?: number;
}

// Generate a real semantic embedding using OpenAI's dedicated API
async function generateSemanticEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(OPENAI_EMBEDDINGS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: text,
      model: EMBEDDING_MODEL,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const embedding = data.data?.[0]?.embedding;
  
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Invalid embedding response from OpenAI');
  }

  return embedding;
}

export async function createEmbedding(
  text: string, 
  options: EmbeddingOptions = {}
): Promise<number[]> {
  const { retries = 3, retryDelay = 1000 } = options;
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Cannot create embedding for empty text');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const embedding = await generateSemanticEmbedding(text, openaiApiKey);
      console.log(`✅ Successfully generated embedding (${embedding.length} dimensions)`);
      return embedding;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Embedding attempt ${attempt + 1} failed:`, lastError.message);
      
      if (lastError.message.includes('429')) {
        console.error('❌ Rate limit exceeded - waiting before retry');
      } else if (lastError.message.includes('401')) {
        console.error('❌ Invalid API key');
        throw lastError; // Don't retry auth errors
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
