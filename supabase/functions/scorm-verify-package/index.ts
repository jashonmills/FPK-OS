// /functions/scorm-verify-package/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const BUCKET = 'scorm-packages';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,OPTIONS' } });

  try {
    const { packageId } = await req.json();
    if (!packageId) return new Response(JSON.stringify({ error: 'packageId required' }), { status: 400 });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

    const { data: pkg } = await supabase.from('scorm_packages')
      .select('id, extract_path, metadata').eq('id', packageId).single();

    const root = pkg?.extract_path || `scorm-unpacked/${packageId}`;
    const manifestPath = `${root}/imsmanifest.xml`;

    const out: any = { ok: true, packageId, checks: [] };

    // manifest exists?
    const { data: man, error: manErr } = await supabase.storage.from(BUCKET).download(manifestPath);
    if (manErr || !man) {
      out.ok = false; out.checks.push({ check: 'manifest', ok: false, path: manifestPath, reason: 'missing' });
      return new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    out.checks.push({ check: 'manifest', ok: true, path: manifestPath });

    const xml = await man.text();
    const defaultOrg = /<organizations[^>]*\bdefault="([^"]+)"/i.exec(xml)?.[1];
    if (!defaultOrg) { out.ok = false; out.checks.push({ check:'defaultOrg', ok:false, reason:'not set' }); }

    const orgBlock = defaultOrg ? (new RegExp(`<organization[^>]*identifier="${defaultOrg}"[\\s\\S]*?<\\/organization>`, 'i').exec(xml)?.[0] || '') : '';
    const resourceId = /<item[^>]*identifierref="([^"]+)"/i.exec(orgBlock)?.[1];
    if (!resourceId) { out.ok = false; out.checks.push({ check:'launchItem', ok:false, reason:'no launchable item' }); }

    const href = resourceId ? (new RegExp(`<resource[^>]*identifier="${resourceId}"[^>]*href="([^"]+)"`, 'i').exec(xml)?.[1] || '') : '';
    if (!href) { out.ok = false; out.checks.push({ check:'launchHref', ok:false, reason:'no href' }); }

    const launchFull = `${root}/${href}`.replace(/\/+/g, '/');
    const { data: launchBlob } = href ? await supabase.storage.from(BUCKET).download(launchFull) : { data: null as any };
    out.checks.push({ check:'launchFile', ok: !!launchBlob, path: launchFull, href });

    return new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});