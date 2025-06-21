
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface EmbeddingResult {
  embedding: number[];
  text: string;
  metadata: Record<string, any>;
}

export class VectorEmbeddingService {
  private model = 'text-embedding-3-small';
  
  async generateEmbedding(text: string): Promise<number[]> {
    if (!openaiApiKey) {
      console.warn('OpenAI API key not available for embeddings');
      return [];
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: text.substring(0, 8000), // Limit text length
          encoding_format: 'float'
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return [];
    }
  }

  async storeEmbedding(
    text: string,
    embedding: number[],
    metadata: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('knowledge_embeddings')
        .insert({
          content: text,
          embedding: JSON.stringify(embedding),
          metadata,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error storing embedding:', error);
      return null;
    }
  }

  async findSimilarContent(
    queryEmbedding: number[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<EmbeddingResult[]> {
    try {
      // For now, we'll use a simple approach since pgvector setup requires database extensions
      // In production, you'd want to use pgvector for efficient similarity search
      const { data, error } = await supabase
        .from('knowledge_embeddings')
        .select('content, embedding, metadata')
        .limit(100); // Get more results to filter locally

      if (error) throw error;

      const results: EmbeddingResult[] = [];
      
      for (const row of data || []) {
        try {
          const embedding = JSON.parse(row.embedding);
          const similarity = this.cosineSimilarity(queryEmbedding, embedding);
          
          if (similarity >= threshold) {
            results.push({
              embedding,
              text: row.content,
              metadata: { ...row.metadata, similarity }
            });
          }
        } catch (parseError) {
          console.error('Error parsing embedding:', parseError);
        }
      }

      // Sort by similarity and return top results
      return results
        .sort((a, b) => (b.metadata.similarity || 0) - (a.metadata.similarity || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding similar content:', error);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async processUserContent(userId: string, content: string, contentType: string): Promise<void> {
    console.log(`Processing ${contentType} content for user ${userId}`);
    
    const embedding = await this.generateEmbedding(content);
    if (embedding.length === 0) return;

    await this.storeEmbedding(content, embedding, {
      user_id: userId,
      content_type: contentType,
      processed_at: new Date().toISOString()
    });
  }
}
