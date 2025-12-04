import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { familyId, studentId, contentType, context = {} } = await req.json();

    if (!familyId || !studentId || !contentType) {
      return new Response(
        JSON.stringify({ error: "familyId, studentId, and contentType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student data
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    // Fetch recent logs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [educatorLogs, parentLogs, incidentLogs, goals, documents, insights] = await Promise.all([
      supabase.from("educator_logs").select("*").eq("student_id", studentId).gte("log_date", thirtyDaysAgo.toISOString().split('T')[0]).order("log_date", { ascending: false }).limit(20),
      supabase.from("parent_logs").select("*").eq("student_id", studentId).gte("log_date", thirtyDaysAgo.toISOString().split('T')[0]).order("log_date", { ascending: false }).limit(20),
      supabase.from("incident_logs").select("*").eq("student_id", studentId).gte("incident_date", thirtyDaysAgo.toISOString().split('T')[0]).order("incident_date", { ascending: false }).limit(10),
      supabase.from("goals").select("*").eq("student_id", studentId).eq("is_active", true),
      supabase.from("documents").select("*").eq("student_id", studentId).order("created_at", { ascending: false }).limit(5),
      supabase.from("ai_insights").select("*").eq("student_id", studentId).eq("is_active", true).order("generated_at", { ascending: false }).limit(10),
    ]);

    // Build context summary
    const contextSummary = {
      student: {
        name: student?.student_name,
        age: student?.date_of_birth ? Math.floor((Date.now() - new Date(student.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        grade: student?.current_grade,
        diagnosis: student?.diagnosis,
        neurodiversity_background: student?.neurodiversity_background,
      },
      recentEducatorObservations: educatorLogs.data?.slice(0, 5).map(log => ({
        date: log.log_date,
        strengths: log.strengths_observed,
        improvements: log.areas_for_improvement,
        engagement: log.engagement_level,
        performance: log.performance_level,
      })),
      recentParentObservations: parentLogs.data?.slice(0, 5).map(log => ({
        date: log.log_date,
        mood: log.mood,
        notes: log.notes,
        challenges: log.challenges,
      })),
      behaviorPatterns: incidentLogs.data?.map(incident => ({
        date: incident.incident_date,
        type: incident.incident_type,
        triggers: incident.potential_triggers,
        interventions: incident.intervention_used,
      })),
      currentGoals: goals.data?.map(goal => ({
        title: goal.goal_title,
        type: goal.goal_type,
        progress: `${goal.current_value}/${goal.target_value}`,
      })),
      recentDocuments: documents.data?.map(doc => ({
        name: doc.file_name,
        category: doc.category,
        date: doc.document_date,
      })),
      aiInsights: insights.data?.map(insight => ({
        type: insight.insight_type,
        title: insight.title,
        content: insight.content,
      })),
    };

    // Generate content based on type
    let systemPrompt = "";
    let userPrompt = "";

    if (contentType === "goals") {
      systemPrompt = `You are an expert special education IEP writer. Generate 2-3 measurable annual IEP goals based on student data. 
Each goal must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
Return ONLY valid JSON in this exact format:
{
  "goals": [
    {
      "domain": "Academic" | "Behavioral" | "Communication" | "Social-Emotional" | "Functional" | "Motor Skills",
      "goalStatement": "By [date], [student] will [specific measurable behavior] with [criteria] as measured by [assessment method]",
      "objectives": [
        {
          "description": "Short-term objective with specific criteria",
          "criteria": "80% accuracy over 3 trials",
          "evaluationMethod": "Teacher observation and data collection"
        }
      ],
      "evaluationCriteria": "How success will be measured",
      "evaluationSchedule": "quarterly" | "monthly" | "weekly",
      "responsiblePersons": ["Special Education Teacher", "General Education Teacher"]
    }
  ]
}`;

      userPrompt = `Student Profile:
Name: ${contextSummary.student.name}
Age: ${contextSummary.student.age} years
Grade: ${contextSummary.student.grade}
Diagnosis: ${contextSummary.student.diagnosis || 'Not specified'}

Recent Educator Observations:
${JSON.stringify(contextSummary.recentEducatorObservations, null, 2)}

Recent Parent Observations:
${JSON.stringify(contextSummary.recentParentObservations, null, 2)}

Behavior Patterns:
${JSON.stringify(contextSummary.behaviorPatterns, null, 2)}

Current Active Goals:
${JSON.stringify(contextSummary.currentGoals, null, 2)}

AI Insights:
${JSON.stringify(contextSummary.aiInsights, null, 2)}

Generate 2-3 appropriate IEP goals based on this data. Focus on areas where the student needs support based on observations and patterns.`;

    } else if (contentType === "present_levels") {
      const domain = context.domain || "academic";
      
      systemPrompt = `You are an expert special education IEP writer. Generate a comprehensive present levels of performance description for the ${domain} domain.
Return ONLY valid JSON in this exact format:
{
  "currentPerformance": "Detailed description of current performance level with specific examples and data",
  "strengths": "Specific strengths in this domain",
  "needs": "Areas requiring support and intervention",
  "supportingData": "Assessment results, observations, work samples that support this description",
  "impactOnGeneralEd": "How these performance levels impact participation in general education curriculum"
}`;

      userPrompt = `Generate ${domain} present levels for:
Student: ${contextSummary.student.name}, Age ${contextSummary.student.age}, Grade ${contextSummary.student.grade}

Recent Data:
${JSON.stringify({ educatorLogs: contextSummary.recentEducatorObservations, parentLogs: contextSummary.recentParentObservations, insights: contextSummary.aiInsights }, null, 2)}`;

    } else if (contentType === "services") {
      systemPrompt = `You are an expert special education IEP writer. Recommend appropriate special education services and supports.
Return ONLY valid JSON in this exact format:
{
  "services": [
    {
      "serviceType": "Type of service",
      "frequency": "Number per week/month",
      "duration": "Minutes per session",
      "location": "Where service will be provided",
      "provider": "Who will provide the service"
    }
  ],
  "accommodations": ["Accommodation 1", "Accommodation 2"],
  "modifications": ["Modification 1", "Modification 2"]
}`;

      userPrompt = `Recommend services for:
${JSON.stringify(contextSummary, null, 2)}`;
    }

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: contentType === "goals" ? [{
          type: "function",
          function: {
            name: "generate_goals",
            description: "Generate IEP goals",
            parameters: {
              type: "object",
              properties: {
                goals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      domain: { type: "string" },
                      goalStatement: { type: "string" },
                      objectives: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            description: { type: "string" },
                            criteria: { type: "string" },
                            evaluationMethod: { type: "string" }
                          },
                          required: ["description", "criteria", "evaluationMethod"],
                          additionalProperties: false
                        }
                      },
                      evaluationCriteria: { type: "string" },
                      evaluationSchedule: { type: "string" },
                      responsiblePersons: { type: "array", items: { type: "string" } }
                    },
                    required: ["domain", "goalStatement", "objectives", "evaluationCriteria", "evaluationSchedule", "responsiblePersons"],
                    additionalProperties: false
                  }
                }
              },
              required: ["goals"],
              additionalProperties: false
            }
          }
        }] : undefined,
        tool_choice: contentType === "goals" ? { type: "function", function: { name: "generate_goals" } } : undefined,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    let result;

    if (contentType === "goals") {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        result = JSON.parse(toolCall.function.arguments);
      }
    } else {
      const aiContent = aiData.choices?.[0]?.message?.content;
      if (aiContent) {
        const cleanContent = aiContent.trim().replace(/^```(?:json)?\s*/g, '').replace(/\s*```$/g, '');
        result = JSON.parse(cleanContent);
      }
    }

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-iep-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
