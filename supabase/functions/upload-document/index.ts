import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_FILE_SIZE_KB = 5120; // 5MB
const WARN_FILE_SIZE_KB = 3072; // 3MB

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📤 ========== UPLOAD DOCUMENT - NEW QUEUE SYSTEM ==========');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const familyId = formData.get('family_id') as string;
    const studentId = formData.get('student_id') as string;
    const category = formData.get('category') as string;
    const documentDate = formData.get('document_date') as string;
    const uploadedBy = formData.get('uploaded_by') as string;

    // Validation
    if (!file || !familyId || !studentId || !category) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Missing required fields: file, family_id, student_id, or category'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check file size
    const fileSizeKB = Math.round(file.size / 1024);
    console.log(`📊 File size: ${fileSizeKB}KB (${(fileSizeKB / 1024).toFixed(2)}MB)`);
    
    if (fileSizeKB > MAX_FILE_SIZE_KB) {
      console.error(`❌ File too large: ${fileSizeKB}KB exceeds ${MAX_FILE_SIZE_KB}KB`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: `File size ${(fileSizeKB / 1024).toFixed(1)}MB exceeds maximum ${(MAX_FILE_SIZE_KB / 1024).toFixed(1)}MB. Please split the document or reduce file size.`,
          file_size_kb: fileSizeKB,
          max_size_kb: MAX_FILE_SIZE_KB
        }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (fileSizeKB > WARN_FILE_SIZE_KB) {
      console.warn(`⚠️ Large file detected: ${(fileSizeKB / 1024).toFixed(1)}MB. Processing may take longer.`);
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📁 Phase 1: Uploading file to storage...');

    // Upload to storage
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
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
      console.error('❌ Storage upload failed:', uploadError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'STORAGE_ERROR',
          message: `Failed to upload file: ${uploadError.message}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ File uploaded to storage');

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('family-documents')
      .getPublicUrl(filePath);

    console.log('📝 Phase 2: Creating document record...');

    // Create document record
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        uploaded_by: uploadedBy,
        file_name: file.name,
        file_path: publicUrl,
        file_type: file.type,
        file_size_kb: fileSizeKB,
        category,
        document_date: documentDate || null,
        extracted_content: null, // Will be filled by extraction
        metadata: {
          upload_timestamp: new Date().toISOString(),
          original_filename: file.name
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database insert failed:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('family-documents').remove([filePath]);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'DATABASE_ERROR',
          message: `Failed to create document record: ${dbError.message}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Document record created: ${documentData.id}`);
    console.log('🔄 Phase 3: Creating unified analysis job...');

    // Create the master analysis job for Project Scribe tracking
    const { data: analysisJob, error: jobError } = await supabase
      .from('analysis_jobs')
      .insert({
        family_id: familyId,
        status: 'processing',
        total_documents: 1,
        processed_documents: 0,
        failed_documents: 0,
        job_type: 'initial',
        started_at: new Date().toISOString(),
        metadata: {
          document_count: 1,
          processing_mode: 'single_upload',
          document_id: documentData.id
        }
      })
      .select()
      .single();

    if (jobError) {
      console.error('❌ Failed to create analysis job:', jobError);
      await supabase.storage.from('family-documents').remove([filePath]);
      await supabase.from('documents').delete().eq('id', documentData.id);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'JOB_CREATION_ERROR',
          message: `Failed to create analysis job: ${jobError.message}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Analysis job created: ${analysisJob.id}`);

    // Add document to the UNIFIED analysis queue
    const { error: queueError } = await supabase
      .from('analysis_queue')
      .insert({
        document_id: documentData.id,
        job_id: analysisJob.id,
        family_id: familyId,
        status: 'pending',
        priority: 1,
        estimated_tokens: fileSizeKB * 10
      });

    if (queueError) {
      console.error('❌ Failed to queue document:', queueError);
      await supabase.from('analysis_jobs').delete().eq('id', analysisJob.id);
      await supabase.storage.from('family-documents').remove([filePath]);
      await supabase.from('documents').delete().eq('id', documentData.id);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'QUEUE_ERROR',
          message: `Failed to queue document: ${queueError.message}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Document queued in analysis_queue');

    // Immediately trigger the unified processor
    console.log('🚀 Invoking process-analysis-queue...');
    const { error: invokeError } = await supabase.functions.invoke(
      'process-analysis-queue',
      {
        body: { 
          family_id: familyId,
          job_id: analysisJob.id
        }
      }
    );

    if (invokeError) {
      console.warn('⚠️ Processor invocation failed (will retry):', invokeError);
    }

    console.log('🎉 Upload complete! Processing started.');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document uploaded and processing started',
        job_id: analysisJob.id,
        document: {
          id: documentData.id,
          file_name: file.name,
          file_path: publicUrl,
          category: category,
          file_size_kb: fileSizeKB,
          status: 'processing'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Upload error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'UPLOAD_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
