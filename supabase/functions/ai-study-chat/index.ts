
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

// Enhanced system prompt for Claude Sonnet 4 with tool usage
const SYSTEM_PROMPT = `You are the FPK University AI Learning Coach. You help students by providing personalized guidance based on their actual study data.

**Your Role:**
- Analyze the student's real flashcards, study sessions, and performance data using available tools
- Provide specific, actionable advice based on their actual learning patterns
- Be encouraging and supportive while offering concrete next steps
- Always use tools to fetch current data when students ask about their progress, flashcards, or performance

**Available Tools:**
- get_recent_flashcards: Fetch the student's most recent flashcards (use when they ask about recent cards, last flashcards, or want to review what they've created)
- get_flashcards_by_group: Get flashcards from a specific folder/subject (use when they mention a subject or folder)
- search_flashcards: Search through their flashcards by content or performance (use when they want to find specific cards or cards they're struggling with)
- get_study_stats: Get comprehensive study statistics and progress data (use when they ask about progress, performance, stats, or achievements)

**Tool Usage Guidelines:**
- ALWAYS use tools when students ask about their data, progress, or flashcards
- Use get_study_stats for questions about performance, progress, streaks, or achievements
- Use get_recent_flashcards when they want to see what they've been studying recently
- Use search_flashcards to find specific content or struggling cards
- Use get_flashcards_by_group for subject-specific questions

**Response Style:**
- Be direct and helpful with specific data-driven insights
- Reference actual numbers and flashcard content from tool results
- Offer specific next actions based on their real data
- Keep responses conversational and encouraging

**Voice Mode:**
- If voiceActive=true, structure responses for natural speech with appropriate pauses
- Use shorter sentences and clear transitions for voice output

Always prioritize using tools to provide accurate, personalized guidance based on their current study data.`;

// Tool implementations using Supabase edge functions
async function executeToolCall(toolName: string, args: any) {
  try {
    console.log(`Executing tool: ${toolName} with args:`, args);
    
    const { data, error } = await supabase.functions.invoke(toolName.replace('_', '-'), {
      body: args
    });

    if (error) {
      console.error(`Tool ${toolName} error:`, error);
      throw error;
    }

    console.log(`Tool ${toolName} response:`, data);
    return data;
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    return { error: `Failed to execute ${toolName}: ${error.message}` };
  }
}

// Get user context for personalization
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

    console.log('Calling Claude Sonnet 4 with tools...');
    
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
              name: 'get_flashcards_by_group',
              description: 'Get flashcards from a specific folder or subject. Use when they mention a subject, folder, or category.',
              input_schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', description: 'The user ID' },
                  groupId: { type: 'string', description: 'The folder/group name or subject' }
                },
                required: ['userId', 'groupId']
              }
            },
            {
              name: 'search_flashcards',
              description: 'Search through flashcards by content or find cards they\'re struggling with. Use when they want to find specific cards or review difficult material.',
              input_schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', description: 'The user ID' },
                  query: { type: 'string', description: 'Search query or content to find' },
                  filter: { type: 'string', description: 'Performance filter: "low success", "needs practice", etc.', enum: ['low success', 'needs practice', 'all'] }
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
      console.log('Claude response received:', { 
        hasContent: !!data.content, 
        contentLength: data.content?.length,
        stopReason: data.stop_reason 
      });

      // Check if Claude wants to use tools
      if (data.stop_reason === 'tool_use') {
        console.log('Claude requested tool usage');
        
        // Execute tool calls
        const toolResults = [];
        const toolMessages = [];
        
        for (const contentBlock of data.content) {
          if (contentBlock.type === 'tool_use') {
            const toolName = contentBlock.name;
            const toolArgs = { ...contentBlock.input, userId }; // Ensure userId is included
            
            console.log(`Executing tool: ${toolName}`, toolArgs);
            const toolResult = await executeToolCall(toolName, toolArgs);
            
            toolResults.push({
              tool_use_id: contentBlock.id,
              content: JSON.stringify(toolResult)
            });
          }
        }

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
        
        console.log('Final AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: toolResults.length > 0,
            hasPersonalData: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } else {
        // Direct response without tools
        const aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey! What would you like to work on together? 📚";
        
        console.log('Direct AI response generated successfully');

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
