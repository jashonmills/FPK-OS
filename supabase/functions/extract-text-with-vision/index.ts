import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// FIX #5: Hard limit for file size (5MB = 5,120 KB)
const MAX_FILE_SIZE_KB = 5120;
const EXTRACTION_TIMEOUT_MS = 45000; // FIX #2: 45 second timeout

// FIX #5: Valid Claude model (CORRECTED to actual working model - Sonnet 4.5)
const CLAUDE_MODEL = 'claude-sonnet-4-5';
console.log(`🔧 Using Claude model: ${CLAUDE_MODEL}`);

// Helper to update extraction progress
async function updateExtractionProgress(
  supabase: any,
  documentId: string,
  status: string,
  message: string
) {
  await supabase
    .from('document_analysis_status')
    .update({
      status,
      status_message: message,
      updated_at: new Date().toISOString()
    })
    .eq('document_id', documentId);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document_id, force_re_extract = false } = await req.json();
    console.log(`📄 Starting extraction for document: ${document_id}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    // FIX #5: Circuit breaker - reject files that are too large
    if (document.file_size_kb > MAX_FILE_SIZE_KB) {
      const errorMsg = `File too large: ${document.file_size_kb} KB exceeds maximum ${MAX_FILE_SIZE_KB} KB (${(MAX_FILE_SIZE_KB / 1024).toFixed(1)}MB). Please split the document and re-upload.`;
      console.error(`❌ ${errorMsg}`);
      
      // Update document metadata
      await supabase
        .from('documents')
        .update({
          metadata: {
            is_processable: false,
            rejection_reason: 'file_too_large',
            max_size_kb: MAX_FILE_SIZE_KB,
            note: 'File size exceeds maximum allowed for processing'
          }
        })
        .eq('id', document_id);

      await updateExtractionProgress(
        supabase,
        document_id,
        'failed',
        errorMsg
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: errorMsg,
          file_size_kb: Number(document.file_size_kb) || 0,
          max_size_kb: MAX_FILE_SIZE_KB,
          document_id: String(document_id)
        }),
        { 
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return existing content if available and not forcing re-extract
    if (!force_re_extract && document.extracted_content && document.extracted_content.length > 100) {
      console.log('✅ Using existing extracted content');
      return new Response(
        JSON.stringify({
          success: true,
          extracted_content: document.extracted_content,
          extracted_length: document.extracted_content.length,
          cached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await updateExtractionProgress(supabase, document_id, 'extracting', 'Downloading document...');

    // Download file from storage
    const filePath = document.file_path.split('/family-documents/')[1];
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('family-documents')
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    const fileBytes = new Uint8Array(await fileData.arrayBuffer());
    const base64File = btoa(String.fromCharCode(...fileBytes));

    const mediaType = document.file_type.includes('pdf') ? 'application/pdf' : 'image/jpeg';

    await updateExtractionProgress(
      supabase,
      document_id,
      'extracting',
      `Calling Claude Vision API (${(Number(document.file_size_kb) / 1024).toFixed(1)}MB)...`
    );

    // FIX #2: Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EXTRACTION_TIMEOUT_MS);

    console.log(`🤖 Calling Claude Vision API with ${EXTRACTION_TIMEOUT_MS}ms timeout...`);
    
    let anthropicResponse;
    try {
      anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'pdfs-2024-09-25', // FIX #2: Enable PDF support
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL, // FIX #1: Use validated model
          max_tokens: 16000,
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
              text: 'Extract all text from this document. Preserve structure, headings, tables, and lists. Return ONLY the extracted text content, nothing else.'
            }]
          }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      
      // FIX #2: Handle timeout specifically
      if (error.name === 'AbortError') {
        const timeoutMsg = `Extraction timeout after ${EXTRACTION_TIMEOUT_MS / 1000}s. File may be too complex or large (${Number(document.file_size_kb) || 0}KB).`;
        console.error(`⏰ ${timeoutMsg}`);
        
        await updateExtractionProgress(supabase, document_id, 'failed', timeoutMsg);
        
        return new Response(
          JSON.stringify({
            success: false,
            error: 'EXTRACTION_TIMEOUT',
            message: timeoutMsg,
            timeout_ms: EXTRACTION_TIMEOUT_MS,
            file_size_kb: Number(document.file_size_kb) || 0
          }),
          { 
            status: 408,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      throw error;
    }

    // FIX #3 & #4: Detailed error handling with better context
    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      
      // FIX #4: Log full request context (without sensitive data)
      console.error(`❌ Claude API Error Details:`, {
        status: anthropicResponse.status,
        statusText: anthropicResponse.statusText,
        model: CLAUDE_MODEL,
        file_size_kb: Number(document.file_size_kb) || 0,
        media_type: mediaType,
        response_body: errorBody.substring(0, 500) // First 500 chars
      });
      
      const errorMsg = `Claude API failed (${anthropicResponse.status}): ${errorBody.substring(0, 200)}`;
      
      await updateExtractionProgress(supabase, document_id, 'failed', errorMsg);
      
      // FIX #3: Simplified error response (prevent stack overflow)
      const errorResponse = {
        success: false,
        error: 'CLAUDE_API_ERROR',
        message: errorMsg,
        status: anthropicResponse.status,
        model: CLAUDE_MODEL,
        file_size_kb: Number(document.file_size_kb) || 0
      };
      
      return new Response(
        JSON.stringify(errorResponse),
        { 
          status: anthropicResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await anthropicResponse.json();
    const extractedText = result.content?.[0]?.text || '';

    if (!extractedText || extractedText.length < 50) {
      throw new Error(`Extraction failed: extracted text too short (${extractedText.length} chars)`);
    }

    console.log(`✅ Extracted ${extractedText.length} characters`);

    // Update document with extracted content
    await supabase
      .from('documents')
      .update({
        extracted_content: extractedText,
        metadata: {
          ...document.metadata,
          extraction_completed: true,
          is_processable: true,
          extraction_length: extractedText.length,
          extraction_timestamp: new Date().toISOString()
        }
      })
      .eq('id', document_id);

    await updateExtractionProgress(
      supabase,
      document_id,
      'complete',
      `Extracted ${extractedText.length} characters successfully`
    );

    // Insert diagnostics
    await supabase
      .from('document_extraction_diagnostics')
      .insert({
        document_id,
        extraction_method: 'claude_vision_api',
        success: true,
        extracted_length: extractedText.length,
        word_count: extractedText.split(/\s+/).length,
        processing_time_ms: 0,
        quality_score: extractedText.length > 1000 ? 0.9 : 0.7
      });

    return new Response(
      JSON.stringify({
        success: true,
        extracted_content: extractedText,
        extracted_length: extractedText.length,
        word_count: extractedText.split(/\s+/).length,
        quality_score: extractedText.length > 1000 ? 0.9 : 0.7
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // FIX #4: Enhanced error logging
    console.error('❌ Extraction error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name || 'UnknownError',
      stack: error instanceof Error ? error.stack?.substring(0, 300) : undefined
    });
    
    // FIX #3: Simplified error response (prevent circular reference issues)
    const errorMessage = error instanceof Error ? error.message : 'Unknown extraction error';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage.substring(0, 500),
        error_type: error?.constructor?.name || 'UnknownError'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
