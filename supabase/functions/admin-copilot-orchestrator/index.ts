import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Available tools the AI can call
const ADMIN_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_students",
      description: "Get list of students with their enrollment and progress data. Can filter by completion percentage.",
      parameters: {
        type: "object",
        properties: {
          completion_below: {
            type: "integer",
            description: "Filter to students with average completion below this percentage (e.g., 50 for students struggling)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_courses",
      description: "Get course assignments, enrollment counts, completion rates, and recent completions",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_ai_usage",
      description: "Get AI tool usage statistics including sessions, messages, top users, and daily trends",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "integer",
            description: "Number of days to look back (default 30)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_governance_stats",
      description: "Get AI governance statistics including rules, pending approvals, and blocked actions",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_goals",
      description: "Get student goals summary including completion rates and recent goals",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_groups",
      description: "Get student groups with member counts and messaging settings",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_staff",
      description: "Get staff members list with roles and activity",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "search_knowledge",
      description: "Search the platform knowledge base for how-to answers and feature documentation",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to find relevant documentation"
          }
        },
        required: ["query"]
      }
    }
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { message, orgId, conversationHistory = [] } = await req.json();
    
    if (!orgId) {
      return new Response(JSON.stringify({ error: 'Organization ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify user is Admin or Owner in this org
    const { data: membership } = await supabaseClient
      .from('org_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return new Response(JSON.stringify({ error: 'Access denied. Admin or Owner role required.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get organization info for context
    const { data: orgInfo } = await supabaseClient
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single();

    const orgName = orgInfo?.name || 'your organization';

    console.log(`[ADMIN_COPILOT] User ${user.id} querying org ${orgId}: ${message}`);

    // Build system prompt
    const systemPrompt = `You are the Admin AI Co-pilot for "${orgName}". You are an expert assistant that helps administrators manage their organization on FPK University.

Your capabilities:
1. Answer questions about organization data (students, courses, AI usage, goals, groups, staff)
2. Provide step-by-step guidance on platform features
3. Generate summaries and analytics insights

Rules:
- ONLY use information from the tools provided. NEVER make up data.
- Be concise and actionable in your responses.
- When showing lists, format them clearly with bullet points or numbered lists.
- If asked something outside your knowledge, say so and suggest where to find help.
- Always be helpful and professional.
- Use the search_knowledge tool for "how to" questions about platform features.
- For data questions, call the appropriate data tool first, then summarize the results.

Current organization: ${orgName}
User role: ${membership.role}`;

    // Build messages for the AI
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // First call: Let AI decide which tools to use
    const initialResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        tools: ADMIN_TOOLS,
        tool_choice: "auto"
      }),
    });

    if (!initialResponse.ok) {
      const errText = await initialResponse.text();
      console.error('[ADMIN_COPILOT] AI gateway error:', errText);
      throw new Error('AI service unavailable');
    }

    const initialData = await initialResponse.json();
    const assistantMessage = initialData.choices[0].message;

    // Check if AI wants to use tools
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log(`[ADMIN_COPILOT] AI requesting ${assistantMessage.tool_calls.length} tools`);
      
      // Execute each tool call
      const toolResults = [];
      
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || '{}');
        
        console.log(`[ADMIN_COPILOT] Executing tool: ${toolName}`, args);
        
        let result;
        
        switch (toolName) {
          case 'get_students':
            const studentFilters = args.completion_below 
              ? { completion_below: args.completion_below }
              : {};
            const { data: studentsData } = await supabaseClient
              .rpc('get_admin_copilot_students', { 
                p_org_id: orgId,
                p_filters: studentFilters
              });
            result = studentsData;
            break;
            
          case 'get_courses':
            const { data: coursesData } = await supabaseClient
              .rpc('get_admin_copilot_courses', { p_org_id: orgId });
            result = coursesData;
            break;
            
          case 'get_ai_usage':
            const { data: aiData } = await supabaseClient
              .rpc('get_admin_copilot_ai_usage', { 
                p_org_id: orgId,
                p_days: args.days || 30
              });
            result = aiData;
            break;
            
          case 'get_governance_stats':
            const { data: govData } = await supabaseClient
              .rpc('get_admin_copilot_governance_stats', { p_org_id: orgId });
            result = govData;
            break;
            
          case 'get_goals':
            const { data: goalsData } = await supabaseClient
              .rpc('get_admin_copilot_goals', { p_org_id: orgId });
            result = goalsData;
            break;
            
          case 'get_groups':
            const { data: groupsData } = await supabaseClient
              .rpc('get_admin_copilot_groups', { p_org_id: orgId });
            result = groupsData;
            break;
            
          case 'get_staff':
            const { data: staffData } = await supabaseClient
              .rpc('get_admin_copilot_staff', { p_org_id: orgId });
            result = staffData;
            break;
            
          case 'search_knowledge':
            const { data: kbData } = await supabaseClient
              .rpc('search_admin_copilot_knowledge', { p_query: args.query });
            result = kbData;
            break;
            
          default:
            result = { error: 'Unknown tool' };
        }
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: "tool",
          content: JSON.stringify(result)
        });
      }

      // Second call: Generate final response with tool results
      const finalMessages = [
        ...messages,
        assistantMessage,
        ...toolResults
      ];

      const finalResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: finalMessages,
          stream: true
        }),
      });

      if (!finalResponse.ok) {
        throw new Error('AI service error on final response');
      }

      // Log to audit
      await supabaseClient
        .from('audit_logs')
        .insert({
          action_type: 'admin_copilot_query',
          resource_type: 'admin_copilot',
          user_id: user.id,
          organization_id: orgId,
          details: {
            query: message,
            tools_used: assistantMessage.tool_calls.map((t: any) => t.function.name)
          }
        });

      return new Response(finalResponse.body, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
      });
    }

    // No tools needed, stream the direct response
    const directResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        stream: true
      }),
    });

    if (!directResponse.ok) {
      throw new Error('AI service error');
    }

    // Log to audit
    await supabaseClient
      .from('audit_logs')
      .insert({
        action_type: 'admin_copilot_query',
        resource_type: 'admin_copilot',
        user_id: user.id,
        organization_id: orgId,
        details: { query: message, tools_used: [] }
      });

    return new Response(directResponse.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });

  } catch (error) {
    console.error('[ADMIN_COPILOT] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
