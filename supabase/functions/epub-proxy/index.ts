
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const epubUrl = url.searchParams.get('url');
    
    if (!epubUrl) {
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

    // Fetch the EPUB file
    const response = await fetch(epubUrl, {
      headers: {
        'User-Agent': 'Lovable Public Domain Library (Educational Use)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch EPUB: ${response.status} ${response.statusText}`);
    }

    // Get the content as a blob
    const epubBlob = await response.blob();
    
    // Return the EPUB with proper headers
    return new Response(epubBlob, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('❌ Error in EPUB proxy:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
});
