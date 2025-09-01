// functions/scorm-extract-package/index.ts
// Deno Deploy / Supabase Edge Function
// Purpose: Extract a SCORM zip into public storage so the content proxy can serve launch files.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";
import { ZipReader } from "https://deno.land/std@0.224.0/archive/zip/reader.ts";
import { readAll } from "https://deno.land/std@0.224.0/io/read_all.ts";

// -------- CORS --------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// -------- MIME MAP (extend as needed) --------
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".txt": "text/plain; charset=utf-8",
};

// -------- Helpers --------
function extname(path: string): string {
  const i = path.lastIndexOf(".");
  return i >= 0 ? path.slice(i).toLowerCase() : "";
}

function contentTypeFor(path: string): string {
  return MIME[extname(path)] ?? "application/octet-stream";
}

function sanitizePath(p: string): string {
  // prevent ../ traversal or leading slashes
  return p.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\.\.+/g, ".");
}

async function streamToUint8Array(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}

// -------- Edge Function --------
serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    const body = await req.json().catch(() => ({}));

    const {
      packageId,
      // Source zip location
      zipBucket = "scorm-lessons",
      zipPath,
      // Target public bucket for extracted files
      targetBucket = "scorm-unpacked",
      // Whether to wipe existing extracted content for this package first
      clean = true,
    } = body as {
      packageId: string;
      zipBucket?: string;
      zipPath: string;
      targetBucket?: string;
      clean?: boolean;
    };

    if (!packageId || !zipPath) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: packageId, zipPath" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const extractPrefix = `scorm-unpacked/${packageId}/`; // stored in extract_path

    // 1) Download ZIP from Storage
    const dl = await supabase.storage.from(zipBucket).download(zipPath);
    if (dl.error) {
      throw new Error(`Download failed from bucket "${zipBucket}" at "${zipPath}": ${dl.error.message}`);
    }
    const zipBytes = await streamToUint8Array(dl.data.stream());

    // 2) Optionally clean existing extracted content
    if (clean) {
      await supabase.storage.from(targetBucket).remove([extractPrefix]); // ignore error; folder delete is recursive
    }

    // 3) Parse ZIP
    const reader = new ZipReader(new Deno.Buffer(zipBytes));
    const entries = await reader.entries();
    if (!entries || entries.length === 0) {
      throw new Error("Zip archive has no entries.");
    }

    let filesWritten = 0;
    let bytesWritten = 0;
    const skipped: string[] = [];

    // 4) Upload each file to storage (preserve structure)
    for (const entry of entries) {
      // Skip directories
      if (entry.isDirectory) continue;

      const rawName = entry.filename;
      const safeRelPath = sanitizePath(rawName);
      if (!safeRelPath || safeRelPath.endsWith("/")) continue; // skip weird names

      // Read file content
      const fileReader = await reader.getReader(entry);
      if (!fileReader) {
        skipped.push(rawName);
        continue;
      }
      const fileBytes = await readAll(fileReader);

      const storagePath = `${extractPrefix}${safeRelPath}`;
      const ct = contentTypeFor(storagePath);

      const up = await supabase.storage
        .from(targetBucket)
        .upload(storagePath, new Blob([fileBytes], { type: ct }), {
          upsert: true,
          contentType: ct,
        });

      if (up.error) {
        skipped.push(rawName + " :: " + up.error.message);
      } else {
        filesWritten++;
        bytesWritten += fileBytes.byteLength;
      }
    }

    // 5) Update DB: package extract path + status
    const { error: upErr } = await supabase
      .from("scorm_packages")
      .update({
        extract_path: extractPrefix,
        status: "ready",
        metadata: {
          ...(body.metadata ?? {}),
          extracted_at: new Date().toISOString(),
          source: `${zipBucket}/${zipPath}`,
          targetBucket,
          filesWritten,
          bytesWritten,
          skippedCount: skipped.length,
        },
      })
      .eq("id", packageId);

    if (upErr) throw upErr;

    return new Response(
      JSON.stringify({
        success: true,
        packageId,
        extractPath: extractPrefix,
        targetBucket,
        filesWritten,
        bytesWritten,
        skipped,
        message: "SCORM zip extracted successfully.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("[scorm-extract-package] ERROR:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error", stack: err?.stack }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});