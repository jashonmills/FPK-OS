import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import JSZip from 'npm:jszip@3.10.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NativeCourseStructure {
  title: string;
  description: string;
  level: string;
  framework: string;
  modules: any[];
  durationEstimateMins?: number;
  backgroundImageUrl?: string;
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

    console.log('🚀 Starting native course import process');
    
    const formData = await req.formData();
    const courseFile = formData.get('course_package') as File;
    const orgId = formData.get('org_id') as string;
    const selectedFramework = formData.get('framework') as string || 'Framework2';
    const backgroundImageOverride = formData.get('background_image_url') as string;

    if (!courseFile || !orgId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: course_package or org_id' }),
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
        file_name: courseFile.name,
        file_size: courseFile.size,
        status: 'uploading',
        steps_log: [{
          step: 'uploading',
          status: 'processing',
          message: 'Starting native course import',
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
      await updateProgress('uploading', 'uploading', 'Uploading course package', 10);
      
      const timestamp = Date.now();
      const fileName = `native_course_${importId}_${timestamp}.zip`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('org-assets')
        .upload(`${orgId}/imports/${fileName}`, courseFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('org-assets')
        .getPublicUrl(uploadData.path);

      // Step 2: Extract and validate
      await updateProgress('validating', 'validating', 'Extracting course structure', 25);
      
      const arrayBuffer = await courseFile.arrayBuffer();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(arrayBuffer);

      console.log('📁 Available files in package:', Object.keys(zipContent.files));

      // Look for course.json files
      const courseJsonFiles = Object.keys(zipContent.files).filter(name => 
        name.includes('course.json') && name.includes(selectedFramework)
      );

      if (courseJsonFiles.length === 0) {
        // Fallback to any course.json
        const anyCourseJson = Object.keys(zipContent.files).filter(name => 
          name.endsWith('course.json')
        );
        
        if (anyCourseJson.length === 0) {
          throw new Error(`No course.json found in package. Available files: ${Object.keys(zipContent.files).slice(0, 10).join(', ')}`);
        }
        
        courseJsonFiles.push(anyCourseJson[0]);
        console.log(`⚠️ Selected framework ${selectedFramework} not found, using: ${anyCourseJson[0]}`);
      }

      const courseJsonPath = courseJsonFiles[0];
      console.log(`📋 Using course structure: ${courseJsonPath}`);

      // Step 3: Parse course structure
      await updateProgress('parsing', 'parsing', 'Parsing course content', 50);
      
      const courseJsonFile = zipContent.file(courseJsonPath);
      if (!courseJsonFile) {
        throw new Error(`Could not read course.json from ${courseJsonPath}`);
      }

      const courseJsonContent = await courseJsonFile.async('text');
      const courseStructure: NativeCourseStructure = JSON.parse(courseJsonContent);

      // Step 4: Extract lesson content
      await updateProgress('extracting_lessons', 'extracting_lessons', 'Extracting lesson content', 70);
      
      const lessonContents = await extractLessonContent(zipContent, courseJsonPath);

      // Step 5: Process final structure
      await updateProgress('mapping', 'mapping', 'Finalizing course structure', 85);
      
      // Apply background image override if provided
      if (backgroundImageOverride) {
        courseStructure.backgroundImageUrl = backgroundImageOverride;
      }

      // Ensure proper framework is set
      courseStructure.framework = courseStructure.framework || 'interactive_micro_learning';

      // Final step: Mark as ready
      await updateProgress('ready', 'ready', 'Import completed successfully', 100, {
        file_url: publicUrl,
        manifest_data: {
          title: courseStructure.title,
          framework: courseStructure.framework,
          modules_count: courseStructure.modules?.length || 0
        },
        mapped_structure: courseStructure,
        completed_at: new Date().toISOString()
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          importId: importId,
          message: 'Native course imported successfully',
          courseStructure: {
            title: courseStructure.title,
            framework: courseStructure.framework,
            modulesCount: courseStructure.modules?.length || 0
          }
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

async function extractLessonContent(zipContent: JSZip, courseJsonPath: string): Promise<Map<string, string>> {
  const lessonContents = new Map<string, string>();
  const basePath = courseJsonPath.substring(0, courseJsonPath.lastIndexOf('/'));
  
  // Look for lesson files (markdown files)
  const lessonFiles = Object.keys(zipContent.files).filter(name => 
    name.startsWith(basePath) && 
    name.endsWith('.md') && 
    name.includes('lesson')
  );

  console.log(`📚 Found ${lessonFiles.length} lesson files to extract`);

  for (const lessonPath of lessonFiles) {
    try {
      const lessonFile = zipContent.file(lessonPath);
      if (lessonFile && !zipContent.files[lessonPath].dir) {
        const content = await lessonFile.async('text');
        const lessonName = lessonPath.split('/').pop()?.replace('.md', '') || lessonPath;
        lessonContents.set(lessonName, content);
        console.log(`✅ Extracted lesson: ${lessonName}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not extract lesson ${lessonPath}:`, error);
    }
  }

  return lessonContents;
}