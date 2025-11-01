import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set')
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration is missing')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get batch parameters from request
    const { batchSize = 4, startIndex = 0 } = await req.json().catch(() => ({}))

    // Course configurations with detailed prompts
    const courses = [
      {
        id: 'el-handwriting',
        filename: 'el-handwriting-bg.jpg',
        prompt: 'Beautiful vibrant flowers in a garden, colorful blooms, nature photography, soft natural lighting, educational and calming atmosphere. 16:9 aspect ratio, high quality, professional photography style.'
      },
      {
        id: 'empowering-learning-numeracy',
        filename: 'empowering-numeracy-bg.jpg',
        prompt: 'Colorful geometric shapes and numbers floating in space, mathematical concepts, vibrant blues and oranges, modern educational design, playful and engaging. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'learning-state-beta',
        filename: 'learning-state-course-bg.jpg',
        prompt: 'Peaceful calming blue gradient background, serene learning environment, soft ethereal lighting, meditative and focused atmosphere, tranquil educational setting. 16:9 aspect ratio, high quality, professional design.'
      },
      {
        id: 'empowering-learning-reading',
        filename: 'empowering-reading-bg.jpg',
        prompt: 'Cozy library scene with books, warm reading atmosphere, comfortable learning space, knowledge and literature theme, inviting educational environment. 16:9 aspect ratio, high quality, professional photography style.'
      },
      {
        id: 'el-spelling',
        filename: 'el-spelling-thumbnail.png',
        prompt: 'Students learning and collaborating, educational classroom environment, diverse learners engaged in spelling activities, bright and encouraging atmosphere, modern educational setting. 16:9 aspect ratio, high quality, professional educational photography.'
      },
      {
        id: 'elt-empowering-learning-techniques',
        filename: 'elt-background-generated.jpg',
        prompt: 'Abstract neural network patterns with growth symbols, light bulbs and ascending arrows, vibrant blues and energetic golds, modern empowering learning visualization, inspirational educational design. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'empowering-learning-handwriting',
        filename: 'empowering-handwriting-bg.jpg',
        prompt: 'Elegant handwriting practice, beautiful cursive letters, pen and paper close-up, artistic writing scene, educational and inspiring atmosphere. 16:9 aspect ratio, high quality, professional photography style.'
      },
      {
        id: 'interactive-algebra',
        filename: 'linear-equations-background.jpg',
        prompt: 'Abstract mathematical visualization with linear equations, graphs and coordinate systems, vibrant colors, modern educational math design, clean and professional. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'geometry',
        filename: 'interactive-geometry-fundamentals-bg.jpg',
        prompt: 'Interactive geometric shapes, polygons, angles, and mathematical patterns, colorful educational visualization, modern geometry concepts, engaging mathematical design. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'interactive-linear-equations',
        filename: 'linear-equations-unique-bg.jpg',
        prompt: 'Dynamic linear equation graphs, mathematical functions on coordinate plane, vibrant educational colors, abstract math art, professional mathematical visualization. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'interactive-trigonometry',
        filename: 'trigonometry-background.jpg',
        prompt: 'Trigonometric concepts visualization, sine and cosine waves, unit circle, triangles, mathematical beauty, vibrant educational design. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'creative-writing-short-stories-poetry',
        filename: 'creative-writing-bg.jpg',
        prompt: 'Creative writing scene with vintage typewriter, literary atmosphere, books and manuscripts, inspiring writing environment, warm artistic lighting. 16:9 aspect ratio, high quality, professional photography style.'
      }
    ]

    // Process only a batch of courses
    const batch = courses.slice(startIndex, startIndex + batchSize)
    const results = []

    console.log(`Processing batch: ${startIndex} to ${startIndex + batchSize} (${batch.length} courses)`)

    for (const course of batch) {
      console.log(`Generating image for ${course.id}...`)

      try {
        // Generate image with Lovable AI (Nano Banana)
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: course.prompt
              }
            ],
            modalities: ['image', 'text']
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`AI generation error for ${course.id}:`, response.status, errorText)
          results.push({
            courseId: course.id,
            success: false,
            error: `AI generation failed: ${response.status}`
          })
          continue
        }

        const data = await response.json()
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

        if (!imageUrl) {
          console.error(`No image URL in response for ${course.id}`)
          results.push({
            courseId: course.id,
            success: false,
            error: 'No image URL in AI response'
          })
          continue
        }

        // Extract base64 data from data URL
        const base64Data = imageUrl.split(',')[1]
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-images')
          .upload(course.filename, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error(`Upload failed for ${course.id}:`, uploadError)
          results.push({
            courseId: course.id,
            success: false,
            error: uploadError.message
          })
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('course-images')
          .getPublicUrl(course.filename)

        console.log(`✅ Successfully generated and uploaded: ${course.id} -> ${urlData.publicUrl}`)

        results.push({
          courseId: course.id,
          success: true,
          imageUrl: urlData.publicUrl,
          filename: course.filename
        })
      } catch (error) {
        console.error(`Error processing ${course.id}:`, error)
        results.push({
          courseId: course.id,
          success: false,
          error: error.message
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    const hasMore = startIndex + batchSize < courses.length
    const nextIndex = startIndex + batchSize

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Batch complete: ${successCount} succeeded, ${failCount} failed`,
        summary: { 
          successCount, 
          failCount, 
          hasMore,
          nextIndex,
          totalCourses: courses.length,
          processed: startIndex + batch.length
        },
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Fatal error:', error)
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
