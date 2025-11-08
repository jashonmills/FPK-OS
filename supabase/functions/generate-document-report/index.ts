import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { 
  COMPREHENSIVE_PROMPT, 
  BEHAVIORAL_PROMPT, 
  SKILL_PROMPT, 
  INTERVENTION_PROMPT, 
  SENSORY_PROMPT, 
  ENVIRONMENTAL_PROMPT 
} from './prompts.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { family_id, student_id, focusArea = 'comprehensive' } = await req.json();

    if (!family_id || !student_id) {
      throw new Error('family_id and student_id are required');
    }

    const validFocusAreas = ['comprehensive', 'behavioral', 'skill', 'intervention', 'sensory', 'environmental'];
    if (!validFocusAreas.includes(focusArea)) {
      throw new Error('Invalid focus area');
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
      const errorMessage = creditResult?.error || 'Insufficient AI credits to generate this report.';
      console.error('Credit consumption failed:', errorMessage);
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          credits_required: 250,
          credits_available: creditResult?.remaining_credits || 0
        }),
        { 
          status: 402, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const sixtyDaysAgoStr = sixtyDaysAgo.toISOString().split('T')[0];

    // Fetch student data for prompts
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('student_name, date_of_birth')
      .eq('id', student_id)
      .single();

    if (studentError) throw studentError;

    const studentName = student.student_name;
    const studentAge = student.date_of_birth 
      ? Math.floor((Date.now() - new Date(student.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : 0;

    // Fetch family name for personalization
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('family_name')
      .eq('id', family_id)
      .single();

    if (familyError) throw familyError;

    const familyName = family.family_name;

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

    // Fetch metrics (last 60 days)
    const { data: metrics, error: metricsError } = await supabase
      .from('document_metrics')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .gte('measurement_date', sixtyDaysAgoStr)
      .order('measurement_date', { ascending: false });

    if (metricsError) throw metricsError;

    // Fetch insights (last 60 days)
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .eq('is_active', true)
      .gte('generated_at', sixtyDaysAgo.toISOString())
      .order('generated_at', { ascending: false });

    if (insightsError) throw insightsError;

    // Fetch progress tracking (last 60 days)
    const { data: progress, error: progressError } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .gte('created_at', sixtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (progressError) throw progressError;

    // Fetch educator logs (last 60 days, limit 50)
    const { data: educatorLogs, error: educatorError } = await supabase
      .from('educator_logs')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .gte('log_date', sixtyDaysAgoStr)
      .order('log_date', { ascending: false })
      .limit(50);

    if (educatorError) throw educatorError;

    // Fetch sleep records (last 60 days for correlation)
    const { data: sleepRecords, error: sleepError } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .gte('sleep_date', sixtyDaysAgoStr)
      .order('sleep_date', { ascending: false });

    if (sleepError) throw sleepError;

    // Fetch incident logs (last 60 days for correlation)
    const { data: incidentLogs, error: incidentError } = await supabase
      .from('incident_logs')
      .select('*')
      .eq('family_id', family_id)
      .eq('student_id', student_id)
      .gte('incident_date', sixtyDaysAgoStr)
      .order('incident_date', { ascending: false });

    if (incidentError) throw incidentError;

    // Calculate sleep-behavior correlation
    let sleepBehaviorCorrelation = null;
    if (sleepRecords && sleepRecords.length > 0 && incidentLogs && incidentLogs.length > 0) {
      const sleepDateMap = new Map(
        sleepRecords.map(s => [s.sleep_date, s.total_sleep_hours || 0])
      );
      
      let incidentsAfterPoorSleep = 0;
      let incidentsAfterGoodSleep = 0;
      
      incidentLogs.forEach(incident => {
        const prevDaySleep = sleepDateMap.get(
          new Date(new Date(incident.incident_date).getTime() - 86400000)
            .toISOString().split('T')[0]
        );
        
        if (prevDaySleep !== undefined) {
          if (prevDaySleep < 7) incidentsAfterPoorSleep++;
          else incidentsAfterGoodSleep++;
        }
      });
      
      const totalCorrelated = incidentsAfterPoorSleep + incidentsAfterGoodSleep;
      if (totalCorrelated > 0) {
        sleepBehaviorCorrelation = {
          poorSleepIncidents: incidentsAfterPoorSleep,
          goodSleepIncidents: incidentsAfterGoodSleep,
          poorSleepPercentage: Math.round((incidentsAfterPoorSleep / totalCorrelated) * 100),
          totalNights: totalCorrelated
        };
      }
    }

    // Prepare data summaries
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

    const educatorSummary = educatorLogs && educatorLogs.length > 0
      ? `Educator Session Logs (${educatorLogs.length} sessions):\n${educatorLogs.slice(0, 10).map(log => 
          `- ${log.log_date}: ${log.log_type} - ${log.session_duration_minutes || 'N/A'} min, Engagement: ${log.engagement_level || 'N/A'}, ${log.progress_notes?.substring(0, 100) || 'No notes'}`
        ).join('\n')}`
      : 'No educator session logs available.';

    const sleepSummary = sleepRecords && sleepRecords.length > 0
      ? `Sleep Records (${sleepRecords.length} nights):\nAverage: ${(sleepRecords.reduce((sum, s) => sum + (s.total_sleep_hours || 0), 0) / sleepRecords.length).toFixed(1)} hours/night`
      : 'No sleep data available.';

    const sleepCorrelationText = sleepBehaviorCorrelation
      ? `Sleep-Behavior Correlation: ${sleepBehaviorCorrelation.poorSleepPercentage}% of incidents occurred after poor sleep (<7 hrs), n=${sleepBehaviorCorrelation.totalNights} nights with data.`
      : 'Insufficient data for sleep-behavior correlation.';

    // Select prompt template based on focus area
    let promptTemplate: string;
    switch (focusArea) {
      case 'behavioral':
        promptTemplate = BEHAVIORAL_PROMPT(studentName, studentAge, familyName);
        break;
      case 'skill':
        promptTemplate = SKILL_PROMPT(studentName, studentAge, familyName);
        break;
      case 'intervention':
        promptTemplate = INTERVENTION_PROMPT(studentName, studentAge, familyName);
        break;
      case 'sensory':
        promptTemplate = SENSORY_PROMPT(studentName, studentAge, familyName);
        break;
      case 'environmental':
        promptTemplate = ENVIRONMENTAL_PROMPT(studentName, studentAge, familyName);
        break;
      default:
        promptTemplate = COMPREHENSIVE_PROMPT(studentName, studentAge, familyName);
    }

    // Build context data object
    const contextData = {
      documentCount: documents.length,
      documentTypes: [...new Set(documents.map(d => d.category))].join(', '),
      dateRange: `${documents[documents.length - 1]?.document_date} to ${documents[0]?.document_date}`,
      documentList,
      metricsSummary,
      insightsSummary,
      progressRecords: progress?.length || 0,
      educatorSummary,
      sleepSummary,
      sleepCorrelationText,
      incidentCount: incidentLogs?.length || 0,
      reportDate: new Date().toISOString().split('T')[0]
    };

    // Replace placeholders in prompt template
    let finalPrompt = promptTemplate;
    Object.entries(contextData).forEach(([key, value]) => {
      finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    });

    // Call Lovable AI with Gemini 2.5 Pro
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: 'You are a Board Certified Behavior Analyst (BCBA) and special education consultant with expertise in autism spectrum disorder, ADHD, and evidence-based interventions. You write clinical reports with professional ABA terminology, cite specific data points, and provide actionable recommendations.' },
          { role: 'user', content: finalPrompt }
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
        focus_area: focusArea,
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