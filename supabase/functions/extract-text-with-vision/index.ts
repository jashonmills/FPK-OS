import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper: Update extraction progress with realtime support
async function updateExtractionProgress(
  supabase: any,
  documentId: string,
  progress: number,
  message: string
) {
  await supabase
    .from('document_analysis_status')
    .update({
      status: 'extracting',
      progress_percent: progress,
      current_phase: 'extraction',
      status_message: message
    })
    .eq('document_id', documentId);
}

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

    // Update progress: starting extraction
    await updateExtractionProgress(supabase, document_id, 5, 'Downloading document...');

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
    const fileSizeKB = Math.round(arrayBuffer.byteLength / 1024);

    console.log(`📄 File downloaded: ${document.file_name} (${fileSizeKB} KB)`);
    
    // Update progress: preparing for extraction
    await updateExtractionProgress(supabase, document_id, 15, `Processing ${fileSizeKB}KB document...`);

    // Determine media type
    const mediaType = document.file_type === 'application/pdf' 
      ? 'application/pdf' 
      : document.file_type.startsWith('image/') 
        ? document.file_type 
        : 'application/pdf';

    console.log(`🤖 Sending to Claude Vision API (${mediaType})...`);
    
    // Update progress: extracting with AI
    await updateExtractionProgress(supabase, document_id, 25, 'Extracting text with AI vision...');

    // Call Anthropic Vision API with intelligent retry logic
    let extractedText = '';
    let retryCount = 0;
    const maxRetries = 3;
    const extractionStartTime = Date.now();
    let qualityMetrics: any = null;
    
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
                  text: `Extract ALL text from this document with highest accuracy. Return JSON format:

{
  "extracted_text": "... full document text ...",
  "quality_assessment": {
    "text_clarity": 1-10,
    "extraction_confidence": 1-10,
    "warnings": ["list any concerns like poor scan quality, handwriting, etc."]
  }
}

EXTRACTION REQUIREMENTS:
- Preserve document structure (headers, sections, paragraphs)
- Include ALL table data (format as markdown tables)
- Include form fields and checkboxes with their values
- Include dates, numbers, and measurements
- Note any handwritten content separately
- Use "--- PAGE X ---" markers for multi-page documents

If you cannot return valid JSON, return only the extracted text.`
                }
              ]
            }]
          })
        });

        if (!anthropicResponse.ok) {
          const errorText = await anthropicResponse.text();
          
          // Handle PDF page limit (Anthropic only supports up to 100 pages)
          if (errorText.includes('maximum of 100 PDF pages')) {
            console.error('❌ PDF exceeds 100-page limit');
            
            // Update document status to indicate oversized PDF
            await supabase
              .from('document_analysis_status')
              .update({
                status: 'failed',
                error_message: 'OVERSIZED_PDF: Document exceeds 100-page limit. Please split into smaller files.',
                completed_at: new Date().toISOString()
              })
              .eq('document_id', document_id);
            
            // Return specific error code that queue processor can detect
            return new Response(
              JSON.stringify({ 
                error: 'OVERSIZED_PDF',
                error_code: 'OVERSIZED_PDF',
                message: 'Document exceeds 100-page limit. Please split into smaller files.',
                success: false 
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Handle rate limiting with aggressive backoff for Anthropic's 10k tokens/minute limit
          if (anthropicResponse.status === 429) {
            // Use much longer delays: 15s, 30s, 45s to allow rate limit window to reset
            const waitTime = 15000 * (retryCount + 1);
            console.log(`⏳ Rate limited (429). Waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}...`);
            console.log(`ℹ️ Anthropic rate limit is 10,000 tokens/minute. Large documents require longer waits.`);
            
            await updateExtractionProgress(
              supabase, 
              document_id, 
              25 + (retryCount * 10), 
              `Rate limited. Waiting ${waitTime/1000}s before retry...`
            );
            
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
        const rawText = anthropicData.content[0].text;
        
        // Try to parse JSON response for quality metrics
        try {
          const parsed = JSON.parse(rawText);
          extractedText = parsed.extracted_text || rawText;
          qualityMetrics = parsed.quality_assessment;
        } catch (e) {
          // If not JSON, use raw text
          extractedText = rawText;
        }
        
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

    const processingTime = Date.now() - extractionStartTime;
    console.log(`✅ Extracted ${extractedText.length} characters in ${processingTime}ms`);
    
    // Update progress: storing results
    await updateExtractionProgress(supabase, document_id, 85, 'Saving extracted content...');

    // Store quality diagnostics
    const wordCount = extractedText.split(/\s+/).length;
    const qualityScore = qualityMetrics?.text_clarity >= 7 ? 'good' : 
                        qualityMetrics?.text_clarity >= 5 ? 'medium' : 'poor';
    
    await supabase.from('document_extraction_diagnostics').insert({
      document_id: document_id,
      family_id: document.family_id,
      extraction_method: 'claude_vision',
      chunk_index: 0,
      total_chunks: 1,
      processing_time_ms: processingTime,
      quality_metrics: qualityMetrics || {},
      warnings: qualityMetrics?.warnings || [],
      text_length: extractedText.length,
      word_count: wordCount,
      validation_passed: true,
      quality_score: qualityScore,
      ai_model_used: 'claude-sonnet-4-20250514'
    });

    // Update document with extracted content
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        extracted_content: extractedText,
        metadata: {
          ...document.metadata,
          extraction_method: 'claude_vision_api',
          extraction_quality: qualityScore,
          extracted_at: new Date().toISOString(),
          text_length: extractedText.length,
          word_count: wordCount,
          model: 'claude-sonnet-4-20250514',
          quality_metrics: qualityMetrics
        }
      })
      .eq('id', document_id);

    if (updateError) {
      console.error('Failed to update document:', updateError);
      throw updateError;
    }

    // Final progress update
    await updateExtractionProgress(supabase, document_id, 100, 'Extraction complete!');

    console.log('✅ Document updated with extracted content');

    return new Response(
      JSON.stringify({
        success: true,
        document_id,
        extracted_length: extractedText.length,
        word_count: wordCount,
        quality_score: qualityScore,
        processing_time_ms: processingTime,
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