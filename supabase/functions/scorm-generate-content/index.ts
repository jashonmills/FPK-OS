import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function htmlRedirect(to: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url='${to}'">
<script>location.replace(${JSON.stringify(to)});</script>
<title>Launching SCORM Content...</title></head>
<body><p>Launching SCORM content...</p></body></html>`;
}

function mimeFor(path: string): string {
  path = path.toLowerCase();
  if (path.endsWith('.html') || path.endsWith('.htm')) return 'text/html; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`🔧 SCORM Content Generator: ${req.method} ${req.url}`);

  try {
    const { packageId } = await req.json();
    if (!packageId) {
      return new Response(JSON.stringify({ error: 'packageId required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📦 Generating content for package: ${packageId}`);

    // Use SERVICE_ROLE_KEY for write operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization') || ''
          }
        }
      }
    );

    // Get package metadata
    const { data: pkg, error: pkgErr } = await supabase
      .from('scorm_packages')
      .select('id, extract_path, metadata, title')
      .eq('id', packageId)
      .single();

    if (pkgErr || !pkg) {
      console.error('❌ Package not found:', pkgErr);
      throw new Error('Package not found');
    }

    console.log(`✅ Found package: ${pkg.title}`);

    const extractRoot = `scorm-unpacked/${packageId}`;

    // Download and parse manifest
    const manifestPath = `${extractRoot}/imsmanifest.xml`;
    console.log(`📄 Reading manifest: ${manifestPath}`);
    
    const { data: manifestFile, error: manErr } = await supabase.storage
      .from('scorm-packages')
      .download(manifestPath);
      
    if (manErr || !manifestFile) {
      console.error('❌ Manifest not found:', manErr);
      throw new Error(`imsmanifest.xml missing at ${manifestPath}`);
    }

    const xml = await manifestFile.text();
    console.log(`📋 Manifest loaded, size: ${xml.length} bytes`);

    // Extract default organization
    const defaultOrg = /<organizations[^>]*\bdefault="([^"]+)"/i.exec(xml)?.[1];
    if (!defaultOrg) {
      throw new Error('No default organization found in manifest');
    }
    console.log(`🎯 Default organization: ${defaultOrg}`);

    // Find the organization block and extract first launchable item
    const orgBlock = new RegExp(`<organization[^>]*identifier="${defaultOrg}"[\\s\\S]*?<\\/organization>`, 'i').exec(xml)?.[0] || '';
    const firstItem = /<item[^>]*identifierref="([^"]+)"/i.exec(orgBlock)?.[1];
    
    if (!firstItem) {
      throw new Error('No launchable item found in default organization');
    }
    console.log(`📋 First item identifier: ${firstItem}`);

    // Find the resource href for this item
    const resourceHref = new RegExp(`<resource[^>]*identifier="${firstItem}"[^>]*href="([^"]+)"`, 'i').exec(xml)?.[1];
    if (!resourceHref) {
      throw new Error('No resource href found for launch item');
    }
    console.log(`🎯 Launch resource: ${resourceHref}`);

    // Check if the launch file exists
    const launchPath = `${extractRoot}/${resourceHref}`;
    console.log(`🔍 Checking launch file: ${launchPath}`);
    
    const { data: launchFile, error: launchErr } = await supabase.storage
      .from('scorm-packages')
      .download(launchPath);

    if (launchErr || !launchFile) {
      console.log(`⚠️ Launch file missing, creating redirect...`);
      
      // Create a redirect index.html in the content folder
      const contentFolder = resourceHref.includes('/') 
        ? resourceHref.substring(0, resourceHref.lastIndexOf('/'))
        : 'content';
      
      const indexPath = `${extractRoot}/${contentFolder}/index.html`;
      const redirectHtml = htmlRedirect(`/api/scorm/content/${packageId}/${resourceHref}`);
      
      console.log(`📝 Creating redirect at: ${indexPath}`);
      
      const { error: uploadErr } = await supabase.storage
        .from('scorm-packages')
        .upload(indexPath, new Blob([redirectHtml], { type: 'text/html' }), {
          upsert: true,
          contentType: 'text/html; charset=utf-8'
        });
        
      if (uploadErr) {
        console.error('❌ Failed to create redirect:', uploadErr);
        throw uploadErr;
      }
      
      console.log(`✅ Created redirect file`);
    } else {
      console.log(`✅ Launch file exists, ensuring correct content-type...`);
      
      // Re-upload with correct content-type
      const buf = await launchFile.arrayBuffer();
      await supabase.storage
        .from('scorm-packages')
        .upload(launchPath, new Blob([buf], { type: mimeFor(launchPath) }), {
          upsert: true,
          contentType: mimeFor(launchPath)
        });
    }

    // Update package metadata with computed launch info
    const updatedMetadata = {
      ...pkg.metadata,
      computed_launch: resourceHref,
      repaired_at: new Date().toISOString(),
      generation_success: true
    };

    const { error: updateErr } = await supabase
      .from('scorm_packages')
      .update({ 
        metadata: updatedMetadata,
        status: 'ready'
      })
      .eq('id', packageId);

    if (updateErr) {
      console.error('❌ Failed to update package metadata:', updateErr);
      // Don't fail the whole operation for this
    }

    console.log(`✅ Content generation completed successfully`);

    return new Response(JSON.stringify({ 
      success: true, 
      launch: resourceHref,
      message: 'Content generated successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Content generation failed:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Content generation failed',
      success: false
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});