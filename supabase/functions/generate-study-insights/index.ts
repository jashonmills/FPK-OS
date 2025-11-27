
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

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

    console.log('Generating proactive insights for user:', userId);

    // Fetch comprehensive user data
    const [sessionsData, flashcardsData, profileData, goalsData] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(30),
      
      supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
    ]);

    const sessions = sessionsData.data || [];
    const flashcards = flashcardsData.data || [];
    const profile = profileData.data;
    const goals = goalsData.data || [];

    if (sessions.length === 0) {
      return new Response(
        JSON.stringify({ 
          insights: [{
            type: 'motivation',
            title: 'Ready to Begin Your Learning Journey?',
            message: 'Start your first study session to unlock personalized AI insights about your learning patterns, strengths, and areas for improvement. Your AI coach is ready to analyze your progress!',
            priority: 'high'
          }]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Detailed analytics
    const completedSessions = sessions.filter(s => s.completed_at);
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    
    // Weekly performance analysis
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSessions = completedSessions.filter(s => new Date(s.created_at) >= weekAgo);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    // Learning patterns
    const studyTimes = completedSessions.map(s => new Date(s.created_at).getHours());
    const avgStudyTime = studyTimes.length > 0 ? Math.round(studyTimes.reduce((a, b) => a + b, 0) / studyTimes.length) : 12;
    
    // Session consistency
    const sessionsThisWeek = recentSessions.length;
    const consistency = sessionsThisWeek >= 5 ? 'excellent' : sessionsThisWeek >= 3 ? 'good' : sessionsThisWeek >= 1 ? 'moderate' : 'needs_improvement';

    // Difficulty analysis
    const strugglingCards = flashcards.filter(card => {
      const successRate = card.times_reviewed > 0 ? (card.times_correct / card.times_reviewed) : 0;
      return card.times_reviewed >= 2 && successRate < 0.5;
    });

    // Performance trend
    const performanceTrend = recentAccuracy - overallAccuracy;
    const trendText = performanceTrend > 10 ? 'rapidly improving' : 
                     performanceTrend > 5 ? 'improving steadily' :
                     performanceTrend > -5 ? 'stable performance' :
                     performanceTrend > -10 ? 'slight decline' : 'needs attention';

    // Goal progress analysis
    const activeGoals = goals.filter(g => g.status === 'active');
    const goalProgress = activeGoals.reduce((sum, g) => sum + g.progress, 0) / Math.max(activeGoals.length, 1);

    // Enhanced prompt for more insightful analysis
    const analysisData = {
      profile: {
        name: profile?.display_name || 'Student',
        totalSessions: completedSessions.length,
        totalCards: flashcards.length,
        currentStreak: profile?.current_streak || 0,
        totalXP: profile?.total_xp || 0
      },
      performance: {
        overallAccuracy,
        recentAccuracy,
        performanceTrend,
        trendText,
        sessionsThisWeek,
        consistency
      },
      patterns: {
        avgStudyTime,
        strugglingCardsCount: strugglingCards.length,
        sessionTypes: [...new Set(completedSessions.map(s => s.session_type))],
        mostStudiedHour: studyTimes.length > 0 ? studyTimes.sort((a,b) => 
          studyTimes.filter(v => v === a).length - studyTimes.filter(v => v === b).length
        ).pop() : 12
      },
      goals: {
        activeCount: activeGoals.length,
        averageProgress: Math.round(goalProgress),
        categories: [...new Set(activeGoals.map(g => g.category))]
      }
    };

    const prompt = `As an AI Learning Coach, analyze this student's comprehensive learning data and provide 3-4 personalized, actionable insights:

STUDENT PROFILE:
- Name: ${analysisData.profile.name}
- Study Sessions Completed: ${analysisData.profile.totalSessions}
- Flashcards Created: ${analysisData.profile.totalCards}
- Current Streak: ${analysisData.profile.currentStreak} days
- Total XP Earned: ${analysisData.profile.totalXP}

PERFORMANCE ANALYSIS:
- Overall Accuracy: ${analysisData.performance.overallAccuracy}%
- Recent Week Accuracy: ${analysisData.performance.recentAccuracy}%
- Performance Trend: ${analysisData.performance.trendText}
- Study Sessions This Week: ${analysisData.performance.sessionsThisWeek}
- Study Consistency: ${analysisData.performance.consistency}

LEARNING PATTERNS:
- Preferred Study Time: ${analysisData.patterns.avgStudyTime}:00
- Cards Needing Extra Practice: ${analysisData.patterns.strugglingCardsCount}
- Session Types Used: ${analysisData.patterns.sessionTypes.join(', ')}
- Most Active Study Hour: ${analysisData.patterns.mostStudiedHour}:00

GOALS & OBJECTIVES:
- Active Goals: ${analysisData.goals.activeCount}
- Average Goal Progress: ${analysisData.goals.averageProgress}%
- Focus Areas: ${analysisData.goals.categories.join(', ') || 'No specific categories'}

Provide insights as JSON array with this format:
[{
  "type": "performance|pattern|recommendation|motivation",
  "title": "Specific, actionable title",
  "message": "Detailed insight with specific strategies and encouragement based on their data",
  "priority": "high|medium|low"
}]

Focus on:
1. Celebrating their achievements and progress
2. Identifying specific improvement opportunities
3. Providing actionable study strategies
4. Encouraging consistency and growth mindset
5. Connecting insights to their goals and patterns

Be encouraging, specific, and reference their actual data points.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI Learning Coach that provides personalized, encouraging, and actionable study insights. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('AI coaching insights response:', generatedText);
    
    let insights;
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Enhanced fallback insights based on actual data
      insights = [
        {
          type: 'performance',
          title: `${analysisData.performance.overallAccuracy >= 80 ? 'Excellent' : analysisData.performance.overallAccuracy >= 60 ? 'Good' : 'Improving'} Study Performance`,
          message: `You've completed ${analysisData.profile.totalSessions} study sessions with ${analysisData.performance.overallAccuracy}% accuracy! ${analysisData.performance.performanceTrend > 0 ? 'Your recent performance shows improvement - keep up the momentum!' : 'Focus on consistent practice to build stronger retention patterns.'}`,
          priority: 'high'
        },
        {
          type: 'pattern',
          title: 'Study Timing Optimization',
          message: `You typically study around ${analysisData.patterns.avgStudyTime}:00. ${analysisData.performance.sessionsThisWeek >= 3 ? 'Your consistency this week is great!' : 'Try to establish a more regular study schedule for better retention.'}`,
          priority: 'medium'
        }
      ];
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating coaching insights:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
