// ============================================================================
// DOCUMENT CLASSIFICATION SYSTEM
// Pre-classification + AI classification with confidence scoring
// ============================================================================

interface PreClassificationResult {
  likelyType: string;
  confidence: number;
  keywords: string[];
  matchCount: number;
}

interface ClassificationResult {
  document_type: string;
  confidence: number;
  pre_classification_match: boolean;
  keyword_confidence: number;
  ai_confidence: number;
  requires_manual_review: boolean;
  classification_metadata: {
    keywords_found: string[];
    ai_reasoning: string[];
    secondary_type?: {
      type: string;
      confidence: number;
    };
  };
}

// Keyword patterns for pre-classification
const TYPE_PATTERNS: Record<string, RegExp[]> = {
  IEP: [
    /IEP\s+team/gi,
    /present\s+levels/gi,
    /annual\s+goals/gi,
    /least\s+restrictive\s+environment/gi,
    /accommodations\s+and\s+modifications/gi,
    /special\s+education/gi,
    /individualized\s+education/gi,
  ],
  "Incident Report": [
    /incident\s+date/gi,
    /antecedent/gi,
    /behavior\s+observed/gi,
    /consequence/gi,
    /intervention\s+used/gi,
    /ABC\s+data/gi,
    /challenging\s+behavior/gi,
  ],
  "Sleep Log": [
    /bedtime/gi,
    /wake\s+time/gi,
    /total\s+sleep/gi,
    /sleep\s+quality/gi,
    /nap/gi,
    /night\s+wakings/gi,
    /sleep\s+duration/gi,
  ],
  "Progress Report": [
    /progress\s+toward/gi,
    /baseline/gi,
    /current\s+level/gi,
    /mastery/gi,
    /growth/gi,
    /achievement/gi,
    /performance\s+data/gi,
  ],
  "Educator Log": [
    /session\s+duration/gi,
    /activities\s+completed/gi,
    /engagement\s+level/gi,
    /prompting/gi,
    /teaching\s+method/gi,
    /lesson\s+plan/gi,
  ],
  "Functional Behavior Assessment (FBA)": [
    /functional\s+behavior/gi,
    /FBA/gi,
    /hypothesis/gi,
    /function\s+of\s+behavior/gi,
    /replacement\s+behavior/gi,
  ],
  "Behavior Intervention Plan (BIP)": [
    /BIP/gi,
    /intervention\s+plan/gi,
    /positive\s+behavior/gi,
    /support\s+strategies/gi,
    /prevention\s+strategies/gi,
  ],
  "Psychoeducational Evaluation": [
    /psychoeducational/gi,
    /cognitive\s+assessment/gi,
    /WISC/gi,
    /IQ\s+test/gi,
    /psychological\s+evaluation/gi,
    /adaptive\s+behavior/gi,
  ],
  "OT/Sensory Profile": [
    /occupational\s+therapy/gi,
    /sensory\s+processing/gi,
    /sensory\s+profile/gi,
    /fine\s+motor/gi,
    /gross\s+motor/gi,
    /sensory\s+integration/gi,
  ],
};

/**
 * Pre-classify document using keyword matching
 */
export function preClassifyDocument(extractedText: string): PreClassificationResult {
  const scores: Record<string, { count: number; keywords: string[] }> = {};

  for (const [type, patterns] of Object.entries(TYPE_PATTERNS)) {
    const matchedKeywords: string[] = [];
    let count = 0;

    for (const pattern of patterns) {
      const matches = extractedText.match(pattern);
      if (matches) {
        count += matches.length;
        matchedKeywords.push(pattern.source.replace(/\\/gi, ""));
      }
    }

    if (count > 0) {
      scores[type] = { count, keywords: matchedKeywords };
    }
  }

  if (Object.keys(scores).length === 0) {
    return {
      likelyType: "Unknown",
      confidence: 0,
      keywords: [],
      matchCount: 0,
    };
  }

  const topMatch = Object.entries(scores).sort((a, b) => b[1].count - a[1].count)[0];

  const totalMatches = Object.values(scores).reduce((sum, s) => sum + s.count, 0);
  const confidence = Math.round((topMatch[1].count / totalMatches) * 100);

  return {
    likelyType: topMatch[0],
    confidence,
    keywords: topMatch[1].keywords,
    matchCount: topMatch[1].count,
  };
}

/**
 * AI-powered classification with enhanced prompt
 */
// ============================================================================
// CORRECTED CLASSIFICATION SYSTEM - GOOGLE GEMINI IMPLEMENTATION
// ============================================================================

// Add this import at the top of your file if it's not there
import { GoogleAuth } from "google-auth-library";

// ... (The TYPE_PATTERNS and preClassifyDocument function can remain as they are) ...

/**
 * AI-powered classification using Google Vertex AI (Gemini).
 * This is the one and only correct implementation.
 */
export async function aiClassifyDocument(
  extractedText: string,
  preClassification: PreClassificationResult,
): Promise<any> {
  // Using 'any' to match the shape of the expected JSON response

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

  const CLASSIFICATION_PROMPT = `You are an expert administrative assistant in the field of special education.
Your task is to analyze the provided text and determine its exact document type from the list below.
You will be given a pre-analysis based on keywords, but you must use the full text to make your final determination.

KEYWORD PRE-ANALYSIS:
- Likely type based on keywords: ${preClassification.likelyType}
- Confidence: ${preClassification.confidence}%

PRIMARY DOCUMENT TYPES:
- "Individualized Education Program (IEP)"
- "Progress Report / Progress Monitoring"
- "Behavioral Incident Report"
- "Sleep Log / Sleep Tracking"
- "Educator Daily Log / Session Notes"
- "Functional Behavior Assessment (FBA)"
- "Behavior Intervention Plan (BIP)"
- "Psychoeducational Evaluation"
- "Occupational Therapy Report"
- "Speech Therapy Report"
- "504 Plan"
- "Medical Records / Doctor's Note"
- "Parent Communication Log"
- "Unknown" (ONLY if truly unidentifiable)

Return ONLY a single, valid JSON object with the following structure:
{
  "document_type": "exact type from list above",
  "confidence": 0-100,
  "confidence_reasons": ["brief reason 1", "brief reason 2"],
  "secondary_type_possibility": { "type": "type name or null", "confidence": 0-100 }
}`;

  const apiEndpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-pro-preview-0409:generateContent`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${CLASSIFICATION_PROMPT}\n\nClassify this document:\n\n${extractedText.substring(0, 8000)}...` },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Google Gemini API Error:", errorBody);
    throw new Error(`Google Gemini classification failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  return JSON.parse(content);
}

/**
 * Combined classification using Google Cloud AI.
 * This function no longer requires any external API key parameters.
 */
export async function classifyDocument(
  extractedText: string,
  documentId: string, // documentId is kept for potential future logging
): Promise<ClassificationResult> {
  // Step 1: Pre-classify with keywords
  const preClassification = preClassifyDocument(extractedText);
  console.log("📊 Pre-classification:", preClassification);

  // Step 2: AI classification using Google Gemini
  const aiClassification = await aiClassifyDocument(extractedText, preClassification);
  console.log("🤖 AI classification (Google Gemini):", aiClassification);

  // Step 3: Validate and reconcile
  const finalClassification: ClassificationResult = {
    document_type: aiClassification.document_type,
    confidence: aiClassification.confidence,
    pre_classification_match: preClassification.likelyType === aiClassification.document_type,
    keyword_confidence: preClassification.confidence,
    ai_confidence: aiClassification.confidence,
    requires_manual_review:
      aiClassification.confidence < 70 ||
      (preClassification.confidence > 50 && preClassification.likelyType !== aiClassification.document_type),
    classification_metadata: {
      keywords_found: preClassification.keywords,
      ai_reasoning: aiClassification.confidence_reasons,
      secondary_type: aiClassification.secondary_type_possibility,
    },
  };

  console.log("✅ Final classification (Google Gemini):", {
    type: finalClassification.document_type,
    confidence: finalClassification.confidence,
    needsReview: finalClassification.requires_manual_review,
  });

  return finalClassification;
}
