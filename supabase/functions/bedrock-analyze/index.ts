import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSpecializedPrompt } from "../_shared/prompts/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let documentId: string | null = null;

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Authenticate
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Get document ID and processor info
    const { document_id, category, processor_id } = await req.json();
    documentId = document_id;
    
    if (!document_id) throw new Error('document_id is required');

    // 3. Fetch document (simple query, no joins)
    const { data: doc, error: fetchError } = await supabase
      .from('bedrock_documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (fetchError || !doc) {
      console.error('Document not found:', fetchError);
      throw new Error('Document not found or access denied');
    }

    // 4. Validate document is ready for analysis
    if (!doc.category) {
      throw new Error('Document must be classified before analysis');
    }

    if (!doc.extracted_content || doc.extracted_content.length < 50) {
      throw new Error('Document content is missing or too short');
    }

    const analysisCategory = category || doc.category;
    console.log(`📄 Analyzing: ${doc.file_name} (${analysisCategory})`);
    if (processor_id) {
      console.log(`🎯 Using processor: ${processor_id}`);
    }

    // 5. Update status to 'analyzing' and category if provided
    const updateData: any = { status: 'analyzing' };
    if (category && category !== doc.category) {
      updateData.category = category;
      console.log(`📝 Updating category: ${doc.category} → ${category}`);
    }
    
    await supabase
      .from('bedrock_documents')
      .update(updateData)
      .eq('id', document_id);

    // 6. Get specialized prompt based on document type
    const specializedPrompt = getSpecializedPrompt(analysisCategory);
    const systemPrompt = specializedPrompt || `You are analyzing a ${analysisCategory} document for a student.

Extract the following data and return ONLY valid JSON:

{
  "metrics": [
    {
      "metric_type": "string",
      "metric_name": "string",
      "metric_value": number,
      "metric_unit": "string",
      "measurement_date": "YYYY-MM-DD or null",
      "context": "string"
    }
  ],
  "insights": [
    {
      "insight_type": "string (strength/challenge/recommendation/observation)",
      "title": "string",
      "content": "string",
      "priority": "string (high/medium/low)",
      "confidence_score": number (0-1)
    }
  ],
  "progress_tracking": [
    {
      "metric_type": "string",
      "baseline_value": number,
      "current_value": number,
      "target_value": number,
      "trend": "string (improving/stable/declining)",
      "notes": "string"
    }
  ]
}

Return ONLY the JSON object, no markdown or explanation.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: doc.extracted_content.substring(0, 100000) }
        ],
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI analysis failed:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Extract JSON from markdown code blocks (handles all variations)
    const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    content = jsonMatch ? jsonMatch[1].trim() : content.trim();
    
    // Parse AI response with enhanced error logging
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (error) {
      console.error('❌ JSON Parse Error:', error);
      console.error('📄 Raw AI Response (first 500 chars):', aiData.choices?.[0]?.message?.content?.substring(0, 500));
      console.error('🔍 Extracted JSON String:', content.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log(`✅ Analysis complete:`, {
      metrics: analysisResult.metrics?.length || 0,
      insights: analysisResult.insights?.length || 0,
      progress: analysisResult.progress_tracking?.length || 0
    });

    // 7. Store results and mark as completed
    await supabase
      .from('bedrock_documents')
      .update({
        status: 'completed',
        analyzed_at: new Date().toISOString(),
        analysis_data: analysisResult,
        error_message: null
      })
      .eq('id', document_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Analysis failed:', error);
    
    // Update document to failed status
    if (documentId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase
        .from('bedrock_documents')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', documentId);
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Analysis failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
