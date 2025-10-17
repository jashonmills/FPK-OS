// AI-powered document classification helper
// Pattern matching for structured log documents
function detectLogTypePattern(content: string): { doc_type: string; confidence: number } | null {
  const patterns = [
    { regex: /sleep\s+(log|tracking|record|diary)/i, type: "Sleep Log", confidence: 0.85 },
    { regex: /incident\s+(report|log|record)/i, type: "Incident Report Log", confidence: 0.85 },
    { regex: /parent\s+(log|notes|home\s+log|daily\s+log)/i, type: "Parent Home Log", confidence: 0.85 },
    { regex: /educator\s+(log|session\s+log|classroom\s+log)/i, type: "Educator Session Log", confidence: 0.85 },
    { regex: /(bedtime|wake\s+time|sleep\s+hours|sleep\s+quality)/i, type: "Sleep Log", confidence: 0.75 },
    { regex: /(antecedent|behavior|consequence|ABC\s+data)/i, type: "Incident Report Log", confidence: 0.75 },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      console.log(`✅ Pattern match detected: ${pattern.type} (confidence: ${pattern.confidence})`);
      return { doc_type: pattern.type, confidence: pattern.confidence };
    }
  }

  return null;
}

export async function aiIdentifyDocumentType(
  extractedContent: string, 
  lovableApiKey: string
): Promise<{ doc_type: string; confidence: number } | null> {
  try {
    console.log('🔍 Starting document type identification...');
    const startTime = Date.now();
    
    // PHASE 1: Try pattern matching first (fast, no AI call needed)
    const patternMatch = detectLogTypePattern(extractedContent);
    if (patternMatch && patternMatch.confidence >= 0.8) {
      const elapsed = Date.now() - startTime;
      console.log(`✅ Pattern-based classification completed in ${elapsed}ms: ${patternMatch.doc_type}`);
      return patternMatch;
    }
    
    // PHASE 2: Use AI with enhanced context window
    // Create abort controller for 60s timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 60000);
    
    // Sample from beginning AND middle (to catch table data that comes after headers)
    const beginningChunk = extractedContent.slice(0, 3000);
    const middleChunk = extractedContent.slice(3000, 6000);
    const contextSample = `=== BEGINNING OF DOCUMENT ===\n${beginningChunk}\n\n=== MIDDLE SECTION ===\n${middleChunk}`;
    
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          model: 'google/gemini-2.5-pro',
          messages: [
            {
              role: 'system',
              content: `You are a document classifier for special education documents.

Classify the document into ONE of these types:
- "Individualized Education Program (IEP)" - Contains goals, accommodations, present levels, services
- "Behavior Intervention Plan (BIP)" - Contains target behaviors, function, replacement behaviors, strategies
- "IEP Amendment" - Modifications to existing IEP
- "Progress Report" - Updates on student progress toward goals
- "Psychoeducational Evaluation" - Cognitive, academic, behavioral assessments with scores
- "Neuropsychological Evaluation" - Detailed cognitive/neurological testing
- "Evaluation Team Report (ETR)" - Team evaluation summary
- "Occupational Therapy Evaluation" - Fine/gross motor, sensory assessments
- "Sensory Profile" - Sensory processing patterns
- "Sleep Log" - Sleep times, wake times, quality ratings
- "Incident Report Log" - Behavioral incidents with ABC data
- "Parent Home Log" - Parent observations and home activities
- "Educator Session Log" - Classroom activities and performance
- "Communication Log (Parent-Teacher)" - Communication between home and school
- "Teacher Progress Notes" - Teacher observations on progress
- "Unknown" - ONLY if genuinely none of the above

**CLASSIFICATION RULES:**
1. Look for KEY INDICATORS first (e.g., "Present Levels", "Annual Goals", "Accommodations" = IEP)
2. Check for STRUCTURED DATA (dates, times, numeric values, tables)
3. Even if formatting is poor, classify based on CONTENT
4. Default to a specific type if 60%+ confident - do NOT overuse "Unknown"
5. Progress reports about IEP goals = "Progress Report", not IEP

Return ONLY a JSON object in this exact format:
{ "doc_type": "type_name", "confidence": 0.85 }

Confidence scoring:
- 0.9-1.0: Document explicitly states type OR has unmistakable key sections
- 0.7-0.89: Strong indicators (multiple section headers match expected structure)
- 0.6-0.69: Moderate confidence (some indicators match, content fits)
- Below 0.6: Classify as "Unknown"`
            },
            {
              role: 'user',
              content: `Classify this document:\n\n${contextSample}`
            }
          ],
        }),
      });
      
      clearTimeout(timeoutId);
      const elapsed = Date.now() - startTime;
      console.log(`✅ Document classification completed in ${elapsed}ms`);

      if (!response.ok) {
        console.error('AI classification failed:', response.status);
        return null;
      }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Clean up potential markdown code blocks
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const result = JSON.parse(cleanedContent);
    
    // Lower threshold - we want to classify more documents as specific types
    if (result.confidence >= 0.55 && result.doc_type !== 'Unknown') {
      console.log(`✅ Document classified as "${result.doc_type}" with ${result.confidence} confidence`);
      return result;
    }
    
    console.log(`⚠️ Confidence too low (${result.confidence}) or Unknown type, will use generic analysis`);
    return null;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ Document classification timed out after 60s');
        return null;
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error in AI document classification:', error);
    if (error.name === 'AbortError') {
      console.error('⏱️ Request timed out');
    }
    return null;
  }
}

// Retry analysis with more aggressive prompt if first attempt yields no data
export async function analyzeWithRetry(
  document: any,
  extractedContent: string,
  identifiedType: any,
  lovableApiKey: string,
  systemPrompt: string,
  attempt: number = 1
): Promise<{ result: any; retryCount: number }> {
  
  console.log(`🔬 Starting AI analysis (attempt ${attempt})...`);
  const startTime = Date.now();
  
  // Create abort controller for 60s timeout
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 60000);
  
  try {
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
      body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: attempt === 1 
            ? `You are provided with the full text content of a document below. Analyze this content and extract structured data according to the instructions in your system prompt.

**CRITICAL: LOOK FOR STRUCTURED TABLES WITH DATES**
If this document contains a table with multiple rows of data (e.g., daily entries, nightly records, session logs), you MUST extract EACH ROW as a separate metric entry. Do NOT summarize tables - extract every single row individually.

**DOCUMENT CONTENT:**
---
${extractedContent}
---

Extract all relevant data from the above document content and return your analysis as a valid JSON object matching the schema in your system prompt.`
            : `CRITICAL RE-ANALYSIS REQUIRED - First attempt returned no data.

This is a ${identifiedType?.doc_type || 'special education'} document. It MUST contain quantifiable information.

Re-read the document CAREFULLY and extract:
- ANY numbers with units (scores, percentages, frequencies, durations)
- ANY mentions of skills, behaviors, or performance levels
- ANY goals, baselines, or targets with dates
- ANY recommendations or action items
- ANY progress indicators or trends

**DOCUMENT CONTENT:**
---
${extractedContent}
---

If you find ABSOLUTELY NOTHING after careful review, create an insight explaining WHY this document contains no extractable data.

Return your analysis as a valid JSON object.`
        },
      ],
    }),
  });
  
  clearTimeout(timeoutId);
  const elapsed = Date.now() - startTime;
  console.log(`⏱️ AI analysis request completed in ${elapsed}ms`);

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error("❌ AI API error:", {
      status: aiResponse.status,
      statusText: aiResponse.statusText,
      error: errorText,
      elapsed_ms: elapsed
    });
    
    // Return more specific error for rate limiting
    if (aiResponse.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    
    throw new Error(`AI analysis failed with status ${aiResponse.status}: ${errorText}`);
  }

  const aiData = await aiResponse.json();
  const aiContent = aiData.choices?.[0]?.message?.content;

  if (!aiContent) {
    throw new Error("AI returned no content");
  }

  // Parse the AI response
  let analysisResult;
  try {
    let cleanContent = aiContent.trim();
    
    // Remove markdown code blocks
    cleanContent = cleanContent.replace(/^```(?:json)?\s*/g, '').replace(/\s*```$/g, '');
    
    // Check if AI returned conversational text instead of JSON
    if (!cleanContent.startsWith('{') && !cleanContent.startsWith('[')) {
      console.error("AI returned conversational response instead of JSON:", cleanContent.substring(0, 100));
      
      // If on first attempt, retry with more explicit instructions
      if (attempt === 1) {
        console.log('⚠️ AI returned text instead of JSON, retrying with stricter prompt...');
        return await analyzeWithRetry(
          document, 
          extractedContent, 
          identifiedType, 
          lovableApiKey, 
          systemPrompt, 
          2
        );
      }
      
      // On second attempt, return empty structure with insight about the issue
      console.log('⚠️ Creating fallback structure for unparseable response');
      analysisResult = {
        metrics: [],
        insights: [{
          insight_type: 'extraction_failure',
          title: 'Document Analysis Incomplete',
          content: `Unable to extract structured data from this document. The AI response was: ${cleanContent.substring(0, 200)}`,
          confidence_score: 0.3,
          priority: 'low'
        }],
        progress: []
      };
    } else {
      analysisResult = JSON.parse(cleanContent);
    }
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    console.error("Raw content:", aiContent.substring(0, 500));
    
    // If on first attempt, retry
    if (attempt === 1) {
      console.log('⚠️ Parse error on first attempt, retrying...');
      return await analyzeWithRetry(
        document, 
        extractedContent, 
        identifiedType, 
        lovableApiKey, 
        systemPrompt, 
        2
      );
    }
    
    throw new Error("Failed to parse AI response after retry");
  }

  // Check if result is suspiciously empty
  const totalItems = (analysisResult.metrics?.length || 0) + 
                    (analysisResult.insights?.length || 0) + 
                    (analysisResult.progress?.length || 0);
  
  if (totalItems === 0 && attempt === 1) {
    console.log('⚠️ First attempt returned no data, retrying with aggressive prompt...');
    return await analyzeWithRetry(
      document, 
      extractedContent, 
      identifiedType, 
      lovableApiKey, 
      systemPrompt, 
      2
    );
  }
  
  console.log(`📊 Analysis complete (attempt ${attempt}): ${analysisResult.metrics?.length || 0} metrics, ${analysisResult.insights?.length || 0} insights, ${analysisResult.progress?.length || 0} progress records`);
  
  return { result: analysisResult, retryCount: attempt - 1 };
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      const elapsed = Date.now() - startTime;
      console.error(`❌ AI analysis timed out after ${elapsed}ms`);
      throw new Error("Analysis request timed out after 60 seconds. Please try again.");
    }
    throw fetchError;
  }
}
