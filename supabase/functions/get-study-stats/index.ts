
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
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Fetch comprehensive study data
    const [sessionsData, flashcardsData, profileData] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('correct_answers, total_cards, session_duration_seconds, completed_at, created_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null),
      
      supabase
        .from('flashcards')
        .select('id, times_reviewed, times_correct, difficulty_level, created_at, last_reviewed_at')
        .eq('user_id', userId),
      
      supabase
        .from('profiles')
        .select('current_streak, total_xp, last_activity_date')
        .eq('id', userId)
        .single()
    ]);

    const sessions = sessionsData.data || [];
    const flashcards = flashcardsData.data || [];
    const profile = profileData.data;

    // Calculate comprehensive stats
    const totalSessions = sessions.length;
    const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = sessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Study time calculations
    const totalStudyMinutes = sessions.reduce((sum, s) => sum + (s.session_duration_seconds || 0), 0) / 60;
    const avgSessionTime = totalSessions > 0 ? Math.round(totalStudyMinutes / totalSessions) : 0;

    // Recent performance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = sessions.filter(s => new Date(s.completed_at) >= sevenDaysAgo);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    // Flashcard analytics
    const totalFlashcards = flashcards.length;
    const reviewedCards = flashcards.filter(f => f.times_reviewed > 0).length;
    const masteredCards = flashcards.filter(f => f.times_reviewed > 0 && (f.times_correct / f.times_reviewed) >= 0.8).length;
    const strugglingCards = flashcards.filter(f => f.times_reviewed >= 2 && (f.times_correct / f.times_reviewed) < 0.6).length;

    // Study frequency
    const daysSinceFirstSession = totalSessions > 0 ? 
      Math.max(1, Math.ceil((Date.now() - new Date(sessions[sessions.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const studyFrequency = daysSinceFirstSession > 0 ? totalSessions / daysSinceFirstSession : 0;

    const stats = {
      sessions: {
        total: totalSessions,
        recentWeek: recentSessions.length,
        avgDuration: avgSessionTime,
        totalMinutes: Math.round(totalStudyMinutes)
      },
      accuracy: {
        overall: overallAccuracy,
        recent: recentAccuracy,
        trend: recentAccuracy - overallAccuracy,
        totalCorrect,
        totalAnswered
      },
      flashcards: {
        total: totalFlashcards,
        reviewed: reviewedCards,
        mastered: masteredCards,
        struggling: strugglingCards,
        masteryRate: reviewedCards > 0 ? Math.round((masteredCards / reviewedCards) * 100) : 0
      },
      progress: {
        currentStreak: profile?.current_streak || 0,
        totalXP: profile?.total_xp || 0,
        studyFrequency: Math.round(studyFrequency * 10) / 10,
        lastActivity: profile?.last_activity_date
      }
    };

    return new Response(
      JSON.stringify({ stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching study stats:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
