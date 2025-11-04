import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-library-api-key',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify API key
    const apiKey = req.headers.get('x-library-api-key')
    const expectedKey = Deno.env.get('LIBRARY_PORTAL_API_KEY')
    
    if (!apiKey || apiKey !== expectedKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse query parameters
    const url = new URL(req.url)
    const mode = url.searchParams.get('mode')
    const courseId = url.searchParams.get('id')

    // Mode: List all courses
    if (mode === 'list') {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          short_description,
          artwork_url,
          duration_hours,
          is_published,
          created_at
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ courses }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Mode: Get single course with all lessons
    if (mode === 'course' && courseId) {
      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          short_description,
          artwork_url,
          duration_hours,
          learning_objectives,
          is_published
        `)
        .eq('id', courseId)
        .eq('is_published', true)
        .single()

      if (courseError) {
        throw courseError
      }

      if (!course) {
        return new Response(
          JSON.stringify({ error: 'Course not found' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Fetch all units/modules for this course
      const { data: units, error: unitsError } = await supabase
        .from('course_units')
        .select(`
          id,
          title,
          description,
          order_index,
          unit_type
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (unitsError) {
        throw unitsError
      }

      // Fetch all lessons for this course
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          content,
          content_type,
          order_index,
          unit_id,
          duration_minutes,
          is_published
        `)
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      if (lessonsError) {
        throw lessonsError
      }

      // Organize lessons by unit
      const unitsWithLessons = units.map(unit => ({
        ...unit,
        lessons: lessons.filter(lesson => lesson.unit_id === unit.id)
      }))

      return new Response(
        JSON.stringify({
          course,
          units: unitsWithLessons
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Mode: Get single lesson content
    if (mode === 'lesson' && courseId) {
      const lessonId = url.searchParams.get('lessonId')
      
      if (!lessonId) {
        return new Response(
          JSON.stringify({ error: 'Lesson ID required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Fetch lesson details
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          content,
          content_type,
          duration_minutes,
          course_id,
          unit_id,
          is_published
        `)
        .eq('id', lessonId)
        .eq('course_id', courseId)
        .eq('is_published', true)
        .single()

      if (lessonError) {
        throw lessonError
      }

      if (!lesson) {
        return new Response(
          JSON.stringify({ error: 'Lesson not found' }),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Fetch all lessons in this course for navigation
      const { data: allLessons, error: allLessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          order_index,
          unit_id
        `)
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      if (allLessonsError) {
        throw allLessonsError
      }

      // Fetch course title for breadcrumb
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single()

      if (courseError) {
        throw courseError
      }

      return new Response(
        JSON.stringify({
          lesson,
          course,
          allLessons
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Invalid mode
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Use ?mode=list, ?mode=course&id=X, or ?mode=lesson&id=X&lessonId=Y' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in library-portal-api:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
