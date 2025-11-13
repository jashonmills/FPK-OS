import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // 2. Get document ID
    const { document_id } = await req.json();
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

    console.log(`📄 Analyzing: ${doc.file_name} (${doc.category})`);

    // 5. Update status to 'analyzing'
    await supabase
      .from('bedrock_documents')
      .update({ status: 'analyzing' })
      .eq('id', document_id);

    // 6. Call Lovable AI for analysis
    const systemPrompt = `You are analyzing a ${doc.category} document for a student.

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
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Parse AI response
    const analysisResult = JSON.parse(content);

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
