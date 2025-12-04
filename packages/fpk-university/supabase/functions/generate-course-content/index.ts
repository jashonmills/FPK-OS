import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StructureRequest {
  mode: 'structure';
  topic: string;
  objectives: string[];
  targetAudience: string;
  lessonCount: number;
  framework: 'sequential' | 'interactive_micro_learning';
}

interface LessonContentRequest {
  mode: 'lesson-content';
  lessonTitle: string;
  lessonDescription: string;
  unitTitle: string;
  courseTitle: string;
  courseContext: string;
  framework: 'sequential' | 'interactive_micro_learning';
}

interface FullCourseRequest {
  mode: 'full-course';
  topic: string;
  objectives: string[];
  targetAudience: string;
  lessonCount: number;
  framework: 'sequential' | 'interactive_micro_learning';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json();
    const { mode } = body;

    console.log(`[GENERATE-COURSE-CONTENT] Mode: ${mode}`);

    if (mode === 'structure') {
      return await generateCourseStructure(body as StructureRequest, LOVABLE_API_KEY);
    }

    if (mode === 'lesson-content') {
      return await generateLessonContent(body as LessonContentRequest, LOVABLE_API_KEY);
    }

    if (mode === 'full-course') {
      return await generateFullCourse(body as FullCourseRequest, LOVABLE_API_KEY);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid mode. Use: structure, lesson-content, or full-course' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[GENERATE-COURSE-CONTENT] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateCourseStructure(params: StructureRequest, apiKey: string) {
  const { topic, objectives, targetAudience, lessonCount, framework } = params;

  const systemPrompt = `You are an expert instructional designer creating educational course structures. 
Create well-organized course structures with clear learning progressions.
Always respond with valid JSON matching the required schema.`;

  const userPrompt = `Create a course structure for the following:

Topic: ${topic}
Learning Objectives: ${objectives.join(', ')}
Target Audience: ${targetAudience}
Number of Lessons: ${lessonCount}
Framework: ${framework}

Generate a course structure with units and lessons. Each unit should have 2-4 lessons that logically progress.
Each lesson needs a clear title and brief description (1-2 sentences).`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [{
        type: "function",
        function: {
          name: "create_course_structure",
          description: "Create a structured course outline with units and lessons",
          parameters: {
            type: "object",
            properties: {
              courseTitle: { type: "string", description: "Full course title" },
              courseDescription: { type: "string", description: "2-3 sentence course description" },
              units: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    unitTitle: { type: "string" },
                    unitDescription: { type: "string" },
                    lessons: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          lessonTitle: { type: "string" },
                          lessonDescription: { type: "string" }
                        },
                        required: ["lessonTitle", "lessonDescription"]
                      }
                    }
                  },
                  required: ["unitTitle", "lessons"]
                }
              }
            },
            required: ["courseTitle", "courseDescription", "units"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "create_course_structure" } }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[GENERATE-COURSE-CONTENT] API error:', errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (!toolCall) {
    throw new Error('No tool call response from AI');
  }

  const structure = JSON.parse(toolCall.function.arguments);
  console.log('[GENERATE-COURSE-CONTENT] Structure generated:', structure.courseTitle);

  return new Response(
    JSON.stringify({ success: true, structure }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateLessonContent(params: LessonContentRequest, apiKey: string) {
  const { lessonTitle, lessonDescription, unitTitle, courseTitle, courseContext, framework } = params;

  const systemPrompt = `You are an expert educational content writer creating engaging lesson content.
Write comprehensive lessons with 500-1000 words of educational content.
Use clear explanations, practical examples, and engaging language appropriate for the target audience.
Always respond with valid JSON matching the required schema.`;

  const userPrompt = `Create full lesson content for:

Course: ${courseTitle}
Unit: ${unitTitle}
Lesson Title: ${lessonTitle}
Lesson Description: ${lessonDescription}
Context: ${courseContext}

Create comprehensive lesson content with:
1. Introduction/Objectives (what students will learn)
2. Main Concept explanation (detailed teaching content, 300-500 words)
3. Practical Example (real-world application)
4. Practice/Activity suggestion
5. Summary/Key Takeaways

The content should be educational, engaging, and appropriate for the target audience.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [{
        type: "function",
        function: {
          name: "create_lesson_content",
          description: "Create full educational content for a lesson",
          parameters: {
            type: "object",
            properties: {
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { 
                      type: "string", 
                      enum: ["heading", "paragraph", "list", "callout", "quote"]
                    },
                    content: { type: "string" },
                    level: { type: "number", description: "For headings: 1-6" },
                    style: { 
                      type: "string", 
                      enum: ["info", "warning", "success", "teaching"],
                      description: "For callouts"
                    },
                    items: { 
                      type: "array", 
                      items: { type: "string" },
                      description: "For lists"
                    }
                  },
                  required: ["type", "content"]
                }
              },
              estimatedMinutes: { type: "number", description: "Estimated reading/learning time" },
              keyTakeaways: { 
                type: "array", 
                items: { type: "string" },
                description: "3-5 key points students should remember"
              }
            },
            required: ["sections", "estimatedMinutes", "keyTakeaways"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "create_lesson_content" } }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[GENERATE-COURSE-CONTENT] API error:', errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (!toolCall) {
    throw new Error('No tool call response from AI');
  }

  const content = JSON.parse(toolCall.function.arguments);
  console.log('[GENERATE-COURSE-CONTENT] Lesson content generated for:', lessonTitle);

  return new Response(
    JSON.stringify({ success: true, content }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateFullCourse(params: FullCourseRequest, apiKey: string) {
  const { topic, objectives, targetAudience, lessonCount, framework } = params;

  // Step 1: Generate structure
  console.log('[GENERATE-COURSE-CONTENT] Step 1: Generating structure...');
  const structureResponse = await generateCourseStructure(
    { mode: 'structure', topic, objectives, targetAudience, lessonCount, framework },
    apiKey
  );
  
  const structureData = await structureResponse.json();
  if (!structureData.success) {
    throw new Error('Failed to generate course structure');
  }

  const structure = structureData.structure;
  const courseContext = `Target audience: ${targetAudience}. Objectives: ${objectives.join(', ')}`;

  // Step 2: Generate content for each lesson
  console.log('[GENERATE-COURSE-CONTENT] Step 2: Generating lesson content...');
  const lessonsWithContent = [];
  let lessonId = 1;

  for (const unit of structure.units) {
    for (const lesson of unit.lessons) {
      console.log(`[GENERATE-COURSE-CONTENT] Generating content for: ${lesson.lessonTitle}`);
      
      const contentResponse = await generateLessonContent(
        {
          mode: 'lesson-content',
          lessonTitle: lesson.lessonTitle,
          lessonDescription: lesson.lessonDescription,
          unitTitle: unit.unitTitle,
          courseTitle: structure.courseTitle,
          courseContext,
          framework
        },
        apiKey
      );
      
      const contentData = await contentResponse.json();
      
      if (contentData.success) {
        lessonsWithContent.push({
          id: lessonId++,
          title: lesson.lessonTitle,
          description: lesson.lessonDescription,
          unit: unit.unitTitle,
          unitColor: getUnitColor(structure.units.indexOf(unit)),
          contentType: 'text' as const,
          sections: contentData.content.sections,
          estimatedMinutes: contentData.content.estimatedMinutes,
          keyTakeaways: contentData.content.keyTakeaways
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Build final manifest
  const manifest = {
    courseId: `ai-generated-${Date.now()}`,
    courseSlug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    contentVersion: 'v2' as const,
    title: structure.courseTitle,
    description: structure.courseDescription,
    lessons: lessonsWithContent
  };

  console.log('[GENERATE-COURSE-CONTENT] Full course generated with', lessonsWithContent.length, 'lessons');

  return new Response(
    JSON.stringify({ success: true, manifest, structure }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function getUnitColor(index: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
  ];
  return colors[index % colors.length];
}
