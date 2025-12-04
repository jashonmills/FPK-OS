
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const epubUrl = url.searchParams.get('url');
    
    if (!epubUrl) {
      console.error('❌ Missing epub URL parameter');
      return new Response(
        JSON.stringify({ error: 'Missing epub URL parameter' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('📖 Proxying EPUB request for:', epubUrl);

    // Validate that it's a Project Gutenberg URL
    if (!epubUrl.includes('gutenberg.org')) {
      console.error('❌ Invalid URL - not from Project Gutenberg');
      return new Response(
        JSON.stringify({ error: 'Only Project Gutenberg URLs are allowed' }),
        { 
          status: 403, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Add timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      // Fetch the EPUB file with timeout
      console.log('🔄 Fetching EPUB from:', epubUrl);
      const response = await fetch(epubUrl, {
        headers: {
          'User-Agent': 'Lovable Public Domain Library (Educational Use)',
          'Accept': 'application/epub+zip,application/octet-stream,*/*'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ Failed to fetch EPUB:', response.status, response.statusText);
        throw new Error(`Failed to fetch EPUB: ${response.status} ${response.statusText}`);
      }

      console.log('✅ EPUB fetched successfully, content-type:', response.headers.get('content-type'));

      // Get the content as array buffer for better handling
      const epubBuffer = await response.arrayBuffer();
      
      console.log('📊 EPUB size:', epubBuffer.byteLength, 'bytes');

      // Return the EPUB with proper headers
      return new Response(epubBuffer, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/epub+zip',
          'Content-Length': epubBuffer.byteLength.toString(),
          'Content-Disposition': 'inline',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ Request timed out');
        throw new Error('Request timed out after 25 seconds');
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('❌ Error in EPUB proxy:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;
    
    if (error.message.includes('timed out') || error.message.includes('timeout')) {
      errorMessage = 'The request timed out. The book file may be too large or the server is slow to respond.';
      statusCode = 504;
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = 'Could not connect to the book server. Please try again later.';
      statusCode = 502;
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      errorMessage = 'The requested book file was not found.';
      statusCode = 404;
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      errorMessage = 'Access to the book file was denied.';
      statusCode = 403;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      { 
        status: statusCode, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
});
