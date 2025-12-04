
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fileId } = await req.json()
    console.log('Processing KB file:', fileId)

    // Get file record
    const { data: fileRecord, error: fileError } = await supabaseClient
      .from('knowledge_base_files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !fileRecord) {
      throw new Error(`File not found: ${fileError?.message}`)
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('kb_files')
      .download(fileRecord.storage_path)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`)
    }

    // Process different file types
    let textContent = ''
    
    if (fileRecord.mime_type === 'text/plain' || fileRecord.mime_type === 'text/markdown') {
      textContent = await fileData.text()
    } else if (fileRecord.mime_type === 'application/pdf') {
      // For now, we'll store a placeholder - in production you'd use a PDF parsing library
      textContent = `PDF content from ${fileRecord.file_name} - full text extraction would be implemented here`
    } else if (fileRecord.mime_type.startsWith('image/')) {
      // For images, we'll store metadata for now
      textContent = `Image file: ${fileRecord.file_name} (${fileRecord.mime_type}) - OCR extraction would be implemented here`
    } else {
      textContent = `Document: ${fileRecord.file_name} - content extraction for ${fileRecord.mime_type} would be implemented here`
    }

    // Create embedding using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: textContent,
      }),
    })

    if (!embeddingResponse.ok) {
      throw new Error('Failed to create embedding')
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Store in knowledge_embeddings table
    const { error: embeddingError } = await supabaseClient
      .from('knowledge_embeddings')
      .insert({
        user_id: fileRecord.user_id,
        content: textContent,
        embedding: JSON.stringify(embedding),
        metadata: {
          source: 'knowledge_base',
          file_id: fileId,
          file_name: fileRecord.file_name,
          mime_type: fileRecord.mime_type,
          file_size: fileRecord.file_size
        }
      })

    if (embeddingError) {
      throw new Error(`Failed to store embedding: ${embeddingError.message}`)
    }

    // Mark file as processed
    const { error: updateError } = await supabaseClient
      .from('knowledge_base_files')
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', fileId)

    if (updateError) {
      throw new Error(`Failed to update file status: ${updateError.message}`)
    }

    console.log('✅ KB file processed successfully:', fileId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        fileId,
        embeddingTokens: embeddingData.usage?.total_tokens || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing KB file:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
