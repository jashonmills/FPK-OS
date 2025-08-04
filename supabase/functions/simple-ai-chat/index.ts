
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store (simple in-memory for demo)
const rateLimitStore = new Map();

const checkRateLimit = (userId: string, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || { count: 0, resetTime: now + windowMs };
  
  if (now > userRequests.resetTime) {
    userRequests.count = 1;
    userRequests.resetTime = now + windowMs;
  } else if (userRequests.count >= maxRequests) {
    return false;
  } else {
    userRequests.count++;
  }
  
  rateLimitStore.set(userId, userRequests);
  return true;
};

const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .trim()
    .slice(0, 4000); // Limit length
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Simple AI Chat request started');

    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      throw new Error('Invalid JSON in request body');
    }

    const { message, userId } = requestBody;
    
    console.log('Request data:', { hasMessage: !!message, hasUserId: !!userId });
    
    // Input validation
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }
    
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID is required and must be a string');
    }

    // Sanitize inputs
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedUserId = sanitizeInput(userId);

    if (!sanitizedMessage) {
      throw new Error('Message cannot be empty after sanitization');
    }

    // Rate limiting
    if (!checkRateLimit(sanitizedUserId)) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Validate user session
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      
      if (userError || !userData.user || userData.user.id !== sanitizedUserId) {
        throw new Error('Invalid authentication');
      }
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      // Provide helpful fallback response when no API key
      const fallbackResponse = `I understand you're asking about "${sanitizedMessage}". While I don't have access to my full AI capabilities right now, I can still provide some helpful study guidance:

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

    // Call OpenAI API with enhanced security
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
            content: `You are an AI Learning Coach. You help students with study techniques, learning strategies, and academic guidance. Be encouraging, practical, and provide actionable advice. Keep responses concise but helpful. Use emojis occasionally to make responses more engaging. Do not provide information on harmful activities or inappropriate content.`
          },
          {
            role: 'user',
            content: sanitizedMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('AI service temporarily unavailable');
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices?.[0]?.message?.content || "I'm here to help with your learning journey! What would you like to work on?";

    // Sanitize AI response
    const sanitizedResponse = sanitizeInput(aiResponse);

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: sanitizedResponse,
        source: 'openai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in simple AI chat function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    // Don't expose internal errors to client
    const safeErrorMessage = errorMessage.includes('Rate limit') ? errorMessage : 'Service temporarily unavailable. Please try again later.';
    
    // Smart fallback response for user-friendly errors
    const fallbackResponse = `I'm here to help with your studies! 🎓 Here are some quick tips while I get back online:

📖 **Reading Strategy**: Preview → Question → Read → Reflect → Review
⏰ **Time Management**: Use the Pomodoro Technique (25 min work, 5 min break)
🧠 **Memory**: Create visual associations and practice active recall
📝 **Note-taking**: Use the Cornell method for better organization

What subject or topic are you working on? I can provide more specific guidance!`;
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        error: safeErrorMessage,
        source: 'error_fallback'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
