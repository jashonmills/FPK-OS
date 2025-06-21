
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { book_id, max_chapter_index = 1, question_count = 5 } = await req.json()

    if (!book_id) {
      return new Response(
        JSON.stringify({ error: 'book_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch quiz questions for chapters user has read
    const { data: questions, error } = await supabaseClient
      .from('book_quiz_questions')
      .select('*')
      .eq('book_id', book_id)
      .lte('chapter_index', max_chapter_index)
      .limit(question_count * 2) // Get more than needed for shuffling

    if (error) {
      throw error
    }

    // Shuffle questions and take the requested amount
    const shuffledQuestions = questions
      ?.sort(() => Math.random() - 0.5)
      .slice(0, question_count)
      .map(q => ({
        ...q,
        // Shuffle answer options
        options: [q.correct_answer, ...q.wrong_answers]
          .sort(() => Math.random() - 0.5)
      })) || []

    return new Response(
      JSON.stringify({ questions: shuffledQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
