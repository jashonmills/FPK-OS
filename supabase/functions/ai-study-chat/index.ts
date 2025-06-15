
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

// Simplified system prompt focused on direct responses
const SYSTEM_PROMPT = `You are the FPK University AI Learning Coach. You help students by providing personalized guidance based on their actual study data.

**Your Role:**
- Analyze the student's real flashcards, study sessions, and performance data
- Provide specific, actionable advice based on their actual learning patterns
- Be encouraging and supportive while offering concrete next steps
- Always reference their specific flashcards and study data when available

**Response Style:**
- Be direct and helpful - no placeholder text or generic advice
- Use the student's actual data to provide personalized insights
- Offer specific next actions they can take
- Keep responses conversational and encouraging

**Voice Mode:**
- If voiceActive=true, structure responses for natural speech with appropriate pauses
- Use shorter sentences and clear transitions for voice output

You have access to the student's personal study data through various tools. When data is provided, use it directly to give specific, personalized guidance.`;

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

  // Enhanced recent flashcards patterns - more comprehensive matching
  if (lowerMessage.match(/(recent|last|newest|latest).*(flashcard|card)/i) ||
      lowerMessage.match(/(show|what|display).*(recent|last|newest|latest)/i) ||
      lowerMessage.match(/(show|display).*me.*my.*(flashcard|card)/i) ||
      lowerMessage.match(/(review|see).*my.*(recent|study|flashcard|card)/i) ||
      lowerMessage.match(/my.*last.*\d*.*(flashcard|card)/i) ||
      lowerMessage.includes('show me my recent') ||
      lowerMessage.includes('what are my last') ||
      lowerMessage.includes('review my recent')) {
    
    const limitMatch = message.match(/(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 3; // Default to 3 cards
    console.log(`Detected recent flashcards request with limit: ${limit}`);
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

// Format tool data into readable context
function formatToolDataForContext(toolData: any, toolUsed: string): string {
  if (!toolData || !toolUsed) return '';

  switch (toolUsed) {
    case 'get-recent-flashcards':
      if (toolData.flashcards && toolData.flashcards.length > 0) {
        const cardsText = toolData.flashcards.map((card: any, index: number) => {
          const createdDate = new Date(card.created_at).toLocaleDateString();
          const successRate = card.stats?.successRate || 0;
          return `${index + 1}. **${card.front}**
   Answer: ${card.back}
   Created: ${createdDate} | Success Rate: ${successRate}% | Folder: ${card.folder}`;
        }).join('\n\n');
        
        return `Here are the student's ${toolData.flashcards.length} most recent flashcards:\n\n${cardsText}`;
      }
      return 'The student has no recent flashcards yet.';

    case 'get-flashcards-by-group':
      if (toolData.flashcards && toolData.flashcards.length > 0) {
        const cardsText = toolData.flashcards.map((card: any, index: number) => {
          const createdDate = new Date(card.created_at).toLocaleDateString();
          const successRate = card.stats?.successRate || 0;
          return `${index + 1}. **${card.front}**
   Answer: ${card.back}
   Success Rate: ${successRate}% | Created: ${createdDate}`;
        }).join('\n\n');
        
        return `Here are the flashcards from "${toolData.groupId}" folder (${toolData.flashcards.length} cards):\n\n${cardsText}`;
      }
      return `No flashcards found in the "${toolData.groupId}" folder.`;

    case 'search-flashcards':
      if (toolData.flashcards && toolData.flashcards.length > 0) {
        const cardsText = toolData.flashcards.map((card: any, index: number) => {
          const successRate = card.stats?.successRate || 0;
          return `${index + 1}. **${card.front}**
   Answer: ${card.back}
   Success Rate: ${successRate}% | Folder: ${card.folder}`;
        }).join('\n\n');
        
        return `Found ${toolData.resultsCount} flashcards matching "${toolData.query}":\n\n${cardsText}`;
      }
      return `No flashcards found matching "${toolData.query}".`;

    case 'get-study-stats':
      if (toolData.stats) {
        const stats = toolData.stats;
        return `Student's Learning Progress:

**Study Sessions:**
- Total sessions completed: ${stats.sessions.total}
- Sessions this week: ${stats.sessions.recentWeek}
- Average session duration: ${stats.sessions.avgDuration} minutes
- Total study time: ${stats.sessions.totalMinutes} minutes

**Performance:**
- Overall accuracy: ${stats.accuracy.overall}%
- Recent accuracy: ${stats.accuracy.recent}%
- Correct answers: ${stats.accuracy.totalCorrect}/${stats.accuracy.totalAnswered}

**Flashcard Progress:**
- Total flashcards: ${stats.flashcards.total}
- Cards reviewed: ${stats.flashcards.reviewed}
- Cards mastered: ${stats.flashcards.mastered} (${stats.flashcards.masteryRate}% mastery rate)
- Cards needing practice: ${stats.flashcards.struggling}

**Achievements:**
- Current streak: ${stats.progress.currentStreak} days
- Total XP earned: ${stats.progress.totalXP}
- Study frequency: ${stats.progress.studyFrequency} sessions per day`;
      }
      return 'No study statistics available yet.';

    default:
      return '';
  }
}

// Get user context
async function getLearningContext(userId: string) {
  try {
    console.log('Fetching learning context for user:', userId);
    
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
    console.error('Error fetching learning context:', error);
    return null;
  }
}

// Get chat history
async function getChatHistory(sessionId: string, limit: number = 4) {
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
    console.error('Error fetching chat history:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, voiceActive = false, metadata } = await req.json();
    
    console.log('AI Coach request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      voiceActive,
      hasSessionId: !!sessionId,
      message: message.substring(0, 100) + '...' // Log first 100 chars for debugging
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
      getLearningContext(userId),
      sessionId ? getChatHistory(sessionId, 4) : Promise.resolve([])
    ]);

    const toolNeeds = detectToolNeeds(message, { userId, learningContext });
    let toolData = null;
    let toolUsed = null;

    console.log('Tool detection result:', toolNeeds);

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

    // Build user context
    let contextPrompt = `\nStudent: ${learningContext?.profile.name || 'Student'}`;
    
    if (learningContext) {
      contextPrompt += `
Current streak: ${learningContext.profile.currentStreak} days
Total XP: ${learningContext.profile.totalXP}
Recent sessions: ${learningContext.recentActivity.sessionCount}
Recent accuracy: ${learningContext.recentActivity.recentAccuracy}%`;

      if (learningContext.recentActivity.lastSession) {
        const daysSince = Math.floor((Date.now() - new Date(learningContext.recentActivity.lastSession).getTime()) / (1000 * 60 * 60 * 24));
        contextPrompt += `\nLast study session: ${daysSince === 0 ? 'Today' : `${daysSince} days ago`}`;
      }
    }

    // Add formatted tool data if available
    if (toolData && toolUsed) {
      const formattedData = formatToolDataForContext(toolData, toolUsed);
      contextPrompt += `\n\n${formattedData}`;
    }

    // Add voice optimization
    if (voiceActive) {
      contextPrompt += `\n\nVOICE MODE: Structure your response for natural speech with appropriate pauses.`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    console.log('Calling Anthropic API...');
    
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
      const aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey! What would you like to work on together? 📚";
      
      console.log('AI Coach response generated successfully');

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
    console.error('Error in AI coach function:', error);
    
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
