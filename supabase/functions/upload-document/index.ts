import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// FIX #5: Circuit breaker - max file size
const MAX_FILE_SIZE_KB = 5120; // 5MB
const WARN_FILE_SIZE_KB = 3072; // 3MB - show warning

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const familyId = formData.get('family_id') as string;
    const studentId = formData.get('student_id') as string;
    const category = formData.get('category') as string;
    const documentDate = formData.get('document_date') as string;
    const uploadedBy = formData.get('uploaded_by') as string;

    if (!file || !familyId || !studentId || !category) {
      throw new Error('Missing required fields');
    }

    // FIX #5: Check file size before upload
    const fileSizeKB = Math.round(file.size / 1024);
    
    if (fileSizeKB > MAX_FILE_SIZE_KB) {
      console.error(`❌ File too large: ${fileSizeKB}KB exceeds ${MAX_FILE_SIZE_KB}KB`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: `File size ${fileSizeKB}KB exceeds maximum ${MAX_FILE_SIZE_KB}KB (${(MAX_FILE_SIZE_KB / 1024).toFixed(1)}MB). Please split the document and re-upload.`,
          file_size_kb: fileSizeKB,
          max_size_kb: MAX_FILE_SIZE_KB
        }),
        { 
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const sizeWarning = fileSizeKB > WARN_FILE_SIZE_KB 
      ? `⚠️ Large file detected (${(fileSizeKB / 1024).toFixed(1)}MB). Processing may take longer.`
      : null;

    if (sizeWarning) {
      console.warn(sizeWarning);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Upload file to storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${familyId}/${studentId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('family-documents')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('family-documents')
      .getPublicUrl(filePath);

    // Insert document record with placeholder content
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        uploaded_by: uploadedBy,
        file_name: file.name,
        file_path: publicUrl,
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
        category,
        document_date: documentDate || null,
        extracted_content: `Document uploaded: ${file.name} (${Math.round(file.size / 1024)} KB) - Extraction pending`,
        metadata: {
          extraction_status: 'pending',
          note: 'Awaiting text extraction via Claude Vision'
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('family-documents').remove([filePath]);
      throw dbError;
    }

    console.log('✅ Document record created:', {
      documentId: documentData.id,
      fileName: file.name,
      fileType: file.type,
      fileSizeKB: Math.round(file.size / 1024)
    });

    // ========================================================================
    // PHASE 1: EXTRACTION TRIGGER - COMPREHENSIVE DIAGNOSTIC LOGGING
    // ========================================================================
    console.log('🔍 EXTRACTION PHASE - Starting diagnostic pipeline...');
    
    // Update status to "triggering"
    await supabase
      .from('documents')
      .update({
        metadata: {
          extraction_status: 'triggering',
          extraction_started_at: new Date().toISOString(),
          note: 'Attempting to invoke extract-text-with-vision function'
        }
      })
      .eq('id', documentData.id);

    const maxExtractionRetries = 3; // Increased to 3 for better debugging
    let extractionAttempt = 0;
    let extractionSucceeded = false;
    let extractionError = null;

    while (extractionAttempt < maxExtractionRetries && !extractionSucceeded) {
      extractionAttempt++;
      console.log(`\n📄 ========== EXTRACTION ATTEMPT ${extractionAttempt}/${maxExtractionRetries} ==========`);
      console.log(`📋 Document ID: ${documentData.id}`);
      console.log(`📂 File: ${file.name} (${file.type})`);
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

      try {
        console.log('🚀 Invoking extract-text-with-vision function...');
        console.log('📤 Request body:', JSON.stringify({ document_id: documentData.id }));

        const invokeStartTime = Date.now();
        
        const { data: extractData, error: extractError } = await supabase.functions.invoke(
          'extract-text-with-vision',
          { 
            body: { 
              document_id: documentData.id,
              force_re_extract: extractionAttempt > 1 // Force re-extract on retries
            } 
          }
        );

        const invokeEndTime = Date.now();
        const invokeDuration = invokeEndTime - invokeStartTime;

        console.log(`⏱️  Function invocation took ${invokeDuration}ms`);
        console.log('📥 Response data:', JSON.stringify(extractData, null, 2));
        console.log('📥 Response error:', extractError ? JSON.stringify(extractError, null, 2) : 'null');

        if (extractError) {
          console.error('❌ Edge function returned error object:', extractError);
          throw new Error(`Extract function error: ${JSON.stringify(extractError)}`);
        }

        if (!extractData) {
          console.error('❌ Edge function returned no data');
          throw new Error('Extract function returned no data');
        }

        if (extractData.error || !extractData.success) {
          console.error('❌ Edge function returned error in data:', extractData.error);
          throw new Error(`Extract function error: ${extractData.error || 'Unknown error'}`);
        }

        // Verify we have actual extracted content
        if (!extractData.extracted_length || extractData.extracted_length < 100) {
          console.error('❌ Extracted content too short or missing:', extractData.extracted_length);
          throw new Error(`Extracted content too short: ${extractData.extracted_length} characters`);
        }

        console.log(`✅ Vision extraction completed successfully on attempt ${extractionAttempt}`);
        console.log(`📊 Extracted content length: ${extractData.extracted_length} characters`);
        console.log(`📊 Word count: ${extractData.word_count} words`);
        console.log(`⭐ Quality score: ${extractData.quality_score}`);
        
        extractionSucceeded = true;

        // Update status to "completed"
        await supabase
          .from('documents')
          .update({
            metadata: {
              extraction_status: 'completed',
              extraction_completed_at: new Date().toISOString(),
              extraction_attempts: extractionAttempt,
              extraction_duration_ms: invokeDuration,
              note: 'Text extraction via Claude Vision completed successfully'
            }
          })
          .eq('id', documentData.id);

      } catch (error) {
        extractionError = error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown extraction error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error(`\n❌ ========== EXTRACTION ATTEMPT ${extractionAttempt} FAILED ==========`);
        console.error('💥 Error type:', error?.constructor?.name || typeof error);
        console.error('💥 Error message:', errorMessage);
        console.error('💥 Error stack:', errorStack);
        console.error('💥 Full error object:', JSON.stringify(error, null, 2));

        // Update document with attempt failure
        await supabase
          .from('documents')
          .update({
            metadata: {
              extraction_status: 'retrying',
              extraction_last_error: errorMessage,
              extraction_last_error_stack: errorStack,
              extraction_attempts: extractionAttempt,
              extraction_last_attempt_at: new Date().toISOString(),
              note: `Extraction attempt ${extractionAttempt} failed, will retry`
            }
          })
          .eq('id', documentData.id);

        if (extractionAttempt >= maxExtractionRetries) {
          console.error(`\n❌ ========== EXTRACTION FAILED AFTER ${maxExtractionRetries} ATTEMPTS ==========`);
          console.error('💀 Final error:', errorMessage);

          // Update document with FINAL FAILED status
          await supabase
            .from('documents')
            .update({
              metadata: {
                extraction_status: 'failed',
                extraction_final_error: errorMessage,
                extraction_final_error_stack: errorStack,
                extraction_attempts: extractionAttempt,
                extraction_failed_at: new Date().toISOString(),
                note: 'Text extraction failed after all retry attempts'
              }
            })
            .eq('id', documentData.id);

          return new Response(
            JSON.stringify({
              success: false,
              error: 'EXTRACTION_FAILED',
              message: `Text extraction failed after ${maxExtractionRetries} attempts: ${errorMessage}`,
              document: documentData,
              debug: {
                attempts: extractionAttempt,
                lastError: errorMessage,
                documentId: documentData.id
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Wait before retry with exponential backoff
        const retryDelay = 3000 * extractionAttempt; // 3s, 6s, 9s
        console.log(`⏳ Waiting ${retryDelay}ms before retry ${extractionAttempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // ========================================================================
    // PHASE 2: ANALYSIS TRIGGER (Only if extraction succeeded)
    // ========================================================================
    if (extractionSucceeded) {
      console.log('\n🧠 ========== ANALYSIS PHASE - Starting ==========');
      console.log('✅ Extraction completed, triggering Claude Sonnet 4.5 analysis...');

      // Add a 3-second buffer to ensure database is fully committed
      console.log('⏳ Waiting 3 seconds to ensure database commit...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Double-check that content is actually in the database
      const { data: verifyDoc } = await supabase
        .from('documents')
        .select('extracted_content')
        .eq('id', documentData.id)
        .single();

      if (!verifyDoc?.extracted_content || verifyDoc.extracted_content.length < 100) {
        console.error('⚠️ CRITICAL: Extracted content not in database after extraction success');
        console.error(`📊 Content length in DB: ${verifyDoc?.extracted_content?.length || 0}`);
        console.log('⏭️ Skipping analysis - will need to be triggered manually');
      } else {
        console.log(`✅ Verified content in database: ${verifyDoc.extracted_content.length} characters`);
        
        try {
          console.log('🚀 Invoking analyze-document function...');
          const analysisStartTime = Date.now();

          const { data: analysisData, error: analyzeError } = await supabase.functions.invoke(
            'analyze-document',
            { body: { document_id: documentData.id } }
          );

          const analysisEndTime = Date.now();
          const analysisDuration = analysisEndTime - analysisStartTime;

          console.log(`⏱️  Analysis invocation took ${analysisDuration}ms`);
          console.log('📥 Analysis response data:', JSON.stringify(analysisData, null, 2));
          console.log('📥 Analysis response error:', analyzeError ? JSON.stringify(analyzeError, null, 2) : 'null');

          if (analyzeError) {
            console.error('⚠️  Analysis invocation error (non-blocking):', analyzeError);
            // Don't fail the upload - analysis can be retried later
          } else {
            console.log('✅ Analysis triggered successfully');
          }
        } catch (analysisError) {
          const errorMessage = analysisError instanceof Error ? analysisError.message : 'Unknown analysis error';
          console.error('⚠️  Analysis trigger failed (non-blocking):', errorMessage);
          console.error('💥 Analysis error details:', JSON.stringify(analysisError, null, 2));
          // Don't fail the upload - analysis can be retried later
        }
      }
    } else {
      console.log('⏭️  Skipping analysis - extraction did not succeed');
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: documentData,
        extraction_status: extractionSucceeded ? 'completed' : 'failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload document error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
