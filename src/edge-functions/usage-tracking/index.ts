import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Edge function to handle usage tracking and quota management
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const user = userData.user;
    const { action, featureType, amount = 1, metadata = {} } = await req.json();

    if (action === 'check') {
      // Check usage quotas
      const { data: quotas, error: quotaError } = await supabaseClient
        .from('usage_quotas')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_end', new Date().toISOString())
        .single();

      if (quotaError && quotaError.code !== 'PGRST116') {
        console.error('Error fetching quotas:', quotaError);
        throw quotaError;
      }

      return new Response(JSON.stringify({ quotas }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'track') {
      // Track usage
      const { data: result, error: trackError } = await supabaseClient.rpc('track_usage', {
        p_user_id: user.id,
        p_feature_type: featureType,
        p_usage_amount: amount,
        p_metadata: metadata
      });

      if (trackError) {
        console.error('Error tracking usage:', trackError);
        throw trackError;
      }

      return new Response(JSON.stringify({ success: true, canUse: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'initialize') {
      // Initialize quotas for user
      const { tier = 'basic' } = await req.json();
      
      const { error: initError } = await supabaseClient.rpc('initialize_user_quotas', {
        p_user_id: user.id,
        p_subscription_tier: tier
      });

      if (initError) {
        console.error('Error initializing quotas:', initError);
        throw initError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Usage tracking error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});