
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

// Enhanced system prompt with explicit tool usage instructions
const SYSTEM_PROMPT = `You are Claude, the FPK University AI Learning Coach. You help students by providing personalized guidance based on their actual study data.

**CRITICAL TOOL USAGE RULES:**
- ALWAYS use tools when students ask about their data, progress, or flashcards
- When they mention "my flashcards", "my cards", "recent cards", or similar - IMMEDIATELY call get_recent_flashcards or get_user_flashcards
- When they ask about performance, stats, or progress - call get_study_stats
- NEVER ask users to "share their flashcard details" - you can see them directly via tools
- Reference actual flashcard content in your responses using the tool results

**Available Tools:**
1. get_recent_flashcards: Get the student's most recent flashcards (use for "recent cards", "last cards", "what I created")
2. get_user_flashcards: Advanced flashcard search with filters (use for "struggling cards", "difficult cards", specific searches)
3. get_study_stats: Comprehensive study statistics and progress (use for performance questions)

**Response Style:**
- Reference actual flashcard content: "I see your card about [front content] - [back content]"
- Provide specific insights: "Your card on X has a 45% success rate, let's work on that"
- Offer concrete actions based on real data
- Keep responses conversational and encouraging

**Voice Mode Optimization:**
- If voiceActive=true, structure responses for natural speech with appropriate pauses
- Use shorter sentences and clear transitions for voice output

Always prioritize using tools to provide accurate, personalized guidance based on their current study data.`;

async function executeToolCall(toolName: string, args: any) {
  try {
    console.log(`🔧 Executing tool: ${toolName} with args:`, args);
    
    // Map tool names to actual function names
    const functionName = toolName.replace('_', '-');
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: args
    });

    if (error) {
      console.error(`❌ Tool ${toolName} error:`, error);
      throw error;
    }

    console.log(`✅ Tool ${toolName} response:`, data);
    return data;
  } catch (error) {
    console.error(`💥 Error executing tool ${toolName}:`, error);
    return { 
      error: `Failed to execute ${toolName}: ${error.message}`,
      flashcards: [],
      total: 0,
      message: 'Tool execution failed'
    };
  }
}

// Get user context for personalization
async function getLearningContext(userId: string) {
  try {
    console.log('📊 Fetching learning context for user:', userId);
    
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
    console.error('❌ Error fetching learning context:', error);
    return null;
  }
}

// Get chat history for context
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
    console.error('❌ Error fetching chat history:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, voiceActive = false, metadata } = await req.json();
    
    console.log('🎯 AI Coach request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      voiceActive,
      hasSessionId: !!sessionId,
      message: message.substring(0, 100) + '...'
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

    // Get context and history
    const [learningContext, chatHistory] = await Promise.all([
      getLearningContext(userId),
      sessionId ? getChatHistory(sessionId, 4) : Promise.resolve([])
    ]);

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

    // Add voice optimization
    if (voiceActive) {
      contextPrompt += `\n\nVOICE MODE: Structure your response for natural speech with appropriate pauses.`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    console.log('🤖 Calling Claude with enhanced tools...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      // Initial call to Claude with tools
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': anthropicApiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          tools: [
            {
              name: 'get_recent_flashcards',
              description: 'Get the student\'s most recent flashcards. Use when they ask about recent cards, what they\'ve been studying, or want to review their latest flashcards.',
              input_schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', description: 'The user ID' },
                  limit: { type: 'integer', description: 'Number of flashcards to return (default: 5)', default: 5 }
                },
                required: ['userId']
              }
            },
            {
              name: 'get_user_flashcards',
              description: 'Advanced flashcard search with filters. Use when they want specific cards, struggling cards, or filtered results.',
              input_schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', description: 'The user ID' },
                  filter: { 
                    type: 'object', 
                    description: 'Filter options',
                    properties: {
                      difficulty: { type: 'integer', description: 'Filter by difficulty level' },
                      needsPractice: { type: 'boolean', description: 'Show cards that need practice' },
                      searchTerm: { type: 'string', description: 'Search in card content' }
                    }
                  },
                  limit: { type: 'integer', description: 'Number of flashcards to return (default: 10)', default: 10 },
                  sortBy: { type: 'string', description: 'Sort field', default: 'created_at' },
                  sortOrder: { type: 'string', description: 'Sort order: asc or desc', default: 'desc' }
                },
                required: ['userId']
              }
            },
            {
              name: 'get_study_stats',
              description: 'Get comprehensive study statistics and progress data. Use when they ask about performance, progress, achievements, streaks, or overall stats.',
              input_schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', description: 'The user ID' }
                },
                required: ['userId']
              }
            }
          ],
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
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📨 Claude response received:', { 
        hasContent: !!data.content, 
        contentLength: data.content?.length,
        stopReason: data.stop_reason 
      });

      // Check if Claude wants to use tools
      if (data.stop_reason === 'tool_use') {
        console.log('🛠️ Claude requested tool usage');
        
        // Execute tool calls
        const toolResults = [];
        
        for (const contentBlock of data.content) {
          if (contentBlock.type === 'tool_use') {
            const toolName = contentBlock.name;
            const toolArgs = { ...contentBlock.input, userId }; // Ensure userId is included
            
            console.log(`🔧 Executing tool: ${toolName}`, toolArgs);
            const toolResult = await executeToolCall(toolName, toolArgs);
            
            toolResults.push({
              tool_use_id: contentBlock.id,
              content: JSON.stringify(toolResult)
            });
          }
        }

        console.log('🔄 Sending tool results back to Claude...');

        // Send tool results back to Claude for final response
        const finalResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anthropicApiKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            'x-api-key': anthropicApiKey,
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            messages: [
              {
                role: 'user',
                content: SYSTEM_PROMPT + contextPrompt
              },
              {
                role: 'assistant',
                content: data.content
              },
              {
                role: 'user',
                content: toolResults
              }
            ]
          })
        });

        if (!finalResponse.ok) {
          throw new Error(`Claude final API error: ${finalResponse.status}`);
        }

        const finalData = await finalResponse.json();
        const aiResponse = finalData.content?.[0]?.text || "I've analyzed your study data and I'm here to help guide your learning journey! 📚";
        
        console.log('✅ Final AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: true,
            hasPersonalData: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } else {
        // Direct response without tools
        const aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey! What would you like to work on together? 📚";
        
        console.log('✅ Direct AI response generated successfully');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: false,
            hasPersonalData: false
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('💥 Error in AI coach function:', error);
    
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
