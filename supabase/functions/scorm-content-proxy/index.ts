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
  // Health check endpoint
  if (new URL(req.url).searchParams.get('health') === '1') {
    return new Response('OK: proxy', { status: 200 });
  }

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
    const pkg = url.searchParams.get('pkg');
    const rawPath = url.searchParams.get('path') || '';
    const path = normalizePath(rawPath);
    if (!pkg || !path) return new Response('Bad Request', { status: 400 });

    const objectPath = `scorm-unpacked/${pkg}/${path}`.replace(/\/+/g, '/');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!, // reads only
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    );

    const { data, error } = await supabase.storage.from(BUCKET).download(objectPath);
    if (error || !data) return new Response(`Not Found: ${objectPath}`, { status: 404 });

    const buf = await data.arrayBuffer();
    return new Response(buf, {
      headers: {
        'Content-Type': mime(path),
        'Cache-Control': 'public, max-age=600',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': CSP,
        'Access-Control-Allow-Origin': url.origin
      }
    });
  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, { status: 500 });
  }
});