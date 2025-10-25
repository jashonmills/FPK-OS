// Deno Edge Function
// GET /scorm-content-proxy?pkg=<packageId>&path=<relative/path/inside/package>
// Serves SCORM content files directly from ZIP archives on-demand
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "https://esm.sh/jszip@3.10.1";

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

  console.log(`📦 SCORM Proxy Request - Package: ${pkg}, Path: ${relPath}`);

  if (!pkg || !relPath) {
    return new Response("Missing pkg or path parameters", { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain"
      }
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Step 1: Get package info from database to find ZIP path
    const { data: packageData, error: dbError } = await supabase
      .from('scorm_packages')
      .select('zip_path, title')
      .eq('id', pkg)
      .single();

    if (dbError || !packageData?.zip_path) {
      console.error('❌ Package not found:', pkg, dbError);
      return new Response(`Package not found: ${pkg}`, { 
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain"
        }
      });
    }

    console.log(`✅ Found package: ${packageData.title}, ZIP: ${packageData.zip_path}`);

    // Step 2: Download ZIP from storage
    const { data: zipBlob, error: downloadError } = await supabase
      .storage
      .from('scorm-packages')
      .download(packageData.zip_path);

    if (downloadError || !zipBlob) {
      console.error('❌ Failed to download ZIP:', downloadError);
      return new Response(`Failed to download package ZIP: ${downloadError?.message}`, { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain"
        }
      });
    }

    console.log(`✅ Downloaded ZIP (${zipBlob.size} bytes)`);

    // Step 3: Extract requested file from ZIP
    const zip = await JSZip.loadAsync(zipBlob);
    
    // Find the file (case-insensitive search)
    let targetFile = null;
    const fileNames = Object.keys(zip.files);
    
    for (const fileName of fileNames) {
      // Remove leading slash and compare paths
      const normalizedFileName = fileName.replace(/^\/+/, '');
      const normalizedRelPath = relPath.replace(/^\/+/, '');
      
      if (normalizedFileName.toLowerCase() === normalizedRelPath.toLowerCase()) {
        targetFile = zip.files[fileName];
        console.log(`✅ Found file in ZIP: ${fileName}`);
        break;
      }
    }

    if (!targetFile) {
      console.error('❌ File not found in ZIP:', relPath);
      console.log('📁 Available files:', fileNames.slice(0, 10).join(', '));
      
      return new Response(
        `File not found in package: ${relPath}\n\nAvailable files:\n${fileNames.slice(0, 20).join('\n')}`,
        { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/plain"
          }
        }
      );
    }

    // Step 4: Extract and serve the file
    const fileData = await targetFile.async('uint8array');
    const mimeType = mimeFor(relPath);
    
    console.log(`✅ Serving file: ${relPath} (${fileData.length} bytes, ${mimeType})`);

    return new Response(fileData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN"
      }
    });

});
