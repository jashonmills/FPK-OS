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

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const doc of documents || []) {
      try {
        // Check if embeddings already exist
        const { data: existingEmbeddings, error: checkError } = await supabase
          .from('kb_embeddings')
          .select('id')
          .eq('document_id', doc.id)
          .limit(1);

        if (checkError) {
          throw checkError;
        }

        if (existingEmbeddings && existingEmbeddings.length > 0) {
          console.log(`Document ${doc.id} already has embeddings, skipping`);
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
          const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lovableApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'text-embedding-3-small',
              input: chunk
            })
          });

          if (!embeddingResponse.ok) {
            const errorText = await embeddingResponse.text();
            throw new Error(`Embedding API error: ${embeddingResponse.status} ${errorText}`);
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

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
        console.log(`✅ Generated ${chunks.length} embeddings for document: ${doc.title}`);
      } catch (error) {
        failCount++;
        const errorMsg = `Failed on document ${doc.id} (${doc.title}): ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('❌', errorMsg);
        errors.push(errorMsg);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Embedding generation complete`,
        stats: {
          total: documents?.length || 0,
          success: successCount,
          failed: failCount,
          errors: errors.length > 0 ? errors : undefined
        }
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

  // If no chunks were created (text too short), return the original text
  if (chunks.length === 0) {
    chunks.push(text);
  }

  return chunks;
}
