/**
 * VERSION: 3.0.0-SYNC-PROCESSOR
 * 
 * Synchronous processing for Google Document AI
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";

const VERSION = "3.0.0-SYNC-PROCESSOR";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Phase 2: Intelligent Router - Build processor map from environment secrets
function buildProcessorMap(): Record<string, string> {
  const map = {
    'other': Deno.env.get('DOC_AI_PROCESSOR_OCR'),
    'form': Deno.env.get('DOC_AI_PROCESSOR_FORM'),
    'layout': Deno.env.get('DOC_AI_PROCESSOR_LAYOUT'),
    'iep': Deno.env.get('DOC_AI_PROCESSOR_IEP')
  };

  // Validate all processors are configured
  const missing = Object.entries(map)
    .filter(([_, id]) => !id)
    .map(([type]) => type);
  
  if (missing.length > 0) {
    console.log(`⚠️ Missing processor IDs for: ${missing.join(', ')}`);
    console.log(`🎯 Falling back to single processor mode (Phase 1)`);
    return {};
  }

  console.log(`✅ Processor arsenal loaded: ${Object.keys(map).length} processors`);
  return map as Record<string, string>;
}

const PROCESSOR_MAP = buildProcessorMap();

serve(async (req) => {
  console.log(`🚀 [${VERSION}] bedrock-upload-v2 invoked`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) throw new Error('Unauthorized');

    console.log(`✓ User authenticated: ${user.id}`);

    // Parse request body - accept both snake_case (frontend) and camelCase formats
    const body = await req.json();
    const fileData = body.file_data_base64 || body.fileData;
    const fileName = body.file_name || body.fileName;
    const familyId = body.family_id || body.familyId;
    const studentId = body.student_id || body.studentId;
    const documentDate = body.document_date || body.documentDate;
    const category = body.category || 'other';
    
    if (!fileData || !fileName || !familyId) {
      throw new Error('Missing required fields: file_data_base64/fileData, file_name/fileName, or family_id/familyId');
    }

    console.log(`📄 Processing: ${fileName}`);
    console.log(`📋 Category: ${category}`);
    console.log(`👥 Family: ${familyId}, Student: ${studentId || 'none'}`);

    // Decode file
    const fileBytes = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const fileSizeKb = Math.round(fileBytes.length / 1024);
    
    console.log(`📊 File size: ${fileSizeKb} KB (${(fileSizeKb / 1024).toFixed(2)} MB)`);

    // Upload to storage
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${familyId}/${timestamp}_${sanitizedFileName}`;

    console.log(`💾 Uploading to storage: ${storagePath}`);

    const { error: uploadError } = await supabase.storage
      .from('bedrock-storage')
      .upload(storagePath, fileBytes, {
        contentType: 'application/pdf',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      throw new Error('File upload failed');
    }

    console.log(`✅ File uploaded to storage`);

    // Get Google Document AI credentials
    console.log('🔐 Authenticating with Google Document AI...');
    
    const credentialsJson = Deno.env.get('GOOGLE_DOCUMENT_AI_CREDENTIALS');
    if (!credentialsJson) {
      throw new Error('Missing Google Document AI credentials');
    }

    const credentials = JSON.parse(credentialsJson);
    console.log(`📧 Using service account: ${credentials.client_email}`);

    // Phase 2: Intelligent routing based on category
    let processorId: string;
    
    if (Object.keys(PROCESSOR_MAP).length > 0 && PROCESSOR_MAP[category]) {
      processorId = PROCESSOR_MAP[category];
      console.log(`🎯 Phase 2 Mode: Category '${category}' → Processor: ${processorId}`);
    } else {
      processorId = Deno.env.get('ACTIVE_DOCUMENT_AI_PROCESSOR_ID')!;
      if (!processorId) {
        throw new Error('No processor ID configured');
      }
      console.log(`🎯 Phase 1 Mode: Using single processor: ${processorId}`);
    }

    // Get OAuth access token
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Authentication successful');

    // Download file from Supabase Storage to process with Document AI
    console.log('📥 Downloading file from storage for processing...');
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('bedrock-storage')
      .download(storagePath);

    if (downloadError || !fileBlob) {
      throw new Error('Failed to download file from storage');
    }

    // Convert blob to base64 (chunked to avoid stack overflow)
    const arrayBuffer = await fileBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Process in chunks to avoid "Maximum call stack size exceeded"
    const chunkSize = 8192;
    let binaryString = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binaryString += String.fromCharCode(...chunk);
    }
    const base64Content = btoa(binaryString);
    
    // Call synchronous processDocument API
    console.log(`🚀 Initiating synchronous document processing`);
    
    const processUrl = `https://documentai.googleapis.com/v1/${processorId}:process`;
    
    const requestBody = {
      rawDocument: {
        content: base64Content,
        mimeType: 'application/pdf'
      }
    };

    const processResponse = await fetch(processUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      console.error('❌ Document processing failed:', errorText);
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error(`Processing failed: ${processResponse.status} ${errorText}`);
    }

    const result = await processResponse.json();
    const extractedText = result.document?.text || '';
    
    console.log(`✅ Document processed successfully. Extracted ${extractedText.length} characters`);

    // Create database record with extracted content
    const { data: document, error: dbError } = await supabase
      .from('bedrock_documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        file_name: fileName,
        file_path: storagePath,
        file_size_kb: fileSizeKb,
        status: 'extracted',
        extracted_content: extractedText,
        category: category
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert failed:', dbError);
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error('Failed to create document record');
    }

    console.log(`✅ Document record created with ID: ${document.id}`);

    // Return 200 OK - processing complete
    return new Response(
      JSON.stringify({ 
        success: true,
        status: 'extracted',
        document_id: document.id,
        character_count: extractedText.length,
        message: 'Document processed successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('❌ Upload failed:', error.message);
    
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
