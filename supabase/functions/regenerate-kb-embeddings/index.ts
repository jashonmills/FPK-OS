import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let jobId: string | null = null;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('🚀 Starting knowledge base embedding regeneration');

    // Check for OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured. Please add it in Supabase Edge Function secrets.');
    }

    // Get all knowledge sources
    const { data: sources, error: sourcesError } = await supabase
      .from('ai_knowledge_sources')
      .select('id, source_name, description, url')
      .eq('is_active', true);

    if (sourcesError) throw sourcesError;

    console.log(`📚 Found ${sources.length} knowledge sources to process`);

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('kb_embedding_jobs')
      .insert({
        status: 'in_progress',
        total_documents: sources.length,
        processed_documents: 0,
        successful_embeddings: 0,
        failed_embeddings: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      console.error('❌ Failed to create job:', jobError);
      throw jobError;
    }

    jobId = job.id;
    console.log(`✅ Created job: ${jobId}`);

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Process in batches of 10 for efficiency
    const batchSize = 10;
    
    for (let batchStart = 0; batchStart < sources.length; batchStart += batchSize) {
      const batch = sources.slice(batchStart, batchStart + batchSize);
      console.log(`📦 Processing batch ${Math.floor(batchStart / batchSize) + 1}/${Math.ceil(sources.length / batchSize)}`);

      // Process batch in parallel
      await Promise.all(batch.map(async (source, batchIndex) => {
        const globalIndex = batchStart + batchIndex;
        
        try {
          // Update progress
          await supabase
            .from('kb_embedding_jobs')
            .update({
              current_document_title: source.source_name,
              processed_documents: globalIndex + 1,
            })
            .eq('id', jobId);

          // Prepare content for embedding
          const content = `${source.source_name}\n\n${source.description || ''}\n\nSource: ${source.url}`;
          
          // Split into chunks if content is long (max 8000 chars per chunk)
          const maxChunkSize = 8000;
          const chunks: string[] = [];
          
          if (content.length <= maxChunkSize) {
            chunks.push(content);
          } else {
            // Split by sentences to avoid breaking mid-sentence
            const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
            let currentChunk = '';
            
            for (const sentence of sentences) {
              if ((currentChunk + sentence).length > maxChunkSize) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
              } else {
                currentChunk += sentence;
              }
            }
            if (currentChunk) chunks.push(currentChunk.trim());
          }

          console.log(`  📄 ${source.source_name} - ${chunks.length} chunk(s)`);

          // Generate embeddings for each chunk
          for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex];
            
            // Retry logic for embedding generation
            let embeddingVector = null;
            const maxRetries = 3;
            
            for (let retry = 0; retry < maxRetries; retry++) {
              try {
                const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'text-embedding-3-small',
                    input: chunk,
                  }),
                  signal: AbortSignal.timeout(30000), // 30 second timeout
                });

                if (!embeddingResponse.ok) {
                  const errorText = await embeddingResponse.text();
                  throw new Error(`OpenAI API error ${embeddingResponse.status}: ${errorText}`);
                }

                const embeddingData = await embeddingResponse.json();
                embeddingVector = embeddingData.data[0].embedding;
                break; // Success
                
              } catch (err) {
                if (retry === maxRetries - 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retry)));
              }
            }

            if (!embeddingVector) {
              throw new Error('Failed to generate embedding after retries');
            }

            // Store embedding
            const { error: embeddingError } = await supabase
              .from('kb_embeddings')
              .upsert({
                source_id: source.id,
                content_chunk: chunk,
                embedding: embeddingVector,
                chunk_index: chunkIndex,
              }, {
                onConflict: 'source_id,chunk_index'
              });

            if (embeddingError) {
              console.error(`  ❌ DB insert error for chunk ${chunkIndex}:`, embeddingError);
              throw embeddingError;
            }
          }

          successCount++;
          console.log(`  ✅ ${source.source_name} - ${chunks.length} embedding(s) created`);

        } catch (error) {
          failCount++;
          const errorMsg = `${source.source_name}: ${error.message}`;
          console.error(`  ❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }));

      // Update counts after each batch
      await supabase
        .from('kb_embedding_jobs')
        .update({
          successful_embeddings: successCount,
          failed_embeddings: failCount,
          error_message: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
        })
        .eq('id', jobId);

      // Rate limiting: wait 1 second between batches
      if (batchStart + batchSize < sources.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Mark job as complete
    await supabase
      .from('kb_embedding_jobs')
      .update({
        status: failCount > 0 && successCount === 0 ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
        current_document_title: null,
        successful_embeddings: successCount,
        failed_embeddings: failCount,
      })
      .eq('id', jobId);

    console.log(`🏁 Embedding generation complete: ${successCount}/${sources.length} successful`);

    return new Response(
      JSON.stringify({ 
        success: true,
        job_id: jobId,
        total: sources.length,
        successful: successCount,
        failed: failCount,
        errors: errors.length > 0 ? errors.slice(0, 10) : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Fatal error in regenerate-kb-embeddings:', error);

    // Update job as failed
    if (jobId) {
      try {
        await supabase
          .from('kb_embedding_jobs')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch (updateErr) {
        console.error('Failed to update job status:', updateErr);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
