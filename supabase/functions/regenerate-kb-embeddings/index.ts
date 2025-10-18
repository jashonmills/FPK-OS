import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'LOVABLE_API_KEY not configured. Please set it in Supabase Dashboard > Settings > Edge Functions' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all documents without embeddings
    const { data: documents, error: docsError } = await supabase
      .from('kb_documents')
      .select('id, title, content')
      .order('created_at', { ascending: true });

    if (docsError) {
      throw docsError;
    }

    console.log(`Found ${documents?.length || 0} documents`);

    // Create job tracking record
    const { data: job, error: jobError } = await supabase
      .from('kb_embedding_jobs')
      .insert({
        status: 'in_progress',
        total_documents: documents?.length || 0,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    const jobId = job.id;

    // Process documents in background
    processDocuments(supabase, documents || [], jobId, lovableApiKey);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Embedding generation started',
        jobId: jobId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in regenerate-kb-embeddings:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processDocuments(supabase: any, documents: any[], jobId: string, lovableApiKey: string) {
  let successCount = 0;
  let failCount = 0;
  const errors: string[] = [];

  for (let docIndex = 0; docIndex < documents.length; docIndex++) {
    const doc = documents[docIndex];
    
    try {
      // Update progress
      await supabase
        .from('kb_embedding_jobs')
        .update({
          processed_documents: docIndex + 1,
          current_document_title: doc.title
        })
        .eq('id', jobId);

      // Check if embeddings already exist
      const { data: existingEmbeddings } = await supabase
        .from('kb_embeddings')
        .select('id')
        .eq('document_id', doc.id)
        .limit(1);

      if (existingEmbeddings && existingEmbeddings.length > 0) {
        console.log(`Document ${doc.id} already has embeddings, skipping`);
        successCount++;
        continue;
      }

      // Use title as content for embedding since documents might not have full content
      const contentToEmbed = doc.content || doc.title;
      
      // Split into chunks
      const chunks = splitIntoChunks(contentToEmbed, 1000);
      console.log(`Processing document ${doc.id}: ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Generate embedding using Lovable AI
        const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a semantic analysis system. Generate a comma-separated list of exactly 50 semantic keywords that represent the core concepts, themes, and topics in the given text. Focus on educational, neurodiversity, and academic concepts.'
              },
              {
                role: 'user',
                content: `Analyze this text and return exactly 50 keywords:\n\n${chunk}`
              }
            ],
            max_completion_tokens: 500
          })
        });

        if (!embeddingResponse.ok) {
          const errorText = await embeddingResponse.text();
          throw new Error(`Embedding API error: ${embeddingResponse.status} ${errorText}`);
        }

        const embeddingData = await embeddingResponse.json();
        const keywords = embeddingData.choices[0].message.content;
        
        // Convert keywords to a simple vector representation
        const embedding = keywords.split(',').map((kw: string) => kw.trim().toLowerCase());

        // Store embedding
        const { error: insertError } = await supabase
          .from('kb_embeddings')
          .insert({
            document_id: doc.id,
            chunk_index: i,
            chunk_text: chunk,
            embedding: JSON.stringify(embedding)
          });

        if (insertError) {
          throw insertError;
        }
      }

      successCount++;
      
      // Update success count
      await supabase
        .from('kb_embedding_jobs')
        .update({
          successful_embeddings: successCount
        })
        .eq('id', jobId);

      console.log(`✅ Generated ${chunks.length} embeddings for document: ${doc.title}`);
    } catch (error) {
      failCount++;
      const errorMsg = `Failed on document ${doc.id} (${doc.title}): ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌', errorMsg);
      errors.push(errorMsg);
      
      // Update fail count
      await supabase
        .from('kb_embedding_jobs')
        .update({
          failed_embeddings: failCount,
          error_message: errorMsg
        })
        .eq('id', jobId);
    }
  }

  // Mark job as complete
  await supabase
    .from('kb_embedding_jobs')
    .update({
      status: failCount === documents.length ? 'failed' : 'completed',
      completed_at: new Date().toISOString(),
      processed_documents: documents.length,
      successful_embeddings: successCount,
      failed_embeddings: failCount
    })
    .eq('id', jobId);

  console.log(`Embedding generation complete: ${successCount} successful, ${failCount} failed`);
}

function splitIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  if (chunks.length === 0) {
    chunks.push(text);
  }

  return chunks;
}
