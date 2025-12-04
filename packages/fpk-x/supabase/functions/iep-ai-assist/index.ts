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
    const { action, currentText, context = {} } = await req.json();

    if (!action || !['rewrite', 'expand', 'suggest'].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be 'rewrite', 'expand', or 'suggest'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    
    let systemPrompt = "";
    let userPrompt = "";

    if (action === "rewrite") {
      systemPrompt = `You are an expert IEP writer. Rewrite the provided text to be more clear, professional, and appropriate for an IEP document. 
Maintain all key information but improve clarity, use person-first language, and ensure measurable, objective language where appropriate.
Return ONLY the rewritten text, no explanations or preambles.`;
      
      userPrompt = currentText || "Please provide professional IEP language for this section.";

    } else if (action === "expand") {
      systemPrompt = `You are an expert IEP writer. Expand the provided text with more detail, specific examples, and supporting information appropriate for an IEP document.
Add relevant details that would help the IEP team understand the full picture while maintaining professional tone and person-first language.
Return ONLY the expanded text, no explanations or preambles.`;
      
      userPrompt = currentText || "Please provide detailed IEP language for this section.";

    } else if (action === "suggest") {
      // For suggest, we need student data
      const { familyId, studentId, fieldContext } = context;
      
      if (familyId && studentId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch relevant student data
        const { data: student } = await supabase
          .from("students")
          .select("*")
          .eq("id", studentId)
          .single();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [educatorLogs, insights] = await Promise.all([
          supabase.from("educator_logs").select("*").eq("student_id", studentId).gte("log_date", thirtyDaysAgo.toISOString().split('T')[0]).order("log_date", { ascending: false }).limit(5),
          supabase.from("ai_insights").select("*").eq("student_id", studentId).eq("is_active", true).order("generated_at", { ascending: false }).limit(5),
        ]);

        systemPrompt = `You are an expert IEP writer. Based on the student data provided, suggest appropriate content for the "${fieldContext || 'IEP'}" field.
Use person-first language, be specific and measurable, and draw from the actual observations and data.
Return ONLY the suggested text, no explanations or preambles.`;

        userPrompt = `Current text (if any): ${currentText || "None"}

Student Profile:
- Name: ${student?.student_name}
- Grade: ${student?.current_grade}
- Diagnosis: ${student?.diagnosis || 'Not specified'}

Recent Educator Observations:
${JSON.stringify(educatorLogs.data?.map(log => ({
  date: log.log_date,
  strengths: log.strengths_observed,
  improvements: log.areas_for_improvement,
  engagement: log.engagement_level,
})), null, 2)}

AI Insights:
${JSON.stringify(insights.data?.map(i => ({ type: i.insight_type, content: i.content })), null, 2)}

Context: ${fieldContext || 'General IEP content'}

Suggest appropriate content for this IEP field based on the data.`;
      } else {
        systemPrompt = `You are an expert IEP writer. Suggest professional, appropriate content for an IEP document based on best practices.
Use person-first language and ensure content is specific and measurable.
Return ONLY the suggested text, no explanations or preambles.`;
        
        userPrompt = `Field context: ${fieldContext || 'IEP content'}
Current text: ${currentText || "None"}

Suggest appropriate professional content for this IEP field.`;
      }
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
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI assistance failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const enhancedText = aiData.choices?.[0]?.message?.content;

    if (!enhancedText) {
      return new Response(
        JSON.stringify({ error: "AI returned no content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ enhancedText: enhancedText.trim() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in iep-ai-assist:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
