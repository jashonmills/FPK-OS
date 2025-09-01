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
      // Use SERVICE_ROLE_KEY to access private buckets
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
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

    // Get package info for proper path resolution including computed launch
    const { data: packageData } = await supabase
      .from('scorm_packages')
      .select('extract_path, status, metadata')
      .eq('id', packageId)
      .single();

    console.log(`🔍 Proxy request: pkg=${packageId}, path=${path}, extract_path=${packageData?.extract_path}`);

    // Smart path resolution: use computed launch from metadata if available
    let resolvedPath = path;
    const computedLaunch = packageData?.metadata?.computed_launch;
    
    // If requesting a generic path but we have a computed launch, use that instead
    if (computedLaunch && (path === 'content/index.html' || path === 'index.html')) {
      resolvedPath = computedLaunch;
      console.log(`🎯 Using computed launch path: ${resolvedPath} instead of ${path}`);
    }

    // Build intelligent path attempts based on package structure
    const basePath = packageData?.extract_path || `packages/${packageId}/`;
    const pathsToTry = [
      // Try exact computed launch path first
      computedLaunch ? `${basePath}${computedLaunch}` : null,
      // Try the resolved path
      `${basePath}${resolvedPath}`,
      // Fallback patterns for compatibility
      `packages/${packageId}/${resolvedPath}`,
      `packages/${packageId}/content/${resolvedPath}`,
      `scorm-unpacked/${packageId}/${resolvedPath}`, // Legacy path
    ].filter(Boolean).map(p => p.replace(/\/+/g, '/'));

    console.log(`📂 Trying paths:`, pathsToTry);

    let data, error, objectPath;

    // Try each path until we find the file
    for (const tryPath of pathsToTry) {
      const result = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(tryPath);
      
      if (!result.error && result.data) {
        data = result.data;
        error = null;
        objectPath = tryPath;
        console.log(`✅ Found file at: ${tryPath}`);
        break;
      } else {
        console.log(`❌ Not found at: ${tryPath} - ${result.error?.message}`);
      }
    }

    // If still not found, try to trigger content generation
    if (error || !data) {
      console.log(`🔄 File not found, attempting content generation for package ${packageId}`);
      
      try {
        const generateResult = await supabase.functions.invoke('scorm-generate-content', {
          body: { packageId }
        });
        
        if (generateResult.error) {
          console.error('❌ Content generation failed:', generateResult.error);
        } else {
          console.log('✅ Content generation triggered, retrying download...');
          
          // Retry the first successful path pattern after generation
          for (const tryPath of pathsToTry) {
            const retryResult = await supabase.storage
              .from(STORAGE_BUCKET)
              .download(tryPath);
            
            if (!retryResult.error && retryResult.data) {
              data = retryResult.data;
              error = null;
              objectPath = tryPath;
              console.log(`✅ Found file after generation at: ${tryPath}`);
              break;
            }
          }
        }
      } catch (genError) {
        console.error('❌ Generation error:', genError);
      }
    }

    if (error || !data) {
      console.error(`❌ Final error: File not found after all attempts`);
      return new Response(
        JSON.stringify({
          error: "Content not available",
          details: `Tried paths: ${pathsToTry.join(', ')}`,
          packageId,
          requestedPath: path,
          suggestion: "Content may need to be generated or re-uploaded"
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