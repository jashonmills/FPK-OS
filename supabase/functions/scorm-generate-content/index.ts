import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const APP_ORIGIN = Deno.env.get("APP_ORIGIN") ?? "*";
const STORAGE_BUCKET = "scorm-packages";

const cors = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Vary": "Origin",
};

function guessMime(path: string): string {
  const p = path.toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html; charset=utf-8";
  if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript; charset=utf-8";
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

serve(async (req) => {
  // Health check endpoint
  if (new URL(req.url).searchParams.get('health') === '1') {
    return new Response('OK: generate-content', { 
      status: 200, 
      headers: { ...cors, "Content-Type": "text/plain" }
    });
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { ...cors } });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? "",
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "" // service key to read/write Storage
    );

    const { packageId, zipPath } = await req.json();
    if (!packageId) {
      return new Response(JSON.stringify({ error: 'packageId required' }), { 
        status: 400, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Get package info from database
    const { data: pkg, error: pkgErr } = await supabase
      .from('scorm_packages')
      .select('id, extract_path, metadata, zip_path')
      .eq('id', packageId)
      .single();
    
    if (pkgErr || !pkg) {
      return new Response(JSON.stringify({ error: 'Package not found' }), { 
        status: 404, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Use provided zipPath or fall back to package zip_path
    const actualZipPath = zipPath || pkg.zip_path;
    if (!actualZipPath) {
      return new Response(JSON.stringify({ error: 'No zip path available' }), { 
        status: 400, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Check if content already exists in expected location
    const expectedPath = `packages/${packageId}`;
    const manifestPath = `${expectedPath}/imsmanifest.xml`;
    
    console.log(`🔍 Checking for existing content at: ${manifestPath}`);
    
    const { data: existingManifest } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(manifestPath);
    
    if (existingManifest) {
      // Content already exists, just parse and return launch info
      console.log(`✅ Content already exists, parsing manifest`);
      const xml = await existingManifest.text();
      const launchHref = parseManifestForLaunch(xml);
      
      // Update database with correct extract path
      await supabase.from('scorm_packages')
        .update({ 
          extract_path: `${expectedPath}/`,
          status: 'ready'
        })
        .eq('id', packageId);
      
      return new Response(JSON.stringify({
        success: true,
        packageId,
        alreadyExtracted: true,
        launchHref: launchHref || 'content/index.html',
        message: 'Content already exists'
      }), { 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Download the ZIP file
    console.log(`📦 Downloading ZIP file: ${actualZipPath}`);
    const { data: zipBlob, error: zipErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(actualZipPath);
    
    if (zipErr || !zipBlob) {
      return new Response(JSON.stringify({ 
        error: 'Zip file not found', 
        details: zipErr?.message,
        zipPath: actualZipPath
      }), { 
        status: 404, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Extract ZIP using modern Web APIs
    console.log(`📦 Extracting ZIP content...`);
    const zipBytes = new Uint8Array(await zipBlob.arrayBuffer());
    
    // Validate ZIP format first
    if (zipBytes.length < 22) {
      return new Response(JSON.stringify({ 
        error: 'Invalid ZIP file - too small' 
      }), {
        status: 400, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }
    
    // Use fflate for ZIP extraction - correct synchronous API
    const { unzipSync } = await import("https://esm.sh/fflate@0.8.2");
    
    let extractedFiles: { [key: string]: Uint8Array };
    try {
      extractedFiles = unzipSync(zipBytes);
      console.log(`✅ Extracted ${Object.keys(extractedFiles).length} files from ZIP`);
      
      // Validate we have files
      if (Object.keys(extractedFiles).length === 0) {
        throw new Error('No files found in ZIP archive');
      }
    } catch (error) {
      console.error(`❌ ZIP extraction failed:`, error);
      return new Response(JSON.stringify({ 
        error: 'ZIP extraction failed', 
        details: String(error) 
      }), {
        status: 400, 
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Upload all extracted files to Storage
    let fileCount = 0;
    let manifestContent = '';
    
    console.log(`📤 Uploading ${Object.keys(extractedFiles).length} files to storage...`);
    
    for (const [filePath, fileBytes] of Object.entries(extractedFiles)) {
      try {
        // Skip directory entries and __MACOSX files
        if (filePath.endsWith('/') || filePath.includes('__MACOSX/')) {
          continue;
        }
        
        const storagePath = `${expectedPath}/${filePath}`;
        console.log(`📁 Uploading: ${storagePath}`);
        
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, fileBytes, { 
            upsert: true, 
            contentType: guessMime(filePath) 
          });
        
        if (uploadError) {
          console.error(`❌ Failed to upload ${filePath}:`, uploadError);
          continue; // Continue with other files
        }
        
        fileCount++;
        
        // Capture manifest content
        if (filePath.toLowerCase().endsWith('imsmanifest.xml')) {
          manifestContent = new TextDecoder().decode(fileBytes);
          console.log(`📋 Found manifest file: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error processing file ${filePath}:`, error);
        continue; // Continue with other files
      }
    }

    // Parse manifest for launch information
    let launchHref = 'content/index.html'; // default fallback
    if (manifestContent) {
      const parsedLaunch = parseManifestForLaunch(manifestContent);
      if (parsedLaunch) {
        launchHref = parsedLaunch;
      }
    }

    // Update package metadata with correct extract path
    console.log(`📝 Updating package metadata: ${fileCount} files extracted`);
    await supabase.from('scorm_packages')
      .update({ 
        extract_path: `${expectedPath}/`,
        metadata: { 
          ...pkg.metadata, 
          computed_launch: launchHref, 
          extracted_at: new Date().toISOString(),
          files_extracted: fileCount
        },
        status: 'ready'
      })
      .eq('id', packageId);

    return new Response(JSON.stringify({
      success: true,
      packageId,
      filesExtracted: fileCount,
      launchHref,
      extractPath: expectedPath
    }), { 
      headers: { ...cors, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error('Generation error:', e);
    return new Response(JSON.stringify({ 
      error: 'Generation failed', 
      details: String(e) 
    }), {
      status: 500, 
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }
});

// Enhanced manifest parsing with better error handling
function parseManifestForLaunch(xml: string): string | null {
  try {
    console.log(`🔍 Parsing manifest for launch file...`);
    
    // Find default organization
    const defaultOrgMatch = /<organizations[^>]*\bdefault="([^"]+)"/i.exec(xml);
    if (!defaultOrgMatch) {
      console.log(`❌ No default organization found in manifest`);
      return null;
    }
    
    const defaultOrg = defaultOrgMatch[1];
    console.log(`📋 Found default organization: ${defaultOrg}`);
    
    // Find the organization block
    const orgRegex = new RegExp(`<organization[^>]*identifier="${defaultOrg}"[\\s\\S]*?<\\/organization>`, 'i');
    const orgMatch = orgRegex.exec(xml);
    if (!orgMatch) {
      console.log(`❌ Organization block not found for: ${defaultOrg}`);
      return null;
    }
    
    // Find first item with identifierref
    const itemMatch = /<item[^>]*identifierref="([^"]+)"/i.exec(orgMatch[0]);
    if (!itemMatch) {
      console.log(`❌ No item with identifierref found`);
      return null;
    }
    
    const resourceId = itemMatch[1];
    console.log(`🎯 Found resource ID: ${resourceId}`);
    
    // Find resource with that identifier
    const resourceRegex = new RegExp(`<resource[^>]*identifier="${resourceId}"[^>]*href="([^"]+)"`, 'i');
    const resourceMatch = resourceRegex.exec(xml);
    
    if (resourceMatch) {
      console.log(`🚀 Found launch file: ${resourceMatch[1]}`);
      return resourceMatch[1];
    } else {
      console.log(`❌ Resource not found for ID: ${resourceId}`);
      return null;
    }
  } catch (e) {
    console.error('❌ Error parsing manifest:', e);
    return null;
  }
}
