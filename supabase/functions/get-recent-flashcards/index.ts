
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

    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select(`
        id,
        front_content,
        back_content,
        folder_name,
        difficulty_level,
        times_reviewed,
        times_correct,
        last_reviewed_at,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Calculate success rate and format response
    const formattedCards = flashcards?.map(card => ({
      id: card.id,
      front: card.front_content,
      back: card.back_content,
      folder: card.folder_name || 'General',
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
      JSON.stringify({ flashcards: formattedCards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching recent flashcards:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
