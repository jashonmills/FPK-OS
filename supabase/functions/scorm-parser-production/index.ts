import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import JSZip from 'https://esm.sh/jszip@3.10.1';
import { Scorm12API, Scorm2004API } from "https://esm.sh/scorm-again@1.7.0";

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

// Real SCORM manifest parsing using scorm-again library
async function parseManifestXML(xmlContent: string): Promise<ParsedManifest> {
  console.log('🔍 Parsing SCORM manifest with scorm-again...');
  
  // Detect SCORM version
  const isScorm2004 = xmlContent.includes('ADL SCORM 2004') || 
                      xmlContent.includes('adlcp:') ||
                      xmlContent.includes('imsss:') ||
                      xmlContent.includes('2004 4th Edition') ||
                      xmlContent.includes('version="2004"') ||
                      xmlContent.includes('IMS Content') && xmlContent.includes('adlseq:');

  const standard = isScorm2004 ? 'SCORM 2004' : 'SCORM 1.2';
  console.log(`📦 Detected ${standard} package`);

  // Initialize appropriate SCORM API based on version
  const scormAPI = isScorm2004 ? new Scorm2004API() : new Scorm12API();
  
  try {
    // Load and parse the manifest
    scormAPI.loadFromXML(xmlContent);
    
    // Extract manifest metadata
    const manifestId = scormAPI.settings?.identifier || 'manifest-' + Date.now();
    const title = scormAPI.settings?.title || 'Untitled SCORM Package';
    
    // Get all SCOs from the parsed manifest
    const rawSCOs = scormAPI.getSCOs();
    console.log(`✅ Found ${rawSCOs.length} SCOs in manifest`);
    
    // Transform SCOs to our database format
    const scos = rawSCOs.map((sco: any, index: number) => {
      // Clean up launch URL (remove leading slashes if present)
      let launchHref = sco.launchUrl || sco.launch || 'index.html';
      if (launchHref.startsWith('/')) {
        launchHref = launchHref.substring(1);
      }
      
      console.log(`  📄 SCO ${index + 1}: "${sco.title}" → ${launchHref}`);
      
      return {
        identifier: sco.identifier || `sco-${index + 1}`,
        title: sco.title || `Lesson ${index + 1}`,
        launch_href: launchHref,
        parameters: sco.parameters || '',
        seq_order: index + 1,
        mastery_score: sco.masteryScore || sco.mastery_score || null,
        max_time_allowed: sco.maxTimeAllowed || sco.max_time_allowed || undefined,
        time_limit_action: sco.timeLimitAction || sco.time_limit_action || 'continue,no message',
        is_launchable: true,
        scorm_type: sco.scormType || sco.scorm_type || 'sco'
      };
    });

    // Build organizations structure
    const organizations = [{
      identifier: 'org-1',
      title: title,
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
    }];

    // Build resources list
    const resources = scos.map(sco => ({
      identifier: sco.identifier,
      type: 'webcontent',
      href: sco.launch_href,
      metadata: {},
      files: [sco.launch_href]
    }));

    return {
      version: isScorm2004 ? '2004 4th Edition' : '1.2',
      standard,
      identifier: manifestId,
      title,
      organizations,
      defaultOrganization: 'org-1',
      resources,
      scos,
      metadata: {
        schema: 'ADL SCORM',
        schemaversion: isScorm2004 ? '2004 4th Edition' : '1.2',
        parsed_at: new Date().toISOString(),
        total_scos: scos.length,
        parsed_with: 'scorm-again@1.7.0'
      }
    };
  } catch (error) {
    console.error('❌ scorm-again parsing failed:', error);
    throw new Error(`Failed to parse SCORM manifest: ${error.message}`);
  }
}

// Extract imsmanifest.xml from ZIP file
async function extractManifestFromZip(zipPath: string, supabaseClient: any): Promise<string> {
  console.log('📦 Extracting imsmanifest.xml from ZIP...');
  
  try {
    // Download ZIP from storage
    const { data: zipData, error: downloadError } = await supabaseClient
      .storage
      .from('scorm-packages')
      .download(zipPath);

    if (downloadError) {
      throw new Error(`Failed to download ZIP: ${downloadError.message}`);
    }

    console.log('✅ ZIP downloaded, extracting...');
    
    // Load ZIP
    const zip = await JSZip.loadAsync(zipData);
    
    // Find imsmanifest.xml (case-insensitive)
    let manifestFile = null;
    const fileNames = Object.keys(zip.files);
    
    for (const fileName of fileNames) {
      if (fileName.toLowerCase().endsWith('imsmanifest.xml')) {
        manifestFile = zip.files[fileName];
        console.log(`✅ Found manifest: ${fileName}`);
        break;
      }
    }
    
    if (!manifestFile) {
      throw new Error('imsmanifest.xml not found in ZIP package');
    }
    
    // Extract XML content
    const xmlContent = await manifestFile.async('text');
    console.log(`✅ Manifest extracted (${xmlContent.length} bytes)`);
    
    return xmlContent;
  } catch (error) {
    console.error('❌ ZIP extraction failed:', error);
    throw new Error(`Failed to extract manifest: ${error.message}`);
  }
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

    // Real SCORM manifest parsing
    let parsedManifest: ParsedManifest;
    
    try {
      // Get package to find ZIP path
      const { data: packageData, error: packageError } = await supabaseClient
        .from('scorm_packages')
        .select('zip_path')
        .eq('id', packageId)
        .single();

      if (packageError || !packageData?.zip_path) {
        throw new Error('Package ZIP path not found in database');
      }

      console.log(`📦 Processing package from: ${packageData.zip_path}`);

      // Extract and parse real imsmanifest.xml from ZIP
      const manifestXML = await extractManifestFromZip(packageData.zip_path, supabaseClient);
      
      // Parse with scorm-again library
      parsedManifest = await parseManifestXML(manifestXML);
      
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