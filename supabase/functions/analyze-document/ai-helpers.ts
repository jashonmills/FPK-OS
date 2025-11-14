// ============================================================================
// FINAL, CORRECTED VERSION - GOOGLE GEMINI IMPLEMENTATION
// ============================================================================
import { GoogleAuth } from "google-auth-library";

export async function masterAnalyzeDocument(
  extractedContent: string,
  documentType?: string,
  specializedPrompt?: string,
  progressCallback?: (stage: string) => Promise<void>,
): Promise<{ result: any; retryCount: number }> {
  // These environment variables ALREADY EXIST in your Supabase project.
  const projectId = Deno.env.get("GCP_PROJECT_ID");
  const serviceAccountKeyStr = Deno.env.get("GCP_SERVICE_ACCOUNT_KEY");

  if (!projectId || !serviceAccountKeyStr) {
    throw new Error(
      "Critical configuration error: GCP_PROJECT_ID or GCP_SERVICE_ACCOUNT_KEY is missing from environment variables.",
    );
  }

  const serviceAccountKey = JSON.parse(serviceAccountKeyStr);

  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccountKey.client_email,
      private_key: serviceAccountKey.private_key,
    },
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  const authToken = await auth.getAccessToken();

  const SYSTEM_PROMPT =
    specializedPrompt ||
    `You are an elite AI data analyst for FPX MyCNS, a special education collaborative care platform. Your mission is to perform a complete analysis of a single clinical or educational document in one pass.

You MUST follow these three steps in order and return a single, valid JSON object.

**STEP 1: IDENTIFY THE DOCUMENT TYPE**
First, analyze the entire document text and classify it into ONE of the following categories. This is your highest priority.
- "Individualized Education Program (IEP)"
- "Behavior Intervention Plan (BIP)"
- "Functional Behavior Assessment (FBA)"
- "Psychoeducational Evaluation"
- "Progress Report"
- "Sleep Log"
- "Incident Report"
- "Parent Log"
- "Educator Log"
- "Communication Log"
- "OT/Sensory Profile"
- "Unknown" (Use only as a last resort if the document is truly unidentifiable).

**STEP 2: EXTRACT ALL STRUCTURED DATA**
Based on the type you identified in Step 1, extract all relevant data.

**CRITICAL EXTRACTION RULES:**
- **NO HALLUCINATION:** If a metric, value, or date is not explicitly stated, DO NOT invent it.
- **QUANTIFY EVERYTHING:** Convert written numbers ("five instances") to numeric values (5).
- **DATES ARE MANDATORY:** Extract the measurement date for every metric. If not specified, use the document's primary date. Format as YYYY-MM-DD.
- **EXTRACT EVERY TABLE ROW:** If you see a table with multiple rows of data (daily logs, nightly records), extract EACH ROW as a separate metric. Do NOT summarize.

**Data to Extract (populate all that apply):**
- "metrics": Array of all quantifiable data points (frequencies, scores, percentages, durations)
- "insights": Array of qualitative observations, patterns, or recommendations
- "progress_tracking": Array for goal-related data with baseline, current, and/or target values

**STEP 3: RECOMMEND ANALYTICS CHARTS**
Based on the metrics you extracted in Step 2, identify which of the following analytics charts can be populated. Only recommend charts for which you have found direct, supporting data.
- "iep_goal_service_tracker"
- "academic_fluency_trends"
- "behavior_function_analysis"
- "sensory_profile_heatmap"
- "intervention_effectiveness_summary"
- "task_initiation_and_latency"
- "social_interaction_funnel"

**FINAL OUTPUT: JSON STRUCTURE**
Your final response MUST be a single JSON object matching this exact schema. Do not include any text outside of the JSON block.

{
  "identified_document_type": "Individualized Education Program (IEP)",
  "confidence_score": 0.95,
  "metrics": [
    {
      "metric_name": "Reading Fluency",
      "metric_type": "academic_fluency",
      "metric_value": 45,
      "metric_unit": "words_per_minute",
      "measurement_date": "2025-09-15"
    }
  ],
  "insights": [
    {
      "title": "Positive Peer Interactions",
      "content": "Student was observed initiating play with two peers during recess.",
      "priority": "medium",
      "insight_type": "observation"
    }
  ],
  "progress_tracking": [],
  "recommended_charts": ["academic_fluency_trends"]
}`;

  const promptInfo = specializedPrompt ? `using specialized ${documentType} extraction prompt` : "using master prompt";
  console.log(`🔬 Starting Master Analysis (Google Gemini) ${promptInfo}...`);

  const maxRetries = 2;
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`📊 Master Analysis attempt ${attempt}/${maxRetries} (Google Gemini)...`);

    if (attempt > 1) {
      const delay = 5000 * attempt;
      console.log(`⏸️ Waiting ${delay / 1000}s before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      if (progressCallback) await progressCallback("calling_ai_model");
      console.log("📡 Calling Google Gemini...");

      const apiEndpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-pro-preview-0409:generateContent`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nAnalyze this document:\n\n${extractedContent}` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (progressCallback) await progressCallback("processing_response");
      console.log("🔄 Processing Gemini Response...");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Google Gemini API error:", { status: response.status, error: errorText });
        throw new Error(`Google Gemini API failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      if (!content) {
        throw new Error("Master Analysis (Gemini) returned no content");
      }

      const analysisResult = JSON.parse(content);

      if (progressCallback) await progressCallback("distributing_data");
      console.log("✅ Master Analysis complete (Google Gemini)");

      return { result: analysisResult, retryCount: attempt - 1 };
    } catch (error: any) {
      lastError = error;
      console.error(`Master Analysis attempt ${attempt} failed:`, error);
      if (attempt >= maxRetries) {
        console.error("❌ Master Analysis failed after all retries");
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Master Analysis failed");
}
