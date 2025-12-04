import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tool type to toolId mapping for the unified gateway
const TOOL_TYPE_TO_ID: Record<string, string> = {
  'lesson-plan': 'lesson-planner',
  'quiz': 'quiz-generator',
  'rubric': 'rubric-creator',
  'course-outline': 'course-builder',
  'grade-feedback': 'grading-assistant',
  'performance-insights': 'performance-analyzer',
};

// Additional context builders for each tool type
function buildUserPrompt(toolType: string, params: any): string {
  switch (toolType) {
    case 'lesson-plan':
      return `Create a detailed lesson plan for:
Topic: ${params.topic}
Grade Level: ${params.grade || 'Not specified'}
Duration: ${params.duration || 60} minutes
${params.objectives ? `Key Objectives: ${params.objectives}` : ''}`;

    case 'quiz':
      return `Generate ${params.count || 5} ${params.difficulty || 'Medium'} difficulty quiz questions about:
Topic: ${params.topic}
Question Type: ${params.type || 'Multiple Choice'}

Remember to respond with valid JSON only.`;

    case 'rubric':
      return `Create a grading rubric for:
Assignment: ${params.assignmentTitle || 'Assignment'}
Subject Area: ${params.subject || 'General'}
Grade Level: ${params.grade || 'Not specified'}
${params.criteria ? `Existing criteria to expand: ${params.criteria.join(', ')}` : ''}

Remember to respond with valid JSON only.`;

    case 'course-outline':
      return `Generate a course structure for:
Unit Topic: ${params.topic}
Duration: ${params.duration || '2 weeks'}
${params.goals ? `Learning Goals: ${params.goals}` : ''}

Remember to respond with valid JSON only.`;

    case 'grade-feedback':
      return `Analyze this student submission and provide feedback:

Student Work:
${params.studentWork}

${params.rubric ? `Grading Rubric: ${params.rubric}` : ''}
${params.assignmentTitle ? `Assignment: ${params.assignmentTitle}` : ''}`;

    case 'performance-insights':
      return `Analyze this student performance data and provide insights:
${JSON.stringify(params.data, null, 2)}`;

    default:
      return params.prompt || 'Please provide guidance.';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolType, ...params } = await req.json();
    
    if (!toolType) {
      return new Response(
        JSON.stringify({ error: `Tool type is required` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const toolId = TOOL_TYPE_TO_ID[toolType];
    if (!toolId) {
      return new Response(
        JSON.stringify({ error: `Invalid tool type: ${toolType}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    
    // Create supabase client for user lookup
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: authHeader ? { Authorization: authHeader } : {} } }
    );

    // Try to get user ID and org ID
    let userId: string | null = null;
    let orgId: string | null = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        userId = user.id;
        
        // Get user's org
        const { data: orgMember } = await supabaseClient
          .from('org_members')
          .select('org_id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        orgId = orgMember?.org_id || null;
      }
    }

    // Build the user message
    const userPrompt = buildUserPrompt(toolType, params);

    console.log(`[TEACHER-AI-TOOLS] Tool: ${toolType} -> ${toolId}`);
    console.log(`[TEACHER-AI-TOOLS] User prompt: ${userPrompt.substring(0, 200)}...`);

    // Call the unified AI gateway
    console.log('[TEACHER-AI-TOOLS] 🔀 Routing through unified-ai-gateway...');
    const gatewayResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/unified-ai-gateway`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolId,
        userId,
        orgId,
        message: userPrompt,
        // Lower temperature for structured output tools
        temperatureOverride: ['quiz', 'rubric', 'course-outline'].includes(toolType) ? 0.3 : undefined,
      })
    });

    if (!gatewayResponse.ok) {
      const errorData = await gatewayResponse.json().catch(() => ({ error: 'Gateway error' }));
      console.error('[TEACHER-AI-TOOLS] ❌ Gateway error:', gatewayResponse.status, errorData);
      return new Response(
        JSON.stringify(errorData),
        { status: gatewayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gatewayData = await gatewayResponse.json();
    const content = gatewayData.response || '';

    // For JSON-expected responses, try to parse
    if (['quiz', 'rubric', 'course-outline'].includes(toolType)) {
      try {
        // Extract JSON from markdown code blocks if present
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        }
        const parsed = JSON.parse(jsonStr);
        return new Response(
          JSON.stringify({ result: parsed, raw: content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('[TEACHER-AI-TOOLS] JSON parse error:', parseError);
        // Return raw content if JSON parsing fails
        return new Response(
          JSON.stringify({ result: null, raw: content, parseError: 'Failed to parse JSON response' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ result: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[TEACHER-AI-TOOLS] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
