import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScormManifest {
  identifier: string
  version: string
  title: string
  description?: string
  organizations: any[]
  resources: any[]
  sequencingCollection?: any[]
  metadata?: any
}

interface ScormResource {
  identifier: string
  type: string
  href: string
  files?: string[]
  dependencies?: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔄 Processing SCORM package upload request')
    
    const formData = await req.formData()
    const scormFile = formData.get('scorm_package') as File
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const lessonNumber = parseInt(formData.get('lesson_number') as string) || 1

    if (!scormFile || !courseId || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: scorm_package, course_id, or title' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('📦 Processing SCORM package:', {
      fileName: scormFile.name,
      size: scormFile.size,
      courseId,
      title
    })

    // Validate that the file is a ZIP
    if (!scormFile.name.toLowerCase().endsWith('.zip')) {
      return new Response(
        JSON.stringify({ error: 'SCORM package must be a ZIP file' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate unique filename for the SCORM package
    const timestamp = Date.now()
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, '_')
    const packageFileName = `scorm_${courseId}_${sanitizedTitle}_${timestamp}.zip`
    
    // Upload the SCORM package to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('scorm-packages')
      .upload(packageFileName, scormFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload SCORM package', details: uploadError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('✅ SCORM package uploaded to storage:', uploadData.path)

    // Get the public URL for the uploaded package
    const { data: urlData } = supabaseClient.storage
      .from('scorm-packages')
      .getPublicUrl(packageFileName)

    const packageUrl = urlData.publicUrl

    // Extract and parse the SCORM manifest (simplified approach)
    // In a production environment, you'd want to extract the ZIP and parse imsmanifest.xml
    // For now, we'll create a basic manifest structure
    const manifest: ScormManifest = {
      identifier: `scorm_${timestamp}`,
      version: '1.2',
      title: title,
      description: description || 'SCORM Learning Content',
      organizations: [
        {
          identifier: `org_${timestamp}`,
          title: title,
          items: [
            {
              identifier: `item_${timestamp}`,
              title: title,
              resource: `resource_${timestamp}`
            }
          ]
        }
      ],
      resources: [
        {
          identifier: `resource_${timestamp}`,
          type: 'webcontent',
          href: 'index.html',
          scormType: 'sco'
        }
      ]
    }

    // Basic completion criteria
    const completionCriteria = {
      completionThreshold: 1.0,
      successStatus: 'passed',
      completionStatus: 'completed',
      scoreRange: { min: 0, max: 100 },
      timeLimit: null,
      attemptsAllowed: null
    }

    // Create lesson record in the database
    const { data: lesson, error: lessonError } = await supabaseClient
      .from('lessons')
      .insert({
        course_id: courseId,
        title: title,
        description: description,
        lesson_number: lessonNumber,
        content_type: 'scorm',
        scorm_package_url: packageUrl,
        scorm_manifest: manifest,
        scorm_completion_criteria: completionCriteria,
        is_published: false,
        sort_order: lessonNumber
      })
      .select()
      .single()

    if (lessonError) {
      console.error('❌ Database error:', lessonError)
      
      // Clean up uploaded file on database error
      await supabaseClient.storage
        .from('scorm-packages')
        .remove([packageFileName])

      return new Response(
        JSON.stringify({ error: 'Failed to create lesson record', details: lessonError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('✅ SCORM lesson created successfully:', lesson.id)

    const response = {
      success: true,
      lesson: lesson,
      manifest: manifest,
      packageUrl: packageUrl,
      message: 'SCORM package processed and lesson created successfully'
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error processing SCORM package:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})