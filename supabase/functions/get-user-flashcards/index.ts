
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
    const { userId, filter = {}, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Fetching user flashcards:', { userId, filter, limit, sortBy, sortOrder });

    let query = supabase
      .from('flashcards')
      .select(`
        id,
        front_content,
        back_content,
        difficulty_level,
        times_reviewed,
        times_correct,
        last_reviewed_at,
        created_at,
        updated_at
      `)
      .eq('user_id', userId);

    // Apply filters
    if (filter.difficulty) {
      query = query.eq('difficulty_level', filter.difficulty);
    }

    if (filter.needsPractice) {
      // Cards with low success rate or not reviewed recently
      query = query.or('times_correct.lt.times_reviewed,last_reviewed_at.lt.2024-01-01');
    }

    if (filter.searchTerm) {
      query = query.or(`front_content.ilike.%${filter.searchTerm}%,back_content.ilike.%${filter.searchTerm}%`);
    }

    // Apply sorting
    const ascending = sortOrder === 'asc';
    query = query.order(sortBy, { ascending }).limit(limit);

    const { data: flashcards, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Found flashcards:', flashcards?.length || 0);

    // Format response for Claude
    const formattedCards = flashcards?.map(card => {
      const successRate = card.times_reviewed > 0 ? Math.round((card.times_correct / card.times_reviewed) * 100) : 0;
      const daysSinceReview = card.last_reviewed_at 
        ? Math.floor((Date.now() - new Date(card.last_reviewed_at).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        id: card.id,
        front: card.front_content,
        back: card.back_content,
        created_at: card.created_at,
        stats: {
          correct: card.times_correct || 0,
          attempts: card.times_reviewed || 0,
          successRate,
          difficulty: card.difficulty_level || 1,
          lastReviewed: card.last_reviewed_at,
          daysSinceReview,
          needsPractice: successRate < 70 || (daysSinceReview && daysSinceReview > 7)
        }
      };
    }) || [];

    return new Response(
      JSON.stringify({ 
        flashcards: formattedCards,
        total: formattedCards.length,
        filter: filter,
        message: formattedCards.length > 0 
          ? `Found ${formattedCards.length} flashcards matching your criteria`
          : 'No flashcards found matching your criteria'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching user flashcards:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        flashcards: [],
        total: 0,
        message: 'Failed to fetch flashcards'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
