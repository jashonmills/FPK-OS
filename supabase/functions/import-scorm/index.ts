import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import JSZip from 'npm:jszip@3.10.1';
import { XMLParser } from 'npm:fast-xml-parser@4.2.5';
import { parse as parseHtml } from 'npm:node-html-parser@6.1.12';

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

      // Step 4: Extract content files
      await updateProgress('parsing_content', 'parsing_content', 'Parsing content files', 50);
      
      const contentFiles = await extractContentFiles(zipContent, manifest);

      // Step 5: Process assets
      await updateProgress('processing_assets', 'processing_assets', 'Processing media assets', 65);
      
      const processedAssets = await processAssets(zipContent, manifest, supabase, orgId);

      // Step 6: Map to Framework 2
      await updateProgress('mapping', 'mapping', 'Mapping to Course Framework 2', 75);
      
      const mappedStructure = mapToFramework2(manifest, contentFiles, processedAssets, backgroundImageOverride);
      
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

function mapToFramework2(manifest: ScormManifest, contentFiles: Map<string, string>, processedAssets: Map<string, string>, backgroundImageOverride?: string) {
  const modules = manifest.organizations.map((org, orgIndex) => ({
    id: `module_${orgIndex + 1}`,
    title: cleanTitle(org.title),
    lessons: org.items.map((item, itemIndex) => ({
      id: `lesson_${orgIndex + 1}_${itemIndex + 1}`,
      title: cleanTitle(item.title),
      description: extractLessonDescription(item, contentFiles),
      slides: item.children && item.children.length > 0 
        ? item.children.map((child, childIndex) => ({
            id: `slide_${orgIndex + 1}_${itemIndex + 1}_${childIndex + 1}`,
            kind: inferSlideType(child.title),
            title: cleanTitle(child.title),
            html: generateSlideContent(child.title, item.resource, manifest.resources, contentFiles, processedAssets)
          }))
        : [{
            id: `slide_${orgIndex + 1}_${itemIndex + 1}_1`,
            kind: 'content' as const,
            title: cleanTitle(item.title),
            html: generateSlideContent(item.title, item.resource, manifest.resources, contentFiles, processedAssets)
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
function extractLessonDescription(item: any, contentFiles?: Map<string, string>): string {
  // Try to get description from various SCORM fields
  if (item.description && typeof item.description === 'string') {
    return cleanTitle(item.description);
  }
  
  // Try to extract description from actual content if available
  if (contentFiles && item.resource) {
    for (const [filePath, content] of contentFiles) {
      // Look for content that matches this item
      if (filePath.toLowerCase().includes(item.title?.toLowerCase()) || 
          content.toLowerCase().includes(item.title?.toLowerCase())) {
        
        // Try to extract a meaningful description from the HTML content
        const description = extractDescriptionFromHtml(content, item.title);
        if (description && description.length > 20) {
          return description;
        }
      }
    }
  }
  
  // If no description found, create a descriptive one based on the title
  if (item.title) {
    const cleanedTitle = cleanTitle(item.title);
    
    // Check if the title indicates specific educational content
    const titleLower = cleanedTitle.toLowerCase();
    if (titleLower.includes('parent')) {
      return `Essential guidance and resources for parents regarding ${cleanedTitle.toLowerCase()}`;
    } else if (titleLower.includes('educator') || titleLower.includes('teacher')) {
      return `Professional development and instructional strategies for educators on ${cleanedTitle.toLowerCase()}`;
    } else if (titleLower.includes('iep') || titleLower.includes('individualized')) {
      return `Comprehensive information about individualized education programs and ${cleanedTitle.toLowerCase()}`;
    }
    
    const contentType = inferSlideType(item.title);
    switch (contentType) {
      case 'practice':
        return `Interactive exercises and practice activities for ${cleanedTitle.toLowerCase()}`;
      case 'example':
        return `Real-world examples and demonstrations of ${cleanedTitle.toLowerCase()}`;
      case 'summary':
        return `Key takeaways and summary of ${cleanedTitle.toLowerCase()}`;
      default:
        return `Educational content covering ${cleanedTitle.toLowerCase()} concepts and applications`;
    }
  }
  
  return 'Interactive educational content';
}

/**
 * Extract a meaningful description from HTML content
 */
function extractDescriptionFromHtml(htmlContent: string, title: string): string {
  try {
    const root = parseHtml(htmlContent);
    
    // Look for meta description
    const metaDesc = root.querySelector('meta[name="description"]');
    if (metaDesc) {
      const content = metaDesc.getAttribute('content');
      if (content && content.length > 20) {
        return content.trim();
      }
    }
    
    // Look for the first substantial paragraph
    const paragraphs = root.querySelectorAll('p, .description, .intro, .summary');
    for (const p of paragraphs) {
      const text = p.text.trim();
      if (text && text.length > 30 && text.length < 200) {
        // Clean up and return the first good paragraph
        return text.replace(/\s+/g, ' ').trim();
      }
    }
    
    // Look for any substantial text content
    const bodyText = root.querySelector('body')?.text.trim();
    if (bodyText && bodyText.length > 50) {
      const sentences = bodyText.split('.').filter(s => s.trim().length > 20);
      if (sentences.length > 0) {
        return sentences[0].trim() + '.';
      }
    }
    
    return '';
  } catch (error) {
    console.warn('⚠️  Error extracting description from HTML:', error);
    return '';
  }
}

/**
 * Generate meaningful slide content based on SCORM resource
 */
function generateSlideContent(title: string, resourceRef: string, resources: any[], contentFiles: Map<string, string>, processedAssets: Map<string, string>): string {
  const cleanedTitle = cleanTitle(title);
  
  console.log(`🔍 Generating content for: ${cleanedTitle}, resourceRef: ${resourceRef}`);
  console.log(`📄 Available content files: ${Array.from(contentFiles.keys()).join(', ')}`);
  
  // Find the associated resource
  const resource = resources.find(r => r.identifier === resourceRef);
  
  // Try multiple strategies to find content
  let actualContent = null;
  
  if (resource && resource.href) {
    // Strategy 1: Direct match
    actualContent = contentFiles.get(resource.href);
    console.log(`🔍 Direct match for ${resource.href}: ${actualContent ? 'FOUND' : 'NOT FOUND'}`);
    
    // Strategy 2: Try without leading slash
    if (!actualContent && resource.href.startsWith('/')) {
      actualContent = contentFiles.get(resource.href.substring(1));
      console.log(`🔍 Without leading slash ${resource.href.substring(1)}: ${actualContent ? 'FOUND' : 'NOT FOUND'}`);
    }
    
    // Strategy 3: Try with leading slash
    if (!actualContent && !resource.href.startsWith('/')) {
      actualContent = contentFiles.get('/' + resource.href);
      console.log(`🔍 With leading slash /${resource.href}: ${actualContent ? 'FOUND' : 'NOT FOUND'}`);
    }
  }
  
  // Strategy 4: Try to find content by title matching
  if (!actualContent) {
    const titleLower = cleanedTitle.toLowerCase();
    for (const [filePath, content] of contentFiles) {
      if (filePath.toLowerCase().includes(titleLower) || 
          filePath.toLowerCase().includes(title.toLowerCase()) ||
          content.toLowerCase().includes(titleLower)) {
        actualContent = content;
        console.log(`🔍 Found content by title matching in: ${filePath}`);
        break;
      }
    }
  }
  
  // Strategy 5: Try common patterns based on title
  if (!actualContent) {
    const patterns = [
      `${cleanedTitle.toLowerCase().replace(/\s+/g, '')}.html`,
      `${cleanedTitle.toLowerCase().replace(/\s+/g, '_')}.html`,
      `lesson${cleanedTitle.toLowerCase().replace(/\D/g, '')}.html`,
      `${cleanedTitle.toLowerCase()}/index.html`
    ];
    
    for (const pattern of patterns) {
      for (const [filePath, content] of contentFiles) {
        if (filePath.toLowerCase().includes(pattern) || filePath.toLowerCase().endsWith(pattern)) {
          actualContent = content;
          console.log(`🔍 Found content by pattern ${pattern} in: ${filePath}`);
          break;
        }
      }
      if (actualContent) break;
    }
  }
  
  // Strategy 6: Use any available content if we still haven't found anything
  if (!actualContent && contentFiles.size > 0) {
    const firstContent = Array.from(contentFiles.values())[0];
    const firstPath = Array.from(contentFiles.keys())[0];
    actualContent = firstContent;
    console.log(`🔍 Using first available content from: ${firstPath}`);
  }
  
  // If we found actual content, parse it
  if (actualContent) {
    console.log(`✅ Using actual HTML content for ${cleanedTitle}`);
    return parseHtmlContent(actualContent, cleanedTitle, processedAssets);
  }
  
  // Final fallback - this should rarely happen now
  console.log(`⚠️  No content found for ${cleanedTitle}, using fallback`);
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

/**
 * Extract content files from the SCORM package
 */
async function extractContentFiles(zipContent: JSZip, manifest: ScormManifest): Promise<Map<string, string>> {
  const contentFiles = new Map<string, string>();
  
  console.log('📂 Extracting content files from SCORM package...');
  
  // Get all HTML files referenced in resources
  for (const resource of manifest.resources) {
    if (resource.href && (resource.href.endsWith('.html') || resource.href.endsWith('.htm'))) {
      try {
        const file = zipContent.file(resource.href);
        if (file) {
          const content = await file.async('text');
          contentFiles.set(resource.href, content);
          console.log(`✅ Extracted content from: ${resource.href}`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not extract ${resource.href}:`, error);
      }
    }
  }
  
  // Also look for common SCORM content files
  const commonPaths = ['index.html', 'content.html', 'lesson.html', 'main.html'];
  for (const path of commonPaths) {
    const file = zipContent.file(path);
    if (file && !contentFiles.has(path)) {
      try {
        const content = await file.async('text');
        contentFiles.set(path, content);
        console.log(`✅ Found and extracted: ${path}`);
      } catch (error) {
        console.warn(`⚠️  Could not extract ${path}:`, error);
      }
    }
  }
  
  console.log(`📊 Total content files extracted: ${contentFiles.size}`);
  return contentFiles;
}

/**
 * Process and upload assets from SCORM package
 */
async function processAssets(zipContent: JSZip, manifest: ScormManifest, supabase: any, orgId: string): Promise<Map<string, string>> {
  const processedAssets = new Map<string, string>();
  
  console.log('🖼️  Processing SCORM assets...');
  
  // Find all asset files (images, videos, etc.)
  const assetExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.mp3', '.wav', '.pdf'];
  const assetFiles: string[] = [];
  
  zipContent.forEach((relativePath, file) => {
    if (!file.dir) {
      const ext = relativePath.toLowerCase().substring(relativePath.lastIndexOf('.'));
      if (assetExtensions.includes(ext)) {
        assetFiles.push(relativePath);
      }
    }
  });
  
  console.log(`🔍 Found ${assetFiles.length} potential asset files`);
  
  // Process and upload assets (limit to reasonable number for performance)
  const maxAssets = 20;
  const assetsToProcess = assetFiles.slice(0, maxAssets);
  
  for (const assetPath of assetsToProcess) {
    try {
      const file = zipContent.file(assetPath);
      if (file) {
        const blob = await file.async('blob');
        const fileName = `scorm_assets/${Date.now()}_${assetPath.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('org-assets')
          .upload(`${orgId}/imports/${fileName}`, blob, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('org-assets')
            .getPublicUrl(data.path);
          
          processedAssets.set(assetPath, publicUrl);
          console.log(`✅ Uploaded asset: ${assetPath} -> ${publicUrl}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not process asset ${assetPath}:`, error);
    }
  }
  
  console.log(`📊 Total assets processed: ${processedAssets.size}`);
  return processedAssets;
}

/**
 * Parse HTML content and extract meaningful educational content
 */
function parseHtmlContent(htmlContent: string, title: string, processedAssets: Map<string, string>): string {
  try {
    const root = parseHtml(htmlContent);
    
    // Remove script tags and non-content elements
    root.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
    
    // Extract main content areas
    let mainContent = root.querySelector('main, .content, .lesson-content, #content, .main-content');
    if (!mainContent) {
      mainContent = root.querySelector('body') || root;
    }
    
    // Clean up and extract text content
    let extractedHtml = '';
    
    // Process headings
    const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      extractedHtml += `<h3>${title}</h3>\n`;
      
      headings.forEach((heading, index) => {
        if (index === 0 && heading.text.trim().toLowerCase() === title.toLowerCase()) {
          return; // Skip if it's the same as our title
        }
        const level = Math.max(4, parseInt(heading.tagName[1]) + 1); // Adjust heading level
        extractedHtml += `<h${level}>${heading.text.trim()}</h${level}>\n`;
      });
    } else {
      extractedHtml += `<h3>${title}</h3>\n`;
    }
    
    // Extract paragraphs and lists
    const contentElements = mainContent.querySelectorAll('p, ul, ol, div.text-content, .lesson-text');
    contentElements.forEach(el => {
      const text = el.text.trim();
      if (text && text.length > 20) { // Only include substantial content
        if (el.tagName === 'P') {
          extractedHtml += `<p>${text}</p>\n`;
        } else if (el.tagName === 'UL' || el.tagName === 'OL') {
          const listItems = el.querySelectorAll('li');
          if (listItems.length > 0) {
            extractedHtml += `<${el.tagName.toLowerCase()}>\n`;
            listItems.forEach(li => {
              if (li.text.trim()) {
                extractedHtml += `  <li>${li.text.trim()}</li>\n`;
              }
            });
            extractedHtml += `</${el.tagName.toLowerCase()}>\n`;
          }
        } else if (text.length > 50) {
          extractedHtml += `<p>${text}</p>\n`;
        }
      }
    });
    
    // Process images and update URLs
    const images = mainContent.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && processedAssets.has(src)) {
        const newSrc = processedAssets.get(src);
        const alt = img.getAttribute('alt') || 'Educational content image';
        extractedHtml += `<img src="${newSrc}" alt="${alt}" class="lesson-image" />\n`;
      }
    });
    
    // If we didn't extract much content, fall back to basic text extraction
    if (extractedHtml.length < 100) {
      const bodyText = mainContent.text.trim();
      if (bodyText.length > 50) {
        const sentences = bodyText.split('.').filter(s => s.trim().length > 20);
        extractedHtml = `<h3>${title}</h3>\n`;
        sentences.slice(0, 5).forEach(sentence => {
          extractedHtml += `<p>${sentence.trim()}.</p>\n`;
        });
      }
    }
    
    return extractedHtml || `<h3>${title}</h3>\n<p>Educational content for ${title.toLowerCase()}.</p>`;
    
  } catch (error) {
    console.warn('⚠️  Error parsing HTML content:', error);
    return `<h3>${title}</h3>\n<p>Learn about ${title.toLowerCase()} in this comprehensive lesson.</p>`;
  }
}