
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { gutenbergIds, batchSize = 5 } = await req.json()
    
    if (!gutenbergIds || !Array.isArray(gutenbergIds)) {
      throw new Error('gutenbergIds array is required')
    }

    console.log(`📚 Starting EPUB ingestion for ${gutenbergIds.length} books`)
    
    const results = []
    
    // Process books in batches to avoid overwhelming the system
    for (let i = 0; i < gutenbergIds.length; i += batchSize) {
      const batch = gutenbergIds.slice(i, i + batchSize)
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}: books ${batch.join(', ')}`)
      
      const batchPromises = batch.map(async (gutenbergId: number) => {
        return await processBook(supabase, gutenbergId)
      })
      
      const batchResults = await Promise.allSettled(batchPromises)
      results.push(...batchResults)
      
      // Brief pause between batches to be respectful to Project Gutenberg
      if (i + batchSize < gutenbergIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Summarize results
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    console.log(`✅ Ingestion complete: ${successful} successful, ${failed} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: gutenbergIds.length,
          successful,
          failed,
          results: results.map((result, index) => ({
            gutenbergId: gutenbergIds[index],
            status: result.status,
            error: result.status === 'rejected' ? result.reason : null
          }))
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error in EPUB ingestion:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function processBook(supabase: any, gutenbergId: number) {
  console.log(`📖 Processing book ${gutenbergId}`)
  
  try {
    // Update status to 'downloading'
    await supabase
      .from('public_domain_books')
      .update({ 
        download_status: 'downloading',
        last_download_attempt: new Date().toISOString(),
        download_error_message: null
      })
      .eq('gutenberg_id', gutenbergId)

    // Download EPUB from Project Gutenberg
    const epubUrl = `https://www.gutenberg.org/ebooks/${gutenbergId}.epub.noimages`
    console.log(`🔗 Downloading from: ${epubUrl}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const response = await fetch(epubUrl, {
      headers: {
        'User-Agent': 'Lovable Public Domain Library (Educational Use)',
        'Accept': 'application/epub+zip,application/octet-stream,*/*'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to download EPUB: ${response.status} ${response.statusText}`)
    }

    const epubBlob = await response.arrayBuffer()
    const fileSize = epubBlob.byteLength
    
    console.log(`📊 Downloaded ${fileSize} bytes for book ${gutenbergId}`)

    // Upload to Supabase Storage
    const fileName = `${gutenbergId}.epub`
    const filePath = `books/${fileName}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('books')
      .upload(filePath, epubBlob, {
        contentType: 'application/epub+zip',
        upsert: true // Overwrite if exists
      })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('books')
      .getPublicUrl(filePath)

    console.log(`🔗 Public URL: ${publicUrl}`)

    // Update database record
    const { error: updateError } = await supabase
      .from('public_domain_books')
      .update({
        storage_url: publicUrl,
        file_size: fileSize,
        download_status: 'completed',
        last_download_attempt: new Date().toISOString(),
        download_error_message: null
      })
      .eq('gutenberg_id', gutenbergId)

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log(`✅ Successfully processed book ${gutenbergId}`)
    return { gutenbergId, success: true, fileSize, publicUrl }

  } catch (error) {
    console.error(`❌ Error processing book ${gutenbergId}:`, error)
    
    // Update status to 'failed'
    await supabase
      .from('public_domain_books')
      .update({
        download_status: 'failed',
        last_download_attempt: new Date().toISOString(),
        download_error_message: error.message
      })
      .eq('gutenberg_id', gutenbergId)

    throw error
  }
}
