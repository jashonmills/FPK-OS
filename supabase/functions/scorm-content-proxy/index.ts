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
      return new Response('Package ID not found in path, expected UUID format', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }
    
    packageId = pathParts[packageIndex];
    filePath = pathParts.slice(packageIndex + 1).join('/');
    
    // Default to index.html if no file specified
    if (!filePath || filePath === '') {
      filePath = 'content/index.html';
      console.log(`No file path specified, defaulting to: ${filePath}`);
    }

    console.log(`📦 Package ID: ${packageId}`);
    console.log(`📄 Requested file: ${filePath}`);

    // Verify package exists and get metadata
    console.log(`🔍 Looking up package: ${packageId}`);
    const { data: packageData, error: packageError } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      console.error('❌ Package not found:', packageError);
      return new Response(`SCORM Package not found: ${packageId}`, { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    console.log(`✅ Package found: ${packageData.title} (Status: ${packageData.status})`);
    console.log(`📂 Extract path: ${packageData.extract_path}`);

    // Try to get the file from storage with comprehensive path attempts
    // Handle path deduplication - if extract_path ends with content/ and filePath starts with content/, avoid duplication
    let cleanFilePath = filePath;
    if (packageData.extract_path?.endsWith('content/') && filePath.startsWith('content/')) {
      cleanFilePath = filePath.substring('content/'.length);
      console.log(`🔧 Path deduplication: ${filePath} → ${cleanFilePath}`);
    }

    const storagePaths = [
      `${packageData.extract_path}${cleanFilePath}`, // Primary path with deduplication
      `${packageData.extract_path}${filePath}`, // Original path with extract_path
      `${packageData.extract_path}/${cleanFilePath}`, // With extra slash safety
      `${packageData.extract_path}/${filePath}`, // With extra slash safety  
      filePath, // Direct path
      cleanFilePath, // Direct clean path
      `content/${cleanFilePath}`, // With content prefix on clean path
      `${packageId}/${filePath}`, // With package ID prefix
      `${packageId}/${cleanFilePath}`, // With package ID prefix on clean path
      `packages/${packageId}/${filePath}`, // Full packages path
      `packages/${packageId}/${cleanFilePath}`, // Full packages path clean
      `packages/${packageId}/content/${cleanFilePath}`, // Full packages + content path
    ];

    console.log(`🔍 Attempting to fetch file from storage with ${storagePaths.length} possible paths...`);
    console.log(`📂 Extract path: ${packageData.extract_path}`);
    console.log(`📄 Original file path: ${filePath}`);
    console.log(`🧹 Clean file path: ${cleanFilePath}`);

    for (let i = 0; i < storagePaths.length; i++) {
      const storagePath = storagePaths[i];
      console.log(`📁 Trying path ${i + 1}/${storagePaths.length}: ${storagePath}`);
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('scorm-packages')
        .download(storagePath);

      if (!fileError && fileData) {
        console.log(`✅ File found at: ${storagePath}`);
        
        // Convert blob to array buffer
        const arrayBuffer = await fileData.arrayBuffer();
        const mimeType = getMimeType(filePath);
        
        // Debug: Check if HTML content looks correct
        if (mimeType.includes('text/html')) {
          const textContent = new TextDecoder().decode(arrayBuffer);
          const preview = textContent.substring(0, 200);
          console.log(`🔍 HTML Content Preview (first 200 chars): ${preview}`);
          
          // Check if it's actually HTML or just text containing HTML
          if (textContent.toLowerCase().includes('<!doctype html>') || textContent.toLowerCase().includes('<html')) {
            console.log('✅ Content appears to be proper HTML');
            
            // Check if content contains escaped HTML (common issue)
            if (textContent.includes('&lt;') || textContent.includes('&gt;')) {
              console.log('⚠️ Content contains escaped HTML entities - will decode');
              // Decode HTML entities
              const unescapedContent = textContent
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&');
              
              // Return the unescaped content
              const correctedBuffer = new TextEncoder().encode(unescapedContent);
              const headers = {
                ...corsHeaders,
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Content-Type-Options': 'nosniff',
                'Content-Disposition': 'inline; filename="' + filePath.split('/').pop() + '"',
                'X-Frame-Options': 'ALLOWALL',
              };
              console.log(`📋 Serving corrected HTML content, size: ${correctedBuffer.byteLength} bytes`);
              console.log(`📋 Response headers:`, Object.keys(headers));
              return new Response(correctedBuffer, { headers });
            }
          } else {
            console.log('⚠️ Content does not appear to be proper HTML - might be text containing HTML code');
            
            // If content looks like it might be JSON or other format containing HTML, try to extract it
            try {
              const parsed = JSON.parse(textContent);
              if (typeof parsed === 'string' && parsed.includes('<!DOCTYPE html>')) {
                console.log('🔧 Found HTML content in JSON string, extracting...');
                const extractedHTML = parsed;
                const correctedBuffer = new TextEncoder().encode(extractedHTML);
                const headers = {
                  ...corsHeaders,
                  'Content-Type': 'text/html; charset=utf-8',
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0',
                  'X-Content-Type-Options': 'nosniff',
                  'Content-Disposition': 'inline; filename="' + filePath.split('/').pop() + '"',
                  'X-Frame-Options': 'ALLOWALL',
                };
                console.log(`📋 Serving extracted HTML content, size: ${correctedBuffer.byteLength} bytes`);
                return new Response(correctedBuffer, { headers });
              }
            } catch (e) {
              // Not JSON, continue with original processing
            }
          }
        }
        
        console.log(`📤 Serving ${filePath} as ${mimeType}, size: ${arrayBuffer.byteLength} bytes`);

        // Enhanced headers for proper HTML rendering
        const headers = {
          ...corsHeaders,
          'Content-Type': mimeType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
        };

        // Add Content-Disposition for HTML files to ensure proper rendering
        if (mimeType.includes('text/html')) {
          headers['Content-Disposition'] = 'inline; filename="' + filePath.split('/').pop() + '"';
          headers['X-Frame-Options'] = 'ALLOWALL';
          // Remove CSP that might block iframe loading
        }

        console.log(`📋 Response headers:`, Object.keys(headers));
        return new Response(arrayBuffer, { headers });
      } else {
        console.log(`❌ Not found at: ${storagePath} (${fileError?.message || 'no error details'})`);
      }
    }

    // If we get here, file was not found in any location
    console.error(`❌ File not found in any location: ${filePath}`);
    console.error(`📋 Searched paths:`, storagePaths);
    
    return new Response(`SCORM Content File Not Found: ${filePath}\n\nSearched in:\n${storagePaths.join('\n')}`, { 
      status: 404, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
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