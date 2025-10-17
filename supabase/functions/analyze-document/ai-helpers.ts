// AI-powered document classification helper
export async function aiIdentifyDocumentType(
  extractedContent: string, 
  lovableApiKey: string
): Promise<{ doc_type: string; confidence: number } | null> {
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a document classifier for special education documents.

Classify the document into ONE of these types:
- "Individualized Education Program (IEP)"
- "Behavior Intervention Plan (BIP)"
- "IEP Amendment"
- "Progress Report"
- "Psychoeducational Evaluation"
- "Neuropsychological Evaluation"
- "Evaluation Team Report (ETR)"
- "Occupational Therapy Evaluation"
- "Sensory Profile"
- "Communication Log (Parent-Teacher)"
- "Teacher Progress Notes"
- "Unknown"

Return ONLY a JSON object in this exact format:
{ "doc_type": "type_name", "confidence": 0.85 }

Confidence scoring:
- 0.9-1.0: Very clear (document explicitly states type)
- 0.7-0.89: Confident (multiple indicators match)
- 0.5-0.69: Likely (some indicators match)
- Below 0.5: Uncertain (classify as "Unknown")`
          },
          {
            role: 'user',
            content: `Classify this document based on the first 3000 characters:\n\n${extractedContent.slice(0, 3000)}`
          }
        ],
      }),
    });

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
    
    // Only return if confidence is high enough
    if (result.confidence >= 0.6 && result.doc_type !== 'Unknown') {
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Error in AI document classification:', error);
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
        { 
          role: "user", 
          content: attempt === 1 
            ? `You are provided with the full text content of a document below. Analyze this content and extract structured data according to the instructions in your system prompt.

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

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error("❌ AI API error:", {
      status: aiResponse.status,
      statusText: aiResponse.statusText,
      error: errorText
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
    cleanContent = cleanContent.replace(/^```(?:json)?\s*/g, '').replace(/\s*```$/g, '');
    analysisResult = JSON.parse(cleanContent);
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    throw new Error("Failed to parse AI response");
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
}
