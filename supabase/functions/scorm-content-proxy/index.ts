// Deno Deploy / Supabase Edge Function
// Streams SCORM assets from Storage with the CORRECT Content-Type + headers.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".mp4":  "video/mp4",
  ".mp3":  "audio/mpeg",
  ".wav":  "audio/wav",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
};

function getContentType(filepath: string): string {
  const ext = filepath.substring(filepath.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { ...cors } });
  }

  try {
    // Expect ?pkg=<folder> & path=<relative-file-path>
    const url = new URL(req.url);
    const pkg = url.searchParams.get("pkg")?.trim();
    const path = url.searchParams.get("path")?.replace(/^\/+/, "");

    if (!pkg || !path) {
      return new Response(
        JSON.stringify({ error: "Missing pkg or path" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Use the existing bucket and path structure from your system
    // Based on the logs, files are stored in scorm-packages bucket
    // with paths like: packages/<packageId>/<path>
    const BUCKET = "scorm-packages";
    const KEY = `packages/${pkg}/${path}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const { data, error } = await supabase.storage.from(BUCKET).download(KEY);
    if (error || !data) {
      console.error(`File not found: ${KEY}`, error);
      return new Response(
        JSON.stringify({ 
          error: "File not found", 
          detail: { 
            bucket: BUCKET, 
            key: KEY, 
            message: error?.message || "File does not exist" 
          } 
        }),
        { status: 404, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Get the correct MIME type based on file extension
    const contentType = getContentType(path);
    console.log(`Serving ${path} as ${contentType}`);

    // Stream the raw file content with correct MIME type
    const fileBuffer = await data.arrayBuffer();
    
    const filename = path.split("/").pop() || "file";
    
    return new Response(fileBuffer, {
      headers: {
        ...cors,
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
        // Very permissive CSP for SCORM content - allows everything needed for interactive content
        "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src *; connect-src *; media-src *; frame-src *; frame-ancestors *;",
        // Additional headers for SCORM compatibility
        "X-Frame-Options": "ALLOWALL",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Proxy failure", detail: String(e) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});