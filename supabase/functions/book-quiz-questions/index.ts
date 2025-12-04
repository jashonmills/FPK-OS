
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

    // Build the query - if max_chapter_index is very high (999), don't filter by chapter
    let query = supabaseClient
      .from('book_quiz_questions')
      .select('*')
      .eq('book_id', book_id)
      .limit(question_count * 2) // Get more than needed for shuffling

    // Only filter by chapter if it's not the "whole book" indicator (999)
    if (max_chapter_index < 999) {
      query = query.lte('chapter_index', max_chapter_index)
    }

    const { data: questions, error } = await query

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
