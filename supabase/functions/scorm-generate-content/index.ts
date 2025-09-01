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
    
    const { data: existingManifest } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(manifestPath);
    
    if (existingManifest) {
      // Content already exists, just parse and return launch info
      const xml = await existingManifest.text();
      const launchHref = parseManifestForLaunch(xml);
      
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

    // Create temporary file for unzipping
    const zipBytes = new Uint8Array(await zipBlob.arrayBuffer());
    const tempDir = await Deno.makeTempDir();
    const zipFile = `${tempDir}/package.zip`;
    await Deno.writeFile(zipFile, zipBytes);

    // Import unzip dynamically to avoid import issues
    const { decompress } = await import("https://deno.land/x/zip@v1.2.5/mod.ts");
    
    // Unzip to temp directory
    await decompress(zipFile, tempDir);

    // Upload all extracted files to Storage
    let fileCount = 0;
    let manifestContent = '';
    
    for await (const entry of Deno.readDir(tempDir)) {
      if (entry.isFile && entry.name !== 'package.zip') {
        await processFile(tempDir, entry.name, expectedPath, supabase, '');
        fileCount++;
        
        if (entry.name === 'imsmanifest.xml') {
          manifestContent = await Deno.readTextFile(`${tempDir}/${entry.name}`);
        }
      } else if (entry.isDirectory) {
        const subFileCount = await processDirectory(tempDir, entry.name, expectedPath, supabase);
        fileCount += subFileCount;
      }
    }

    // Clean up temp directory
    await Deno.remove(tempDir, { recursive: true });

    // Parse manifest for launch information
    let launchHref = 'content/index.html'; // default fallback
    if (manifestContent) {
      const parsedLaunch = parseManifestForLaunch(manifestContent);
      if (parsedLaunch) {
        launchHref = parsedLaunch;
      }
    }

    // Update package metadata
    await supabase.from('scorm_packages')
      .update({ 
        extract_path: expectedPath,
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

// Helper function to process individual files
async function processFile(baseDir: string, fileName: string, targetPath: string, supabase: any, subPath: string) {
  const fullFileName = subPath ? `${subPath}/${fileName}` : fileName;
  const fileBytes = await Deno.readFile(`${baseDir}/${fullFileName}`);
  const storagePath = `${targetPath}/${fullFileName}`;
  
  await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBytes, { 
      upsert: true, 
      contentType: guessMime(fileName) 
    });
}

// Helper function to process directories recursively
async function processDirectory(baseDir: string, dirName: string, targetPath: string, supabase: any): Promise<number> {
  let fileCount = 0;
  const dirPath = `${baseDir}/${dirName}`;
  
  for await (const entry of Deno.readDir(dirPath)) {
    if (entry.isFile) {
      await processFile(baseDir, entry.name, targetPath, supabase, dirName);
      fileCount++;
    } else if (entry.isDirectory) {
      const subFileCount = await processSubDirectory(dirPath, entry.name, targetPath, supabase, dirName);
      fileCount += subFileCount;
    }
  }
  
  return fileCount;
}

// Helper function for nested directories
async function processSubDirectory(parentDir: string, dirName: string, targetPath: string, supabase: any, parentPath: string): Promise<number> {
  let fileCount = 0;
  const dirPath = `${parentDir}/${dirName}`;
  const fullDirPath = `${parentPath}/${dirName}`;
  
  for await (const entry of Deno.readDir(dirPath)) {
    if (entry.isFile) {
      const fileBytes = await Deno.readFile(`${dirPath}/${entry.name}`);
      const storagePath = `${targetPath}/${fullDirPath}/${entry.name}`;
      
      await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, fileBytes, { 
          upsert: true, 
          contentType: guessMime(entry.name) 
        });
      fileCount++;
    } else if (entry.isDirectory) {
      const subFileCount = await processSubDirectory(dirPath, entry.name, targetPath, supabase, fullDirPath);
      fileCount += subFileCount;
    }
  }
  
  return fileCount;
}

// Helper function to parse manifest and find launch file
function parseManifestForLaunch(xml: string): string | null {
  try {
    // Find default organization
    const defaultOrgMatch = /<organizations[^>]*\bdefault="([^"]+)"/i.exec(xml);
    if (!defaultOrgMatch) return null;
    
    const defaultOrg = defaultOrgMatch[1];
    
    // Find the organization block
    const orgRegex = new RegExp(`<organization[^>]*identifier="${defaultOrg}"[\\s\\S]*?<\\/organization>`, 'i');
    const orgMatch = orgRegex.exec(xml);
    if (!orgMatch) return null;
    
    // Find first item with identifierref
    const itemMatch = /<item[^>]*identifierref="([^"]+)"/i.exec(orgMatch[0]);
    if (!itemMatch) return null;
    
    const resourceId = itemMatch[1];
    
    // Find resource with that identifier
    const resourceRegex = new RegExp(`<resource[^>]*identifier="${resourceId}"[^>]*href="([^"]+)"`, 'i');
    const resourceMatch = resourceRegex.exec(xml);
    
    return resourceMatch ? resourceMatch[1] : null;
  } catch (e) {
    console.error('Error parsing manifest:', e);
    return null;
  }
}