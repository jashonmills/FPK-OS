
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SYSTEM_PROMPT } from './constants.ts';
import { ChatRequest, QueryMode } from './types.ts';
import { getLearningContext, getChatHistory } from './context.ts';
import { detectQueryMode } from './mode-detection.ts';
import { buildContextPrompt } from './prompt-builder.ts';
import { callClaude, handleToolCalls } from './claude-client.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, chatMode = 'personal', voiceActive = false, metadata }: ChatRequest = await req.json();
    
    console.log('🎯 AI Coach request:', { 
      hasMessage: !!message, 
      hasUserId: !!userId, 
      chatMode,
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

    // Determine model and tools based on chat mode
    const model = chatMode === 'personal' ? 'claude-3-5-sonnet-20241022' : 'claude-3-opus-20240229';
    console.log(`🤖 Using model: ${model} for ${chatMode} mode`);

    // Detect query mode and get context based on chat mode
    let queryMode: QueryMode;
    let learningContext: any = null;
    let chatHistory: any[] = [];

    if (chatMode === 'personal') {
      queryMode = detectQueryMode(message);
      console.log('🧠 Query mode detected:', queryMode);
      
      [learningContext, chatHistory] = await Promise.all([
        getLearningContext(userId),
        sessionId ? getChatHistory(sessionId, 4) : Promise.resolve([])
      ]);
    } else {
      // For general mode, always use general query mode and don't fetch personal data
      queryMode = 'general';
      console.log('🌐 General knowledge mode - no personal data access');
    }

    // Build context prompt with mode-specific system prompts
    const contextPrompt = buildContextPrompt(
      learningContext,
      chatHistory,
      queryMode,
      voiceActive,
      message,
      chatMode
    );

    // Initial call to Claude with the appropriate model
    const messages = [{
      role: 'user',
      content: contextPrompt
    }];

    const data = await callClaude(messages, model, chatMode);
    
    console.log('📨 Claude response received:', { 
      hasContent: !!data.content, 
      contentLength: data.content?.length,
      stopReason: data.stop_reason,
      model,
      chatMode
    });

    // Check if Claude wants to use tools
    if (data.stop_reason === 'tool_use') {
      const toolResults = await handleToolCalls(data, userId, chatMode);
      
      if (toolResults.length > 0) {
        console.log('🔄 Sending tool results back to Claude...');

        // Send tool results back to Claude for final response with correct message structure
        const finalMessages = [
          ...messages,
          {
            role: 'assistant',
            content: data.content
          },
          {
            role: 'user',
            content: toolResults
          }
        ];

        const finalData = await callClaude(finalMessages, model, chatMode);
        const aiResponse = finalData.content?.[0]?.text || "I've analyzed your request and I'm here to help guide your learning journey! 📚";
        
        console.log('✅ Final AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: true,
            queryMode,
            chatMode,
            model,
            hasPersonalData: chatMode === 'personal' && queryMode === 'personal'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Direct response without tools
    const defaultResponse = chatMode === 'personal' 
      ? "I'm here to guide your personalized learning journey! What would you like to work on together? 📚"
      : "I'm here to help you explore any topic with comprehensive research and analysis! What would you like to learn about? 🌟";
      
    const aiResponse = data.content?.[0]?.text || defaultResponse;
    
    console.log('✅ Direct AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        voiceEnabled: voiceActive,
        toolsUsed: false,
        queryMode,
        chatMode,
        model,
        hasPersonalData: chatMode === 'personal'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error in AI coach function:', error);
    
    const smartFallback = "I'm here to support your learning journey! 🎯 I can help with both your study data and general knowledge questions. What would you like to explore?";
    
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
