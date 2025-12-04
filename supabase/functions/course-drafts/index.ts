import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      throw new Error('Missing authorization header');
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const draftId = pathSegments[pathSegments.length - 1];

    if (req.method === 'GET' && draftId && draftId !== 'course-drafts') {
      // Get specific draft
      const { data: draft, error } = await supabaseClient
        .from('course_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(draft), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      // Create new draft
      const requestData = await req.json();
      
      const { data: draft, error } = await supabaseClient
        .from('course_drafts')
        .insert({
          org_id: requestData.orgId,
          source: requestData.source || 'manual',
          source_package_id: requestData.sourcePackageId,
          title: requestData.title,
          description: requestData.description,
          level: requestData.level,
          duration_minutes: requestData.durationMinutes,
          framework: requestData.framework || 'interactive_micro_learning',
          structure: requestData.structure || { modules: [] },
          status: requestData.status || 'ready',
          created_by: user.id,
          updated_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(draft), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PATCH' && draftId && draftId !== 'course-drafts') {
      // Update draft
      const requestData = await req.json();
      
      const { data: draft, error } = await supabaseClient
        .from('course_drafts')
        .update({
          title: requestData.title,
          description: requestData.description,
          level: requestData.level,
          duration_minutes: requestData.durationMinutes,
          structure: requestData.structure,
          status: requestData.status,
          validation: requestData.validation,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', draftId)
        .eq('created_by', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(draft), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'DELETE' && draftId && draftId !== 'course-drafts') {
      // Delete draft
      const { error } = await supabaseClient
        .from('course_drafts')
        .delete()
        .eq('id', draftId)
        .eq('created_by', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Course drafts error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});