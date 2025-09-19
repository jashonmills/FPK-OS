import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import JSZip from 'npm:jszip@3.10.1';
import { XMLParser } from 'npm:fast-xml-parser@4.2.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScormManifest {
  identifier: string;
  version: string;
  title: string;
  description?: string;
  organizations: any[];
  resources: any[];
  sequencingCollection?: any[];
  metadata?: any;
}

interface ImportStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Starting SCORM import process');
    
    const formData = await req.formData();
    const scormFile = formData.get('scorm_package') as File;
    const orgId = formData.get('org_id') as string;
    const backgroundImageOverride = formData.get('background_image_url') as string;

    if (!scormFile || !orgId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: scorm_package or org_id' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create import record
    const { data: importRecord, error: importError } = await supabase
      .from('scorm_imports')
      .insert({
        org_id: orgId,
        user_id: user.id,
        file_url: '',
        file_name: scormFile.name,
        file_size: scormFile.size,
        status: 'uploading',
        steps_log: [{
          step: 'uploading',
          status: 'processing',
          message: 'Starting file upload',
          timestamp: new Date().toISOString()
        }],
        progress_percentage: 5
      })
      .select()
      .single();

    if (importError) {
      console.error('❌ Failed to create import record:', importError);
      return new Response(
        JSON.stringify({ error: 'Failed to create import record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const importId = importRecord.id;

    // Update function to track progress
    const updateProgress = async (status: string, step: string, message: string, progress: number, additionalData?: any) => {
      const updatedSteps = [...(importRecord.steps_log || [])];
      const existingStepIndex = updatedSteps.findIndex(s => s.step === step);
      
      if (existingStepIndex >= 0) {
        updatedSteps[existingStepIndex] = {
          step,
          status: status as any,
          message,
          timestamp: new Date().toISOString()
        };
      } else {
        updatedSteps.push({
          step,
          status: status as any,
          message,
          timestamp: new Date().toISOString()
        });
      }

      await supabase
        .from('scorm_imports')
        .update({ 
          status, 
          steps_log: updatedSteps, 
          progress_percentage: progress,
          ...additionalData 
        })
        .eq('id', importId);
    };

    try {
      // Step 1: Upload file
      await updateProgress('uploading', 'uploading', 'Uploading SCORM package', 10);
      
      const timestamp = Date.now();
      const fileName = `scorm_import_${importId}_${timestamp}.zip`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('org-assets')
        .upload(`${orgId}/imports/${fileName}`, scormFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('org-assets')
        .getPublicUrl(uploadData.path);

      // Step 2: Validate package
      await updateProgress('validating', 'validating', 'Validating SCORM package', 25);
      
      const arrayBuffer = await scormFile.arrayBuffer();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(arrayBuffer);

      // Look for imsmanifest.xml
      const manifestFile = zipContent.file('imsmanifest.xml');
      if (!manifestFile) {
        throw new Error('Invalid SCORM package: imsmanifest.xml not found');
      }

      // Step 3: Extract structure
      await updateProgress('extracting', 'extracting', 'Extracting SCORM structure', 40);
      
      const manifestContent = await manifestFile.async('text');
      const xmlParser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      });
      const manifestData = xmlParser.parse(manifestContent);

      // Parse manifest into our format
      const manifest = parseManifest(manifestData);

      // Step 4: Map to Framework 2
      await updateProgress('mapping', 'mapping', 'Mapping to Course Framework 2', 60);
      
      const mappedStructure = mapToFramework2(manifest, backgroundImageOverride);

      // Step 5: Convert assets (simplified - mark as future enhancement)
      await updateProgress('converting', 'converting', 'Processing assets', 80);
      
      // Step 6: Build preview
      await updateProgress('building_preview', 'building_preview', 'Building course preview', 95);
      
      // Final step: Mark as ready
      await updateProgress('ready', 'ready', 'Import completed successfully', 100, {
        file_url: publicUrl,
        manifest_data: manifest,
        mapped_structure: mappedStructure,
        completed_at: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          importId: importId,
          message: 'SCORM package imported successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('❌ Import failed:', error);
      await updateProgress('failed', 'failed', error.message, 0, {
        error_message: error.message
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Import failed', 
          details: error.message,
          importId: importId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function parseManifest(manifestData: any): ScormManifest {
  const manifest = manifestData.manifest;
  const identifier = manifest['@_identifier'] || 'unknown';
  const version = manifest['@_version'] || '1.2';
  
  // Extract title from organizations
  const organizations = manifest.organizations?.organization || [];
  const orgArray = Array.isArray(organizations) ? organizations : [organizations];
  
  const title = orgArray[0]?.title || manifest.metadata?.schema || 'Imported SCORM Course';
  
  const parsedOrganizations = orgArray.map((org: any) => {
    const items = org.item || [];
    const itemArray = Array.isArray(items) ? items : [items];
    
    return {
      identifier: org['@_identifier'],
      title: typeof org.title === 'string' ? org.title : org.title?.['#text'] || 'Module',
      items: itemArray.map((item: any) => ({
        identifier: item['@_identifier'],
        title: typeof item.title === 'string' ? item.title : item.title?.['#text'] || 'Lesson',
        resource: item['@_identifierref'],
        children: item.item ? (Array.isArray(item.item) ? item.item : [item.item]).map((child: any) => ({
          identifier: child['@_identifier'],
          title: typeof child.title === 'string' ? child.title : child.title?.['#text'] || 'Screen'
        })) : []
      }))
    };
  });

  const resources = manifest.resources?.resource || [];
  const resourceArray = Array.isArray(resources) ? resources : [resources];
  
  const parsedResources = resourceArray.map((res: any) => ({
    identifier: res['@_identifier'],
    type: res['@_type'],
    href: res['@_href'],
    scormType: res['@_adlcp:scormType'] || 'sco'
  }));

  return {
    identifier,
    version,
    title: typeof title === 'string' ? title : title?.['#text'] || 'Imported SCORM Course',
    description: manifest.metadata?.lom?.general?.description?.string || 'Course imported from SCORM package',
    organizations: parsedOrganizations,
    resources: parsedResources
  };
}

function mapToFramework2(manifest: ScormManifest, backgroundImageOverride?: string) {
  const modules = manifest.organizations.map((org, orgIndex) => ({
    id: `module_${orgIndex + 1}`,
    title: cleanTitle(org.title),
    lessons: org.items.map((item, itemIndex) => ({
      id: `lesson_${orgIndex + 1}_${itemIndex + 1}`,
      title: cleanTitle(item.title),
      description: extractLessonDescription(item),
      slides: item.children && item.children.length > 0 
        ? item.children.map((child, childIndex) => ({
            id: `slide_${orgIndex + 1}_${itemIndex + 1}_${childIndex + 1}`,
            kind: inferSlideType(child.title),
            title: cleanTitle(child.title),
            html: generateSlideContent(child.title, item.resource, manifest.resources)
          }))
        : [{
            id: `slide_${orgIndex + 1}_${itemIndex + 1}_1`,
            kind: 'content' as const,
            title: cleanTitle(item.title),
            html: generateSlideContent(item.title, item.resource, manifest.resources)
          }]
    }))
  }));

  return {
    title: manifest.title,
    description: manifest.description || 'Course imported from SCORM package',
    level: 'intermediate' as const,
    durationEstimateMins: estimateDuration(modules),
    backgroundImageUrl: backgroundImageOverride || undefined,
    framework: 'interactive_micro_learning' as const,
    modules,
    source: {
      type: 'scorm',
      manifest_identifier: manifest.identifier,
      version: manifest.version,
      imported_at: new Date().toISOString()
    }
  };
}

function inferSlideType(title: string): 'content' | 'example' | 'practice' | 'summary' {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('quiz') || lowerTitle.includes('test') || lowerTitle.includes('exercise')) {
    return 'practice';
  }
  if (lowerTitle.includes('example') || lowerTitle.includes('demo')) {
    return 'example';
  }
  if (lowerTitle.includes('summary') || lowerTitle.includes('conclusion') || lowerTitle.includes('review')) {
    return 'summary';
  }
  return 'content';
}

function estimateDuration(modules: any[]): number {
  const totalSlides = modules.reduce((acc, module) => 
    acc + module.lessons.reduce((lessonAcc: number, lesson: any) => 
      lessonAcc + lesson.slides.length, 0), 0);
  return Math.max(30, totalSlides * 3); // Minimum 30 minutes, 3 minutes per slide
}

/**
 * Clean up titles by removing HTML and common prefixes
 */
function cleanTitle(title: string): string {
  if (!title) return '';
  
  return title
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") // Decode entities
    .replace(/^(lesson|module|chapter|unit|topic)\s*\d*:?\s*/i, '') // Remove common prefixes
    .trim();
}

/**
 * Extract meaningful lesson description from SCORM item
 */
function extractLessonDescription(item: any): string {
  // Try to get description from various SCORM fields
  if (item.description && typeof item.description === 'string') {
    return cleanTitle(item.description);
  }
  
  // If no description, create a basic one from the title
  if (item.title) {
    return `Learn about ${cleanTitle(item.title).toLowerCase()}`;
  }
  
  return '';
}

/**
 * Generate meaningful slide content based on SCORM resource
 */
function generateSlideContent(title: string, resourceRef: string, resources: any[]): string {
  const cleanedTitle = cleanTitle(title);
  
  // Find the associated resource
  const resource = resources.find(r => r.identifier === resourceRef);
  
  if (resource && resource.href) {
    // For now, create structured content with the resource reference
    // In a full implementation, you would parse the actual HTML file
    return `<h3>${cleanedTitle}</h3>
<p>This lesson covers key concepts related to ${cleanedTitle.toLowerCase()}.</p>
<div class="resource-reference" data-href="${resource.href}">
  <p>Content source: ${resource.href}</p>
</div>`;
  }
  
  // Fallback content based on title analysis
  const contentType = inferSlideType(title);
  switch (contentType) {
    case 'practice':
      return `<h3>${cleanedTitle}</h3>
<p>Practice exercises and activities for ${cleanedTitle.toLowerCase()}.</p>
<ul>
  <li>Review key concepts</li>
  <li>Complete practice questions</li>
  <li>Apply what you've learned</li>
</ul>`;
    
    case 'example':
      return `<h3>${cleanedTitle}</h3>
<p>Examples and demonstrations of ${cleanedTitle.toLowerCase()}.</p>
<p>Study the following examples to understand the concepts better:</p>`;
    
    case 'summary':
      return `<h3>${cleanedTitle}</h3>
<p>Summary and review of ${cleanedTitle.toLowerCase()}.</p>
<ul>
  <li>Key takeaways</li>
  <li>Important concepts to remember</li>
  <li>Next steps</li>
</ul>`;
    
    default:
      return `<h3>${cleanedTitle}</h3>
<p>Explore the fundamentals of ${cleanedTitle.toLowerCase()} in this comprehensive lesson.</p>
<p>You will learn the essential concepts and practical applications.</p>`;
  }
}