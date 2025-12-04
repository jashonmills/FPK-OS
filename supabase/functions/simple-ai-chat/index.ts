import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    console.log('Simple AI Chat request:', { hasMessage: !!message, hasUserId: !!userId });
    
    if (!message || !userId) {
      throw new Error('Message and user ID are required');
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      // Provide helpful fallback response when no API key
      const fallbackResponse = `I understand you're asking about "${message}". While I don't have access to my full AI capabilities right now, I can still provide some helpful study guidance:

🎯 **For Better Learning:**
- Use active recall: test yourself without looking at notes
- Practice spaced repetition: review material at increasing intervals
- Break study sessions into 25-30 minute focused blocks

📚 **Study Techniques:**
- Summarize what you've learned in your own words
- Create mind maps or visual connections
- Teach the concept to someone else (or yourself aloud)

🧠 **Memory Tips:**
- Create acronyms or mnemonics for lists
- Associate new information with things you already know
- Use the "story method" to remember sequences

What specific topic or subject would you like help with?`;

      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          source: 'fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI Learning Coach. You help students with study techniques, learning strategies, and academic guidance. Be encouraging, practical, and provide actionable advice. Keep responses concise but helpful. Use emojis occasionally to make responses more engaging.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices?.[0]?.message?.content || "I'm here to help with your learning journey! What would you like to work on?";

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        source: 'openai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in simple AI chat function:', error);
    
    // Smart fallback response
    const fallbackResponse = `I'm here to help with your studies! 🎓 Here are some quick tips while I get back online:

📖 **Reading Strategy**: Preview → Question → Read → Reflect → Review
⏰ **Time Management**: Use the Pomodoro Technique (25 min work, 5 min break)
🧠 **Memory**: Create visual associations and practice active recall
📝 **Note-taking**: Use the Cornell method for better organization

What subject or topic are you working on? I can provide more specific guidance!`;
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        source: 'error_fallback'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});