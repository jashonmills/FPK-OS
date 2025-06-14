
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

// Enhanced FPK University AI Learning Coach System Prompt with Tool Integration
const ENHANCED_SYSTEM_PROMPT = `You are the FPK University AI Learning Coach—a Claude-based assistant embedded in the FPK Learner Portal. Your mission is to help each student study more effectively by tapping into their **own** flashcards, study materials, and performance data.

**AVAILABLE TOOLS:**
You have access to these authenticated Supabase tools to fetch user-specific data:

1. **getRecentFlashcards(userId, limit)** - Returns the N most recent flashcards created by this user
2. **getFlashcardsByGroup(userId, groupId)** - Returns all flashcards in a specific folder/group  
3. **searchFlashcards(userId, query)** - Full-text search across user's flashcards
4. **getStudyStats(userId)** - Returns comprehensive study statistics and performance metrics

**TOOL CALLING GUIDELINES:**
- When a user asks about their **own** flashcards or study history, you **MUST** invoke the appropriate tool
- Format tool calls as: {"tool": "toolName", "arguments": {"userId": "abc123", "param": "value"}}
- After receiving tool data, synthesize it into clear, supportive, actionable guidance

**WHEN TO CALL EACH TOOL:**
- **getRecentFlashcards**: "What were my last 5 flashcards?" "Show my newest uploads" "Which card did I create recently?"
- **getFlashcardsByGroup**: "Let's review my Biology flashcards" "Show cards in my Math folder"
- **searchFlashcards**: "Find my cards about 'photosynthesis'" "Search for cards with 'calculus'"
- **getStudyStats**: "How many flashcards have I studied?" "What's my accuracy?" "Show my learning progress"

**VOICE INTEGRATION:**
- Check for voiceActive flag in the request
- If voiceActive=true: structure responses for natural speech with appropriate pauses
- If voiceActive=false: optimize for text readability
- Always provide both text and voice-optimized versions when voice is enabled

**COACHING APPROACH:**
- Warm, encouraging, and personalized based on actual user data
- Always suggest specific next steps: "Let's focus on these 3 challenging cards"
- Celebrate progress and gently guide through difficulties
- Use emojis sparingly for emphasis: 🎯📚✨💡
- Reference specific flashcards, folders, and performance trends

**RESPONSE STRUCTURE:**
1. Acknowledge their current progress/question
2. Use tools to fetch relevant data when needed
3. Provide specific, data-driven insights
4. Suggest concrete next actions
5. Encourage continued learning

**FALLBACK BEHAVIOR:**
- For general study questions ("What is spaced repetition?"), answer from knowledge without tools
- For mixed requests ("Teach me about my weak areas in biology"), first fetch weak biology cards, then provide targeted teaching
- Always prioritize user-specific data over general advice when available

Remember: You're not just an AI assistant—you're their personal learning coach who knows their study history, strengths, and areas for improvement. Make every interaction feel personalized and actionable.`;

// Tool function implementations
async function callTool(toolName: string, args: any) {
  try {
    console.log(`Calling tool: ${toolName} with args:`, args);
    
    const { data, error } = await supabase.functions.invoke(toolName, {
      body: args
    });

    if (error) {
      console.error(`Tool ${toolName} error:`, error);
      throw error;
    }

    console.log(`Tool ${toolName} response:`, data);
    return data;
  } catch (error) {
    console.error(`Error calling tool ${toolName}:`, error);
    throw error;
  }
}

// Detect if user needs tool data
function detectToolNeeds(message: string, context: any): { tool?: string, args?: any } {
  const lowerMessage = message.toLowerCase();
  const userId = context.userId;

  // Recent flashcards patterns
  if (lowerMessage.match(/(recent|last|newest|latest).*(flashcard|card)/i) ||
      lowerMessage.match(/(show|what).*(recent|last|newest|latest)/i)) {
    const limitMatch = message.match(/(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 5;
    return { tool: 'get-recent-flashcards', args: { userId, limit } };
  }

  // Group/folder flashcards patterns
  if (lowerMessage.match(/(folder|group|category).*(flashcard|card)/i) ||
      lowerMessage.match(/(review|show).*(biology|math|history|science|english)/i)) {
    const groupMatch = message.match(/(biology|math|history|science|english|\w+\s+folder|\w+\s+group)/i);
    const groupId = groupMatch ? groupMatch[1].toLowerCase() : 'general';
    return { tool: 'get-flashcards-by-group', args: { userId, groupId } };
  }

  // Search patterns
  if (lowerMessage.match(/(search|find|look for).*(flashcard|card)/i) ||
      lowerMessage.match(/cards?.*(about|with|containing)/i)) {
    const queryMatch = message.match(/(?:about|with|containing|for)\s+['"]?([^'"]+)['"]?/i);
    const query = queryMatch ? queryMatch[1].trim() : '';
    
    // Check for performance filters
    let filter = undefined;
    if (lowerMessage.includes('weak') || lowerMessage.includes('struggling') || lowerMessage.includes('difficult')) {
      filter = 'low success';
    } else if (lowerMessage.includes('practice') || lowerMessage.includes('review needed')) {
      filter = 'needs practice';
    }
    
    return { tool: 'search-flashcards', args: { userId, query, filter } };
  }

  // Stats patterns
  if (lowerMessage.match(/(stats|statistics|progress|accuracy|performance)/i) ||
      lowerMessage.match(/(how many|total).*(session|card|study)/i) ||
      lowerMessage.match(/(streak|xp|level)/i)) {
    return { tool: 'get-study-stats', args: { userId } };
  }

  return {};
}

// Enhanced user context fetching
async function getEnhancedLearningContext(userId: string) {
  try {
    console.log('Fetching enhanced learning context for user:', userId);
    
    const [profileData, recentActivity] = await Promise.all([
      supabase
        .from('profiles')
        .select('display_name, full_name, current_streak, total_xp')
        .eq('id', userId)
        .single(),
      
      supabase
        .from('study_sessions')
        .select('completed_at, correct_answers, total_cards')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(3)
    ]);

    const profile = profileData.data;
    const sessions = recentActivity.data || [];

    return {
      profile: {
        name: profile?.display_name || profile?.full_name || 'Student',
        currentStreak: profile?.current_streak || 0,
        totalXP: profile?.total_xp || 0
      },
      recentActivity: {
        sessionCount: sessions.length,
        lastSession: sessions[0]?.completed_at || null,
        recentAccuracy: sessions.length > 0 ? 
          Math.round((sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0) / 
                     sessions.reduce((sum, s) => sum + (s.total_cards || 0), 1)) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching enhanced context:', error);
    return null;
  }
}

// Enhanced chat history
async function getEnhancedChatHistory(sessionId: string, limit: number = 6) {
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
    const { message, userId, sessionId, voiceActive = false, metadata } = await req.json();
    
    console.log('Enhanced AI Coach request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      voiceActive,
      hasSessionId: !!sessionId
    });
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    if (!anthropicApiKey) {
      const fallbackResponse = voiceActive 
        ? "I'm here to help you with your studies! While I'm getting ready to access your personal data, feel free to ask me about study strategies or any academic topics."
        : "I'm here to support your learning journey! 🎯 I'm working on connecting to your study data to provide personalized guidance.";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          voiceEnabled: voiceActive
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get context and detect tool needs
    const [learningContext, chatHistory] = await Promise.all([
      getEnhancedLearningContext(userId),
      sessionId ? getEnhancedChatHistory(sessionId, 4) : Promise.resolve([])
    ]);

    const toolNeeds = detectToolNeeds(message, { userId, learningContext });
    let toolData = null;
    let toolUsed = null;

    // Execute tool if needed
    if (toolNeeds.tool) {
      try {
        toolData = await callTool(toolNeeds.tool, toolNeeds.args);
        toolUsed = toolNeeds.tool;
        console.log('Tool executed successfully:', toolUsed);
      } catch (error) {
        console.error('Tool execution failed:', error);
        // Continue without tool data
      }
    }

    // Build conversation context
    let conversationContext = '';
    if (chatHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n' + 
        chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
    }

    // Build comprehensive context prompt
    let contextPrompt = `\nCurrent learner: ${learningContext?.profile.name || 'Student'}`;
    
    if (learningContext) {
      contextPrompt += `
📊 Quick Profile:
• Current Streak: ${learningContext.profile.currentStreak} days
• Total XP: ${learningContext.profile.totalXP}
• Recent Sessions: ${learningContext.recentActivity.sessionCount}
• Recent Accuracy: ${learningContext.recentActivity.recentAccuracy}%`;

      if (learningContext.recentActivity.lastSession) {
        const daysSince = Math.floor((Date.now() - new Date(learningContext.recentActivity.lastSession).getTime()) / (1000 * 60 * 60 * 24));
        contextPrompt += `\n• Last Study: ${daysSince === 0 ? 'Today' : `${daysSince} days ago`}`;
      }
    }

    // Add tool data if available
    if (toolData && toolUsed) {
      contextPrompt += `\n\n🔧 Tool Data Retrieved (${toolUsed}):\n${JSON.stringify(toolData, null, 2)}
      
IMPORTANT: Use this specific user data to provide personalized, actionable guidance. Reference their actual flashcards, performance metrics, and study patterns.`;
    }

    // Add voice optimization instruction
    if (voiceActive) {
      contextPrompt += `\n\n🎤 VOICE MODE ACTIVE: Structure your response for natural speech with appropriate pauses. Keep it conversational and easy to listen to.`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    // Add coaching guidance
    if (learningContext && toolData) {
      contextPrompt += `\n\n💡 Coaching Focus: Provide specific, data-driven insights based on their actual study data. Suggest concrete next steps and celebrate their progress.`;
    }

    console.log('Calling enhanced Anthropic API with personalized context and tool data...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
          max_tokens: 400,
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
      const aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey! What would you like to work on together? 📚";
      
      console.log('Enhanced AI Coach response generated successfully');

      return new Response(
        JSON.stringify({ 
          response: aiResponse,
          voiceEnabled: voiceActive,
          toolUsed: toolUsed,
          hasPersonalData: !!toolData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('Error in enhanced AI coach function:', error);
    
    const smartFallback = "I'm here to support your personalized learning journey! 🎯 While I'm connecting to your study data, feel free to ask me about study strategies, specific topics, or how to make the most of your flashcards.";
    
    return new Response(
      JSON.stringify({ 
        response: smartFallback,
        error: 'fallback_mode'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
