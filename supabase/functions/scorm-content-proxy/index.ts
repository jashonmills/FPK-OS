import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const APP_ORIGIN = Deno.env.get("APP_ORIGIN") ?? "*";
const STORAGE_BUCKET = "scorm-packages";

const cors = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Vary": "Origin",
};

const security = {
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
};

function guessMime(path: string): string {
  const p = path.toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html; charset=utf-8";
  if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".mjs")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".css")) return "text/css; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".gif")) return "image/gif";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".woff")) return "font/woff";
  if (p.endsWith(".woff2")) return "font/woff2";
  if (p.endsWith(".mp4")) return "video/mp4";
  if (p.endsWith(".mp3")) return "audio/mpeg";
  if (p.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { ...cors } });
  }

  try {
    const url = new URL(req.url);
    if (url.searchParams.get("health") === "1") {
      return new Response("OK: proxy", {
        status: 200,
        headers: { ...cors, ...security, "Content-Type": "text/plain" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const packageId = url.searchParams.get("pkg") ?? "";
    const path = url.searchParams.get("path") ?? "";
    if (!packageId || !path) {
      return new Response(JSON.stringify({ error: "Missing pkg or path" }), {
        status: 400,
        headers: { ...cors, ...security, "Content-Type": "application/json" },
      });
    }

    // Prevent path traversal
    if (path.includes("..") || path.startsWith("/")) {
      return new Response(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: { ...cors, ...security, "Content-Type": "application/json" },
      });
    }

    // Your extraction layout: scorm-unpacked/<pkgId>/content/...
    const objectPath = `scorm-unpacked/${packageId}/${path}`.replace(/\/+/g, '/');

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(objectPath);

    if (error || !data) {
      return new Response(
        JSON.stringify({
          error: "Not found",
          details: error?.message,
          objectPath,
        }),
        {
          status: 404,
          headers: { ...cors, ...security, "Content-Type": "application/json" },
        }
      );
    }

    // Build response
    const contentType = guessMime(objectPath);
    const body = await data.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        ...cors,
        ...security,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, ...security, "Content-Type": "application/json" },
    });
  }
});