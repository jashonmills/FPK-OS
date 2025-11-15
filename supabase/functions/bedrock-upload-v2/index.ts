/**
 * VERSION: 4.0.0-PHASE1D-BILINGUAL
 * 
 * PHASE 1D: Bilingual Document Upload
 * Supports both legacy student_id and new client_id models via feature flag
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";
import { 
  isFlagEnabled, 
  isFlagEnabledForOrg,
  userCanAccessClient,
  getClientContext 
} from "../_shared/feature-flags.ts";

const VERSION = "4.0.0-PHASE1D-BILINGUAL";

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
    const organizationId = body.organization_id || body.organizationId;
    
    // PHASE 1D: Support both student_id (OLD) and client_id (NEW)
    const studentId = body.student_id || body.studentId;
    const clientId = body.client_id || body.clientId;
    
    const documentDate = body.document_date || body.documentDate;
    const category = body.category || 'other';
    const processorId = body.processor_id;
    
    // Validate: Must have EITHER family_id OR organization_id, but not both
    if (!fileData || !fileName) {
      throw new Error('Missing required fields: file_data_base64 and file_name');
    }
    if (!familyId && !organizationId) {
      throw new Error('Must provide either family_id or organization_id');
    }
    if (familyId && organizationId) {
      throw new Error('Cannot specify both family_id and organization_id');
    }

    console.log(`📄 Processing: ${fileName}`);
    console.log(`📋 Category: ${category}`);
    console.log(`🎯 Processor ID: ${processorId || 'using fallback'}`);
    if (familyId) {
      console.log(`👨‍👩‍👧 B2C Upload - Family: ${familyId}`);
      console.log(`📊 Data Model - Student: ${studentId || 'none'}, Client: ${clientId || 'none'}`);
    } else {
      console.log(`🏢 B2B Upload - Org: ${organizationId}`);
      console.log(`📊 Data Model - Student: ${studentId || 'none'}, Client: ${clientId || 'none'}`);
    }
    
    // ========================================
    // PHASE 1D: FEATURE FLAG FORK
    // ========================================
    const useNewModel = familyId 
      ? await isFlagEnabled(supabase, familyId, 'use_new_client_model')
      : await isFlagEnabledForOrg(supabase, organizationId!, 'use_new_client_model');
    
    console.log(`🚩 PHASE 1D: Using ${useNewModel ? 'NEW client_id' : 'OLD student_id'} model`);
    
    // Determine final IDs based on feature flag
    let finalClientId: string | null = null;
    let finalStudentId: string | null = null;
    let finalFamilyId: string | null = familyId || null;
    let finalOrgId: string | null = organizationId || null;
    
    if (useNewModel) {
      // ========================================
      // NEW WORLD: client_id model
      // ========================================
      if (!clientId) {
        throw new Error('client_id is required when using new data model');
      }
      
      // Verify user has access to this client
      const hasAccess = await userCanAccessClient(supabase, user.id, clientId);
      if (!hasAccess) {
        throw new Error('Unauthorized: You do not have access to this client');
      }
      
      // Get client context to determine family or org
      const context = await getClientContext(supabase, clientId);
      if (!context) {
        throw new Error('Could not determine client context');
      }
      
      finalClientId = clientId;
      finalFamilyId = context.family_id;
      finalOrgId = context.organization_id;
      
      console.log(`✅ NEW MODEL: client_id=${clientId}, context=${finalFamilyId ? 'family' : 'org'}`);
    } else {
      // ========================================
      // OLD WORLD: student_id model (existing logic)
      // ========================================
      finalStudentId = studentId;
      console.log(`✅ OLD MODEL: student_id=${studentId || 'none'}`);
    }

    // If organization context, verify user membership and permissions
    if (organizationId) {
      console.log(`🔐 Validating B2B permissions...`);
      
      // Verify user is a member of this organization
      const { data: membership, error: memberError } = await supabase.rpc(
        'is_organization_member',
        { _user_id: user.id, _org_id: organizationId }
      );
      
      if (memberError || !membership) {
        throw new Error('You do not have permission to upload documents for this organization');
      }
      
      // If student specified, verify they belong to this organization
      if (studentId) {
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('id', studentId)
          .eq('organization_id', organizationId)
          .maybeSingle();
        
        if (studentError || !student) {
          throw new Error('Student not found or does not belong to this organization');
        }
      }
      
      console.log(`✅ B2B permissions validated`);
    }

    // Decode file
    const fileBytes = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const fileSizeKb = Math.round(fileBytes.length / 1024);
    
    console.log(`📊 File size: ${fileSizeKb} KB (${(fileSizeKb / 1024).toFixed(2)} MB)`);

    // Upload to storage
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const contextId = familyId || organizationId;
    const storagePath = `${contextId}/${timestamp}_${sanitizedFileName}`;

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

    // Phase 2: Intelligent Router - Select processor based on category or explicit ID
    let selectedProcessor: string;
    
    if (processorId) {
      console.log(`🎯 Using explicitly provided processor: ${processorId}`);
      selectedProcessor = processorId;
    } else if (PROCESSOR_MAP[category]) {
      selectedProcessor = PROCESSOR_MAP[category];
      console.log(`✅ Using specialized processor for "${category}": ${selectedProcessor}`);
    } else {
      const fallbackProcessor = Deno.env.get('DOC_AI_PROCESSOR_OCR') || 
                               Deno.env.get('DOC_AI_PROCESSOR_ID');
      
      if (!fallbackProcessor) {
        throw new Error('No processor configured for this document type');
      }
      
      selectedProcessor = fallbackProcessor;
      console.log(`⚠️ No specialized processor for "${category}", using fallback: ${selectedProcessor}`);
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
    
    const processUrl = `https://documentai.googleapis.com/v1/${selectedProcessor}:process`;
    
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
    // PHASE 1D: Use appropriate IDs based on feature flag
    const { data: document, error: dbError } = await supabase
      .from('bedrock_documents')
      .insert({
        family_id: finalFamilyId,
        organization_id: finalOrgId,
        student_id: finalStudentId,  // NULL in new model
        client_id: finalClientId,     // NULL in old model
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
