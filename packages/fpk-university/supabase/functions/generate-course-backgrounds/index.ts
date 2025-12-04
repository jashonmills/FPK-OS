import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration is missing')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Course configurations
    const courses = [
      {
        id: 'elt-empowering-learning-techniques',
        filename: 'backgrounds/elt.png',
        prompt: 'A vibrant, inspiring educational background representing empowering learning techniques. Calming blues and energetic golds with subtle neural network patterns, growth symbols like ascending arrows and light bulbs. Modern, abstract, motivational. 16:9 aspect ratio, high quality, professional educational design.'
      },
      {
        id: 'interactive-science',
        filename: 'backgrounds/intro-science.png',
        prompt: 'A dynamic, exciting background for an interactive science course. Abstract atoms, DNA double helix, chemistry flasks, microscopes, planets, and stars in a clean modern style. Vibrant blues, greens, and purples. Educational energy and discovery. 16:9 aspect ratio, high quality, professional educational design.'
      }
    ]

    const results = []

    for (const course of courses) {
      console.log(`Generating image for ${course.id}...`)

      // Generate image with OpenAI
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: course.prompt,
          n: 1,
          size: '1536x1024',
          quality: 'high',
          output_format: 'webp',
          background: 'opaque'
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error for ${course.id}: ${error.error?.message || 'Failed to generate image'}`)
      }

      const data = await response.json()
      const base64Image = data.data[0].b64_json

      // Convert base64 to buffer
      const imageBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0))

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(course.filename, imageBuffer, {
          contentType: 'image/webp',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Failed to upload ${course.id}: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('course-images')
        .getPublicUrl(course.filename)

      console.log(`Successfully generated and uploaded: ${urlData.publicUrl}`)

      // Update course record in database
      const { error: updateError } = await supabase
        .from('courses')
        .update({ background_image: urlData.publicUrl })
        .eq('id', course.id)

      if (updateError) {
        console.error(`Failed to update database for ${course.id}:`, updateError)
      }

      results.push({
        courseId: course.id,
        imageUrl: urlData.publicUrl,
        filename: course.filename
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'All course backgrounds generated successfully',
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
