/**
 * VERSION: 3.0.0-ASYNC-BATCH-PROCESSOR
 * 
 * Async batch processing for Google Document AI - handles up to 500-page documents
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";

const VERSION = "3.0.0-ASYNC-BATCH-PROCESSOR";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Intelligent Router: Maps document types to specialized processors
const PROCESSOR_MAP: Record<string, string> = {
  'other': 'projects/fpkuniversity/locations/us/processors/9a2c8ed98e2c75bc',
  'form': 'projects/fpkuniversity/locations/us/processors/67a01c2d52e6af65',
  'layout': 'projects/fpkuniversity/locations/us/processors/cb205a77bf9a675e',
  'iep': 'projects/fpkuniversity/locations/us/processors/e0dcf69b05bd5c40'
};

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

    // Parse request body
    const { fileData, fileName, category = 'other', familyId, studentId, documentDate } = await req.json();
    
    if (!fileData || !fileName || !familyId) {
      throw new Error('Missing required fields: fileData, fileName, or familyId');
    }

    console.log(`📄 Processing: ${fileName}`);
    console.log(`👥 Family: ${familyId}, Student: ${studentId || 'none'}`);
    console.log(`📋 Category: ${category}`);

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
    const credsJson = Deno.env.get('GOOGLE_DOC_AI_CREDS');
    if (!credsJson) {
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error('Google Document AI credentials not configured');
    }

    // Validate and parse credentials
    if (!credsJson.trim().startsWith('{')) {
      console.error('❌ GOOGLE_DOCUMENT_AI_CREDENTIALS is not JSON format');
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error('Invalid credentials format: Expected Google Service Account JSON');
    }

    let credentials;
    try {
      credentials = JSON.parse(credsJson);
      
      if (!credentials.private_key || !credentials.client_email || !credentials.project_id) {
        throw new Error('Service account JSON missing required fields (private_key, client_email, project_id)');
      }
    } catch (e) {
      console.error('❌ Failed to parse Google credentials:', e.message);
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error(`Invalid Google credentials: ${e.message}`);
    }

    // Select processor based on category (Intelligent Router)
    const processorId = PROCESSOR_MAP[category] || PROCESSOR_MAP['other'];
    console.log(`🎯 Selected processor: ${processorId} for category: ${category}`);

    // Get access token
    console.log('🔐 Authenticating with Google Document AI...');
    console.log('📧 Using service account:', credentials.client_email);
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Authentication successful');

    // Generate job ID
    const jobId = `${familyId}_${timestamp}`;
    
    // Call batchProcess API
    console.log(`🚀 Initiating async batch processing with job ID: ${jobId}`);
    
    const batchProcessUrl = `https://documentai.googleapis.com/v1/${processorId}:batchProcess`;
    
    const requestBody = {
      inputDocuments: {
        gcsPrefix: {
          gcsUriPrefix: `gs://bedrock-storage/${storagePath}`
        }
      },
      documentOutputConfig: {
        gcsOutputConfig: {
          gcsUri: `gs://bedrock-storage-output/${jobId}/`
        }
      }
    };

    const batchResponse = await fetch(batchProcessUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!batchResponse.ok) {
      const errorText = await batchResponse.text();
      console.error('❌ Batch process API failed:', errorText);
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error(`Batch process failed: ${batchResponse.status} ${errorText}`);
    }

    const operation = await batchResponse.json();
    const operationName = operation.name;
    
    console.log(`✅ Batch process initiated. Operation: ${operationName}`);

    // Create database record with processing status
    const { data: document, error: dbError } = await supabase
      .from('bedrock_documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        file_name: fileName,
        file_path: storagePath,
        file_size_kb: fileSizeKb,
        status: 'processing',
        job_id: operationName,
        metadata: {
          category,
          processor_id: processorId,
          initiated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert failed:', dbError);
      await supabase.storage.from('bedrock-storage').remove([storagePath]);
      throw new Error('Failed to create document record');
    }

    console.log(`✅ Document record created with ID: ${document.id}`);

    // Return 202 Accepted - processing started
    return new Response(
      JSON.stringify({ 
        success: true,
        status: 'processing',
        document_id: document.id,
        job_id: operationName,
        message: 'Document processing initiated. You will be notified when complete.'
      }),
      { 
        status: 202,
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
