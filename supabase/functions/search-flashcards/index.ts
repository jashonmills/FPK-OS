
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, query, filter } = await req.json();
    
    if (!userId || !query) {
      throw new Error('User ID and search query are required');
    }

    let supabaseQuery = supabase
      .from('flashcards')
      .select(`
        id,
        front_content,
        back_content,
        category,
        folder_name,
        difficulty_level,
        times_reviewed,
        times_correct,
        last_reviewed_at,
        created_at
      `)
      .eq('user_id', userId);

    // Apply search filters
    if (filter === 'low success') {
      // Find cards with low success rate (less than 60%)
      supabaseQuery = supabaseQuery
        .gt('times_reviewed', 1)
        .lt('times_correct', supabaseQuery.select('times_reviewed * 0.6'));
    } else if (filter === 'needs practice') {
      // Cards reviewed but not mastered
      supabaseQuery = supabaseQuery
        .gt('times_reviewed', 0)
        .lt('times_correct', supabaseQuery.select('times_reviewed * 0.8'));
    } else {
      // Full-text search
      supabaseQuery = supabaseQuery
        .or(`front_content.ilike.%${query}%,back_content.ilike.%${query}%,category.ilike.%${query}%,folder_name.ilike.%${query}%`);
    }

    const { data: flashcards, error } = await supabaseQuery
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    const formattedCards = flashcards?.map(card => ({
      id: card.id,
      front: card.front_content,
      back: card.back_content,
      folder: card.folder_name || card.category || 'General',
      created_at: card.created_at,
      stats: {
        correct: card.times_correct || 0,
        attempts: card.times_reviewed || 0,
        successRate: card.times_reviewed > 0 ? Math.round((card.times_correct / card.times_reviewed) * 100) : 0,
        difficulty: card.difficulty_level || 1,
        lastReviewed: card.last_reviewed_at
      }
    })) || [];

    return new Response(
      JSON.stringify({ flashcards: formattedCards, query, resultsCount: formattedCards.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error searching flashcards:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
