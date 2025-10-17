import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('✅ Document record created, initiating vision extraction...');

    // ========================================================================
    // UNIFIED EXTRACTION PATHWAY: Claude Vision (No Fallbacks)
    // ========================================================================
    const maxExtractionRetries = 2;
    let extractionAttempt = 0;
    let extractionSucceeded = false;
    let extractionError = null;

    while (extractionAttempt < maxExtractionRetries && !extractionSucceeded) {
      extractionAttempt++;
      console.log(`📄 Text extraction attempt ${extractionAttempt}/${maxExtractionRetries}...`);

      try {
        const { data: extractData, error: extractError } = await supabase.functions.invoke(
          'extract-text-with-vision',
          { body: { document_id: documentData.id } }
        );

        if (extractError) {
          throw extractError;
        }

        console.log(`✅ Vision extraction completed on attempt ${extractionAttempt}`);
        extractionSucceeded = true;
      } catch (error) {
        extractionError = error;
        console.error(`Extraction attempt ${extractionAttempt} failed:`, error);

        if (extractionAttempt >= maxExtractionRetries) {
          console.error('❌ Text extraction failed after max retries');

          // Update document with FAILED status
          await supabase
            .from('documents')
            .update({
              metadata: {
                extraction_status: 'failed',
                extraction_error: error instanceof Error ? error.message : 'Unknown extraction error',
                extraction_attempts: extractionAttempt
              }
            })
            .eq('id', documentData.id);

          return new Response(
            JSON.stringify({
              success: false,
              error: 'Critical Error: Text extraction failed',
              message: 'Unable to extract text from document. Please try uploading again or contact support.',
              document: documentData
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 2000 * extractionAttempt));
      }
    }

    // If extraction succeeded, proceed to analysis
    if (extractionSucceeded) {
      console.log('🧠 Extraction successful, triggering AI analysis...');

      try {
        const { error: analyzeError } = await supabase.functions.invoke(
          'analyze-document',
          { body: { document_id: documentData.id } }
        );

        if (analyzeError) {
          console.error('Analysis invocation error:', analyzeError);
          // Don't fail the upload - analysis can be retried later
        }
      } catch (analysisError) {
        console.error('Analysis trigger failed:', analysisError);
        // Don't fail the upload - analysis can be retried later
      }
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
