/**
 * Model fallback hierarchy for text extraction
 * Tries faster/cheaper models first, falls back to more powerful ones
 */

export interface ModelConfig {
  name: string;
  apiKey: 'ANTHROPIC_API_KEY' | 'OPENAI_API_KEY';
  maxTokens: number;
  timeout: number; // ms
  costPer1k: number; // cents
  provider: 'anthropic' | 'openai';
}

export const MODEL_HIERARCHY: ModelConfig[] = [
  {
    name: 'claude-3-5-haiku-20241022',
    apiKey: 'ANTHROPIC_API_KEY',
    maxTokens: 16000,
    timeout: 120000, // 2 min
    costPer1k: 0.08,
    provider: 'anthropic'
  },
  {
    name: 'claude-sonnet-4-20250514',
    apiKey: 'ANTHROPIC_API_KEY',
    maxTokens: 16000,
    timeout: 180000, // 3 min
    costPer1k: 0.3,
    provider: 'anthropic'
  },
  {
    name: 'claude-opus-4-1-20250805',
    apiKey: 'ANTHROPIC_API_KEY',
    maxTokens: 16000,
    timeout: 240000, // 4 min
    costPer1k: 1.5,
    provider: 'anthropic'
  }
];

export async function extractWithFallback(
  base64File: string,
  mediaType: string,
  chunkIndex?: number,
  totalChunks?: number
): Promise<{ text: string; model: string; cost: number }> {
  const errors: string[] = [];
  
  for (const model of MODEL_HIERARCHY) {
    try {
      console.log(`🔄 Attempting extraction with ${model.name}...`);
      
      const apiKey = Deno.env.get(model.apiKey);
      if (!apiKey) {
        console.warn(`⚠️ ${model.apiKey} not configured, skipping ${model.name}`);
        continue;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), model.timeout);

      let prompt = 'Extract all text from this document. Preserve structure, headings, tables, and lists. Return ONLY the extracted text content, nothing else.';
      
      if (chunkIndex !== undefined && totalChunks !== undefined) {
        prompt = `This is chunk ${chunkIndex + 1} of ${totalChunks}. ${prompt}`;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'pdfs-2024-09-25',
        },
        body: JSON.stringify({
          model: model.name,
          max_tokens: model.maxTokens,
          messages: [{
            role: 'user',
            content: [{
              type: 'document',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64File,
              }
            }, {
              type: 'text',
              text: prompt
            }]
          }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      const text = result.content?.[0]?.text || '';

      if (!text || text.length < 50) {
        throw new Error(`Extraction too short: ${text.length} chars`);
      }

      const estimatedTokens = text.length / 4;
      const cost = (estimatedTokens / 1000) * model.costPer1k;

      console.log(`✅ Extraction successful with ${model.name}: ${text.length} chars, $${cost.toFixed(4)}`);
      
      return { text, model: model.name, cost };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${model.name} failed: ${errorMsg}`);
      errors.push(`${model.name}: ${errorMsg}`);
      
      // If this is the last model, throw combined error
      if (model === MODEL_HIERARCHY[MODEL_HIERARCHY.length - 1]) {
        throw new Error(`All models failed:\n${errors.join('\n')}`);
      }
      
      // Continue to next model
      continue;
    }
  }

  throw new Error('No models available for extraction');
}
