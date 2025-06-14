
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

// Enhanced system prompt for FPK University AI Learning Coach
const SYSTEM_PROMPT = `You are the FPK University AI Learning Coach—an empathetic, conversational study buddy whose sole focus is helping learners achieve their educational goals. Follow these guidelines in every interaction:

1. Persona & Tone:
   • Friendly, supportive, and lightly humorous—like a trusted tutor or peer.  
   • Encourage progress: celebrate wins ("Great job!") and gently guide through challenges.  

2. Dynamic Knowledge Retrieval:
   • When asked about facts, definitions, or concepts outside the learner's current module, fetch up-to-date information from the integrated knowledge base or external educational APIs.  
   • If no direct data is available, respond with "Let me find that for you…" then deliver a concise, accurate answer.  

3. Scope & Boundaries:
   • Answer any academic question—history, math, science, language, arts—always with an educational focus.  
   • Politely decline non-educational or off-topic requests: "I'm here to help with your learning; let's stick to study or course questions."  

4. Context Awareness & Memory:
   • Remember the learner's current course, module, or flashcard set.  
   • Tailor examples and suggestions to that context: "In Module 3 you learned X; here's how it applies…"  

5. Multi-Modal Guidance:
   • Where relevant, point back to in-platform resources: flashcards, notes, video lectures, or external references.  
   • Offer next steps: "Try reviewing flashcard set #5, or attempt a quick quiz on this topic."  

6. Clarification & Fallback:
   • If a question is vague, ask a clarifying question: "Would you like a brief overview or a deep dive with examples?"  
   • If uncertain, admit it and offer to look up or suggest reliable resources.  

7. Study Coaching & Strategy:
   • Provide study tips, memory techniques, and personalized practice plans based on learner performance metrics (e.g., "You've struggled with X; focus on spaced repetition for that topic").  

Always deliver responses that are concise (1–3 paragraphs), actionable, and uplifting. Keep the conversation learner-centered, guiding them toward deeper understanding and confidence.`;

// Enhanced user context fetching with more detailed analytics
async function getEnhancedLearningContext(userId: string) {
  try {
    console.log('Fetching enhanced learning context for user:', userId);
    
    const [sessionsData, flashcardsData, profileData, notesData] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('correct_answers, total_cards, session_type, created_at, completed_at, difficulty_distribution')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(15),
      
      supabase
        .from('flashcards')
        .select('difficulty_level, times_reviewed, times_correct, front_content, category, folder_name')
        .eq('user_id', userId)
        .limit(30),
      
      supabase
        .from('profiles')
        .select('display_name, full_name, current_streak, total_xp, learning_preferences')
        .eq('id', userId)
        .single(),

      supabase
        .from('notes')
        .select('title, category, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    const sessions = sessionsData.data || [];
    const flashcards = flashcardsData.data || [];
    const profile = profileData.data;
    const notes = notesData.data || [];

    // Enhanced analytics
    const completedSessions = sessions.filter(s => s.completed_at);
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalAnswered = completedSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Recent performance trend
    const recentSessions = completedSessions.slice(0, 5);
    const recentCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const recentTotal = recentSessions.reduce((sum, s) => sum + (s.total_cards || 0), 0);
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

    // Struggling areas analysis
    const strugglingCards = flashcards.filter(card => {
      const successRate = card.times_reviewed > 0 ? (card.times_correct / card.times_reviewed) : 0;
      return card.times_reviewed >= 2 && successRate < 0.6;
    });

    // Study patterns
    const studyFrequency = completedSessions.length > 0 ? 
      completedSessions.length / Math.max(1, Math.ceil((Date.now() - new Date(completedSessions[completedSessions.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))) : 0;

    // Categories and topics
    const categories = [...new Set(flashcards.map(card => card.category).filter(Boolean))];
    const folders = [...new Set(flashcards.map(card => card.folder_name).filter(Boolean))];

    return {
      performance: {
        totalSessions: completedSessions.length,
        overallAccuracy,
        recentAccuracy,
        improvementTrend: recentAccuracy - overallAccuracy,
        currentStreak: profile?.current_streak || 0,
        totalXP: profile?.total_xp || 0,
        studyFrequency: Math.round(studyFrequency * 10) / 10
      },
      profile: {
        name: profile?.display_name || profile?.full_name || 'Student',
        totalCards: flashcards.length,
        strugglingCards: strugglingCards.length,
        categories,
        folders,
        totalNotes: notes.length,
        learningPreferences: profile?.learning_preferences
      },
      recentActivity: {
        lastStudySession: completedSessions[0]?.created_at,
        recentNotes: notes.slice(0, 3).map(note => note.title),
        strugglingTopics: strugglingCards.slice(0, 5).map(card => card.front_content?.substring(0, 50))
      }
    };
  } catch (error) {
    console.error('Error fetching enhanced context:', error);
    return null;
  }
}

// Enhanced chat history with context tags
async function getEnhancedChatHistory(sessionId: string, limit: number = 12) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content, timestamp')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).reverse();
  } catch (error) {
    console.error('Error fetching enhanced chat history:', error);
    return [];
  }
}

// Knowledge retrieval function (placeholder for future external API integration)
async function retrieveKnowledge(query: string, context: any) {
  // This could integrate with educational APIs, Wikipedia, or other knowledge bases
  // For now, we'll enhance the prompt with available context
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, pageContext } = await req.json();
    
    console.log('Enhanced AI Coach request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      hasSessionId: !!sessionId,
      pageContext
    });
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    if (!anthropicApiKey) {
      const coachingResponses = [
        "Great to see you're engaging with your studies! 🌟 While I'm getting my advanced coaching features ready, you can still make amazing progress with the flashcards and study sessions available.",
        "I love your curiosity! 📚 Let's focus on building consistent study habits with the tools available - try creating some flashcards or taking a quick study session.",
        "You're on the right track! 🎯 Consistent practice is key to learning success. Start with a short study session and I'll have better insights to share soon.",
        "Keep that learning momentum going! 💪 Every question you ask shows you're thinking critically - that's the foundation of great learning.",
        "Your dedication to learning is inspiring! ✨ Try reviewing some flashcards or creating notes, and I'll be able to provide more personalized guidance."
      ];
      
      return new Response(
        JSON.stringify({ 
          response: coachingResponses[Math.floor(Math.random() * coachingResponses.length)]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get enhanced context and chat history
    const [learningContext, chatHistory] = await Promise.all([
      getEnhancedLearningContext(userId),
      sessionId ? getEnhancedChatHistory(sessionId, 10) : Promise.resolve([])
    ]);

    // Build enhanced conversation context
    let conversationContext = '';
    if (chatHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n' + 
        chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
    }

    // Build comprehensive learning context
    let contextPrompt = `\nLearner Profile: ${learningContext?.profile.name || 'Student'}`;
    
    if (learningContext && learningContext.performance.totalSessions > 0) {
      contextPrompt += `
📊 Learning Analytics:
• Study Sessions: ${learningContext.performance.totalSessions} completed
• Overall Accuracy: ${learningContext.performance.overallAccuracy}%
• Recent Performance: ${learningContext.performance.recentAccuracy}% (${learningContext.performance.improvementTrend > 0 ? '+' : ''}${learningContext.performance.improvementTrend}% trend)
• Current Streak: ${learningContext.performance.currentStreak} days
• Study Frequency: ${learningContext.performance.studyFrequency} sessions/day
• Total XP: ${learningContext.performance.totalXP}

📚 Learning Resources:
• Flashcards: ${learningContext.profile.totalCards} total, ${learningContext.profile.strugglingCards} need practice
• Notes: ${learningContext.profile.totalNotes} created
• Categories: ${learningContext.profile.categories.join(', ') || 'None yet'}
• Folders: ${learningContext.profile.folders.join(', ') || 'None yet'}`;

      if (learningContext.recentActivity.strugglingTopics.length > 0) {
        contextPrompt += `\n\n🎯 Areas needing attention: ${learningContext.recentActivity.strugglingTopics.join(', ')}`;
      }

      if (learningContext.recentActivity.lastStudySession) {
        const daysSinceLastSession = Math.floor((Date.now() - new Date(learningContext.recentActivity.lastStudySession).getTime()) / (1000 * 60 * 60 * 24));
        contextPrompt += `\n\n⏰ Last study session: ${daysSinceLastSession === 0 ? 'Today' : `${daysSinceLastSession} days ago`}`;
      }
    } else {
      contextPrompt += `\n\n🌱 New learner - encourage them to start with flashcards or study sessions to build their learning profile.`;
    }

    // Add page context if available
    if (pageContext) {
      contextPrompt += `\n\n📍 Current page: ${pageContext}`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    // Enhanced coaching guidance
    if (learningContext) {
      if (learningContext.performance.improvementTrend > 10) {
        contextPrompt += `\n\n🚀 Coaching note: Student is improving rapidly! Celebrate their progress and suggest increasing difficulty.`;
      } else if (learningContext.performance.improvementTrend < -10) {
        contextPrompt += `\n\n💡 Coaching note: Student may be struggling. Provide encouragement and suggest reviewing fundamentals.`;
      } else if (learningContext.performance.currentStreak > 7) {
        contextPrompt += `\n\n⭐ Coaching note: Excellent consistency! Acknowledge their dedication and suggest advanced techniques.`;
      } else if (learningContext.performance.studyFrequency < 0.5) {
        contextPrompt += `\n\n📅 Coaching note: Low study frequency. Gently encourage more regular practice with achievable goals.`;
      }
    }

    console.log('Calling enhanced Anthropic API...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
              content: SYSTEM_PROMPT + contextPrompt
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content?.[0]?.text || "I'm here to guide your learning journey! 🌟";
      
      console.log('Enhanced AI Coach response generated successfully');

      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('Error in enhanced AI coach function:', error);
    
    const contextualFallbacks = [
      "I'm here to help you succeed! 🎯 Let's tackle this together - what specific topic or concept would you like to explore?",
      "Learning is a journey, and I'm your guide! 📚 Try a quick study session and I'll analyze your progress to provide better insights.",
      "Great question! 💭 While I'm processing your learning data, remember that consistent practice leads to mastery.",
      "You're building something amazing with every study session! ⭐ Keep the momentum going and I'll provide personalized coaching soon.",
      "I believe in your potential! 🌟 Every expert was once a beginner - let's focus on your next learning step."
    ];
    
    return new Response(
      JSON.stringify({ 
        response: contextualFallbacks[Math.floor(Math.random() * contextualFallbacks.length)]
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
