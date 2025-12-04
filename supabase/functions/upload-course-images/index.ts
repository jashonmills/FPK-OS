import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration is missing')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // List of course images to upload
    const courseImages = [
      'empowering-handwriting-bg.jpg',
      'el-handwriting-bg.jpg',
      'empowering-numeracy-bg.jpg',
      'empowering-reading-bg.jpg',
      'empowering-spelling-new-bg.jpg',
      'learning-state-course-bg.jpg',
      'linear-equations-unique-bg.jpg',
      'trigonometry-background.jpg',
      'linear-equations-background.jpg',
      'logic-background.jpg',
      'economics-background.jpg',
      'neurodiversity-background.jpg',
      'money-management-background.jpg',
      'interactive-geometry-fundamentals-bg.jpg',
      'elt-background-generated.jpg',
      'science-background-generated.jpg',
      'creative-writing-bg.jpg',
      'drawing-sketching-bg.jpg',
      'philosophy-bg.jpg'
    ]

    const results = {
      success: [] as string[],
      failed: [] as { file: string; error: string }[]
    }

    for (const filename of courseImages) {
      try {
        console.log(`Processing ${filename}...`)
        
        // Read the file from the local file system
        const imagePath = `../../storage/course-images/${filename}`
        let imageData: Uint8Array
        
        try {
          imageData = await Deno.readFile(imagePath)
        } catch (error) {
          console.error(`Failed to read ${filename}:`, error)
          results.failed.push({ file: filename, error: `File not found: ${error.message}` })
          continue
        }

        // Determine content type
        const contentType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') 
          ? 'image/jpeg' 
          : filename.endsWith('.png') 
          ? 'image/png' 
          : 'image/jpeg'

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('course-images')
          .upload(filename, imageData, {
            contentType,
            upsert: true,
            cacheControl: '3600'
          })

        if (error) {
          console.error(`Error uploading ${filename}:`, error)
          results.failed.push({ file: filename, error: error.message })
        } else {
          console.log(`✓ Successfully uploaded ${filename}`)
          results.success.push(filename)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error processing ${filename}:`, errorMessage)
        results.failed.push({ file: filename, error: errorMessage })
      }
    }

    console.log('\n=== Upload Summary ===')
    console.log(`✓ Successful: ${results.success.length}/${courseImages.length}`)
    console.log(`✗ Failed: ${results.failed.length}/${courseImages.length}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Uploaded ${results.success.length}/${courseImages.length} images`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})