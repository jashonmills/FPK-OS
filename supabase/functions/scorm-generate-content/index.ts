import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const BUCKET = 'scorm-packages';

function htmlRedirect(to: string) {
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url='${to}'"><script>location.replace(${JSON.stringify(to)});</script>Launching…`;
}
function ct(path: string) { return path.toLowerCase().endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8'; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,OPTIONS' } });

  try {
    const { packageId } = await req.json();
    if (!packageId) return new Response(JSON.stringify({ error: 'packageId required' }), { status: 400 });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // <- service key
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    );

    const { data: pkg, error: pkgErr } = await supabase
      .from('scorm_packages')
      .select('id, extract_path, metadata')
      .eq('id', packageId)
      .single();
    if (pkgErr || !pkg) throw new Error('Package not found');

    const root = pkg.extract_path || `scorm-unpacked/${packageId}`;
    const manifestPath = `${root}/imsmanifest.xml`;

    const { data: manifestBlob, error: manErr } = await supabase.storage.from(BUCKET).download(manifestPath);
    if (manErr || !manifestBlob) throw new Error(`imsmanifest.xml missing at ${manifestPath}`);

    const xml = await manifestBlob.text();

    // default organization
    const defaultOrg = /<organizations[^>]*\bdefault="([^"]+)"/i.exec(xml)?.[1];
    if (!defaultOrg) throw new Error('No default organization');

    const orgBlock = new RegExp(`<organization[^>]*identifier="${defaultOrg}"[\\s\\S]*?<\\/organization>`, 'i').exec(xml)?.[0] || '';
    const resourceId = /<item[^>]*identifierref="([^"]+)"/i.exec(orgBlock)?.[1];
    if (!resourceId) throw new Error('No launchable item found');

    const href = new RegExp(`<resource[^>]*identifier="${resourceId}"[^>]*href="([^"]+)"`, 'i').exec(xml)?.[1];
    if (!href) throw new Error('No resource href found');

    const launchFull = `${root}/${href}`.replace(/\/+/g, '/');
    const folder = launchFull.replace(/\/[^/]+$/, '');
    const indexPath = `${folder}/index.html`;

    // Ensure launch file exists or create redirect
    const { data: fileBlob } = await supabase.storage.from(BUCKET).download(launchFull);
    if (!fileBlob) {
      const target = `/functions/v1/scorm-content-proxy?pkg=${packageId}&path=${encodeURIComponent(href)}`;
      const html = htmlRedirect(target);
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(indexPath, new Blob([html], { type: 'text/html' }), {
        upsert: true, contentType: 'text/html; charset=utf-8'
      });
      if (upErr) throw upErr;
    } else {
      // Fix wrong content-type on launch file (re-upload with proper type)
      const buf = await fileBlob.arrayBuffer();
      await supabase.storage.from(BUCKET).upload(launchFull, new Blob([buf], { type: ct(launchFull) }), {
        upsert: true, contentType: ct(launchFull)
      });
    }

    await supabase.from('scorm_packages')
      .update({ metadata: { ...(pkg.metadata||{}), computed_launch: href, repaired_at: new Date().toISOString() } })
      .eq('id', packageId);

    return new Response(JSON.stringify({ ok: true, launch: href }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});