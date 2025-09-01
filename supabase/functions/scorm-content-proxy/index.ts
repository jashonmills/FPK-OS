// Deno Edge Function
// GET /scorm-content-proxy?pkg=<packageId>&path=<relative/path/inside/package>
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUCKETS = ["scorm-unpacked", "scorm-packages", "scorm-lessons", "scorm-content"]; // try in this order

function mimeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
    case "htm":
      return "text/html; charset=utf-8";
    case "js":
      return "application/javascript; charset=utf-8";
    case "css":
      return "text/css; charset=utf-8";
    case "json":
      return "application/json; charset=utf-8";
    case "xml":
      return "application/xml; charset=utf-8";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "mp3":
      return "audio/mpeg";
    case "mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  const url = new URL(req.url);
  const pkg = url.searchParams.get("pkg") || "";
  const relPath = url.searchParams.get("path") || "";

  if (!pkg || !relPath) {
    return new Response("Missing pkg or path", { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }

  // Normalize canonical key as packages/<packageId>/<relativePath>
  const key = `packages/${pkg}/${relPath}`.replace(/\/{2,}/g, "/");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Try buckets in order (lets us migrate names without breaking)
  let obj: Blob | null = null;
  let bucketUsed = "";

  for (const bucket of BUCKETS) {
    const { data, error } = await supabase.storage.from(bucket).download(key);
    if (!error && data) {
      obj = data;
      bucketUsed = bucket;
      console.log(`SCORM proxy found file in bucket: ${bucket}, key: ${key}`);
      break;
    }
  }

  if (!obj) {
    console.error("SCORM proxy 404", { pkg, relPath, key, bucketsChecked: BUCKETS });
    return new Response("Not found", { 
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }

  const body = await obj.arrayBuffer();
  const contentType = mimeFor(relPath);

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=600",
    "X-Content-Type-Options": "nosniff",
    // allow our app to frame it; content is ours
    "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob: *; media-src 'self' blob: *; style-src 'self' 'unsafe-inline' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; frame-ancestors *;",
    "X-Frame-Options": "ALLOWALL",
  });

  return new Response(body, { status: 200, headers });
});