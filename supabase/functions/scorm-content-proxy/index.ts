import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml":  "application/xml; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".mp3":  "audio/mpeg",
  ".mp4":  "video/mp4",
  ".wav":  "audio/wav",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".eot":  "application/vnd.ms-fontobject",
  ".pdf":  "application/pdf",
  ".swf":  "application/x-shockwave-flash",
};

function getFileExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  return lastDot >= 0 ? path.slice(lastDot).toLowerCase() : "";
}

function getMimeType(path: string): string {
  return MIME_TYPES[getFileExtension(path)] || "application/octet-stream";
}

function getCSPHeader(): string {
  // CSP for SCORM content - allows iframe embedding and necessary permissions
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "connect-src 'self'", 
    "object-src 'none'",
    "frame-ancestors 'self' *", // Allow iframe embedding
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ");
}

function normalizePath(path: string): string {
  // Prevent path traversal and normalize
  if (!path || path.includes('..')) return 'content/index.html';
  let p = path.replace(/^\/+/, '');
  if (p.endsWith('/')) p += 'index.html';
  if (!p) p = 'content/index.html';
  return p;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`SCORM Content Proxy Request: ${req.method} ${req.url}`);

  try {
    // Use ANON_KEY for reads - more appropriate for content serving
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') || ''
          }
        }
      }
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    console.log(`🔍 URL Analysis:`, {
      pathname: url.pathname,
      pathParts,
      query: url.search
    });
    
    // Parse URL pattern: /scorm-content-proxy/{packageId}/{filePath}
    let packageId = '';
    let filePath = '';
    
    // Find the package ID (UUID format) in the path
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const packageIndex = pathParts.findIndex(part => uuidRegex.test(part));
    
    if (packageIndex !== -1) {
      packageId = pathParts[packageIndex];
      filePath = normalizePath(decodeURIComponent(pathParts.slice(packageIndex + 1).join('/')));
    } else {
      console.error('❌ Package ID not found in path:', pathParts);
      return new Response(`Bad Request: Missing packageId in path`, {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    console.log(`📦 Package ID: ${packageId}`);
    console.log(`📄 Requested file: ${filePath}`);

    // Get package metadata to find extract path
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

    // Build storage path using scorm-unpacked structure
    const objectPath = `scorm-unpacked/${packageId}/${filePath}`;
    
    console.log(`🔍 Trying storage path: ${objectPath}`);

    const { data: fileData, error: fileError } = await supabase.storage
      .from('scorm-packages')
      .download(objectPath);

    if (fileError || !fileData) {
      console.error(`❌ File not found: ${objectPath}`, fileError);
      return new Response(`Not Found: ${filePath}`, {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    console.log(`✅ File found at: ${objectPath}`);
    
    // Get the correct MIME type
    const contentType = getMimeType(filePath);
    
    // Stream the raw file bytes
    const arrayBuffer = await fileData.arrayBuffer();
    
    console.log(`📤 Serving ${filePath} as ${contentType}, size: ${arrayBuffer.byteLength} bytes`);

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Content-Security-Policy": getCSPHeader(),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=600",
        "Accept-Ranges": "bytes",
        "X-SCORM-Proxy": "v3.0",
        "X-Package-ID": packageId,
        "X-File-Path": filePath,
      },
    });

  } catch (error) {
    console.error('SCORM Content Proxy Error:', error);
    return new Response(`Proxy error: ${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});