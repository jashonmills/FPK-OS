// Public endpoint that handles post-authentication redirects for students
// This avoids client-side redirect issues by handling everything server-side

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('[auth-redirect] ====== REQUEST RECEIVED ======');
  console.log('[auth-redirect] Method:', req.method);
  console.log('[auth-redirect] URL:', req.url);
  console.log('[auth-redirect] Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[auth-redirect] Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const redirectUri = url.searchParams.get('redirect_uri');

    console.log('[auth-redirect] Redirect request received');
    console.log('[auth-redirect] Redirect URI:', redirectUri);

    // Validate redirect URI
    if (!redirectUri) {
      console.error('[auth-redirect] No redirect_uri provided');
      return new Response('Missing redirect_uri parameter', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Security: Validate that redirect_uri is to an allowed domain
    const allowedDomains = [
      'fpkuniversity.com',
      'localhost',
      '127.0.0.1',
      'lovableproject.com',
      'lovable.app'
    ];

    try {
      const redirectUrl = new URL(redirectUri);
      const isAllowed = allowedDomains.some(domain => 
        redirectUrl.hostname === domain || redirectUrl.hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        console.error('[auth-redirect] Redirect to unauthorized domain:', redirectUrl.hostname);
        return new Response('Unauthorized redirect domain', { 
          status: 403,
          headers: corsHeaders 
        });
      }

      console.log('[auth-redirect] Validated redirect to:', redirectUri);

      // Perform server-side redirect
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUri,
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('[auth-redirect] Invalid redirect_uri format:', error);
      return new Response('Invalid redirect_uri format', { 
        status: 400,
        headers: corsHeaders 
      });
    }

  } catch (error) {
    console.error('[auth-redirect] Unexpected error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
