import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Master analysis function using Lovable AI
async function analyzeDocumentWithAI(
  content: string,
  category: string
): Promise<any> {
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  const systemPrompt = `You are an expert special education data analyst. Analyze the following ${category} document and extract structured data.

Extract the following:
1. **metrics**: Quantifiable measurements (scores, percentages, frequencies) with:
   - metric_name: descriptive name
   - metric_value: numerical value
   - metric_type: category (academic_performance, behavior, communication, social_skills, motor_skills, etc.)
   - measurement_date: when measured in YYYY-MM-DD format (if available, otherwise use today's date)
   - target_value: goal/target (if mentioned)
   - context: additional context

2. **insights**: Qualitative observations and recommendations with:
   - insight_text: the observation or recommendation
   - insight_type: category (strength, concern, recommendation, observation)
   - confidence_score: 0-10 rating
   - relates_to: what it relates to (goal, behavior, skill, etc.)

3. **progress_tracking**: Goals and progress indicators with:
   - metric_type: the skill/goal area
   - current_value: current level
   - target_value: goal level
   - progress_percentage: calculated progress (0-100)
   - trend: improving/stable/declining

Return ONLY a valid JSON object with these three arrays: metrics, insights, progress_tracking.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Document Category: ${category}\n\nDocument Content:\n${content.substring(0, 50000)}` }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API Error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 402) {
      throw new Error('AI credits depleted. Please add credits to continue.');
    }
    throw new Error(`AI analysis failed: ${errorText}`);
  }

  const data = await response.json();
  const content_text = data.choices?.[0]?.message?.content;
  
  if (!content_text) {
    throw new Error('No response from AI model');
  }

  // Parse JSON response
  let jsonMatch = content_text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Failed to find JSON in response:', content_text);
    throw new Error('AI response was not valid JSON');
  }

  const result = JSON.parse(jsonMatch[0]);
  
  // Validate structure
  if (!result.metrics || !result.insights || !result.progress_tracking) {
    throw new Error('AI response missing required fields');
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { document_id } = await req.json();

    if (!document_id) {
      throw new Error('Missing document_id');
    }

    console.log(`[v3-analyze-document] Starting analysis for document: ${document_id}`);

    // Get document and verify access
    const { data: document, error: docError } = await supabase
      .from('v3_documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      console.error('[v3-analyze-document] Document fetch error:', docError);
      throw new Error('Document not found or you do not have access to it');
    }

    console.log(`[v3-analyze-document] Document found: ${document.file_name}`);
    console.log(`[v3-analyze-document] Document status: ${document.status}, is_classified: ${document.is_classified}`);

    // Get family to get student_id
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('id, student_id')
      .eq('id', document.family_id)
      .single();

    if (familyError || !family) {
      console.error('[v3-analyze-document] Family fetch error:', familyError);
      throw new Error('Family not found');
    }

    // Verify user is family member
    const { data: familyMembers, error: memberError } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', document.family_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !familyMembers) {
      throw new Error('Access denied: Not a family member');
    }

    // Verify document is classified
    if (!document.is_classified) {
      throw new Error('Document must be classified before analysis');
    }

    // Check if already analyzing
    if (document.status === 'analyzing' || document.status === 'extracting') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Analysis already in progress for this document' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Verify extracted content exists
    if (!document.extracted_content || document.extracted_content.trim().length < 50) {
      console.error('[v3-analyze-document] No extracted content found. Content length:', document.extracted_content?.length || 0);
      
      // Update document with specific error message
      await supabase
        .from('v3_documents')
        .update({ 
          status: 'failed',
          error_message: 'Document text extraction required before analysis. Please re-upload the document.'
        })
        .eq('id', document_id);
      
      throw new Error('Document text must be extracted before analysis. Please re-upload the document.');
    }
    
    console.log(`[v3-analyze-document] Extracted content length: ${document.extracted_content.length} characters`);

    // Update status to analyzing
    const { error: updateError } = await supabase
      .from('v3_documents')
      .update({ 
        status: 'analyzing',
        error_message: null
      })
      .eq('id', document_id);

    if (updateError) {
      throw new Error(`Failed to update document status: ${updateError.message}`);
    }

    console.log(`[v3-analyze-document] Status updated to 'analyzing'`);
    console.log(`[v3-analyze-document] Category: ${document.category}`);
    console.log(`[v3-analyze-document] Content length: ${document.extracted_content.length} chars`);

    // Perform AI analysis
    const analysisResult = await analyzeDocumentWithAI(
      document.extracted_content,
      document.category
    );

    console.log(`[v3-analyze-document] AI analysis complete`);
    console.log(`[v3-analyze-document] Extracted: ${analysisResult.metrics?.length || 0} metrics, ${analysisResult.insights?.length || 0} insights, ${analysisResult.progress_tracking?.length || 0} progress items`);

    // Store metrics
    if (analysisResult.metrics && analysisResult.metrics.length > 0) {
      const metricsToInsert = analysisResult.metrics.map((metric: any) => ({
        document_id: document_id,
        family_id: document.family_id,
        student_id: family.student_id,
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        metric_type: metric.metric_type || 'general',
        measurement_date: metric.measurement_date || new Date().toISOString().split('T')[0],
        target_value: metric.target_value,
        context: metric.context,
      }));

      const { error: metricsError } = await supabase
        .from('document_metrics')
        .insert(metricsToInsert);

      if (metricsError) {
        console.error('[v3-analyze-document] Metrics insert error:', metricsError);
      } else {
        console.log(`[v3-analyze-document] Inserted ${metricsToInsert.length} metrics`);
      }
    }

    // Store insights
    if (analysisResult.insights && analysisResult.insights.length > 0) {
      const insightsToInsert = analysisResult.insights.map((insight: any) => ({
        document_id: document_id,
        family_id: document.family_id,
        student_id: family.student_id,
        insight_text: insight.insight_text,
        insight_type: insight.insight_type || 'observation',
        confidence_score: insight.confidence_score || 5,
        relates_to: insight.relates_to,
      }));

      const { error: insightsError } = await supabase
        .from('ai_insights')
        .insert(insightsToInsert);

      if (insightsError) {
        console.error('[v3-analyze-document] Insights insert error:', insightsError);
      } else {
        console.log(`[v3-analyze-document] Inserted ${insightsToInsert.length} insights`);
      }
    }

    // Store progress tracking
    if (analysisResult.progress_tracking && analysisResult.progress_tracking.length > 0) {
      const progressToInsert = analysisResult.progress_tracking.map((progress: any) => ({
        document_id: document_id,
        family_id: document.family_id,
        student_id: family.student_id,
        metric_type: progress.metric_type,
        current_value: progress.current_value,
        target_value: progress.target_value,
        progress_percentage: progress.progress_percentage || 0,
        trend: progress.trend || 'stable',
      }));

      const { error: progressError } = await supabase
        .from('progress_tracking')
        .insert(progressToInsert);

      if (progressError) {
        console.error('[v3-analyze-document] Progress tracking insert error:', progressError);
      } else {
        console.log(`[v3-analyze-document] Inserted ${progressToInsert.length} progress items`);
      }
    }

    // Update document status to completed
    const { error: completeError } = await supabase
      .from('v3_documents')
      .update({ 
        status: 'completed',
        analyzed_at: new Date().toISOString(),
        error_message: null
      })
      .eq('id', document_id);

    if (completeError) {
      throw new Error(`Failed to complete analysis: ${completeError.message}`);
    }

    console.log(`[v3-analyze-document] Analysis completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: 'completed',
        message: 'Analysis completed successfully',
        stats: {
          metrics: analysisResult.metrics?.length || 0,
          insights: analysisResult.insights?.length || 0,
          progress_items: analysisResult.progress_tracking?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[v3-analyze-document] Error:', error);
    
    // Try to update document status to failed if we have document_id
    const { document_id } = await req.json().catch(() => ({}));
    if (document_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase
        .from('v3_documents')
        .update({ 
          status: 'failed',
          error_message: error.message || 'Analysis failed'
        })
        .eq('id', document_id);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
