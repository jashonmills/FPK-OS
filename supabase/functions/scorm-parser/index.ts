import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManifestResource {
  identifier: string;
  type: string;
  href: string;
  scormType?: string;
}

interface ManifestItem {
  identifier: string;
  title: string;
  identifierref?: string;
  isVisible?: boolean;
  parameters?: string;
  masteryScore?: number;
  prerequisites?: string[];
}

interface ParsedManifest {
  version: string;
  identifier: string;
  title: string;
  description?: string;
  organizations: ManifestItem[];
  resources: ManifestResource[];
  scos: Array<{
    identifier: string;
    title: string;
    launch_href: string;
    parameters?: string;
    mastery_score?: number;
    prerequisites?: string[];
    seq_order: number;
  }>;
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

    // Download and extract the ZIP file
    const extractPath = `/tmp/scorm-extract/${packageId}`;
    
    // For now, we'll simulate the parsing process
    // In a real implementation, you would:
    // 1. Download the ZIP from storage
    // 2. Extract it to a temporary directory
    // 3. Parse the imsmanifest.xml file
    // 4. Extract SCO information
    
    const mockManifest: ParsedManifest = {
      version: '1.2',
      identifier: 'SCORM_PACKAGE_' + packageId,
      title: 'Sample SCORM Package',
      description: 'A sample SCORM 1.2 package for testing',
      organizations: [
        {
          identifier: 'org1',
          title: 'Main Organization',
          identifierref: 'sco1'
        }
      ],
      resources: [
        {
          identifier: 'res1',
          type: 'webcontent',
          href: 'index.html',
          scormType: 'sco'
        }
      ],
      scos: [
        {
          identifier: 'sco1',
          title: 'Introduction',
          launch_href: 'index.html',
          parameters: '',
          mastery_score: 80,
          prerequisites: [],
          seq_order: 1
        }
      ]
    };

    // Update the package status and extract path
    const { error: packageError } = await supabaseClient
      .from('scorm_packages')
      .update({
        status: 'parsed',
        extract_path: extractPath,
        metadata: {
          manifest: mockManifest,
          parsed_at: new Date().toISOString()
        }
      })
      .eq('id', packageId);

    if (packageError) {
      throw packageError;
    }

    // Insert SCO records
    const scoInserts = mockManifest.scos.map(sco => ({
      package_id: packageId,
      identifier: sco.identifier,
      title: sco.title,
      launch_href: sco.launch_href,
      parameters: sco.parameters || null,
      mastery_score: sco.mastery_score,
      seq_order: sco.seq_order,
      prerequisites: sco.prerequisites || []
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
        manifest: mockManifest,
        extractPath,
        scosCreated: scoInserts.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scorm-parser function:', error);
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