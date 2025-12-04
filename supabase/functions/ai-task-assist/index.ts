import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, taskId, title, description } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;

    if (action === 'summarize') {
      // Fetch all comments for the task
      const { data: comments, error } = await supabase
        .from('task_comments')
        .select('content, created_at, user_id, profiles(full_name)')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!comments || comments.length === 0) {
        return new Response(
          JSON.stringify({ summary: 'No comments to summarize.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const commentThread = comments.map((c: any) => 
        `${c.profiles?.full_name || 'User'}: ${c.content}`
      ).join('\n\n');

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: `You are a project management assistant. Summarize this task's comment thread in 2-3 sentences, highlighting key decisions, unresolved questions, and action items.\n\nComments:\n${commentThread}`
          }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      result = { summary: data.choices[0].message.content };

    } else if (action === 'suggest-subtasks') {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: `Based on this task, suggest 3-5 actionable sub-tasks:\n\nTitle: ${title}\nDescription: ${description || 'No description provided'}`
          }],
          tools: [{
            type: 'function',
            function: {
              name: 'suggest_subtasks',
              description: 'Return 3-5 actionable sub-task suggestions',
              parameters: {
                type: 'object',
                properties: {
                  suggestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                      },
                      required: ['title', 'priority'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['suggestions'],
                additionalProperties: false
              }
            }
          }],
          tool_choice: { type: 'function', function: { name: 'suggest_subtasks' } }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices[0].message.tool_calls?.[0];
      
      if (toolCall) {
        const args = JSON.parse(toolCall.function.arguments);
        result = { suggestions: args.suggestions };
      } else {
        result = { suggestions: [] };
      }

    } else if (action === 'identify-blockers') {
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('description')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      const { data: comments, error: commentsError } = await supabase
        .from('task_comments')
        .select('content')
        .eq('task_id', taskId);

      if (commentsError) throw commentsError;

      const allText = [
        task.description || '',
        ...(comments || []).map(c => c.content)
      ].join('\n\n');

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: `Analyze this task and identify any blockers, dependencies, or roadblocks mentioned. Look for phrases like "blocked by", "waiting for", "depends on", "can't proceed until". Return a list of blockers or state "No blockers identified".\n\nTask content:\n${allText}`
          }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      result = { blockers: data.choices[0].message.content };

    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-task-assist:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
