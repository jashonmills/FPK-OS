import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document_id, force_re_extract = false } = await req.json();
    
    console.log('\n🔍 ========== EXTRACT-TEXT-WITH-VISION INVOKED ==========');
    console.log('📋 Document ID:', document_id);
    console.log('🔄 Force re-extract:', force_re_extract);
    console.log('⏰ Invoked at:', new Date().toISOString());
    
    if (!document_id) {
      console.error('❌ CRITICAL: Missing document_id in request');
      throw new Error('document_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

    console.log('🔑 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasAnthropicKey: !!anthropicApiKey
    });

    if (!anthropicApiKey) {
      console.error('❌ CRITICAL: ANTHROPIC_API_KEY is not configured');
      throw new Error('ANTHROPIC_API_KEY is not configured in environment');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');

    // Fetch document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    // Check if document already has extracted content (unless force re-extract)
    if (!force_re_extract && document.extracted_content && document.extracted_content.length > 100) {
      console.log('✅ Document already has extracted content, skipping extraction');
      return new Response(
        JSON.stringify({ 
          success: true, 
          document_id,
          extracted_content: document.extracted_content,
          message: 'Document already has extracted content'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (force_re_extract) {
      console.log('🔄 Force re-extract enabled, clearing old content...');
      await supabase
        .from('documents')
        .update({ extracted_content: null })
        .eq('id', document_id);
    }

    // Download file from storage
    console.log(`📥 Downloading file: ${document.file_path}`);
    const filePathParts = document.file_path.split('/family-documents/')[1];
    
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('family-documents')
      .download(filePathParts);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    // Convert blob to base64 using Deno's standard library (robust & efficient)
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Data = encodeBase64(uint8Array);

    console.log(`📄 File downloaded: ${document.file_name} (${Math.round(arrayBuffer.byteLength / 1024)} KB)`);

    // Determine media type
    const mediaType = document.file_type === 'application/pdf' 
      ? 'application/pdf' 
      : document.file_type.startsWith('image/') 
        ? document.file_type 
        : 'application/pdf';

    console.log(`🤖 Sending to Claude Vision API (${mediaType})...`);

    // Call Anthropic Vision API with intelligent retry logic
    let extractedText = '';
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Data
                  }
                },
                {
                  type: 'text',
                  text: `Extract ALL text from this document. Preserve:
- All headings, titles, and section names
- All body text and paragraphs
- All table data (convert tables to structured text)
- All form fields and their values
- All dates, numbers, and measurements
- Page numbers and footers

Output ONLY the extracted text. Do not add commentary or explanations. If this is a multi-page document, clearly separate pages with "--- PAGE X ---" markers.`
                }
              ]
            }]
          })
        });

        if (!anthropicResponse.ok) {
          const errorText = await anthropicResponse.text();
          
          // Handle rate limiting with exponential backoff
          if (anthropicResponse.status === 429) {
            const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, 8s
            console.log(`⏳ Rate limited (429). Waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}...`);
            
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, waitTime));
              retryCount++;
              continue;
            }
          }
          
          console.error('Anthropic API error:', errorText);
          throw new Error(`Anthropic API error: ${anthropicResponse.status} - ${errorText}`);
        }

        const anthropicData = await anthropicResponse.json();
        extractedText = anthropicData.content[0].text;
        break; // Success - exit retry loop
        
      } catch (error) {
        if (retryCount >= maxRetries) {
          throw error;
        }
        
        console.log(`⚠️ Attempt ${retryCount + 1} failed, retrying...`);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Extracted ${extractedText.length} characters`);

    // Update document with extracted content
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        extracted_content: extractedText,
        metadata: {
          ...document.metadata,
          extraction_method: 'claude_vision_api',
          extraction_quality: 'high',
          extracted_at: new Date().toISOString(),
          text_length: extractedText.length,
          model: 'claude-sonnet-4-20250514'
        }
      })
      .eq('id', document_id);

    if (updateError) {
      console.error('Failed to update document:', updateError);
      throw updateError;
    }

    console.log('✅ Document updated with extracted content');

    return new Response(
      JSON.stringify({
        success: true,
        document_id,
        extracted_length: extractedText.length,
        method: 'claude_vision_api'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Vision extraction error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
