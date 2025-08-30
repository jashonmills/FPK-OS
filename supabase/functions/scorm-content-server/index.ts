import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Handle different URL structures - the function might receive the full path or just the part after function name
    let packageId: string;
    let filePath: string;
    
    // Find the package ID (UUID format) in the path
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const packageIndex = pathParts.findIndex(part => uuidRegex.test(part));
    
    if (packageIndex === -1) {
      return new Response('Package ID not found in path', { status: 400, headers: corsHeaders });
    }
    
    packageId = pathParts[packageIndex];
    filePath = pathParts.slice(packageIndex + 1).join('/');

    console.log(`SCORM Content Server: Serving ${filePath} from package ${packageId}`);

    // Get package info
    const { data: packageData, error: packageError } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      console.error('Package not found:', packageError);
      return new Response('Package not found', { status: 404, headers: corsHeaders });
    }

    // Build the full content path
    let contentPath = filePath;
    
    // If the file path doesn't include the package structure, prepend it
    if (!filePath.startsWith('packages/')) {
      contentPath = `packages/${packageId}/${filePath}`;
    }

    // Handle default file - if requesting manifest or empty, serve index.html instead
    if (!filePath || filePath === 'imsmanifest.xml' || filePath.endsWith('imsmanifest.xml')) {
      contentPath = `packages/${packageId}/content/index.html`;
      console.log(`Redirecting manifest request to: ${contentPath}`);
    }

    // If no specific file requested, default to index.html
    if (!filePath || filePath === packageId) {
      contentPath = `packages/${packageId}/content/index.html`;
      console.log(`Using default index.html: ${contentPath}`);
    }

    console.log(`Attempting to fetch: ${contentPath}`);

    // Try to get the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('scorm-packages')
      .download(contentPath);

    if (fileError || !fileData) {
      console.error('File not found in storage:', fileError);
      
      // Return a helpful error page
      return new Response(`
        <html>
          <head>
            <title>SCORM Content Unavailable</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                text-align: center; 
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              .error-code { 
                font-size: 3em; 
                font-weight: bold; 
                color: #e74c3c; 
                margin-bottom: 20px; 
              }
              .message {
                font-size: 1.2em;
                color: #666;
                margin-bottom: 30px;
              }
              .details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 4px;
                margin: 20px 0;
                text-align: left;
              }
              .retry-btn {
                background: #6366f1;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              }
              .retry-btn:hover {
                background: #5048e5;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error-code">404</div>
              <div class="message">SCORM Content Not Found</div>
              <p>The requested SCORM content file could not be located.</p>
              
              <div class="details">
                <strong>Debug Information:</strong><br>
                Package: ${packageData.title}<br>
                Requested file: ${filePath}<br>
                Storage path: ${contentPath}<br>
                Package status: ${packageData.status}
              </div>
              
              <p><strong>This usually means the SCORM package needs to be re-processed.</strong></p>
              
              <button class="retry-btn" onclick="window.parent.postMessage({type: 'scorm-reprocess', packageId: '${packageId}'}, '*')">
                Reprocess Package
              </button>
              
              <p style="margin-top: 20px; font-size: 14px; color: #888;">
                If you continue to see this error, please contact support.
              </p>
            </div>
          </body>
        </html>
      `, {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html',
        },
      });
    }

    // Determine content type
    const extension = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'text/html';
    
    switch (extension) {
      case 'html':
      case 'htm':
        contentType = 'text/html; charset=utf-8';
        break;
      case 'js':
        contentType = 'application/javascript; charset=utf-8';
        break;
      case 'css':
        contentType = 'text/css; charset=utf-8';
        break;
      case 'json':
        contentType = 'application/json; charset=utf-8';
        break;
      case 'xml':
        contentType = 'application/xml; charset=utf-8';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'woff':
        contentType = 'font/woff';
        break;
      case 'woff2':
        contentType = 'font/woff2';
        break;
      case 'ttf':
        contentType = 'font/ttf';
        break;
      case 'eot':
        contentType = 'application/vnd.ms-fontobject';
        break;
      default:
        contentType = 'text/html; charset=utf-8';
    }

    // Return the file content
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('SCORM Content Server Error:', error);
    return new Response(`
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h1>Server Error</h1>
          <p>An error occurred while serving SCORM content.</p>
          <p>${error.message}</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    });
  }
});