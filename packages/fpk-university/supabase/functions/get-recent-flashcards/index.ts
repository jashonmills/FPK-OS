
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
    const { userId, limit = 5 } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('📚 Fetching recent flashcards for user:', userId, 'limit:', limit);

    const { data: flashcards, error } = await supabase
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('📚 Found flashcards:', flashcards?.length || 0);

    // Enhanced formatting for Claude to understand and present properly
    const formattedCards = flashcards?.map(card => {
      // Extract a meaningful title from the front content (first few words)
      const title = card.front_content.length > 50 
        ? card.front_content.substring(0, 50) + '...'
        : card.front_content;
      
      // Extract snippet from back content (first few words)
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

    // Enhanced response structure for better AI parsing
    const response = {
      success: true,
      flashcards: formattedCards,
      total: formattedCards.length,
      message: formattedCards.length > 0 
        ? `Found ${formattedCards.length} recent flashcards`
        : 'No flashcards found for this user',
      isEmpty: formattedCards.length === 0,
      // Add metadata for AI to understand context
      metadata: {
        userHasFlashcards: formattedCards.length > 0,
        requestedLimit: limit,
        actualCount: formattedCards.length
      }
    };

    console.log('📚 Returning enhanced flashcard response:', {
      count: response.total,
      isEmpty: response.isEmpty,
      hasData: response.success
    });

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching recent flashcards:', error);
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
