import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const credsJson = Deno.env.get('GOOGLE_DOCUMENT_AI_CREDENTIALS');
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID');
    
    console.log('🔍 Testing Google Document AI credentials...');
    
    // Test 1: Check if secrets exist
    if (!credsJson) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'GOOGLE_DOCUMENT_AI_CREDENTIALS secret not found',
        tests: {
          credentials_exist: false,
          processor_id_exists: !!processorId
        }
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!processorId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'GOOGLE_DOCUMENT_AI_PROCESSOR_ID secret not found',
        tests: {
          credentials_exist: true,
          processor_id_exists: false
        }
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const creds = JSON.parse(credsJson);
    
    // Test 2: Verify credentials structure
    const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
    const missing = requiredFields.filter(f => !creds[f]);
    if (missing.length > 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: `Missing fields in credentials: ${missing.join(', ')}`,
        tests: {
          credentials_exist: true,
          processor_id_exists: true,
          credentials_valid: false
        }
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Credentials structure valid');
    console.log('📧 Service account:', creds.client_email);
    console.log('🔑 Project ID:', creds.project_id);
    console.log('🔧 Processor ID:', processorId);

    // Test 3: Try to get access token
    console.log('🔐 Testing OAuth token exchange...');
    const token = await getAccessToken(creds);
    console.log('✅ Successfully obtained access token');

    // Test 4: Test API access with processor info
    console.log('🤖 Testing Document AI API access...');
    const apiUrl = `https://documentai.googleapis.com/v1/${processorId}`;
    const response = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const apiAccessible = response.ok;
    let apiError = null;
    
    if (!apiAccessible) {
      const errorText = await response.text();
      apiError = `Status ${response.status}: ${errorText}`;
      console.error('❌ API access failed:', apiError);
    } else {
      console.log('✅ Document AI API accessible');
    }

    return new Response(JSON.stringify({
      success: true,
      tests: {
        credentials_exist: true,
        processor_id_exists: true,
        credentials_valid: true,
        token_exchange_success: true,
        api_accessible: apiAccessible
      },
      details: {
        project_id: creds.project_id,
        service_account: creds.client_email,
        processor_id: processorId,
        api_status: response.status,
        api_error: apiError
      },
      message: apiAccessible 
        ? '✅ All tests passed! Google Document AI is ready to use.'
        : '⚠️ Token exchange works but API access failed. Check IAM permissions.'
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
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
