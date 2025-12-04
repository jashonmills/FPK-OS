
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

    const { content, contentType, userId } = await req.json()
    console.log('Processing user content:', { contentType, userId, contentLength: content.length })

    if (!userId || !content || !contentType) {
      throw new Error('Missing required fields: userId, content, or contentType')
    }

    // Create embedding using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Creating embedding for content...')
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: content,
      }),
    })

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text()
      throw new Error(`OpenAI API error: ${embeddingResponse.status} ${errorText}`)
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Store in knowledge_embeddings table
    const { error: embeddingError } = await supabaseClient
      .from('knowledge_embeddings')
      .insert({
        user_id: userId,
        content: content.substring(0, 2000), // Truncate for storage
        embedding: JSON.stringify(embedding),
        metadata: {
          source: contentType,
          processed_at: new Date().toISOString(),
          content_length: content.length,
          embedding_model: 'text-embedding-3-small'
        }
      })

    if (embeddingError) {
      console.error('Database error:', embeddingError)
      throw new Error(`Failed to store embedding: ${embeddingError.message}`)
    }

    console.log('✅ Content processed successfully:', { contentType, userId })

    return new Response(
      JSON.stringify({ 
        success: true, 
        contentType,
        embeddingTokens: embeddingData.usage?.total_tokens || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing user content:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
