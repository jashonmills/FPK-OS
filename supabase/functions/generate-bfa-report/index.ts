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

    const { family_id, student_id, wizard_data } = await req.json();

    // Get student details
    const { data: student } = await supabase
      .from("students")
      .select("student_name")
      .eq("id", student_id)
      .single();

    const studentName = student?.student_name || "Student";
    const reportDate = new Date().toLocaleDateString();

    // Generate comprehensive report content using AI
    const reportPrompt = `You are generating a professional Functional Behavior Assessment (FBA) report.

Create a comprehensive, clinical-grade report in HTML format that includes:

1. COVER PAGE
   - Title: "FPX-BFA™ Functional Behavior Assessment"
   - Student: ${studentName}
   - Date: ${reportDate}

2. SECTION 1: BEHAVIOR DEFINITION
   - Behavior Name: ${wizard_data.behaviorName}
   - Operational Definition: ${wizard_data.operationalDefinition}
   - Non-Examples: ${wizard_data.nonExamples || "Not specified"}
   - Baseline Frequency: ${wizard_data.frequency || "Not specified"} per day
   - Typical Duration: ${wizard_data.duration || "Not specified"} minutes
   - Intensity: ${wizard_data.intensity || "Not specified"}

3. SECTION 2: INDIRECT ASSESSMENT SUMMARY
   - Settings & Environmental Analysis
   - Antecedent Triggers (organized by category)
   - Consequence Outcomes
   - Communication & Coping Skills Assessment

4. SECTION 3: DIRECT OBSERVATION ANALYSIS
   ${wizard_data.directObservation?.total_incidents_analyzed > 0
     ? `- Total Incidents Analyzed: ${wizard_data.directObservation.total_incidents_analyzed}
   - Date Range: ${wizard_data.directObservation.date_range}
   - Key Findings from each category`
     : "- Insufficient data for statistical analysis"}

5. SECTION 4: FUNCTIONAL HYPOTHESIS
   - Primary Hypothesis (ABC format)
   - Function: ${wizard_data.hypothesis?.primary_hypothesis?.function || ""}
   - Confidence Level
   - Supporting Evidence

6. SECTION 5: RECOMMENDATIONS
   - Generate 3-5 evidence-based intervention recommendations based on the identified function
   - Include both proactive strategies and reactive strategies
   - Note that a comprehensive BIP should be developed

Return ONLY valid HTML (no markdown, no code blocks) with professional styling for printing.
Use semantic HTML tags and inline CSS for formatting.
Make it look clinical and professional.`;

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
            content: reportPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${await aiResponse.text()}`);
    }

    const aiData = await aiResponse.json();
    const htmlContent = aiData.choices?.[0]?.message?.content || "";

    // For now, we'll store the HTML content as text
    // In a production system, you'd convert this to PDF using a library
    const reportContent = htmlContent.replace(/```html\n?|\n?```/g, '').trim();

    // Create a text file with the report content
    const fileName = `BFA_Report_${studentName.replace(/\s+/g, '_')}_${Date.now()}.html`;
    const blob = new Blob([reportContent], { type: "text/html" });

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("family-documents")
      .upload(`${family_id}/${fileName}`, blob, {
        contentType: "text/html",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("family-documents")
      .getPublicUrl(`${family_id}/${fileName}`);

    // Create document record
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert({
        family_id,
        student_id,
        file_name: fileName,
        file_path: uploadData.path,
        file_type: "text/html",
        category: "bfa_report",
        uploaded_by: family_id,
        metadata: {
          report_type: "FPX-BFA",
          behavior_name: wizard_data.behaviorName,
          generated_date: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (docError) throw docError;

    return new Response(
      JSON.stringify({
        pdf_url: urlData.publicUrl,
        document_id: docData.id,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-bfa-report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
