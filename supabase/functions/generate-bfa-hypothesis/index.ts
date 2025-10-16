import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      family_id,
      student_id,
      behavior_definition,
      indirect_assessment,
      direct_observation,
    } = await req.json();

    // Prepare comprehensive prompt for AI
    const aiPrompt = `You are a Board Certified Behavior Analyst (BCBA) conducting a Functional Behavior Assessment. 
I will provide you with:
1. Indirect Assessment data (structured parent interview)
2. Direct Observation data (statistical analysis of incident logs)

Your task is to formulate a functional behavior hypothesis using the Four Functions Framework (Escape/Avoidance, Attention, Tangible, Sensory).

BEHAVIOR DEFINITION:
Name: ${behavior_definition.behaviorName}
Operational Definition: ${behavior_definition.operationalDefinition}

INDIRECT ASSESSMENT (Parent Interview):
Settings Most Common: ${JSON.stringify(indirect_assessment.settingLocations || [])}
Times Most Common: ${JSON.stringify(indirect_assessment.settingTimes || [])}
People Present: ${JSON.stringify(indirect_assessment.settingPeople || [])}

Antecedent Triggers Identified:
- Demands: ${JSON.stringify(indirect_assessment.antecedentDemands || [])}
- Social: ${JSON.stringify(indirect_assessment.antecedentSocial || [])}
- Environmental: ${JSON.stringify(indirect_assessment.antecedentEnvironmental || [])}
- Internal State: ${JSON.stringify(indirect_assessment.antecedentInternal || [])}

Consequence Outcomes:
- Attention: ${JSON.stringify(indirect_assessment.consequenceAttention || [])}
- Escape: ${JSON.stringify(indirect_assessment.consequenceEscape || [])}
- Tangible: ${JSON.stringify(indirect_assessment.consequenceTangible || [])}
- Sensory: ${JSON.stringify(indirect_assessment.consequenceSensory || [])}

Skills Deficit Assessment:
${JSON.stringify(indirect_assessment.skillsDeficit || {}, null, 2)}

DIRECT OBSERVATION DATA:
${direct_observation?.total_incidents_analyzed > 0 
  ? `Analyzed ${direct_observation.total_incidents_analyzed} incidents
Key Findings:
${direct_observation.findings.map((f: any) => `- ${f.finding} (${f.confidence} confidence)`).join('\n')}`
  : "Insufficient incident log data - rely primarily on indirect assessment"}

TASK:
1. Identify the PRIMARY function (Escape/Avoidance, Attention, Tangible, or Sensory)
2. If data strongly suggests it, identify a SECONDARY function
3. Formulate hypothesis in ABC format (Antecedent → Behavior → Consequence)
4. Provide confidence rating based on convergence of indirect + direct data
5. List 3-5 key supporting evidence points

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "primary_hypothesis": {
    "function": "escape_avoidance",
    "antecedent": "When presented with [specific trigger]",
    "behavior": "${behavior_definition.behaviorName}",
    "consequence": "[what the child gets or avoids]",
    "function_statement": "The primary function is to [achieve X or avoid Y].",
    "confidence": "high",
    "confidence_explanation": "Explain why confidence is high/medium/low based on data convergence"
  },
  "secondary_hypothesis": {
    "function": "attention",
    "antecedent": "...",
    "behavior": "...",
    "consequence": "...",
    "function_statement": "...",
    "confidence": "medium",
    "confidence_explanation": "..."
  },
  "supporting_evidence": [
    "Evidence point 1",
    "Evidence point 2",
    "Evidence point 3"
  ]
}

If there is NO clear secondary function, set "secondary_hypothesis" to null.
Function must be one of: escape_avoidance, attention, tangible, sensory, multiple
Confidence must be one of: high, medium, low`;

    const { data: aiData, error: aiError } = await supabase.functions.invoke("chat-with-data", {
      body: {
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        model: "google/gemini-2.5-flash",
      },
    });

    if (aiError) throw aiError;

    // Parse AI response
    let parsedResponse;
    try {
      const aiContent = aiData.response || aiData.content || aiData;
      const cleanedContent = typeof aiContent === 'string'
        ? aiContent.replace(/```json\n?|\n?```/g, '').trim()
        : JSON.stringify(aiContent);
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiData);
      throw new Error("AI returned invalid JSON");
    }

    // Validate response structure
    if (!parsedResponse.primary_hypothesis || !parsedResponse.supporting_evidence) {
      throw new Error("AI response missing required fields");
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-bfa-hypothesis:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
