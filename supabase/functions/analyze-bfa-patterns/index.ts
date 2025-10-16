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

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY") ?? "";

    const { family_id, student_id, behavior_name, operational_definition } = await req.json();

    // Fetch all incident logs for this student
    const { data: incidents, error: fetchError } = await supabase
      .from("incident_logs")
      .select("*")
      .eq("family_id", family_id)
      .eq("student_id", student_id)
      .order("incident_date", { ascending: false })
      .limit(100);

    if (fetchError) throw fetchError;

    if (!incidents || incidents.length === 0) {
      return new Response(
        JSON.stringify({
          findings: [],
          total_incidents_analyzed: 0,
          date_range: "N/A",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate statistics
    const totalIncidents = incidents.length;
    const dateRange = `${new Date(incidents[incidents.length - 1].incident_date).toLocaleDateString()} to ${new Date(incidents[0].incident_date).toLocaleDateString()}`;

    // Temporal analysis
    const timeDistribution: Record<string, number> = {};
    const dayDistribution: Record<string, number> = {};
    incidents.forEach((inc) => {
      const hour = parseInt(inc.incident_time?.split(":")[0] || "0");
      const timeSlot =
        hour >= 6 && hour < 9
          ? "Morning (6-9am)"
          : hour >= 9 && hour < 15
          ? "Mid-day (9am-3pm)"
          : hour >= 15 && hour < 18
          ? "Afternoon (3-6pm)"
          : hour >= 18 && hour < 21
          ? "Evening (6-9pm)"
          : "Night (9pm+)";
      timeDistribution[timeSlot] = (timeDistribution[timeSlot] || 0) + 1;

      const date = new Date(inc.incident_date);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      dayDistribution[dayOfWeek] = (dayDistribution[dayOfWeek] || 0) + 1;
    });

    // Antecedent analysis
    const antecedentCounts: Record<string, number> = {};
    incidents.forEach((inc) => {
      if (inc.antecedent) {
        antecedentCounts[inc.antecedent] = (antecedentCounts[inc.antecedent] || 0) + 1;
      }
    });

    // Consequence analysis
    const consequenceCounts: Record<string, number> = {};
    incidents.forEach((inc) => {
      if (inc.consequence) {
        consequenceCounts[inc.consequence] = (consequenceCounts[inc.consequence] || 0) + 1;
      }
    });

    // Location analysis
    const locationCounts: Record<string, number> = {};
    incidents.forEach((inc) => {
      if (inc.location) {
        locationCounts[inc.location] = (locationCounts[inc.location] || 0) + 1;
      }
    });

    // Prepare statistics for AI
    const statistics = {
      total_incidents: totalIncidents,
      date_range: dateRange,
      time_distribution: timeDistribution,
      day_distribution: dayDistribution,
      top_antecedents: Object.entries(antecedentCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      top_consequences: Object.entries(consequenceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      top_locations: Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3),
      average_duration: incidents
        .filter((i) => i.duration_minutes)
        .reduce((sum, i) => sum + (i.duration_minutes || 0), 0) /
        incidents.filter((i) => i.duration_minutes).length || 0,
    };

    // Call AI to synthesize findings
    const aiPrompt = `You are a Board Certified Behavior Analyst (BCBA) conducting a Functional Behavior Assessment. 
I will provide you with statistical analysis of incident log data. Your task is to:
1. Interpret the statistics
2. Identify the 3-5 most significant patterns
3. Format each as a clear, professional finding with confidence level

Behavior: ${behavior_name}
Operational Definition: ${operational_definition}

Data Statistics:
${JSON.stringify(statistics, null, 2)}

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "findings": [
    {
      "category": "temporal",
      "finding": "Clear statement of the pattern",
      "confidence": "high",
      "supporting_data": "X of Y incidents occurred...",
      "clinical_note": "Brief interpretation of significance"
    }
  ]
}

Categories must be one of: temporal, antecedent, consequence, environmental
Confidence must be one of: high, medium, low`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: aiPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI API error:", await aiResponse.text());
      // Fallback to basic findings if AI fails
      const basicFindings = [];
      
      const mostCommonTime = Object.entries(timeDistribution).sort(([, a], [, b]) => b - a)[0];
      if (mostCommonTime) {
        basicFindings.push({
          category: "temporal",
          finding: `This behavior occurs most frequently during ${mostCommonTime[0]}.`,
          confidence: "high",
          supporting_data: `${mostCommonTime[1]} of ${totalIncidents} incidents (${Math.round((mostCommonTime[1] / totalIncidents) * 100)}%)`,
          clinical_note: "Temporal patterns often indicate environmental or routine factors.",
        });
      }

      if (statistics.top_antecedents[0]) {
        basicFindings.push({
          category: "antecedent",
          finding: `The most common antecedent is: ${statistics.top_antecedents[0][0]}`,
          confidence: "high",
          supporting_data: `Occurred in ${statistics.top_antecedents[0][1]} of ${totalIncidents} incidents (${Math.round((statistics.top_antecedents[0][1] / totalIncidents) * 100)}%)`,
        });
      }

      return new Response(
        JSON.stringify({
          findings: basicFindings,
          total_incidents_analyzed: totalIncidents,
          date_range: dateRange,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response
    let parsedResponse;
    try {
      const cleanedContent = aiContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("AI returned invalid JSON");
    }

    return new Response(
      JSON.stringify({
        findings: parsedResponse.findings || [],
        total_incidents_analyzed: totalIncidents,
        date_range: dateRange,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-bfa-patterns:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
