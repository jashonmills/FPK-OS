/**
 * Model fallback hierarchy for text extraction using Lovable AI Gateway
 * Tries faster/cheaper models first, falls back to more powerful ones
 */

export interface ModelConfig {
  name: string;
  maxTokens: number;
  timeout: number; // ms
  costPer1k: number; // cents (estimated)
}

export const MODEL_HIERARCHY: ModelConfig[] = [
  {
    name: 'google/gemini-2.5-flash',
    maxTokens: 16000,
    timeout: 120000, // 2 min
    costPer1k: 0.05, // Estimated
  },
  {
    name: 'google/gemini-2.5-pro',
    maxTokens: 16000,
    timeout: 180000, // 3 min
    costPer1k: 0.15, // Estimated
  },
  {
    name: 'openai/gpt-5-mini',
    maxTokens: 16000,
    timeout: 180000, // 3 min
    costPer1k: 0.2, // Estimated
  }
];

export async function extractWithFallback(
  base64File: string,
  mediaType: string,
  chunkIndex?: number,
  totalChunks?: number
): Promise<{ text: string; model: string; cost: number }> {
  const errors: string[] = [];
  
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    throw new Error('LOVABLE_API_KEY not configured');
  }
  
  for (const model of MODEL_HIERARCHY) {
    try {
      console.log(`🔄 Attempting extraction with ${model.name}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), model.timeout);

      let prompt = 'Extract all text from this document image or PDF. Preserve structure, headings, tables, and lists. Return ONLY the extracted text content, nothing else.';
      
      if (chunkIndex !== undefined && totalChunks !== undefined) {
        prompt = `This is chunk ${chunkIndex + 1} of ${totalChunks}. ${prompt}`;
      }

      // Use Lovable AI Gateway with vision capabilities
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lovableApiKey}`,
        },
        body: JSON.stringify({
          model: model.name,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mediaType};base64,${base64File}`
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }],
          max_tokens: model.maxTokens,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again later.`);
        }
        
        // Handle payment required
        if (response.status === 402) {
          throw new Error(`Payment required. Please add credits to your Lovable workspace.`);
        }
        
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || '';

      if (!text || text.length < 50) {
        throw new Error(`Extraction too short: ${text.length} chars`);
      }

      const estimatedTokens = text.length / 4;
      const cost = (estimatedTokens / 1000) * model.costPer1k;

      console.log(`✅ Extraction successful with ${model.name}: ${text.length} chars, estimated $${cost.toFixed(4)}`);
      
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
