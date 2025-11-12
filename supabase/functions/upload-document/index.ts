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
    console.log('🔄 Phase 3: Queueing for extraction...');

    // Add to processing queue
    const { error: queueError } = await supabase
      .from('document_processing_queue')
      .insert({
        document_id: documentData.id,
        family_id: familyId,
        job_type: 'EXTRACT',
        status: 'queued',
        priority: 0,
        retry_count: 0,
        max_retries: 5
      });

    if (queueError) {
      console.error('❌ Failed to queue document:', queueError);
      // Document is uploaded but not queued - can be manually retried
      return new Response(
        JSON.stringify({
          success: true, // File uploaded successfully
          warning: 'QUEUE_ERROR',
          message: 'Document uploaded but failed to queue for processing. Please contact support.',
          document: {
            id: documentData.id,
            file_name: file.name,
            file_size_kb: fileSizeKB,
            status: 'uploaded_not_queued'
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Document queued for extraction');
    console.log('🎉 Upload complete! Document will be processed by the queue.');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document uploaded and queued for processing',
        document: {
          id: documentData.id,
          file_name: file.name,
          file_path: publicUrl,
          category: category,
          file_size_kb: fileSizeKB,
          status: 'queued',
          queue_position: 'Processing will begin shortly'
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
