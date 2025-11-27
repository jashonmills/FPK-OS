
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IngestionRequest {
  gutenbergIds: number[];
  batchSize?: number;
  forceRedownload?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { gutenbergIds, batchSize = 3, forceRedownload = false }: IngestionRequest = await req.json();

    console.log('🚀 Starting enhanced EPUB ingestion for', gutenbergIds.length, 'books');

    const results = [];
    let processed = 0;

    // Process books in batches to avoid overwhelming the system
    for (let i = 0; i < gutenbergIds.length; i += batchSize) {
      const batch = gutenbergIds.slice(i, i + batchSize);
      const batchPromises = batch.map(gutenbergId => processBook(supabaseClient, gutenbergId, forceRedownload));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('❌ Batch processing error:', result.reason);
          results.push({
            gutenbergId: 'unknown',
            title: 'Unknown',
            status: 'failed',
            error: result.reason?.message || 'Unknown error'
          });
        }
        processed++;
      }

      // Small delay between batches to be respectful
      if (i + batchSize < gutenbergIds.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log(`✅ Ingestion complete: ${successful} successful, ${failed} failed`);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total: gutenbergIds.length,
        successful,
        failed,
        results
      },
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Ingestion function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to process EPUB ingestion'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function processBook(supabaseClient: any, gutenbergId: number, forceRedownload: boolean) {
  try {
    console.log(`📚 Processing book ${gutenbergId}`);

    // Get book info from database
    const { data: book, error: bookError } = await supabaseClient
      .from('public_domain_books')
      .select('*')
      .eq('gutenberg_id', gutenbergId)
      .single();

    if (bookError || !book) {
      throw new Error(`Book ${gutenbergId} not found in database`);
    }

    // Check if already downloaded and not forcing redownload
    if (book.download_status === 'completed' && book.storage_url && !forceRedownload) {
      console.log(`⚠️ Book ${gutenbergId} already downloaded, skipping`);
      return {
        gutenbergId,
        title: book.title,
        status: 'success',
        message: 'Already downloaded'
      };
    }

    // Update status to downloading
    await supabaseClient
      .from('public_domain_books')
      .update({ 
        download_status: 'downloading',
        last_download_attempt: new Date().toISOString(),
        download_error_message: null
      })
      .eq('gutenberg_id', gutenbergId);

    // Try multiple EPUB URL strategies
    const epubUrls = [
      `https://www.gutenberg.org/ebooks/${gutenbergId}.epub.noimages`,
      `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.epub`,
      `https://www.gutenberg.org/files/${gutenbergId}/${gutenbergId}-0.epub`
    ];

    let epubData = null;
    let finalUrl = null;

    for (const url of epubUrls) {
      try {
        console.log(`🔗 Trying URL: ${url}`);
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Supabase-Function/1.0' },
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (response.ok) {
          epubData = await response.arrayBuffer();
          finalUrl = url;
          console.log(`✅ Successfully downloaded from: ${url}`);
          break;
        } else {
          console.log(`⚠️ Failed to download from ${url}: ${response.status}`);
        }
      } catch (urlError) {
        console.log(`⚠️ Error with ${url}:`, urlError.message);
        continue;
      }
    }

    if (!epubData) {
      throw new Error('Could not download EPUB from any source');
    }

    // Upload to Supabase Storage
    const fileName = `gutenberg-${gutenbergId}.epub`;
    const filePath = `public-domain/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('books')
      .upload(filePath, epubData, {
        contentType: 'application/epub+zip',
        upsert: true // Allow overwriting if it exists
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('books')
      .getPublicUrl(filePath);

    const storageUrl = urlData.publicUrl;

    // Update book record with storage info
    const { error: updateError } = await supabaseClient
      .from('public_domain_books')
      .update({
        download_status: 'completed',
        storage_url: storageUrl,
        file_size: epubData.byteLength,
        download_error_message: null,
        last_download_attempt: new Date().toISOString()
      })
      .eq('gutenberg_id', gutenbergId);

    if (updateError) {
      console.error(`❌ Failed to update book ${gutenbergId}:`, updateError);
    }

    console.log(`✅ Successfully processed book ${gutenbergId}: ${book.title}`);

    return {
      gutenbergId,
      title: book.title,
      status: 'success',
      storageUrl,
      fileSize: epubData.byteLength
    };

  } catch (error) {
    console.error(`❌ Error processing book ${gutenbergId}:`, error);

    // Update status to failed
    try {
      await supabaseClient
        .from('public_domain_books')
        .update({
          download_status: 'failed',
          download_error_message: error.message,
          last_download_attempt: new Date().toISOString()
        })
        .eq('gutenberg_id', gutenbergId);
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return {
      gutenbergId,
      title: `Book ${gutenbergId}`,
      status: 'failed',
      error: error.message
    };
  }
}
