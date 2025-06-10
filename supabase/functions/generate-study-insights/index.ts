
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

    console.log('Generating insights for user:', userId);

    // Fetch user's study sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (sessionsError) {
      throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
    }

    // Fetch user's flashcards
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (flashcardsError) {
      throw new Error(`Failed to fetch flashcards: ${flashcardsError.message}`);
    }

    // Calculate study statistics
    const totalSessions = sessions?.length || 0;
    const totalCards = flashcards?.length || 0;
    
    if (totalSessions === 0) {
      return new Response(
        JSON.stringify({ 
          insights: [{
            type: 'motivation',
            title: 'Start Your Learning Journey',
            message: 'Begin studying to unlock personalized AI insights about your learning patterns and performance.',
            priority: 'high'
          }]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const completedSessions = sessions?.filter(s => s.completed_at) || [];
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const averageAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    
    // Calculate weekly performance
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSessions = completedSessions.filter(s => new Date(s.created_at) >= weekAgo);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    // Calculate study time patterns
    const studyTimes = completedSessions.map(s => new Date(s.created_at).getHours());
    const avgStudyTime = studyTimes.length > 0 ? Math.round(studyTimes.reduce((a, b) => a + b, 0) / studyTimes.length) : 12;

    // Prepare data for AI analysis
    const analysisData = {
      totalSessions,
      totalCards,
      averageAccuracy,
      recentAccuracy,
      recentSessions: recentSessions.length,
      avgStudyTime,
      sessionTypes: [...new Set(completedSessions.map(s => s.session_type))],
      improvementTrend: recentAccuracy - averageAccuracy,
      studyConsistency: recentSessions.length >= 3 ? 'consistent' : 'inconsistent'
    };

    // Generate AI insights
    const prompt = `Analyze this student's learning data and provide 2-3 personalized study insights:

Study Statistics:
- Total study sessions: ${analysisData.totalSessions}
- Total flashcards: ${analysisData.totalCards}
- Overall accuracy: ${analysisData.averageAccuracy}%
- Recent week accuracy: ${analysisData.recentAccuracy}%
- Recent sessions this week: ${analysisData.recentSessions}
- Preferred study time: ${analysisData.avgStudyTime}:00
- Session types used: ${analysisData.sessionTypes.join(', ')}
- Performance trend: ${analysisData.improvementTrend > 0 ? 'improving' : analysisData.improvementTrend < 0 ? 'declining' : 'stable'}

Provide insights as JSON array with format:
[{
  "type": "performance|pattern|recommendation|motivation",
  "title": "Short descriptive title",
  "message": "Detailed insight with actionable advice",
  "priority": "high|medium|low"
}]

Focus on actionable advice for improving learning effectiveness.`;

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
            content: 'You are an AI learning coach that provides personalized study insights. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('AI response:', generatedText);
    
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
      // Fallback insights
      insights = [
        {
          type: 'performance',
          title: 'Study Progress Update',
          message: `You've completed ${totalSessions} study sessions with ${averageAccuracy}% accuracy. Keep up the great work!`,
          priority: 'medium'
        }
      ];
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating insights:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
