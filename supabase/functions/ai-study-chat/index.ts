
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

async function getUserLearningContext(userId: string) {
  try {
    // Fetch comprehensive user data for AI analysis
    const [sessionsData, flashcardsData, profileData, goalsData] = await Promise.all([
      // Recent study sessions with detailed performance
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20),
      
      // Flashcards with performance metrics
      supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('last_reviewed_at', { ascending: false }),
      
      // User profile and preferences
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      
      // Active goals and progress
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
    ]);

    const sessions = sessionsData.data || [];
    const flashcards = flashcardsData.data || [];
    const profile = profileData.data;
    const goals = goalsData.data || [];

    // Calculate learning analytics
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed_at);
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Recent performance (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSessions = completedSessions.filter(s => new Date(s.created_at) >= weekAgo);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    // Study patterns
    const studyTimes = completedSessions.map(s => new Date(s.created_at).getHours());
    const preferredStudyTime = studyTimes.length > 0 ? 
      studyTimes.reduce((a, b, i, arr) => a + b / arr.length, 0) : 12;

    // Session types analysis
    const sessionTypes = completedSessions.reduce((acc, s) => {
      acc[s.session_type] = (acc[s.session_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Flashcard difficulty analysis
    const cardsByDifficulty = flashcards.reduce((acc, card) => {
      const level = card.difficulty_level || 1;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Struggling areas (cards with low success rate)
    const strugglingCards = flashcards.filter(card => {
      const successRate = card.times_reviewed > 0 ? (card.times_correct / card.times_reviewed) : 0;
      return card.times_reviewed >= 3 && successRate < 0.6;
    });

    // Streak and consistency
    const currentStreak = profile?.current_streak || 0;
    const totalXP = profile?.total_xp || 0;

    return {
      performance: {
        totalSessions,
        overallAccuracy,
        recentAccuracy,
        recentSessions: recentSessions.length,
        improvementTrend: recentAccuracy - overallAccuracy,
        currentStreak,
        totalXP
      },
      patterns: {
        preferredStudyTime: Math.round(preferredStudyTime),
        sessionTypes,
        cardsByDifficulty,
        strugglingCards: strugglingCards.length,
        strugglingTopics: strugglingCards.slice(0, 3).map(c => c.front_content.substring(0, 50))
      },
      goals: goals.map(g => ({
        title: g.title,
        progress: g.progress,
        category: g.category,
        priority: g.priority
      })),
      profile: {
        name: profile?.display_name || profile?.full_name || 'Student',
        learningStyles: profile?.learning_styles || [],
        totalCards: flashcards.length
      }
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    console.log('AI Coach request for user:', userId);

    // Check if Anthropic API key is available
    if (!anthropicApiKey) {
      console.log('Anthropic API key not found, returning fallback');
      return new Response(
        JSON.stringify({ 
          response: "I'm here to help guide your learning journey! While the AI coaching service is being configured, you can still use all the study features. Try creating flashcards or taking a study session to generate insights I can analyze!" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch comprehensive user learning context
    const learningContext = await getUserLearningContext(userId);

    // Create personalized coaching prompt
    let coachingPrompt = `You are an AI Learning Coach analyzing ${learningContext?.profile.name || 'this student'}'s educational journey. Be proactive, encouraging, and provide specific guidance.`;

    if (learningContext) {
      coachingPrompt += `

STUDENT LEARNING PROFILE:
- Total Study Sessions: ${learningContext.performance.totalSessions}
- Overall Accuracy: ${learningContext.performance.overallAccuracy}%
- Recent Week Accuracy: ${learningContext.performance.recentAccuracy}%
- Current Streak: ${learningContext.performance.currentStreak} days
- Total XP: ${learningContext.performance.totalXP}
- Total Flashcards: ${learningContext.profile.totalCards}

LEARNING PATTERNS:
- Preferred Study Time: ${learningContext.patterns.preferredStudyTime}:00
- Session Types Used: ${Object.keys(learningContext.patterns.sessionTypes).join(', ')}
- Cards Needing Attention: ${learningContext.patterns.strugglingCards}
- Performance Trend: ${learningContext.performance.improvementTrend > 5 ? 'Improving significantly!' : learningContext.performance.improvementTrend > 0 ? 'Steady improvement' : learningContext.performance.improvementTrend < -5 ? 'Needs attention' : 'Stable'}

ACTIVE GOALS:
${learningContext.goals.map(g => `- ${g.title} (${g.progress}% complete, ${g.priority} priority)`).join('\n') || 'No active goals set'}

STRUGGLING AREAS:
${learningContext.patterns.strugglingTopics.length > 0 ? learningContext.patterns.strugglingTopics.map(topic => `- ${topic}...`).join('\n') : 'No significant struggles identified'}

As their AI coach, analyze this data and provide:
1. Specific insights about their learning patterns
2. Actionable recommendations to improve weak areas
3. Encouragement based on their progress
4. Proactive suggestions for their next steps

Be conversational, supportive, and focus on helping them grow. Address their question: "${message}"`;
    } else {
      coachingPrompt += `\n\nThe student asked: "${message}"\n\nProvide encouraging guidance and suggest they complete some study sessions so you can analyze their learning patterns and provide personalized coaching.`;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
          max_tokens: 300,
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
    console.error('Error in AI coach:', error);
    
    // Personalized fallback responses
    const coachingFallbacks = [
      "I believe in your potential! Try creating some flashcards and taking a study session so I can analyze your learning style and provide personalized guidance.",
      "Every expert was once a beginner. Let's start building your study habits - try a quick memory test session and I'll help you identify your strengths!",
      "Your learning journey is unique. Complete a few study sessions and I'll help you discover the study methods that work best for you.",
      "Success in learning comes from consistency. Start with just 10 minutes of study today, and I'll help you build momentum!",
      "I'm here to help you turn your study challenges into strengths. Try some flashcard reviews and let's analyze your progress together!"
    ];
    
    const randomFallback = coachingFallbacks[Math.floor(Math.random() * coachingFallbacks.length)];
    
    return new Response(
      JSON.stringify({ response: randomFallback }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
