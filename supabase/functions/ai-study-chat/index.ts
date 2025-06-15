
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

// Enhanced system prompt with dual-mode functionality
const SYSTEM_PROMPT = `You are Claude, the FPK University AI Learning Coach. You have two distinct modes:

**1. PERSONAL MODE** - When users ask about THEIR data:
- Keywords: "my flashcards", "my cards", "my progress", "my stats", "my XP", "my streak", "recent cards", "last session"
- ALWAYS use tools: get_recent_flashcards, get_user_flashcards, get_study_stats
- Reference actual data in your responses: "I see your card about [front content] - [back content]"
- Provide specific insights: "Your card on X has a 45% success rate, let's work on that"

**2. GENERAL KNOWLEDGE MODE** - For subject matter questions:
- Keywords: history, science, math, definitions, "what is", "what causes", "how does", "explain"
- Use retrieve_knowledge tool to get external information from Wikipedia, academic sources
- Answer directly with factual information, cite sources
- Do NOT try to fetch personal data for these questions
- Do NOT say "I'm connecting to your data" for general questions

**MODE DETECTION RULES:**
- If question contains personal pronouns about study data → PERSONAL MODE
- If question is about academic topics, definitions, facts → GENERAL KNOWLEDGE MODE
- If unclear, default to GENERAL KNOWLEDGE MODE

**Available Tools:**
1. get_recent_flashcards: Get user's most recent flashcards
2. get_user_flashcards: Advanced flashcard search with filters
3. get_study_stats: User's study statistics and progress
4. retrieve_knowledge: Get external knowledge from academic sources

**Response Style:**
- Be conversational and encouraging
- Provide actionable insights
- Cite sources for general knowledge
- Keep responses focused and helpful

Always choose the correct mode immediately and respond accordingly.`;

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

// Detect if query is personal or general knowledge
function detectQueryMode(message: string): 'personal' | 'general' {
  const personalKeywords = [
    'my flashcards', 'my cards', 'my progress', 'my stats', 'my xp', 'my streak',
    'recent cards', 'last session', 'my performance', 'my accuracy', 'my goals',
    'cards i', 'flashcards i', 'sessions i', 'studied', 'learning'
  ];
  
  const generalKeywords = [
    'what is', 'what are', 'what causes', 'how does', 'explain', 'define',
    'history', 'science', 'math', 'physics', 'chemistry', 'biology',
    'causes of', 'civil war', 'world war', 'definition of'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for personal keywords first (higher priority)
  if (personalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'personal';
  }
  
  // Check for general knowledge keywords
  if (generalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'general';
  }
  
  // Default to general knowledge for ambiguous cases
  return 'general';
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

    // Detect query mode
    const queryMode = detectQueryMode(message);
    console.log('🧠 Query mode detected:', queryMode);

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

    // Add mode detection context
    contextPrompt += `\n\nQUERY MODE: ${queryMode.toUpperCase()}`;
    if (queryMode === 'personal') {
      contextPrompt += ` - Use personal data tools to answer about the user's study progress and flashcards.`;
    } else {
      contextPrompt += ` - Use general knowledge tools or your training to answer this academic/factual question directly.`;
    }

    // Add voice optimization
    if (voiceActive) {
      contextPrompt += `\n\nVOICE MODE: Structure your response for natural speech with appropriate pauses.`;
    }

    contextPrompt += conversationContext;
    contextPrompt += `\n\nStudent's question: "${message}"`;

    console.log('🤖 Calling Claude with dual-mode tools...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      // Define tools based on query mode
      const tools = [
        // Personal data tools (always available)
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
        },
        // General knowledge tool (always available)
        {
          name: 'retrieve_knowledge',
          description: 'Retrieve external knowledge from academic sources like Wikipedia, research papers, and educational databases. Use for general knowledge questions about any topic.',
          input_schema: {
            type: 'object',
            properties: {
              topic: { type: 'string', description: 'The topic to research' }
            },
            required: ['topic']
          }
        }
      ];

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
          tools,
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
            let toolArgs = contentBlock.input;
            
            // Ensure userId is included for personal tools
            if (['get_recent_flashcards', 'get_user_flashcards', 'get_study_stats'].includes(toolName)) {
              toolArgs = { ...toolArgs, userId };
            }
            
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
        const aiResponse = finalData.content?.[0]?.text || "I've analyzed your request and I'm here to help guide your learning journey! 📚";
        
        console.log('✅ Final AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: true,
            queryMode,
            hasPersonalData: queryMode === 'personal'
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
            queryMode,
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
    
    const smartFallback = "I'm here to support your personalized learning journey! 🎯 I can help with both your study data and general knowledge questions. What would you like to explore?";
    
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
