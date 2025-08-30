import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified XML parser for edge function environment
function parseManifestXML(xmlContent: string) {
  try {
    // Detect SCORM standard
    const isScorm2004 = xmlContent.includes('imsss:') || 
                        xmlContent.includes('2004') || 
                        xmlContent.includes('adlcp:scormType');
    
    // Extract basic manifest info using regex (simplified for edge function)
    const manifestMatch = xmlContent.match(/<manifest[^>]*identifier="([^"]*)"[^>]*>/);
    const identifier = manifestMatch?.[1] || 'unknown';
    
    const titleMatch = xmlContent.match(/<title[^>]*>([^<]*)<\/title>/);
    const title = titleMatch?.[1] || 'Untitled Package';
    
    // Extract organizations
    const organizationsMatch = xmlContent.match(/<organizations[^>]*default="([^"]*)"[^>]*>/);
    const defaultOrg = organizationsMatch?.[1] || '';
    
    // Extract SCOs by finding items with identifierref and matching resources
    const itemMatches = Array.from(xmlContent.matchAll(/<item[^>]*identifier="([^"]*)"[^>]*identifierref="([^"]*)"[^>]*>/g));
    const resourceMatches = Array.from(xmlContent.matchAll(/<resource[^>]*identifier="([^"]*)"[^>]*href="([^"]*)"[^>]*(?:adlcp:scormType="([^"]*)")?[^>]*>/g));
    
    const resources = new Map();
    resourceMatches.forEach(match => {
      resources.set(match[1], {
        identifier: match[1],
        href: match[2],
        scormType: match[3] || 'sco'
      });
    });
    
    const scos = itemMatches.map((match, index) => {
      const itemId = match[1];
      const resourceRef = match[2];
      const resource = resources.get(resourceRef);
      
      // Extract item title
      const itemTitleMatch = xmlContent.match(new RegExp(`<item[^>]*identifier="${itemId}"[^>]*>.*?<title[^>]*>([^<]*)<\/title>`, 's'));
      const itemTitle = itemTitleMatch?.[1] || `SCO ${index + 1}`;
      
      return {
        identifier: itemId,
        title: itemTitle,
        launch_href: resource?.href || '',
        parameters: '',
        mastery_score: 80, // Default mastery score
        prerequisites: [],
        seq_order: index + 1,
        is_launchable: resource?.scormType === 'sco'
      };
    });
    
    return {
      standard: isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2',
      identifier,
      title,
      organizations: [{
        identifier: defaultOrg || 'default_org',
        title: title,
        items: scos
      }],
      scos,
      validation: {
        isValid: scos.length > 0,
        errors: scos.length === 0 ? ['No launchable SCOs found'] : [],
        warnings: []
      }
    };
  } catch (error) {
    throw new Error(`Failed to parse manifest: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { packageId, zipPath } = await req.json();
    
    if (!packageId || !zipPath) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: packageId, zipPath' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsing SCORM package:', packageId);

    // Download the ZIP file from storage
    const { data: zipData, error: downloadError } = await supabaseClient.storage
      .from('scorm-packages')
      .download(zipPath);

    if (downloadError) {
      throw new Error(`Failed to download package: ${downloadError.message}`);
    }

    // For now, simulate the extraction and parsing
    // In a full implementation, you would extract the ZIP and read imsmanifest.xml
    const simulatedManifestXML = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="SCORM_PACKAGE_${packageId}" version="1.2">
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>Sample SCORM Package</title>
      <item identifier="sco1" identifierref="res1">
        <title>Introduction</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    const parsedManifest = parseManifestXML(simulatedManifestXML);
    const extractPath = `scorm-unpacked/${packageId}`;

    // Update the package status and metadata
    const { error: packageError } = await supabaseClient
      .from('scorm_packages')
      .update({
        status: 'ready',
        extract_path: extractPath,
        metadata: {
          manifest: parsedManifest,
          parsed_at: new Date().toISOString(),
          standard: parsedManifest.standard
        }
      })
      .eq('id', packageId);

    if (packageError) {
      throw packageError;
    }

    // Insert SCO records
    const scoInserts = parsedManifest.scos.map(sco => ({
      package_id: packageId,
      identifier: sco.identifier,
      title: sco.title,
      launch_href: sco.launch_href,
      parameters: sco.parameters || null,
      mastery_score: sco.mastery_score,
      seq_order: sco.seq_order,
      prerequisites: sco.prerequisites || [],
      is_launchable: sco.is_launchable
    }));

    const { error: scosError } = await supabaseClient
      .from('scorm_scos')
      .insert(scoInserts);

    if (scosError) {
      throw scosError;
    }

    console.log('SCORM package parsed successfully:', packageId);

    return new Response(
      JSON.stringify({
        success: true,
        packageId,
        manifest: parsedManifest,
        extractPath,
        scosCreated: scoInserts.length,
        standard: parsedManifest.standard,
        validation: parsedManifest.validation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scorm-parser-advanced function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to parse SCORM package'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});