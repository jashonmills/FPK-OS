
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Optimized user context fetching
async function getUserLearningContext(userId: string) {
  try {
    console.log('Fetching learning context for user:', userId);
    
    const [sessionsData, flashcardsData, profileData] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('correct_answers, total_cards, session_type, created_at, completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10),
      
      supabase
        .from('flashcards')
        .select('difficulty_level, times_reviewed, times_correct, front_content')
        .eq('user_id', userId)
        .limit(20),
      
      supabase
        .from('profiles')
        .select('display_name, full_name, current_streak, total_xp')
        .eq('id', userId)
        .single()
    ]);

    const sessions = sessionsData.data || [];
    const flashcards = flashcardsData.data || [];
    const profile = profileData.data;

    // Calculate analytics
    const completedSessions = sessions.filter(s => s.completed_at);
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const recentSessions = completedSessions.slice(0, 5);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    const strugglingCards = flashcards.filter(card => {
      const successRate = card.times_reviewed > 0 ? (card.times_correct / card.times_reviewed) : 0;
      return card.times_reviewed >= 2 && successRate < 0.6;
    }).length;

    return {
      performance: {
        totalSessions: completedSessions.length,
        overallAccuracy,
        recentAccuracy,
        improvementTrend: recentAccuracy - overallAccuracy,
        currentStreak: profile?.current_streak || 0,
        totalXP: profile?.total_xp || 0
      },
      profile: {
        name: profile?.display_name || profile?.full_name || 'Student',
        totalCards: flashcards.length,
        strugglingCards
      }
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

// Get recent chat history for context
async function getChatHistory(sessionId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).reverse();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId } = await req.json();
    
    console.log('AI Coach request received:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      hasSessionId: !!sessionId 
    });
    
    if (!message || !userId) {
      console.error('Missing required parameters:', { message: !!message, userId: !!userId });
      throw new Error('Message and user ID are required');
    }

    // Check if Anthropic API key is available
    if (!anthropicApiKey) {
      console.log('Anthropic API key not found, returning fallback');
      const fallbacks = [
        "I'm here to help guide your learning journey! While the AI coaching service is being configured, you can still use all the study features.",
        "Great question! Try creating some flashcards and taking study sessions so I can analyze your learning patterns.",
        "I believe in your potential! Let's start building your study habits with consistent practice."
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      
      return new Response(
        JSON.stringify({ response: randomFallback }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user context and chat history
    console.log('Fetching user context and chat history...');
    const [learningContext, chatHistory] = await Promise.all([
      getUserLearningContext(userId),
      sessionId ? getChatHistory(sessionId, 8) : Promise.resolve([])
    ]);

    // Build conversation context
    let conversationContext = '';
    if (chatHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n' + 
        chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
    }

    // Build coaching prompt
    let coachingPrompt = `You are an AI Learning Coach. Be encouraging and provide specific guidance in 2-3 sentences.

Student: ${learningContext?.profile.name || 'Student'}`;

    if (learningContext && learningContext.performance.totalSessions > 0) {
      coachingPrompt += `
Sessions: ${learningContext.performance.totalSessions}
Accuracy: ${learningContext.performance.overallAccuracy}% overall, ${learningContext.performance.recentAccuracy}% recent
Streak: ${learningContext.performance.currentStreak} days
Cards: ${learningContext.profile.totalCards} total, ${learningContext.profile.strugglingCards} need practice

Trend: ${learningContext.performance.improvementTrend > 5 ? 'Improving!' : learningContext.performance.improvementTrend > 0 ? 'Steady' : 'Needs focus'}`;
    }

    coachingPrompt += conversationContext;
    coachingPrompt += `\nLatest question: "${message}"\n\nProvide specific, encouraging guidance based on their data and conversation history.`;

    if (!learningContext || learningContext.performance.totalSessions === 0) {
      coachingPrompt += ' Encourage them to start studying so you can provide personalized guidance.';
    }

    console.log('Calling Anthropic API...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': anthropicApiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: coachingPrompt
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('Anthropic API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Anthropic API error: ${response.status} - ${errorText}`);
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content?.[0]?.text || "I'm here to guide your learning journey!";
      
      console.log('AI Coach response generated successfully');

      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('Error in AI coach function:', error);
    
    const smartFallbacks = [
      "I'm analyzing your learning patterns! Try a study session and I'll provide personalized insights about your progress.",
      "Every learning journey is unique. Start with some flashcard practice and I'll help identify your optimal study strategies.",
      "Consistency beats intensity! Even 10 minutes of focused study creates valuable data for me to analyze and guide you.",
      "Your growth mindset is your superpower! Take a quick study session and I'll help turn your challenges into strengths.",
      "Building strong learning habits takes time. Let's start with one study session and build momentum together!"
    ];
    
    const randomFallback = smartFallbacks[Math.floor(Math.random() * smartFallbacks.length)];
    
    return new Response(
      JSON.stringify({ response: randomFallback }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
