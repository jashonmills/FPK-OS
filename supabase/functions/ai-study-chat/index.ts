
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SYSTEM_PROMPT_PERSONAL, SYSTEM_PROMPT_GENERAL } from './constants.ts';
import { ChatRequest, QueryMode } from './types.ts';
import { getLearningContext, getChatHistory } from './context.ts';
import { detectQueryMode, detectRecentFlashcardsRequest } from './mode-detection.ts';
import { buildContextPrompt } from './prompt-builder.ts';
import { callClaude, callOpenAI, handleToolCalls, postProcessResponse } from './claude-client.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, chatMode = 'personal', voiceActive = false, metadata }: ChatRequest = await req.json();
    
    console.log('🎯 Dual AI Coach request:', { 
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

    // Mode-specific fallback handling
    if (chatMode === 'general' && !openaiApiKey) {
      const fallbackResponse = voiceActive 
        ? "I need an OpenAI API key to access General Knowledge mode. Please switch to My Data mode or configure the OpenAI API key."
        : "🌐 General Knowledge mode requires OpenAI API configuration. Switch to My Data mode for personalized guidance, or ask an admin to configure OpenAI API access.";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          voiceEnabled: voiceActive,
          error: 'openai_key_missing'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (chatMode === 'personal' && !anthropicApiKey) {
      const fallbackResponse = voiceActive 
        ? "I need an Anthropic API key to access your personal data. Please switch to General Knowledge mode or configure the Anthropic API key."
        : "🔒 My Data mode requires Anthropic API configuration. Switch to General Knowledge mode for general questions, or ask an admin to configure Anthropic API access.";
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          voiceEnabled: voiceActive,
          error: 'anthropic_key_missing'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine model and API based on chat mode
    const useOpenAI = chatMode === 'general';
    const model = useOpenAI ? 'gpt-4o' : 'claude-3-5-sonnet-20241022';
    
    console.log(`🤖 Using ${useOpenAI ? 'OpenAI' : 'Claude'} model: ${model} for ${chatMode} mode`);

    // Context isolation and mode-specific data fetching
    let queryMode: QueryMode;
    let learningContext: any = null;
    let chatHistory: any[] = [];

    if (chatMode === 'personal') {
      // Personal mode: detect query mode and get personal data
      queryMode = detectQueryMode(message);
      console.log('🧠 Query mode detected:', queryMode);
      
      const isRecentFlashcardsRequest = detectRecentFlashcardsRequest(message);
      if (isRecentFlashcardsRequest) {
        console.log('📚 Recent flashcards request detected - ensuring tool usage');
      }
      
      [learningContext, chatHistory] = await Promise.all([
        getLearningContext(userId),
        sessionId ? getChatHistory(sessionId, 6) : Promise.resolve([])
      ]);
    } else {
      // General mode: no personal data, only external knowledge
      queryMode = 'general';
      chatHistory = sessionId ? await getChatHistory(sessionId, 6) : [];
      console.log('🌐 General Knowledge mode - using external knowledge sources only');
    }

    // Build context prompt with strict mode isolation
    const contextPrompt = buildContextPrompt(
      learningContext,
      chatHistory,
      queryMode,
      voiceActive,
      message,
      chatMode
    );

    // Initial call to appropriate AI service
    const messages = [{
      role: 'user',
      content: contextPrompt
    }];

    let data;
    if (useOpenAI) {
      data = await callOpenAI(messages, model, chatMode);
    } else {
      data = await callClaude(messages, model, chatMode);
    }
    
    console.log('📨 AI response received:', { 
      hasContent: !!data.content, 
      contentLength: data.content?.length,
      stopReason: data.stop_reason,
      model,
      chatMode,
      aiProvider: useOpenAI ? 'OpenAI' : 'Claude'
    });

    // Handle tool usage (only for Claude/personal mode currently)
    if (!useOpenAI && data.stop_reason === 'tool_use') {
      const toolResults = await handleToolCalls(data, userId, chatMode);
      
      if (toolResults.length > 0) {
        console.log('🔄 Sending tool results back to Claude...');

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
        let aiResponse = finalData.content?.[0]?.text || "I've analyzed your request and I'm here to help guide your learning journey! 📚";
        
        aiResponse = postProcessResponse(aiResponse, chatMode);
        
        console.log('✅ Final AI response generated successfully with tool data');

        return new Response(
          JSON.stringify({ 
            response: aiResponse,
            voiceEnabled: voiceActive,
            toolsUsed: true,
            queryMode,
            chatMode,
            model,
            aiProvider: 'Claude',
            hasPersonalData: chatMode === 'personal' && queryMode === 'personal'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Direct response handling
    let aiResponse;
    if (useOpenAI) {
      // OpenAI response format
      aiResponse = data.choices?.[0]?.message?.content || "I'm here to help you explore any topic! What would you like to learn about? 🌟";
    } else {
      // Claude response format
      aiResponse = data.content?.[0]?.text || "I'm here to guide your personalized learning journey! What would you like to work on together? 📚";
    }
    
    // Post-process the response
    aiResponse = postProcessResponse(aiResponse, chatMode);
    
    console.log('✅ Direct AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        voiceEnabled: voiceActive,
        toolsUsed: false,
        queryMode,
        chatMode,
        model,
        aiProvider: useOpenAI ? 'OpenAI' : 'Claude',
        hasPersonalData: chatMode === 'personal'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error in Dual AI coach function:', error);
    
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
