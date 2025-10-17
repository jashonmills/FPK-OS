// ============================================================================
// MASTER ANALYSIS PROMPT SYSTEM
// Single AI call performs: Type ID + Data Extraction + Chart Recommendations
// ============================================================================

export async function masterAnalyzeDocument(
  extractedContent: string,
  anthropicApiKey: string,
  documentType?: string,
  specializedPrompt?: string,
  progressCallback?: (stage: string) => Promise<void>
): Promise<{ result: any; retryCount: number }> {
  
  // Use specialized prompt if provided and document type is known
  const SYSTEM_PROMPT = specializedPrompt || `You are an elite AI data analyst for FPX MyCNS, a special education collaborative care platform. Your mission is to perform a complete analysis of a single clinical or educational document in one pass.

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
- **PRIORITIZE TIME-BASED DATA:** Extract exact start times, end times, and calculate durations for any behavioral incidents or observations.
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
      "measurement_date": "2025-09-15",
      "start_time": null,
      "end_time": null,
      "duration_minutes": null,
      "context": "Fall assessment",
      "intervention_used": null,
      "target_value": 60
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
  "progress_tracking": [
    {
      "metric_type": "social_skill",
      "metric_name": "Greeting Peers",
      "baseline_value": 1,
      "current_value": 4,
      "target_value": 5,
      "trend": "improving",
      "notes": "Significant improvement noted"
    }
  ],
  "recommended_charts": ["iep_goal_service_tracker", "academic_fluency_trends"]
}`;

  const promptInfo = specializedPrompt 
    ? `using specialized ${documentType} extraction prompt` 
    : 'using master prompt';

  console.log(`🔬 Starting Master Analysis ${promptInfo}...`);
  const startTime = Date.now();
  
  const maxRetries = 2;
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`📊 Master Analysis attempt ${attempt}/${maxRetries}...`);

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 120000); // 120s timeout for complex documents

      if (progressCallback) {
        await progressCallback('calling_ai_model');
      }
      console.log('📡 Calling AI Model (Claude Sonnet 4.5)...');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: `Analyze this document:\n\n${extractedContent}` }
          ],
        }),
      });

      clearTimeout(timeoutId);
      const elapsed = Date.now() - startTime;
      console.log(`⏱️ Master Analysis API call completed in ${elapsed}ms`);
      
      if (progressCallback) {
        await progressCallback('processing_response');
      }
      console.log('🔄 Processing AI Response...');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Master Analysis API error:', {
          status: response.status,
          error: errorText,
        });
        
        if (response.status === 402) {
          throw new Error('Payment required. Please add credits to your Lovable AI workspace.');
        }

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }

        throw new Error(`Master Analysis API failed with status ${response.status}`);
      }

      console.log('📦 Parsing JSON response...');
      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (!content) {
        console.error('❌ No content in AI response');
        throw new Error('Master Analysis returned no content');
      }

      console.log('📏 Response length:', content.length, 'characters');
      
      // Parse JSON response
      let cleanContent = content.trim()
        .replace(/^```(?:json)?\s*/g, '')
        .replace(/\s*```$/g, '');

      if (!cleanContent.startsWith('{')) {
        console.error('❌ Response is not valid JSON, starts with:', cleanContent.substring(0, 100));
        throw new Error('Master Analysis did not return valid JSON');
      }

      console.log('🔍 Parsing JSON structure...');
      const analysisResult = JSON.parse(cleanContent);
      console.log('✅ JSON parsed successfully');
      
      if (progressCallback) {
        await progressCallback('distributing_data');
      }
      console.log('💾 Parsing and validating extracted data...');

      // Validate Master JSON structure
      if (!analysisResult.identified_document_type || 
          !analysisResult.metrics || 
          !analysisResult.insights || 
          !analysisResult.progress_tracking ||
          !analysisResult.recommended_charts) {
        throw new Error('Master Analysis JSON missing required fields');
      }

      const totalItems = (analysisResult.metrics?.length || 0) + 
                        (analysisResult.insights?.length || 0) + 
                        (analysisResult.progress_tracking?.length || 0);

      console.log(`✅ Master Analysis complete (attempt ${attempt}): ${analysisResult.identified_document_type} with ${totalItems} total data points`);
      console.log(`📊 Breakdown: ${analysisResult.metrics?.length || 0} metrics, ${analysisResult.insights?.length || 0} insights, ${analysisResult.progress_tracking?.length || 0} progress, ${analysisResult.recommended_charts?.length || 0} charts`);

      return { result: analysisResult, retryCount: attempt - 1 };

    } catch (error: any) {
      lastError = error;
      console.error(`Master Analysis attempt ${attempt} failed:`, error);

      if (error.name === 'AbortError') {
        console.error('⏱️ Master Analysis timed out after 120s');
        lastError = new Error('Master Analysis timed out after 120 seconds. Document may be too large or complex.');
      }

      if (attempt >= maxRetries) {
        console.error('❌ Master Analysis failed after all retries');
        throw lastError;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Master Analysis failed');
}
