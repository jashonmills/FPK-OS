
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
    const { userId, user_id, topic_filter, difficulty_filter } = await req.json();
    
    // Accept both userId and user_id for backwards compatibility
    const actualUserId = userId || user_id;
    
    if (!actualUserId) {
      console.error('❌ Missing user ID in request:', { userId, user_id });
      throw new Error('User ID is required');
    }

    console.log('📚 Fetching user flashcards for user:', actualUserId, {
      topic_filter,
      difficulty_filter
    });

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
        created_at
      `)
      .eq('user_id', actualUserId)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (topic_filter) {
      query = query.ilike('front_content', `%${topic_filter}%`);
    }

    if (difficulty_filter) {
      let difficultyLevel;
      switch (difficulty_filter.toLowerCase()) {
        case 'easy':
          difficultyLevel = 1;
          break;
        case 'medium':
          difficultyLevel = 2;
          break;
        case 'hard':
          difficultyLevel = 3;
          break;
        default:
          difficultyLevel = null;
      }
      
      if (difficultyLevel) {
        query = query.eq('difficulty_level', difficultyLevel);
      }
    }

    const { data: flashcards, error } = await query;

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('📚 Found flashcards:', flashcards?.length || 0);

    // Format flashcards for response
    const formattedCards = flashcards?.map(card => {
      const title = card.front_content.length > 50 
        ? card.front_content.substring(0, 50) + '...'
        : card.front_content;
      
      const snippet = card.back_content.length > 30
        ? card.back_content.substring(0, 30) + '...'
        : card.back_content;

      return {
        id: card.id,
        title: title,
        question: card.front_content,
        answer: card.back_content,
        snippet: snippet,
        created_at: card.created_at,
        stats: {
          correct: card.times_correct || 0,
          attempts: card.times_reviewed || 0,
          successRate: card.times_reviewed > 0 ? Math.round((card.times_correct / card.times_reviewed) * 100) : 0,
          difficulty: card.difficulty_level || 1,
          lastReviewed: card.last_reviewed_at
        }
      };
    }) || [];

    const response = {
      success: true,
      flashcards: formattedCards,
      total: formattedCards.length,
      message: formattedCards.length > 0 
        ? `Found ${formattedCards.length} flashcards`
        : 'No flashcards found for this user',
      isEmpty: formattedCards.length === 0,
      filters: {
        topic_filter,
        difficulty_filter
      }
    };

    console.log('✅ Returning flashcard response:', {
      count: response.total,
      isEmpty: response.isEmpty,
      hasFilters: !!(topic_filter || difficulty_filter)
    });

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching user flashcards:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        flashcards: [],
        total: 0,
        isEmpty: true,
        message: 'Failed to fetch flashcards'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
