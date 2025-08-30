import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MIME type helper
function getMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': case 'htm': return 'text/html; charset=utf-8';
    case 'js': return 'text/javascript; charset=utf-8';
    case 'css': return 'text/css; charset=utf-8';
    case 'json': return 'application/json; charset=utf-8';
    case 'xml': return 'application/xml; charset=utf-8';
    case 'png': return 'image/png';
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    case 'woff': return 'font/woff';
    case 'woff2': return 'font/woff2';
    case 'ttf': return 'font/ttf';
    case 'eot': return 'application/vnd.ms-fontobject';
    case 'mp4': return 'video/mp4';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'pdf': return 'application/pdf';
    case 'swf': return 'application/x-shockwave-flash';
    default: return 'application/octet-stream';
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`SCORM Content Proxy Request: ${req.method} ${req.url}`);

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Expected URL structure: /functions/v1/scorm-content-proxy/{packageId}/{filePath}
    let packageId: string;
    let filePath: string;
    
    // Find the package ID (UUID format) in the path
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const packageIndex = pathParts.findIndex(part => uuidRegex.test(part));
    
    if (packageIndex === -1) {
      console.error('Package ID not found in path:', pathParts);
      return new Response('Package ID not found in path', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }
    
    packageId = pathParts[packageIndex];
    filePath = pathParts.slice(packageIndex + 1).join('/');
    
    // Default to index.html if no file specified
    if (!filePath) {
      filePath = 'content/index.html';
    }

    console.log(`Serving file: ${filePath} from package: ${packageId}`);

    // Verify package exists
    const { data: packageData, error: packageError } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      console.error('Package not found:', packageError);
      return new Response('Package not found', { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Try to get the file from storage
    // The extract_path contains the base path where files are stored
    const storagePath = `${packageData.extract_path}${filePath}`;
    console.log(`Attempting to fetch from storage: ${storagePath}`);

    const { data: fileData, error: fileError } = await supabase.storage
      .from('scorm-packages')
      .download(storagePath);

    if (fileError || !fileData) {
      console.error(`File not found: ${storagePath}`, fileError);
      
      // Try alternative paths
      const alternativePaths = [
        filePath, // Direct path
        `content/${filePath}`, // With content prefix
        `${packageId}/${filePath}`, // With package ID prefix
      ];

      for (const altPath of alternativePaths) {
        console.log(`Trying alternative path: ${altPath}`);
        const { data: altData, error: altError } = await supabase.storage
          .from('scorm-packages')
          .download(altPath);
        
        if (!altError && altData) {
          console.log(`Found file at alternative path: ${altPath}`);
          const arrayBuffer = await altData.arrayBuffer();
          const mimeType = getMimeType(filePath);
          
          return new Response(arrayBuffer, {
            headers: {
              ...corsHeaders,
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=600',
              'X-Content-Type-Options': 'nosniff',
            },
          });
        }
      }

      // If still not found, return 404
      return new Response(`File not found: ${filePath}`, { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const mimeType = getMimeType(filePath);
    
    console.log(`Serving ${filePath} as ${mimeType}, size: ${arrayBuffer.byteLength} bytes`);

    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=600',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('SCORM Content Proxy Error:', error);
    return new Response(`Server Error: ${error.message}`, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      },
    });
  }
});