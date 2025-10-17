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
    const { document_id } = await req.json();

    if (!document_id) {
      throw new Error('Missing document_id');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📄 Starting Google Document AI extraction for:', document_id);

    // Get document details
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('file_path, file_name, family_id')
      .eq('id', document_id)
      .single();

    if (docError || !doc) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    // Extract relative path from full URL
    const extractRelativePath = (fullPath: string): string => {
      if (fullPath.includes('/storage/v1/object/public/family-documents/')) {
        return fullPath.split('/storage/v1/object/public/family-documents/')[1];
      }
      return fullPath;
    };

    const relativePath = extractRelativePath(doc.file_path);
    console.log('📥 Downloading PDF from storage:', relativePath);

    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('family-documents')
      .download(relativePath);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download PDF: ${downloadError?.message}`);
    }

    const pdfBytes = new Uint8Array(await fileData.arrayBuffer());
    console.log(`✅ Downloaded ${pdfBytes.length} bytes`);

    // Get Google credentials
    const credentialsJson = Deno.env.get('GOOGLE_DOCUMENT_AI_CREDENTIALS');
    if (!credentialsJson) {
      throw new Error('GOOGLE_DOCUMENT_AI_CREDENTIALS not configured');
    }

    const credentials = JSON.parse(credentialsJson);
    const projectId = credentials.project_id;
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID');

    if (!processorId) {
      throw new Error('GOOGLE_DOCUMENT_AI_PROCESSOR_ID not configured');
    }

    console.log('🔐 Getting OAuth access token...');
    
    // Get OAuth access token using properly signed JWT
    const accessToken = await getAccessToken(credentials);

    // Call Google Document AI
    console.log('🤖 Calling Google Document AI API...');
    const apiUrl = `https://documentai.googleapis.com/v1/${processorId}:process`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rawDocument: {
          content: btoa(String.fromCharCode(...pdfBytes)),
          mimeType: 'application/pdf'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Document AI API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const extractedText = result.document?.text || '';

    if (!extractedText) {
      throw new Error('No text extracted from document');
    }

    console.log(`✅ Extracted ${extractedText.length} characters`);

    // Update document with extracted text
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        extracted_content: extractedText,
        extraction_source: 'google_document_ai',
        updated_at: new Date().toISOString()
      })
      .eq('id', document_id);

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }

    // Log diagnostics
    await supabase
      .from('document_extraction_diagnostics')
      .insert({
        document_id,
        family_id: doc.family_id,
        extraction_method: 'google_document_ai',
        text_length: extractedText.length,
        word_count: extractedText.split(/\s+/).length,
        quality_score: 'excellent',
        validation_passed: true,
        validation_reason: 'Google Document AI extraction successful'
      });

    return new Response(
      JSON.stringify({
        success: true,
        text_length: extractedText.length,
        extraction_source: 'google_document_ai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-text-with-document-ai:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to get OAuth access token with properly signed JWT
async function getAccessToken(credentials: any): Promise<string> {
  const jwt = await createSignedJWT(credentials);
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OAuth token exchange failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Create a properly signed JWT for Google API authentication
async function createSignedJWT(credentials: any): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  // Import private key and sign using Web Crypto API
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(credentials.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signatureInput)
  );

  return `${signatureInput}.${base64UrlEncode(signature)}`;
}

// Base64 URL encode helper
function base64UrlEncode(data: string | ArrayBuffer): string {
  const bytes = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : new Uint8Array(data);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Convert PEM format private key to ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
