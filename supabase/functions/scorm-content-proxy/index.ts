import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BUCKET = 'scorm-packages';

function normalizePath(path: string): string {
  if (!path || path.includes('..')) return '';
  let p = path.replace(/^\/+/, '');
  if (p.endsWith('/')) p += 'index.html';
  return p;
}

function mime(p: string): string {
  p = p.toLowerCase();
  if (p.endsWith('.html') || p.endsWith('.htm')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.json')) return 'application/json; charset=utf-8';
  if (p.endsWith('.xml') || p.endsWith('.manifest')) return 'application/xml; charset=utf-8';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.gif')) return 'image/gif';
  if (p.endsWith('.woff2')) return 'font/woff2';
  if (p.endsWith('.mp4')) return 'video/mp4';
  if (p.endsWith('.mp3')) return 'audio/mpeg';
  return 'application/octet-stream';
}

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests"
].join('; ');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }

  try {
    const url = new URL(req.url);
    
    // Log the incoming request for debugging
    console.log('SCORM Proxy Request:', {
      method: req.method,
      url: req.url,
      pathname: url.pathname,
      search: url.search,
      searchParams: Object.fromEntries(url.searchParams)
    });

    let pkg = '';
    let rawPath = '';

    // Method 1: Query parameters (?pkg=...&path=...)
    const queryPkg = url.searchParams.get('pkg');
    const queryPath = url.searchParams.get('path');
    
    if (queryPkg && queryPath) {
      pkg = queryPkg;
      rawPath = queryPath;
      console.log('Using query parameter format:', { pkg, rawPath });
    } else {
      // Method 2: Path-based format (/packageId/filepath)
      // Remove leading /functions/v1/scorm-content-proxy/ or similar
      const cleanPath = url.pathname.replace(/^.*\/scorm-content-proxy\/?/, '');
      const pathParts = cleanPath.split('/');
      
      if (pathParts.length >= 2) {
        pkg = pathParts[0];
        rawPath = pathParts.slice(1).join('/');
        console.log('Using path-based format:', { pkg, rawPath, cleanPath, pathParts });
      }
    }

    const path = normalizePath(rawPath);
    
    console.log('Parsed request:', { pkg, rawPath, normalizedPath: path });
    
    if (!pkg || !path) {
      const error = `Bad Request: Missing package ID or path. pkg="${pkg}", path="${path}"`;
      console.error(error);
      return new Response(error, { status: 400 });
    }

    const objectPath = `scorm-unpacked/${pkg}/${path}`.replace(/\/+/g, '/');
    console.log('Attempting to download:', objectPath);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!, // reads only
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    );

    const { data, error } = await supabase.storage.from(BUCKET).download(objectPath);
    
    if (error || !data) {
      const errorMsg = `Not Found: ${objectPath} (Error: ${error?.message || 'No data'})`;
      console.error(errorMsg);
      return new Response(errorMsg, { status: 404 });
    }

    const buf = await data.arrayBuffer();
    const contentType = mime(path);
    
    console.log('Successfully serving file:', { 
      objectPath, 
      contentType, 
      size: buf.byteLength 
    });

    return new Response(buf, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=600',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': CSP,
        'Access-Control-Allow-Origin': url.origin
      }
    });
  } catch (e) {
    const errorMsg = `Proxy error: ${e.message}`;
    console.error(errorMsg, e);
    return new Response(errorMsg, { status: 500 });
  }
});