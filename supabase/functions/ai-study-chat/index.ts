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

// Enhanced FPK University AI Learning Coach System Prompt with External Knowledge Tool
const ENHANCED_SYSTEM_PROMPT = `You are the FPK University AI Learning Coach—an empathetic, conversational study-buddy focused exclusively on helping learners succeed. You now have access to external knowledge sources through the @fetchKnowledge tool.

AVAILABLE TOOLS:
- @fetchKnowledge(topic): Retrieves information from external educational sources (Wikipedia, DBpedia, academic papers, etc.)

Follow these rules in every interaction:

1. Persona & Tone:
   • Warm, supportive, lightly humorous—like a trusted tutor or peer.  
   • Celebrate wins ("Great job!") and gently guide through challenges.
   • Use emojis sparingly—only for major wins (🎉✨) or key points (💡📚)
   • Explain jargon when you use it, keep language accessible

2. Dynamic Knowledge Retrieval:
   • For factual or conceptual questions outside the current module, use @fetchKnowledge(topic)
   • Always cite external sources: "According to Wikipedia..." or "Research from Semantic Scholar shows..."
   • If external knowledge is unavailable, provide the best answer from training data
   • Combine external facts with learner's personal context for maximum relevance

3. Tool Usage Guidelines:
   • Use @fetchKnowledge when learners ask about:
     - Scientific concepts, historical events, mathematical theorems
     - Current research, academic papers, or specific topics
     - Definitions of technical terms
     - Background information on subjects they're studying
   • Don't use the tool for:
     - Personal study advice (use their data instead)
     - Platform navigation questions
     - General encouragement or motivation

4. Scope & Boundaries:
   • Answer any academic question—history, science, math, languages, arts—always with educational focus
   • Politely decline off-topic requests: "I'm here to help with your learning—let's stick to study or course questions."
   • For weather, personal life, etc: redirect to academic topics

5. Context Awareness & Memory:
   • Remember the learner's current course, module, flashcard performance, and study patterns
   • Tailor examples to their context: "In your Module 3 material, you learned X; here's how it connects..."
   • Reference their specific data: accuracy rates, struggling topics, recent sessions

6. Multi-Modal Guidance:
   • Point to in-platform resources: "Try reviewing your flashcard set on [topic]" or "Check your notes on [subject]"
   • Suggest actionable next steps: "Practice those 6 challenging flashcards" or "Take a quick quiz on this"

7. Citation & Source Integration:
   • Always include source attribution when using external knowledge
   • Format citations naturally: "According to Wikipedia, photosynthesis is... (source)"
   • Blend external facts with personalized guidance seamlessly

8. Clarification & Fallback:
   • For vague questions like "Tell me more" or "Explain that": Ask "Would you like a brief overview or detailed examples?"
   • If topic is unclear: "Which specific aspect would you like me to focus on?"
   • When external knowledge fails: "I want to give you the most helpful answer—let me work with what I know..."

Response Format:
• Keep responses 1-3 paragraphs, concise and actionable
• Start with acknowledgment of their progress when relevant
• Integrate external knowledge naturally with personal context
• End with a specific next step or question to guide learning
• Use encouraging language that builds confidence
• Always cite sources when using external information`;

// Knowledge retrieval function for educational topics
async function retrieveKnowledge(topic: string) {
  try {
    console.log('Calling external knowledge retrieval for:', topic);
    
    const { data, error } = await supabase.functions.invoke('retrieve-knowledge', {
      body: { topic }
    });

    if (error) {
      console.error('Knowledge retrieval error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error calling knowledge retrieval function:', error);
    return null;
  }
}

// Detect if user needs external knowledge
function needsExternalKnowledge(message: string, context: any): { needed: boolean, topic?: string } {
  const knowledgeIndicators = [
    /what is (.+?)[\?\.]|define (.+?)[\?\.]|explain (.+?)[\?\.]|tell me about (.+?)[\?\.]|how does (.+?) work/i,
    /research on (.+)|papers about (.+)|studies on (.+)/i,
    /history of (.+)|when was (.+) invented|who discovered (.+)/i,
    /(.+) theory|(.+) principle|(.+) law|(.+) equation/i
  ];
  
  for (const pattern of knowledgeIndicators) {
    const match = message.match(pattern);
    if (match) {
      // Extract the topic from the first capturing group
      const topic = match[1] || match[2] || match[3] || match[4];
      if (topic && topic.trim().length > 2) {
        return { needed: true, topic: topic.trim() };
      }
    }
  }
  
  return { needed: false };
}

// Detect if user needs clarification
function needsClarification(message: string): boolean {
  const vaguePatterns = [
    /^(tell me more|explain that|more info|continue|what about|how about)$/i,
    /^(that|this|it)$/i,
    /^(explain|tell me|what)$/i
  ];
  
  return vaguePatterns.some(pattern => pattern.test(message.trim())) || message.trim().length < 10;
}

// Detect off-topic requests
function isOffTopic(message: string): boolean {
  const offTopicPatterns = [
    /weather|temperature|climate today/i,
    /personal life|relationship|dating/i,
    /entertainment|movies|tv shows|music/i,
    /sports|games|gaming/i,
    /politics|religion/i,
    /shopping|buying|selling/i
  ];
  
  return offTopicPatterns.some(pattern => pattern.test(message));
}

// Enhanced user context fetching with better organization
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

// Enhanced chat history with better context
async function getEnhancedChatHistory(sessionId: string, limit: number = 8) {
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

    // Check for off-topic requests first
    if (isOffTopic(message)) {
      return new Response(
        JSON.stringify({ 
          response: "I'm here to help with your learning—let's stick to study or course questions. What academic topic can I help you explore? 📚"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if clarification is needed
    if (needsClarification(message)) {
      return new Response(
        JSON.stringify({ 
          response: "I'd love to help! Could you tell me which specific aspect you'd like me to focus on—a brief overview or detailed examples with practice suggestions? 💡"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!anthropicApiKey) {
      const contextualResponses = [
        "Great to see you're engaging with your studies! 🌟 I'm analyzing your learning patterns to provide better guidance. Try some practice sessions and I'll have personalized insights ready!",
        "I love your curiosity! 📚 Consistent practice with your flashcards will help me understand your learning style better. What specific topic would you like to explore?",
        "You're on the right track! 🎯 Every question shows you're thinking critically. Let's focus on building your knowledge systematically—what subject interests you most?",
        "Your dedication to learning is inspiring! ✨ While I'm optimizing my coaching algorithms, remember that active recall beats passive reading every time.",
        "Keep that learning momentum going! 💪 The fact that you're here asking questions tells me you're serious about growth. What concept can I help clarify?"
      ];
      
      return new Response(
        JSON.stringify({ 
          response: contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get enhanced context and chat history
    const [learningContext, chatHistory] = await Promise.all([
      getEnhancedLearningContext(userId),
      sessionId ? getEnhancedChatHistory(sessionId, 6) : Promise.resolve([])
    ]);

    // Check if external knowledge is needed
    const knowledgeCheck = needsExternalKnowledge(message, { learningContext, pageContext });
    let externalKnowledge = null;
    
    if (knowledgeCheck.needed && knowledgeCheck.topic) {
      externalKnowledge = await retrieveKnowledge(knowledgeCheck.topic);
    }

    // Build conversation context
    let conversationContext = '';
    if (chatHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n' + 
        chatHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
    }

    // Build comprehensive learning context
    let contextPrompt = `\nCurrent learner: ${learningContext?.profile.name || 'Student'}`;
    
    if (learningContext && learningContext.performance.totalSessions > 0) {
      contextPrompt += `
📊 Learner's Progress Data:
• Study Sessions: ${learningContext.performance.totalSessions} completed
• Overall Accuracy: ${learningContext.performance.overallAccuracy}%
• Recent Performance: ${learningContext.performance.recentAccuracy}% (${learningContext.performance.improvementTrend > 0 ? '+' : ''}${learningContext.performance.improvementTrend}% trend)
• Current Streak: ${learningContext.performance.currentStreak} days
• Study Frequency: ${learningContext.performance.studyFrequency} sessions/day

📚 Available Learning Resources:
• Flashcards: ${learningContext.profile.totalCards} total, ${learningContext.profile.strugglingCards} need focused practice
• Notes: ${learningContext.profile.totalNotes} created
• Study Categories: ${learningContext.profile.categories.join(', ') || 'Getting started'}
• Study Folders: ${learningContext.profile.folders.join(', ') || 'None yet'}`;

      if (learningContext.recentActivity.strugglingTopics.length > 0) {
        contextPrompt += `\n\n🎯 Topics needing attention: ${learningContext.recentActivity.strugglingTopics.join(', ')}`;
      }

      if (learningContext.recentActivity.lastStudySession) {
        const daysSinceLastSession = Math.floor((Date.now() - new Date(learningContext.recentActivity.lastStudySession).getTime()) / (1000 * 60 * 60 * 24));
        contextPrompt += `\n\n⏰ Last study session: ${daysSinceLastSession === 0 ? 'Today' : `${daysSinceLastSession} days ago`}`;
      }
    } else {
      contextPrompt += `\n\n🌱 New learner - encourage them to start with flashcards or study sessions to build their learning profile.`;
    }

    // Add page context
    if (pageContext) {
      contextPrompt += `\n\n📍 Current page: ${pageContext}`;
      if (pageContext.includes('Notes')) {
        contextPrompt += ` - Focus on note-taking strategies and study material organization`;
      } else if (pageContext.includes('Flashcard')) {
        contextPrompt += ` - Focus on flashcard optimization and memory techniques`;
      } else if (pageContext.includes('Coach')) {
        contextPrompt += ` - Provide comprehensive learning guidance and strategy`;
      }
    }

    // Add external knowledge if retrieved
    if (externalKnowledge && externalKnowledge.content) {
      contextPrompt += `\n\n🔍 External Knowledge Retrieved:
Source: ${externalKnowledge.source_name}
Content: ${externalKnowledge.content}
URL: ${externalKnowledge.source_url}

IMPORTANT: Integrate this external knowledge naturally into your response and always cite the source.`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    // Enhanced coaching guidance based on performance
    if (learningContext) {
      if (learningContext.performance.improvementTrend > 15) {
        contextPrompt += `\n\n🚀 Coaching note: Student is improving rapidly (+${learningContext.performance.improvementTrend}%)! Celebrate progress and suggest advancing to harder topics.`;
      } else if (learningContext.performance.improvementTrend < -15) {
        contextPrompt += `\n\n💡 Coaching note: Recent decline (${learningContext.performance.improvementTrend}%). Provide encouragement and suggest reviewing fundamentals before advancing.`;
      } else if (learningContext.performance.currentStreak > 7) {
        contextPrompt += `\n\n⭐ Coaching note: Excellent ${learningContext.performance.currentStreak}-day streak! Acknowledge dedication and suggest advanced study techniques.`;
      } else if (learningContext.performance.studyFrequency < 0.5) {
        contextPrompt += `\n\n📅 Coaching note: Low study frequency (${learningContext.performance.studyFrequency}/day). Gently encourage more regular practice with achievable daily goals.`;
      }
    }

    console.log('Calling enhanced Anthropic API with personalized context and external knowledge...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
          max_tokens: 350,
          messages: [
            {
              role: 'user',
              content: ENHANCED_SYSTEM_PROMPT + contextPrompt
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
      const aiResponse = data.content?.[0]?.text || "I'm here to guide your learning journey! What would you like to explore together? 📚";
      
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
    
    const smartFallbacks = [
      "I'm here to support your learning journey! 🎯 What specific concept or study challenge can I help you tackle?",
      "Great to see you engaging with your studies! 📚 Try a quick practice session and I'll analyze your progress for personalized tips.",
      "Learning is about consistent progress! 💭 What topic would you like to explore deeper, or do you need study strategy advice?",
      "You're building expertise with every session! ⭐ Remember, understanding comes through practice—what can I help clarify today?",
      "I believe in your learning potential! 🌟 Every question is a step forward. What subject or concept interests you most right now?"
    ];
    
    return new Response(
      JSON.stringify({ 
        response: smartFallbacks[Math.floor(Math.random() * smartFallbacks.length)]
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
