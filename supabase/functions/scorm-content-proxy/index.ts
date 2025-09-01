// Deno Deploy / Supabase Edge Function
// Streams SCORM assets from Storage with the CORRECT Content-Type + headers.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIME: Record<string, string> = {
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
};

function extname(path: string) {
  const i = path.lastIndexOf(".");
  return i >= 0 ? path.slice(i).toLowerCase() : "";
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

    // Adjust bucket/path to WHERE your extracted files actually live.
    // Suggested layout after extraction:
    // bucket: scorm-public
    // key: lessons/<pkg>/<path>
    const BUCKET = "scorm-public";
    const KEY = `lessons/${pkg}/${path}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const { data, error } = await supabase.storage.from(BUCKET).download(KEY);
    if (error || !data) {
      // Helpful diagnostics in the response for admins/dev tools
      return new Response(
        JSON.stringify({ error: "Not Found", detail: { bucket: BUCKET, key: KEY, supabase: error?.message } }),
        { status: 404, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // DO NOT stringify/escape; stream as bytes with correct type
    const bytes = await data.arrayBuffer();
    const ext = extname(path);
    const type = MIME[ext] ?? "application/octet-stream";

    return new Response(bytes, {
      headers: {
        ...cors,
        "Content-Type": type,
        "Content-Disposition": `inline; filename="${encodeURIComponent(path.split("/").pop() || "file")}"`,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
        // Allow SCORM JS to run in iframe
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'self';",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Proxy failure", detail: String(e) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});