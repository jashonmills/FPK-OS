import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/google-document-ai-auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    console.log(`✅ File uploaded to: ${filePath}`);

    // 4. Extract text using Google Document AI
    console.log('🔍 Calling Google Document AI for text extraction...');

    const credsJson = Deno.env.get('GOOGLE_DOCUMENT_AI_CREDENTIALS');
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID');

    if (!credsJson || !processorId) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Google Document AI credentials not configured');
    }

    const credentials = JSON.parse(credsJson);
    console.log('🔐 Authenticating with Google Document AI...');
    const accessToken = await getAccessToken(credentials);
    console.log('✅ Authentication successful');

    // Call Document AI processDocument endpoint
    const apiUrl = `https://documentai.googleapis.com/v1/${processorId}:process`;
    console.log('📄 Processing document...');
    
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
        }
      })
    });

    if (!response.ok) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      const errorText = await response.text();
      console.error('Google Document AI failed:', response.status, errorText);
      throw new Error(`Document processing failed: ${response.statusText}`);
    }

    const result = await response.json();
    const extractedContent = result.document?.text || '';
    
    if (extractedContent.length < 50) {
      // ROLLBACK: Delete the uploaded file
      await supabase.storage.from('bedrock-storage').remove([filePath]);
      throw new Error('Extracted text is too short. File may be corrupted or empty.');
    }

    console.log(`✅ Extracted ${extractedContent.length} characters of text`);

    // 6. Create database record WITH extracted content
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

    console.log(`✅ Document record created: ${document.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document,
        extracted_length: extractedContent.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Upload failed:', error);
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
