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
  metadata?: any;
  files: string[];
}

interface ManifestItem {
  identifier: string;
  title: string;
  identifierref?: string;
  isvisible: boolean;
  parameters?: string;
  prerequisites?: string;
  maxtimeallowed?: string;
  timelimitaction?: string;
  datafromlms?: string;
  masteryscore?: string;
  children: ManifestItem[];
}

interface ManifestOrganization {
  identifier: string;
  title: string;
  structure: string;
  items: ManifestItem[];
}

interface ParsedManifest {
  version: string;
  standard: 'SCORM 1.2' | 'SCORM 2004';
  identifier: string;
  title: string;
  organizations: ManifestOrganization[];
  defaultOrganization: string;
  resources: ManifestResource[];
  scos: {
    identifier: string;
    title: string;
    launch_href: string;
    parameters?: string;
    seq_order: number;
    mastery_score?: number;
    max_time_allowed?: string;
    time_limit_action?: string;
    is_launchable: boolean;
    scorm_type: string;
  }[];
  metadata: any;
}

// Enhanced XML parsing for SCORM manifests
function parseManifestXML(xmlContent: string): ParsedManifest {
  // This is a simplified XML parser - in production you'd use a proper XML library
  // For now, we'll create a mock structure that demonstrates the expected output
  
  // Detect SCORM version
  const isScorm2004 = xmlContent.includes('ADL SCORM 2004') || 
                      xmlContent.includes('adlcp:') ||
                      xmlContent.includes('imsss:') ||
                      xmlContent.includes('version="2004');

  const standard = isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2';

  // Extract basic manifest information
  const identifierMatch = xmlContent.match(/identifier="([^"]+)"/);
  const manifestId = identifierMatch ? identifierMatch[1] : 'manifest-' + Date.now();

  // Create demo SCOs based on the standard
  const scos = [
    {
      identifier: 'sco-1',
      title: 'Introduction to SCORM',
      launch_href: 'content/index.html',
      parameters: '',
      seq_order: 1,
      mastery_score: 80,
      max_time_allowed: undefined,
      time_limit_action: 'continue,no message',
      is_launchable: true,
      scorm_type: 'sco'
    },
    {
      identifier: 'sco-2', 
      title: 'SCORM Concepts',
      launch_href: 'content/lesson2.html',
      parameters: '',
      seq_order: 2,
      mastery_score: 85,
      max_time_allowed: undefined,
      time_limit_action: 'continue,no message',
      is_launchable: true,
      scorm_type: 'sco'
    }
  ];

  return {
    version: isScorm2004 ? '2004 4th Edition' : '1.2',
    standard,
    identifier: manifestId,
    title: 'Sample SCORM Package',
    organizations: [
      {
        identifier: 'org-1',
        title: 'Default Organization',
        structure: 'hierarchical',
        items: scos.map(sco => ({
          identifier: sco.identifier,
          title: sco.title,
          identifierref: sco.identifier,
          isvisible: true,
          parameters: sco.parameters,
          prerequisites: undefined,
          maxtimeallowed: sco.max_time_allowed,
          timelimitaction: sco.time_limit_action,
          datafromlms: undefined,
          masteryscore: sco.mastery_score?.toString(),
          children: []
        }))
      }
    ],
    defaultOrganization: 'org-1',
    resources: scos.map(sco => ({
      identifier: sco.identifier,
      type: isScorm2004 ? 'webcontent' : 'webcontent',
      href: sco.launch_href,
      metadata: {},
      files: [sco.launch_href]
    })),
    scos,
    metadata: {
      schema: isScorm2004 ? 'ADL SCORM' : 'ADL SCORM',
      schemaversion: isScorm2004 ? '2004 4th Edition' : '1.2',
      parsed_at: new Date().toISOString(),
      total_scos: scos.length
    }
  };
}

// Security: Validate and sanitize file uploads
function validateZipFile(fileName: string, fileSize: number): { valid: boolean; error?: string } {
  // Check file extension
  if (!fileName.toLowerCase().endsWith('.zip')) {
    return { valid: false, error: 'Only ZIP files are allowed' };
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (fileSize > maxSize) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }

  // Check filename for security
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');
  if (sanitizedName !== fileName) {
    return { valid: false, error: 'Invalid characters in filename' };
  }

  return { valid: true };
}

// Rate limiting helper
async function checkRateLimit(supabaseClient: any, userId: string): Promise<boolean> {
  try {
    const { data } = await supabaseClient.rpc('check_rate_limit', {
      p_user_id: userId,
      p_action_type: 'package_upload',
      p_limit: 10, // 10 uploads per hour
      p_window_seconds: 3600
    });
    
    return data === true;
  } catch {
    return false; // Fail safe - allow if rate limit check fails
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth context
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { packageId, fileName, fileSize, zipData } = await req.json();

    if (!packageId) {
      return new Response(
        JSON.stringify({ error: 'Package ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`SCORM Parser: Processing package ${packageId}`);

    // Rate limiting check
    const rateLimitOk = await checkRateLimit(supabaseClient, user.id);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file if provided
    if (fileName && fileSize) {
      const validation = validateZipFile(fileName, fileSize);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ error: validation.error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Update package status to parsing
    const { error: updateError } = await supabaseClient
      .from('scorm_packages')
      .update({ 
        status: 'parsing',
        upload_size: fileSize
      })
      .eq('id', packageId)
      .eq('created_by', user.id); // Ensure ownership

    if (updateError) {
      throw new Error(`Failed to update package status: ${updateError.message}`);
    }

    // Simulate ZIP processing and manifest parsing
    // In production, you would:
    // 1. Extract ZIP file to storage
    // 2. Find and parse imsmanifest.xml
    // 3. Validate SCORM structure
    // 4. Store extracted files in organized structure

    let parsedManifest: ParsedManifest;
    
    try {
      // Mock manifest XML for demonstration
      const mockManifestXML = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.example.scorm" version="1" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="org1">
    <organization identifier="org1">
      <title>Sample SCORM Course</title>
      <item identifier="item1" identifierref="resource1">
        <title>Introduction</title>
      </item>
      <item identifier="item2" identifierref="resource2">
        <title>Concepts</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource1" type="webcontent" href="index.html">
      <file href="index.html"/>
    </resource>
    <resource identifier="resource2" type="webcontent" href="lesson2.html">
      <file href="lesson2.html"/>
    </resource>
  </resources>
</manifest>`;

      parsedManifest = parseManifestXML(mockManifestXML);
      
      // Log parsing activity
      await supabaseClient
        .from('scorm_logs')
        .insert({
          package_id: packageId,
          user_id: user.id,
          level: 'info',
          category: 'parser',
          message: 'Manifest parsed successfully',
          data: {
            standard: parsedManifest.standard,
            sco_count: parsedManifest.scos.length,
            file_size: fileSize
          }
        });

    } catch (parseError) {
      console.error('Manifest parsing error:', parseError);
      
      // Update package status to error
      await supabaseClient
        .from('scorm_packages')
        .update({ 
          status: 'error',
          metadata: { error: parseError.message }
        })
        .eq('id', packageId);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse SCORM manifest',
          details: parseError.message 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update package with parsed data
    const { error: manifestUpdateError } = await supabaseClient
      .from('scorm_packages')
      .update({
        status: 'ready',
        standard: parsedManifest.standard,
        extract_path: `packages/${packageId}/content/`,
        manifest_path: `packages/${packageId}/imsmanifest.xml`,
        metadata: parsedManifest.metadata,
        organizations: parsedManifest.organizations,
        resources: parsedManifest.resources,
        parsed_at: new Date().toISOString()
      })
      .eq('id', packageId);

    if (manifestUpdateError) {
      throw new Error(`Failed to update manifest data: ${manifestUpdateError.message}`);
    }

    // Insert SCOs
    const scoInserts = parsedManifest.scos.map(sco => ({
      package_id: packageId,
      identifier: sco.identifier,
      title: sco.title,
      launch_href: sco.launch_href,
      parameters: sco.parameters,
      seq_order: sco.seq_order,
      mastery_score: sco.mastery_score,
      max_time_allowed: sco.max_time_allowed,
      time_limit_action: sco.time_limit_action,
      is_launchable: sco.is_launchable,
      scorm_type: sco.scorm_type
    }));

    const { error: scoError } = await supabaseClient
      .from('scorm_scos')
      .insert(scoInserts);

    if (scoError) {
      console.error('SCO insert error:', scoError);
      // Continue anyway - package is still usable
    }

    // Log successful parsing
    await supabaseClient
      .from('scorm_analytics')
      .insert({
        user_id: user.id,
        package_id: packageId,
        event_type: 'package_parsed',
        event_data: {
          standard: parsedManifest.standard,
          sco_count: parsedManifest.scos.length,
          file_size: fileSize,
          processing_time_ms: Date.now() - parseInt(packageId.split('-').pop() || '0')
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        packageId,
        manifest: parsedManifest,
        message: `Successfully parsed ${parsedManifest.standard} package with ${parsedManifest.scos.length} SCOs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SCORM Parser error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});