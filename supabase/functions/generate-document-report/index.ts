import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id, student_id } = await req.json();

    if (!family_id || !student_id) {
      throw new Error('family_id and student_id are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Consume 250 AI credits
    const { data: creditResult, error: creditError } = await supabase.rpc('consume_ai_credits', {
      p_family_id: family_id,
      p_action_type: 'comprehensive_report',
      p_credits_required: 250,
      p_metadata: { student_id, report_type: 'comprehensive' }
    });

    if (creditError || !creditResult?.success) {
      throw new Error(creditResult?.error || 'Insufficient credits');
    }

    // Fetch all documents for the student
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .order('document_date', { ascending: false });

    if (docsError) throw docsError;

    if (!documents || documents.length === 0) {
      throw new Error('No documents found for this student');
    }

    // Fetch all metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('document_metrics')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .order('measurement_date', { ascending: false });

    if (metricsError) throw metricsError;

    // Fetch all insights
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .eq('is_active', true)
      .order('generated_at', { ascending: false });

    if (insightsError) throw insightsError;

    // Fetch all progress tracking
    const { data: progress, error: progressError } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .order('created_at', { ascending: false });

    if (progressError) throw progressError;

    // Prepare AI prompt
    const documentList = documents.map(d => 
      `- ${d.file_name} (${d.category}, ${d.document_date})`
    ).join('\n');

    const metricsSummary = `Total Metrics: ${metrics?.length || 0}
Metric Types: ${[...new Set(metrics?.map(m => m.metric_type) || [])].join(', ')}`;

    const insightsSummary = `Total Insights: ${insights?.length || 0}
Priority Breakdown:
- Critical: ${insights?.filter(i => i.priority === 'critical').length || 0}
- High: ${insights?.filter(i => i.priority === 'high').length || 0}
- Medium: ${insights?.filter(i => i.priority === 'medium').length || 0}`;

    const prompt = `You are an expert educational consultant creating a comprehensive report for a student with special needs.

**Student Context:**
- Total Documents Analyzed: ${documents.length}
- Document Types: ${[...new Set(documents.map(d => d.category))].join(', ')}
- Date Range: ${documents[documents.length - 1]?.document_date} to ${documents[0]?.document_date}

**Documents:**
${documentList}

**Extracted Data:**
${metricsSummary}

${insightsSummary}

**Progress Tracking Records:** ${progress?.length || 0}

Generate a comprehensive, professional report with these sections:

# Comprehensive Student Report

## Executive Summary
(2-3 paragraphs summarizing overall student profile and key findings)

## Current Strengths
- [Bullet list of observed strengths]

## Areas of Concern
- [Bullet list with priority level - Critical, High, or Medium]

## IEP Goals Progress
| Goal | Baseline | Current | Target | Progress % | Status |
|------|----------|---------|--------|------------|--------|
[Table format with specific data from metrics]

## Behavioral Patterns
[Analysis of behavioral incident data, frequencies, and trends]

## Intervention Effectiveness
[What interventions are working vs not working, based on data]

## Recommendations for Parents
1. [Actionable item with specific rationale]
2. [Actionable item with specific rationale]
3. [Actionable item with specific rationale]

## Recommendations for Educators
1. [Actionable item with specific rationale]
2. [Actionable item with specific rationale]
3. [Actionable item with specific rationale]

## Next Steps (30-day Timeline)
- Week 1: [Specific actions]
- Week 2: [Specific actions]
- Week 3-4: [Specific actions]

---
*Report generated: ${new Date().toISOString().split('T')[0]}*

Format: Professional markdown for easy reading and printing. Use specific data points and avoid generalizations.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert educational consultant specializing in special education and IEP documentation.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reportContent = aiData.choices[0].message.content;

    // Store report in database
    const { data: reportData, error: reportError } = await supabase
      .from('document_reports')
      .insert({
        family_id,
        student_id,
        report_content: reportContent,
        report_format: 'markdown',
        document_ids: documents.map(d => d.id),
        metrics_count: metrics?.length || 0,
        insights_count: insights?.length || 0,
        progress_records_count: progress?.length || 0,
        generated_by: req.headers.get('x-user-id')
      })
      .select()
      .single();

    if (reportError) throw reportError;

    return new Response(
      JSON.stringify({
        success: true,
        report_id: reportData.id,
        report_content: reportContent,
        document_count: documents.length,
        metrics_analyzed: metrics?.length || 0,
        insights_included: insights?.length || 0,
        generated_at: reportData.generated_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate document report error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});