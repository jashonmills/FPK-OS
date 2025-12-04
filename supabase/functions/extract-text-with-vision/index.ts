import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { extractWithFallback } from "../_shared/model-fallback.ts";
import { chunkDocument, combineChunks, needsChunking } from "../_shared/document-chunker.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PHASE 3: Increased file size limit with chunking support
const MAX_FILE_SIZE_KB = 5120; // 5MB limit with chunking
console.log(`🔧 Phase 3: Background processing with model fallback and chunking enabled`);

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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    console.log('🔑 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasLovableApiKey: !!lovableApiKey
    });

    if (!lovableApiKey) {
      console.error('❌ LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CONFIGURATION_ERROR',
          message: 'LOVABLE_API_KEY not configured. Please contact support.'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client created');

    // Fetch document
    console.log(`📋 Fetching document from database...`);
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      console.error('❌ Document fetch failed:', docError);
      throw new Error(`Document not found: ${docError?.message}`);
    }

    console.log(`📄 Document found:`, {
      id: document.id,
      fileName: document.file_name,
      fileType: document.file_type,
      fileSizeKb: document.file_size_kb
    });

    // Initialize telemetry data
    telemetryData = {
      document_id: document.id,
      family_id: document.family_id,
      file_name: document.file_name,
      file_type: document.file_type,
      file_size_kb: Number(document.file_size_kb) || 0,
      extraction_method: needsChunking(Number(document.file_size_kb) || 0) ? 'chunked_fallback' : 'model_fallback',
      model_used: null, // Will be set by fallback
      success: false,
      retry_count: 0,
      circuit_breaker_triggered: false,
    };

    console.log(`📊 Telemetry initialized:`, telemetryData);

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
    console.log(`📥 Downloading file from storage...`);
    const filePath = document.file_path.split('/family-documents/')[1];
    console.log(`📂 File path: ${filePath}`);
    
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('family-documents')
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('❌ File download failed:', downloadError);
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    console.log(`✅ File downloaded successfully`);
    const fileBytes = new Uint8Array(await fileData.arrayBuffer());
    const mediaType = document.file_type.includes('pdf') ? 'application/pdf' : 'image/jpeg';
    const fileSizeKb = Number(document.file_size_kb) || 0;

    console.log(`📦 File prepared:`, {
      bytesLength: fileBytes.length,
      mediaType,
      fileSizeKb
    });

    // PHASE 3: Check if document needs chunking
    console.log(`🔍 Checking if chunking needed (size: ${fileSizeKb}KB)...`);
    const chunks = chunkDocument(fileBytes, document.file_type, fileSizeKb);
    console.log(`📊 Chunking result: ${chunks.length} chunk(s)`);
    
    if (chunks.length > 1) {
      console.log(`📦 Document split into ${chunks.length} chunks for processing`);
      await updateExtractionProgress(
        supabase,
        document_id,
        'extracting',
        `Processing ${chunks.length} chunks (${(fileSizeKb / 1024).toFixed(1)}MB total)...`
      );
    } else {
      await updateExtractionProgress(
        supabase,
        document_id,
        'extracting',
        `Extracting text with model fallback (${(fileSizeKb / 1024).toFixed(1)}MB)...`
      );
    }

    // PHASE 3: Process chunks with model fallback
    let extractedText = '';
    let totalCost = 0;
    let modelUsed = '';
    const chunkResults: Array<{ text: string; index: number }> = [];

    try {
      console.log(`🔄 Starting chunk processing (${chunks.length} chunk(s))...`);
      
      for (const chunk of chunks) {
        const base64Chunk = btoa(String.fromCharCode(...chunk.data));
        
        console.log(`🔄 Processing chunk ${chunk.index + 1}/${chunk.totalChunks} (size: ${chunk.data.length} bytes)...`);
        
        // Use model fallback for extraction
        console.log(`🤖 Calling extractWithFallback...`);
        const result = await extractWithFallback(
          base64Chunk,
          mediaType,
          chunk.index,
          chunk.totalChunks
        );
        
        console.log(`✅ Chunk ${chunk.index + 1} extracted successfully:`, {
          textLength: result.text.length,
          model: result.model,
          cost: result.cost
        });
        
        chunkResults.push({
          text: result.text,
          index: chunk.index
        });
        
        totalCost += result.cost;
        modelUsed = result.model;
        
        if (chunks.length > 1) {
          await updateExtractionProgress(
            supabase,
            document_id,
            'extracting',
            `Processed chunk ${chunk.index + 1}/${chunk.totalChunks} with ${result.model}`
          );
        }
      }
      
      // Combine chunks if multiple
      extractedText = chunks.length > 1 
        ? combineChunks(chunkResults)
        : chunkResults[0].text;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown extraction error';
      console.error(`❌ All extraction attempts failed: ${errorMsg}`);
      
      telemetryData.error_type = 'extraction_failed';
      telemetryData.error_message = errorMsg;
      telemetryData.extraction_time_ms = Date.now() - startTime;
      
      await supabase.from('extraction_telemetry').insert(telemetryData);
      await supabase.rpc('update_circuit_breaker', {
        p_file_type: document.file_type,
        p_success: false
      });
      
      await updateExtractionProgress(supabase, document_id, 'failed', errorMsg);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'EXTRACTION_FAILED',
          message: errorMsg,
          file_size_kb: fileSizeKb
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!extractedText || extractedText.length < 50) {
      throw new Error(`Extraction failed: extracted text too short (${extractedText.length} chars)`);
    }

    console.log(`✅ Extracted ${extractedText.length} characters using ${modelUsed}`);

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

    // PHASE 3: Record successful telemetry with model info
    telemetryData.success = true;
    telemetryData.model_used = modelUsed;
    telemetryData.extraction_time_ms = Date.now() - startTime;
    telemetryData.api_cost_estimate = totalCost * 100; // cents
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