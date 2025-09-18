// Packaged copy for review/apply: supabase/functions/native-content-proxy/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MIME type mapping for different file extensions
const getMimeType = (path: string): string => {
  const ext = path.toLowerCase().split('.').pop() || '';
  const mimeTypes: { [key: string]: string } = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'pdf': 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  const url = new URL(req.url);
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({ status: 'healthy' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the URL path: /native-content/:pkg/*
  const pathMatch = url.pathname.match(/^\/native-content\/([^/]+)\/(.*)$/);
    if (!pathMatch) {
      return new Response('Invalid path format. Expected: /native-content/:pkg/path', {
        status: 400,
        headers: corsHeaders,
      });
    }

    const [, packageName, filePath] = pathMatch;
    console.log(`📂 Native content request: pkg=${packageName}, file=${filePath}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the storage path for the requested file
    const storagePath = `lessons/${packageName}/${filePath}`;
    
    console.log(`🔍 Looking for file at: scorm-public/${storagePath}`);

    // Download the file from Supabase storage
    const { data: fileData, error } = await supabase.storage
      .from('scorm-public')
      .download(storagePath);

    if (error || !fileData) {
      console.log(`❌ File not found: ${storagePath}`, error);
      return new Response('File not found', {
        status: 404,
        headers: corsHeaders,
      });
    }

    console.log(`✅ File found, size: ${fileData.size} bytes`);

    // Convert blob to array buffer for response
    const arrayBuffer = await fileData.arrayBuffer();
    const contentType = getMimeType(filePath);

    // Return the file with appropriate headers
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Length': fileData.size.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Native content proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
