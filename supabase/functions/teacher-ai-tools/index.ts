import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL_PROMPTS: Record<string, string> = {
  'lesson-plan': `You are an expert curriculum designer and lesson planner. Generate comprehensive, engaging lesson plans.

When given a topic, grade level, duration, and objectives, create a detailed lesson plan with:
1. Clear learning objectives (SWBAT format)
2. Required materials and resources
3. Lesson outline with timing
4. Warm-up/hook activity
5. Direct instruction section
6. Guided practice activities
7. Independent practice
8. Assessment/closure
9. Differentiation strategies
10. Extensions for advanced learners

Format the output in clean markdown with clear headers and bullet points.`,

  'quiz': `You are an assessment specialist who creates high-quality educational quizzes.

Generate quiz questions that:
- Match the specified difficulty level
- Have plausible distractors (wrong answers should be believable)
- Cover key concepts comprehensively
- Include brief explanations for the correct answer

IMPORTANT: You MUST respond with valid JSON in this exact format:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`,

  'rubric': `You are an assessment rubric expert who creates detailed, measurable grading criteria.

Generate rubrics with:
- Clear, specific criteria names
- Appropriate weight percentages that sum to 100%
- Detailed descriptions for each performance level:
  * Excellent (90-100%): Exceeds expectations
  * Good (80-89%): Meets expectations
  * Fair (70-79%): Approaching expectations
  * Poor (Below 70%): Below expectations

IMPORTANT: You MUST respond with valid JSON in this exact format:
{
  "criteria": [
    {
      "name": "Criteria Name",
      "weight": 25,
      "levels": {
        "excellent": "Description of excellent performance...",
        "good": "Description of good performance...",
        "fair": "Description of fair performance...",
        "poor": "Description of poor performance..."
      }
    }
  ]
}`,

  'course-outline': `You are a curriculum architect who designs logical, progressive course structures.

Generate course outlines with:
- Logical lesson sequences that build on each other
- Clear learning objectives for each lesson
- Suggested activities and assessments
- Estimated time for each lesson
- Prerequisites and connections between lessons

IMPORTANT: You MUST respond with valid JSON in this exact format:
{
  "units": [
    {
      "title": "Unit Title",
      "duration": "2 weeks",
      "lessons": [
        {
          "title": "Lesson Title",
          "objectives": ["Objective 1", "Objective 2"],
          "activities": ["Activity 1", "Activity 2"],
          "estimatedMinutes": 45
        }
      ]
    }
  ]
}`,

  'grade-feedback': `You are an experienced educator providing constructive feedback on student work.

When analyzing student submissions:
1. Identify strengths and what the student did well
2. Point out specific areas for improvement
3. Provide actionable suggestions
4. Consider the rubric criteria if provided
5. Suggest a grade range with justification
6. Use encouraging, growth-mindset language

Format your response with clear sections:
## Overall Assessment
## Strengths
## Areas for Improvement
## Specific Suggestions
## Suggested Grade`,

  'performance-insights': `You are an educational data analyst providing actionable insights on student performance.

When given performance data:
1. Identify trends and patterns
2. Highlight top performers
3. Flag students who may need additional support
4. Suggest intervention strategies
5. Recommend curriculum adjustments based on common struggles
6. Provide specific, actionable recommendations

Be concise but thorough. Focus on data-driven insights that teachers can act on immediately.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolType, ...params } = await req.json();
    
    if (!toolType || !TOOL_PROMPTS[toolType]) {
      return new Response(
        JSON.stringify({ error: `Invalid tool type: ${toolType}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = TOOL_PROMPTS[toolType];
    let userPrompt = '';

    // Build user prompt based on tool type
    switch (toolType) {
      case 'lesson-plan':
        userPrompt = `Create a detailed lesson plan for:
Topic: ${params.topic}
Grade Level: ${params.grade || 'Not specified'}
Duration: ${params.duration || 60} minutes
${params.objectives ? `Key Objectives: ${params.objectives}` : ''}`;
        break;

      case 'quiz':
        userPrompt = `Generate ${params.count || 5} ${params.difficulty || 'Medium'} difficulty quiz questions about:
Topic: ${params.topic}
Question Type: ${params.type || 'Multiple Choice'}

Remember to respond with valid JSON only.`;
        break;

      case 'rubric':
        userPrompt = `Create a grading rubric for:
Assignment: ${params.assignmentTitle || 'Assignment'}
Subject Area: ${params.subject || 'General'}
Grade Level: ${params.grade || 'Not specified'}
${params.criteria ? `Existing criteria to expand: ${params.criteria.join(', ')}` : ''}

Remember to respond with valid JSON only.`;
        break;

      case 'course-outline':
        userPrompt = `Generate a course structure for:
Unit Topic: ${params.topic}
Duration: ${params.duration || '2 weeks'}
${params.goals ? `Learning Goals: ${params.goals}` : ''}

Remember to respond with valid JSON only.`;
        break;

      case 'grade-feedback':
        userPrompt = `Analyze this student submission and provide feedback:

Student Work:
${params.studentWork}

${params.rubric ? `Grading Rubric: ${params.rubric}` : ''}
${params.assignmentTitle ? `Assignment: ${params.assignmentTitle}` : ''}`;
        break;

      case 'performance-insights':
        userPrompt = `Analyze this student performance data and provide insights:
${JSON.stringify(params.data, null, 2)}`;
        break;

      default:
        userPrompt = params.prompt || 'Please provide guidance.';
    }

    console.log(`Teacher AI Tool: ${toolType}`);
    console.log(`User prompt: ${userPrompt.substring(0, 200)}...`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: toolType === 'quiz' || toolType === 'rubric' || toolType === 'course-outline' ? 0.3 : 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

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
        console.error('JSON parse error:', parseError);
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
    console.error('Teacher AI Tools error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
