// bedrock-upload-v2 - Enhanced logging for monitoring and performance tracking
// VERSION: 2.4.0 - ENHANCED LOGGING + IMAGELESS MODE (30 pages max)
// Deployed: 2025-01-14 01:00:00 UTC
// New: Detailed timing metrics, page count tracking, processing performance data
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";

const VERSION = "2.4.0-ENHANCED-LOGGING";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const startTime = Date.now();
  const timings = {
    upload: 0,
    auth: 0,
    ocr: 0,
    database: 0,
  };
  
  console.log(`🚀 BEDROCK-UPLOAD-V2 VERSION: ${VERSION} - Starting request`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Authenticate
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Parse request
    const { family_id, student_id, file_name, file_data_base64 } = await req.json();
    
    if (!family_id || !file_name || !file_data_base64) {
      throw new Error('Missing required fields');
    }

    // 3. Upload file to storage
    const timestamp = Date.now();
    const filePath = `${family_id}/${timestamp}_${file_name}`;
    const fileBuffer = Uint8Array.from(atob(file_data_base64), c => c.charCodeAt(0));
    
    console.log('📋 Document metadata:', {
      fileName: file_name,
      fileSizeKB: Math.round(fileBuffer.length / 1024),
      familyId: family_id,
      studentId: student_id || 'none'
    });
    
    const uploadStart = Date.now();
    const { error: uploadError } = await supabase.storage
      .from('bedrock-storage')
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      throw new Error('File upload failed');
    }

    timings.upload = Date.now() - uploadStart;
    console.log(`✅ File uploaded to: ${filePath} (${timings.upload}ms)`);

    // 4. Extract text using Google Document AI
    console.log(`🔍 VERSION ${VERSION}: Calling Google Document AI with IMAGELESS MODE (imagelessMode: true)...`);

    const credsJson = Deno.env.get('GOOGLE_DOC_AI_CREDS');
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID');

    if (!credsJson || !processorId) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Google Document AI credentials not configured');
    }

    // Validate credentials format BEFORE parsing
    if (!credsJson.trim().startsWith('{')) {
      console.error('❌ GOOGLE_DOCUMENT_AI_CREDENTIALS is not JSON format');
      console.error('Received value starts with:', credsJson.substring(0, 20));
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Invalid credentials format: Expected Google Service Account JSON, got raw string. Please update the GOOGLE_DOCUMENT_AI_CREDENTIALS secret with the full service account JSON file contents.');
    }

    let credentials;
    try {
      credentials = JSON.parse(credsJson);
      
      // Validate required fields
      if (!credentials.private_key || !credentials.client_email || !credentials.project_id) {
        throw new Error('Service account JSON missing required fields (private_key, client_email, project_id)');
      }
    } catch (e) {
      console.error('❌ Failed to parse Google credentials:', e.message);
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error(`Invalid Google credentials: ${e.message}`);
    }

    console.log('🔐 Authenticating with Google Document AI...');
    console.log('📧 Using service account:', credentials.client_email);
    const authStart = Date.now();
    const accessToken = await getAccessToken(credentials);
    timings.auth = Date.now() - authStart;
    console.log(`✅ Authentication successful (${timings.auth}ms)`);

    // Call Document AI processDocument endpoint
    const apiUrl = `https://documentai.googleapis.com/v1/${processorId}:process`;
    console.log('📄 Processing document with Google Document AI...');
    
    const ocrStart = Date.now();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rawDocument: {
          content: file_data_base64,
          mimeType: 'application/pdf'
        },
        imagelessMode: true,  // Enables imageless mode for up to 30 pages
        processOptions: {
          ocrConfig: {
            enableNativePdfParsing: true
          }
        }
      })
    });

    if (!response.ok) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      const errorText = await response.text();
      console.error('Google Document AI failed:', response.status, errorText);
      
      // Check for page limit error
      if (errorText.includes('Document pages exceed the limit') || errorText.includes('pages in non-imageless mode exceed the limit')) {
        throw new Error('PAGE_LIMIT_EXCEEDED: This document exceeds the 30-page limit for automatic processing. Please split your document into smaller sections (under 30 pages each) and upload them separately. This ensures faster processing and better accuracy.');
      }
      
      throw new Error(`Document processing failed: ${response.statusText}`);
    }

    const result = await response.json();
    const extractedContent = result.document?.text || '';
    const pageCount = result.document?.pages?.length || 0;
    
    timings.ocr = Date.now() - ocrStart;
    
    console.log(`📊 Document has ${pageCount} pages (limit: 30)`);
    if (pageCount > 25) {
      console.warn(`⚠️ High page count: ${pageCount}/30 pages`);
    }
    
    if (extractedContent.length < 50) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Extracted text is too short. File may be corrupted or empty.');
    }

    console.log(`✅ Extracted ${extractedContent.length} characters of text (${timings.ocr}ms, ${Math.round(extractedContent.length / (timings.ocr / 1000))} chars/sec)`);

    // 6. Create database record WITH extracted content
    const dbStart = Date.now();
    const { data: document, error: dbError } = await supabase
      .from('bedrock_documents')
      .insert({
        family_id,
        student_id,
        file_name,
        file_path: filePath,
        file_size_kb: Math.round(fileBuffer.length / 1024),
        extracted_content: extractedContent,
        status: 'uploaded'  // Ready for user to classify
      })
      .select()
      .single();

    if (dbError) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      console.error('Database insert failed:', dbError);
      throw new Error('Failed to create document record');
    }

    timings.database = Date.now() - dbStart;
    console.log(`✅ Document record created: ${document.id} (${timings.database}ms)`);

    // Processing summary
    const totalTime = Date.now() - startTime;
    console.log('✅ Processing complete:', {
      documentId: document.id,
      fileName: file_name,
      pageCount: pageCount,
      fileSizeKB: Math.round(fileBuffer.length / 1024),
      extractedChars: extractedContent.length,
      timings: {
        total: totalTime,
        upload: timings.upload,
        auth: timings.auth,
        ocr: timings.ocr,
        database: timings.database
      },
      ocrSpeed: `${Math.round(extractedContent.length / (timings.ocr / 1000))} chars/sec`
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        document,
        extracted_length: extractedContent.length,
        page_count: pageCount,
        processing_time_ms: totalTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    // Determine which phase failed
    let failedPhase = 'initialization';
    if (timings.upload > 0 && timings.auth === 0) failedPhase = 'authentication';
    else if (timings.auth > 0 && timings.ocr === 0) failedPhase = 'document_ai_processing';
    else if (timings.ocr > 0 && timings.database === 0) failedPhase = 'database_insert';
    else if (timings.upload > 0) failedPhase = 'storage_upload';
    
    console.error('❌ Upload failed:', {
      error: error.message,
      failedPhase: failedPhase,
      failedAfter: totalTime,
      completedTimings: timings
    });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Upload failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
