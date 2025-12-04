import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodeContext {
  code: string;
  output: string;
  language?: string;
}

interface CodeAction {
  action: 'replace_code' | 'insert_code' | 'highlight_lines' | 'run_code';
  code?: string;
  lines?: number[];
  explanation?: string;
}

interface LearningHubRequest {
  toolId: string;
  message: string;
  sessionId?: string;
  messageHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  codeContext?: CodeContext;
}

// Tool definition for code actions
const codeEditorActionsTool = {
  type: "function",
  function: {
    name: "code_editor_actions",
    description: "Perform actions on the code editor like replacing code, highlighting lines, or running code. Use this when you want to modify the user's code, point out specific lines, or suggest running the code.",
    parameters: {
      type: "object",
      properties: {
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["replace_code", "insert_code", "highlight_lines", "run_code"],
                description: "The action to perform"
              },
              code: {
                type: "string",
                description: "The code to insert or replace (for replace_code and insert_code actions)"
              },
              lines: {
                type: "array",
                items: { type: "number" },
                description: "Line numbers to highlight (for highlight_lines action)"
              },
              explanation: {
                type: "string",
                description: "Brief explanation of what this action does"
              }
            },
            required: ["action"]
          }
        }
      },
      required: ["actions"]
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[AI-LEARNING-HUB] 🚀 Request received');

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[AI-LEARNING-HUB] ❌ Auth failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AI-LEARNING-HUB] ✅ User authenticated:', user.id);

    // Parse request
    const { toolId, message, sessionId, messageHistory = [], codeContext }: LearningHubRequest = await req.json();

    if (!toolId || !message) {
      return new Response(
        JSON.stringify({ error: 'toolId and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AI-LEARNING-HUB] 📋 Tool:', toolId, '| Message length:', message.length, '| Has code context:', !!codeContext);

    // Get user's org_id if any
    const { data: orgMember } = await supabaseClient
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const orgId = orgMember?.org_id || null;

    // Build additional context for code-companion
    let additionalContext = '';
    if (toolId === 'code-companion' && codeContext) {
      const lang = codeContext.language || 'JavaScript';
      const langLower = lang.toLowerCase();
      const isRunnable = ['javascript', 'typescript'].includes(langLower);
      
      additionalContext = `
## CURRENT CODE CONTEXT
Language: ${lang}
The user's current code in the editor:
\`\`\`${langLower}
${codeContext.code}
\`\`\`

Console output from last run:
\`\`\`
${codeContext.output || '(not run yet)'}
\`\`\`

## INSTRUCTIONS FOR CODE ASSISTANCE
1. The user is learning ${lang}. Always provide examples in ${lang}.
2. Always reference the specific code above when explaining concepts
3. If you spot bugs or issues, point them out with specific line numbers
4. When suggesting code changes, provide complete working code in ${lang}
5. Use the code_editor_actions tool to:
   - Replace code when fixing bugs or improving code
   - Highlight specific lines when explaining concepts
   ${isRunnable ? '- Suggest running the code after changes' : '- Note: This language cannot run in the browser, focus on explaining'}
6. Be encouraging and educational - explain WHY changes help
7. If the console shows an error, prioritize explaining and fixing it
${!isRunnable ? `8. Since ${lang} cannot run in the browser, focus on explaining concepts and syntax` : ''}`;
    }

    // Prepare tools for code-companion
    const tools = (toolId === 'code-companion' && codeContext) ? [codeEditorActionsTool] : undefined;

    // Call the unified AI gateway
    console.log('[AI-LEARNING-HUB] 🔀 Routing through unified-ai-gateway...');
    const gatewayResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/unified-ai-gateway`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolId,
        userId: user.id,
        orgId,
        message,
        messageHistory: messageHistory.slice(-10),
        additionalContext,
        tools,
        toolChoice: tools ? "auto" : undefined,
      })
    });

    if (!gatewayResponse.ok) {
      const errorData = await gatewayResponse.json().catch(() => ({ error: 'Gateway error' }));
      console.error('[AI-LEARNING-HUB] ❌ Gateway error:', gatewayResponse.status, errorData);
      return new Response(
        JSON.stringify(errorData),
        { status: gatewayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gatewayData = await gatewayResponse.json();
    
    let responseContent = gatewayData.response || 'I apologize, but I could not generate a response. Please try again.';
    let codeActions: CodeAction[] = [];

    // Process tool calls if present (from gateway's raw response)
    if (gatewayData.toolCalls && gatewayData.toolCalls.length > 0) {
      for (const toolCall of gatewayData.toolCalls) {
        if (toolCall.function?.name === 'code_editor_actions') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            if (args.actions && Array.isArray(args.actions)) {
              codeActions = args.actions;
              console.log('[AI-LEARNING-HUB] 📝 Code actions extracted:', codeActions.length);
            }
          } catch (e) {
            console.error('[AI-LEARNING-HUB] ⚠️ Failed to parse tool call:', e);
          }
        }
      }
    }

    console.log('[AI-LEARNING-HUB] ✅ Response received, length:', responseContent.length, '| Code actions:', codeActions.length);

    // Generate or use existing session ID
    const currentSessionId = sessionId || `session_${Date.now()}_${user.id.substring(0, 8)}`;

    // Return response
    const responseBody: any = {
      response: responseContent,
      sessionId: currentSessionId,
      toolId: toolId,
      creditsUsed: gatewayData.creditsUsed || 1,
    };

    if (codeActions.length > 0) {
      responseBody.codeActions = codeActions;
    }

    return new Response(
      JSON.stringify(responseBody),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('[AI-LEARNING-HUB] ❌ Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
