// Centralized embedding helper for all knowledge base ingestion functions
// CRITICAL: Uses Lovable AI chat completion API to generate semantic embeddings
// Lovable AI Gateway doesn't have a /v1/embeddings endpoint, so we use chat completions

const LOVABLE_AI_API_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const EMBEDDING_MODEL = "google/gemini-2.5-flash"; // Fast, cost-effective model for embedding generation

interface EmbeddingOptions {
  retries?: number;
  retryDelay?: number;
}

// Generate a semantic embedding by using the AI model to create a numerical representation
async function generateSemanticEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(LOVABLE_AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a semantic analysis tool. Analyze the text and return a JSON array of 384 floating point numbers representing the semantic embedding. Each number should be between -1 and 1. Return ONLY the JSON array, no other text.'
        },
        {
          role: 'user',
          content: `Generate a 384-dimensional semantic embedding for this text:\n\n${text.substring(0, 3000)}`
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lovable AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content in AI response');
  }

  // Parse the JSON array from the response
  try {
    const embedding = JSON.parse(content);
    if (!Array.isArray(embedding) || embedding.length !== 384) {
      throw new Error(`Invalid embedding format: expected array of 384 numbers, got ${embedding.length}`);
    }
    return embedding;
  } catch (parseError) {
    console.error('Failed to parse embedding:', content.substring(0, 200));
    throw new Error('Failed to parse embedding from AI response');
  }
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

  if (!text || text.trim().length === 0) {
    throw new Error('Cannot create embedding for empty text');
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

      const embedding = await generateSemanticEmbedding(text, lovableApiKey);
      console.log(`✅ Successfully generated embedding (${embedding.length} dimensions)`);
      return embedding;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Embedding attempt ${attempt + 1} failed:`, lastError.message);
      
      // Check for specific error types
      if (lastError.message.includes('429')) {
        console.error('❌ Rate limit exceeded - waiting before retry');
      } else if (lastError.message.includes('402')) {
        console.error('❌ Payment required - add credits to Lovable AI workspace');
        throw lastError; // Don't retry payment errors
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
