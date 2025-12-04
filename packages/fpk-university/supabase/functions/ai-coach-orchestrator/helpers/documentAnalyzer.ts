/**
 * Document Classification System for Adaptive Pedagogical Flows
 * 
 * Analyzes uploaded documents to determine optimal teaching approach:
 * - Factual documents (business plans, reports) → Explanatory Flow (Al-first)
 * - Creative documents (literature, essays) → Exploratory Flow (Betty-first)
 * - Technical documents (manuals, code) → Problem-Solving Flow
 */

export type DocumentType = 'factual' | 'creative' | 'technical';
export type PedagogicalFlow = 'explanatory' | 'exploratory' | 'problem_solving';

export interface DocumentClassification {
  type: DocumentType;
  suggestedFlow: PedagogicalFlow;
  confidence: number;
  reasoning: string;
}

/**
 * Classify document content using Lovable AI Gateway
 */
export async function classifyDocument(
  content: string,
  title: string,
  lovableApiKey: string
): Promise<DocumentClassification> {
  console.log('[DOC CLASSIFIER] 🔍 Analyzing document:', { title, contentLength: content.length });
  
  try {
    // Truncate content for classification (first 3000 chars should be enough)
    const sample = content.substring(0, 3000);
    
    const classificationPrompt = `You are a document classifier for an educational AI system. Analyze this document and determine the best teaching approach.

Document Title: "${title}"
Document Sample (first 3000 characters):
"""
${sample}
"""

Classify this document into ONE of these types:

1. **FACTUAL**: Business plans, research papers, reports, textbooks, news articles, legal documents
   - Contains structured information, data, facts
   - Best taught by first explaining facts, then asking comprehension questions
   - Teaching Flow: "Explanatory" (Expert explains first, Guide asks questions second)

2. **CREATIVE**: Literature, poetry, philosophical texts, open-ended essays, artistic works
   - Open to interpretation, multiple perspectives
   - Best taught through exploration and discovery
   - Teaching Flow: "Exploratory" (Guide asks questions first, Expert clarifies when needed)

3. **TECHNICAL**: Manuals, code documentation, technical specifications, math problems, scientific procedures
   - Requires step-by-step problem-solving
   - Best taught through guided practice
   - Teaching Flow: "Problem-Solving" (Present problem → Student attempts → Expert corrects → Guide deepens)

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "type": "factual" | "creative" | "technical",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of why this classification was chosen (1 sentence)"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: classificationPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent classification
      }),
    });

    if (!response.ok) {
      throw new Error(`Classification API error: ${response.status}`);
    }

    const data = await response.json();
    const rawResult = data.choices[0].message.content;
    
    console.log('[DOC CLASSIFIER] 🤖 Raw AI response:', rawResult);
    
    // Parse JSON response - strip markdown code blocks if present
    let jsonString = rawResult.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    
    const parsed = JSON.parse(jsonString);
    
    // Map type to suggested flow
    const flowMapping: Record<DocumentType, PedagogicalFlow> = {
      'factual': 'explanatory',
      'creative': 'exploratory',
      'technical': 'problem_solving',
    };
    
    const classification: DocumentClassification = {
      type: parsed.type,
      suggestedFlow: flowMapping[parsed.type],
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
    };
    
    console.log('[DOC CLASSIFIER] ✅ Classification complete:', classification);
    
    return classification;
    
  } catch (error) {
    console.error('[DOC CLASSIFIER] ❌ Classification failed:', error);
    
    // Fallback: Use heuristic-based classification
    console.log('[DOC CLASSIFIER] 🔄 Using fallback heuristic classification...');
    return fallbackClassification(content, title);
  }
}

/**
 * Fallback heuristic classification if AI classification fails
 */
function fallbackClassification(content: string, title: string): DocumentClassification {
  const titleLower = title.toLowerCase();
  const contentSample = content.substring(0, 1000).toLowerCase();
  
  // Factual document indicators
  const factualKeywords = [
    'executive summary', 'market analysis', 'business plan', 'report', 
    'research', 'data', 'statistics', 'findings', 'conclusion',
    'introduction', 'methodology', 'results', 'abstract'
  ];
  
  // Creative document indicators
  const creativeKeywords = [
    'chapter', 'poem', 'story', 'verse', 'metaphor', 'character',
    'once upon', 'narrative', 'protagonist', 'theme'
  ];
  
  // Technical document indicators
  const technicalKeywords = [
    'function', 'algorithm', 'procedure', 'step', 'instruction',
    'code', 'syntax', 'manual', 'specification', 'configuration'
  ];
  
  // Count keyword matches
  const factualScore = factualKeywords.filter(k => 
    titleLower.includes(k) || contentSample.includes(k)
  ).length;
  
  const creativeScore = creativeKeywords.filter(k => 
    titleLower.includes(k) || contentSample.includes(k)
  ).length;
  
  const technicalScore = technicalKeywords.filter(k => 
    titleLower.includes(k) || contentSample.includes(k)
  ).length;
  
  // Determine type based on highest score
  let type: DocumentType;
  let confidence: number;
  
  if (factualScore >= creativeScore && factualScore >= technicalScore) {
    type = 'factual';
    confidence = Math.min(0.7 + (factualScore * 0.05), 0.95);
  } else if (technicalScore > factualScore && technicalScore > creativeScore) {
    type = 'technical';
    confidence = Math.min(0.7 + (technicalScore * 0.05), 0.95);
  } else if (creativeScore > 0) {
    type = 'creative';
    confidence = Math.min(0.7 + (creativeScore * 0.05), 0.95);
  } else {
    // Default to factual with lower confidence
    type = 'factual';
    confidence = 0.6;
  }
  
  const flowMapping: Record<DocumentType, PedagogicalFlow> = {
    'factual': 'explanatory',
    'creative': 'exploratory',
    'technical': 'problem_solving',
  };
  
  console.log('[DOC CLASSIFIER] 📊 Heuristic scores:', { factualScore, creativeScore, technicalScore });
  console.log('[DOC CLASSIFIER] ✅ Fallback classification:', type, confidence);
  
  return {
    type,
    suggestedFlow: flowMapping[type],
    confidence,
    reasoning: `Heuristic classification based on ${type} content indicators`,
  };
}
