import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { date_range = 'all_time' } = await req.json();

    console.log(`[ANALYTICS] Fetching dashboard data for user: ${user.id}, range: ${date_range}`);

    // Fetch all analytics data in parallel
    const [kpisResult, heatmapResult, dayResult, hourResult, topicsResult, masteryResult] =
      await Promise.all([
        supabaseClient.rpc('get_coach_dashboard_kpis', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
        supabaseClient.rpc('get_coach_activity_heatmap', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
        supabaseClient.rpc('get_coach_time_by_day', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
        supabaseClient.rpc('get_coach_time_by_hour', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
        supabaseClient.rpc('get_coach_topic_breakdown', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
        supabaseClient.rpc('get_coach_mastery_over_time', {
          p_user_id: user.id,
          p_date_range: date_range,
        }),
      ]);

    // Check for errors
    if (kpisResult.error) throw kpisResult.error;
    if (heatmapResult.error) throw heatmapResult.error;
    if (dayResult.error) throw dayResult.error;
    if (hourResult.error) throw hourResult.error;
    if (topicsResult.error) throw topicsResult.error;
    if (masteryResult.error) throw masteryResult.error;

    const dashboardData = {
      kpis: kpisResult.data,
      activity_heatmap: heatmapResult.data || [],
      time_by_day: dayResult.data || [],
      time_by_hour: hourResult.data || [],
      topic_breakdown: topicsResult.data || [],
      mastery_over_time: masteryResult.data || [],
    };

    console.log('[ANALYTICS] Dashboard data fetched successfully');

    return new Response(JSON.stringify(dashboardData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[ANALYTICS] Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch analytics dashboard',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
