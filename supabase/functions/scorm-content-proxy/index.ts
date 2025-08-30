import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
  // CSP for SCORM content - allows inline scripts/styles that legacy SCOs need
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

serve(async (req) => {
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
    
    // Find the package ID (UUID format) in the path
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const packageIndex = pathParts.findIndex(part => uuidRegex.test(part));
    
    if (packageIndex === -1) {
      console.error('Package ID not found in path:', pathParts);
      return new Response(JSON.stringify({ error: "Missing packageId or path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const packageId = pathParts[packageIndex];
    const filePath = decodeURIComponent(pathParts.slice(packageIndex + 1).join('/')) || 'content/index.html';

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

    // Build storage path - try the extract_path first, then fallback patterns
    const storagePaths = [
      `${packageData.extract_path}${filePath}`.replace(/\/+/g, "/"),
      `${packageData.extract_path}/${filePath}`.replace(/\/+/g, "/"),
      `packages/${packageId}/${filePath}`.replace(/\/+/g, "/"),
      filePath
    ];

    console.log(`🔍 Trying ${storagePaths.length} storage paths...`);

    for (const storagePath of storagePaths) {
      console.log(`📁 Trying: ${storagePath}`);
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('scorm-packages')
        .download(storagePath);

      if (!fileError && fileData) {
        console.log(`✅ File found at: ${storagePath}`);
        
        // Get the correct MIME type
        const contentType = getMimeType(filePath);
        
        // Stream the raw file bytes - NO escaping or JSON stringification
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
            "X-Frame-Options": "ALLOWALL",
          },
        });
      } else {
        console.log(`❌ Not found at: ${storagePath}`);
      }
    }

    console.error(`❌ File not found: ${filePath}`);
    return new Response(`Not found: ${filePath}`, {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    console.error('SCORM Content Proxy Error:', error);
    return new Response(JSON.stringify({ error: "Proxy error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});