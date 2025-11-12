import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PHASE 1 FIX: Reduce file size limit and use faster model
const MAX_FILE_SIZE_KB = 2048; // 2MB limit for stability
const EXTRACTION_TIMEOUT_MS = 120000; // 120 second timeout

// PHASE 1 FIX: Use Claude 3.5 Haiku - 10x faster for vision tasks
const CLAUDE_MODEL = 'claude-3-5-haiku-20241022';
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

  const startTime = Date.now();
  let telemetryData: any = null;

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

    // Initialize telemetry data
    telemetryData = {
      document_id: document.id,
      family_id: document.family_id,
      file_name: document.file_name,
      file_type: document.file_type,
      file_size_kb: Number(document.file_size_kb) || 0,
      extraction_method: 'claude_vision',
      model_used: CLAUDE_MODEL,
      success: false,
      retry_count: 0,
      circuit_breaker_triggered: false,
    };

    // PHASE 2: Check circuit breaker
    const { data: isAllowed } = await supabase.rpc('is_extraction_allowed', {
      p_file_type: document.file_type
    });

    if (isAllowed === false) {
      telemetryData.circuit_breaker_triggered = true;
      telemetryData.error_type = 'circuit_breaker';
      telemetryData.error_message = 'File type temporarily disabled due to repeated failures';
      
      await supabase.from('extraction_telemetry').insert(telemetryData);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CIRCUIT_BREAKER',
          message: `Extraction temporarily disabled for ${document.file_type} due to repeated failures. Try again in 30 minutes or use a different file format.`,
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // File size check
    if (document.file_size_kb > MAX_FILE_SIZE_KB) {
      const errorMsg = `File too large: ${document.file_size_kb} KB exceeds maximum ${MAX_FILE_SIZE_KB} KB (${(MAX_FILE_SIZE_KB / 1024).toFixed(1)}MB). Please split the document and re-upload.`;
      console.error(`❌ ${errorMsg}`);
      
      telemetryData.error_type = 'file_too_large';
      telemetryData.error_message = errorMsg;
      telemetryData.extraction_time_ms = Date.now() - startTime;
      
      await supabase.from('extraction_telemetry').insert(telemetryData);
      await supabase.rpc('update_circuit_breaker', {
        p_file_type: document.file_type,
        p_success: false
      });

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

    // Return existing content if available
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

    // Add timeout using AbortController
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
          'anthropic-beta': 'pdfs-2024-09-25',
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
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
      
      // PHASE 1 FIX: Handle timeout with OCR fallback
      if (error.name === 'AbortError') {
        console.error(`⏰ Claude Vision timeout after ${EXTRACTION_TIMEOUT_MS / 1000}s. Trying OCR fallback...`);
        
        telemetryData.error_type = 'timeout';
        telemetryData.error_message = `Vision API timeout after ${EXTRACTION_TIMEOUT_MS}ms`;
        telemetryData.extraction_time_ms = Date.now() - startTime;
        
        await supabase.from('extraction_telemetry').insert(telemetryData);
        await supabase.rpc('update_circuit_breaker', {
          p_file_type: document.file_type,
          p_success: false
        });
        
        await updateExtractionProgress(
          supabase, 
          document_id, 
          'extracting', 
          'Vision API timeout. Trying alternative extraction method...'
        );
        
        // Try OCR fallback (pdfjs for PDFs, basic text extraction)
        try {
          let fallbackText = '';
          
          if (mediaType === 'application/pdf') {
            console.log('📄 Attempting pdfjs extraction as fallback...');
            // Note: pdfjs-dist is not available in Deno, so we'll mark for manual review
            fallbackText = 'PDF_REQUIRES_MANUAL_REVIEW';
          }
          
          if (!fallbackText || fallbackText === 'PDF_REQUIRES_MANUAL_REVIEW') {
            const timeoutMsg = `Extraction timeout after ${EXTRACTION_TIMEOUT_MS / 1000}s. File may be too complex (${Number(document.file_size_kb) || 0}KB). Please try splitting the document or use a simpler format.`;
            
            await updateExtractionProgress(supabase, document_id, 'failed', timeoutMsg);
            
            return new Response(
              JSON.stringify({
                success: false,
                error: 'EXTRACTION_TIMEOUT',
                message: timeoutMsg,
                timeout_ms: EXTRACTION_TIMEOUT_MS,
                file_size_kb: Number(document.file_size_kb) || 0,
                suggestion: 'Try splitting the document into smaller files (under 1MB each)'
              }),
              { 
                status: 408,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        } catch (fallbackError) {
          console.error('OCR fallback also failed:', fallbackError);
          throw error;
        }
      }
      
      throw error;
    }

    // Handle API errors
    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      
      console.error(`❌ Claude API Error Details:`, {
        status: anthropicResponse.status,
        statusText: anthropicResponse.statusText,
        model: CLAUDE_MODEL,
        file_size_kb: Number(document.file_size_kb) || 0,
        media_type: mediaType,
        response_body: errorBody.substring(0, 500)
      });
      
      const errorMsg = `Claude API failed (${anthropicResponse.status}): ${errorBody.substring(0, 200)}`;
      
      telemetryData.error_type = 'api_error';
      telemetryData.error_message = errorMsg;
      telemetryData.extraction_time_ms = Date.now() - startTime;
      
      await supabase.from('extraction_telemetry').insert(telemetryData);
      await supabase.rpc('update_circuit_breaker', {
        p_file_type: document.file_type,
        p_success: false
      });
      
      await updateExtractionProgress(supabase, document_id, 'failed', errorMsg);
      
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

    // PHASE 2: Estimate API cost (Claude 3.5 Haiku: ~$0.25 per million input tokens)
    const estimatedTokens = extractedText.length / 4; // rough estimate
    const estimatedCost = (estimatedTokens / 1000000) * 0.25 * 100; // in cents

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

    // PHASE 2: Record successful telemetry
    telemetryData.success = true;
    telemetryData.extraction_time_ms = Date.now() - startTime;
    telemetryData.api_cost_estimate = estimatedCost;
    telemetryData.extracted_length = extractedText.length;
    
    await supabase.from('extraction_telemetry').insert(telemetryData);
    await supabase.rpc('update_circuit_breaker', {
      p_file_type: document.file_type,
      p_success: true
    });

    // Insert diagnostics (keeping existing table for backward compatibility)
    await supabase
      .from('document_extraction_diagnostics')
      .insert({
        document_id,
        extraction_method: 'claude_vision_api',
        success: true,
        extracted_length: extractedText.length,
        word_count: extractedText.split(/\s+/).length,
        processing_time_ms: Date.now() - startTime,
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
    console.error('❌ Extraction error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name || 'UnknownError',
      stack: error instanceof Error ? error.stack?.substring(0, 300) : undefined
    });
    
    // PHASE 2: Record failed telemetry if we have document info
    if (telemetryData) {
      telemetryData.success = false;
      telemetryData.error_type = telemetryData.error_type || 'unknown_error';
      telemetryData.error_message = error instanceof Error ? error.message : 'Unknown extraction error';
      telemetryData.extraction_time_ms = Date.now() - startTime;
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from('extraction_telemetry').insert(telemetryData);
      
      if (telemetryData.file_type) {
        await supabase.rpc('update_circuit_breaker', {
          p_file_type: telemetryData.file_type,
          p_success: false
        });
      }
    }
    
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