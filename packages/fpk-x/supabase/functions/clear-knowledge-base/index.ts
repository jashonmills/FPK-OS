import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!isAdmin) {
      throw new Error('Must be admin to clear knowledge base');
    }

    console.log('🗑️ Starting knowledge base deletion...');

    // Delete embeddings first (due to foreign key constraints)
    const { error: chunksError } = await supabase
      .from('kb_chunks')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (chunksError) {
      console.error('Error deleting kb_chunks:', chunksError);
      throw chunksError;
    }

    // Delete knowledge base entries
    const { error: kbError } = await supabase
      .from('knowledge_base')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (kbError) {
      console.error('Error deleting knowledge_base:', kbError);
      throw kbError;
    }

    console.log('✅ Knowledge base cleared successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Knowledge base cleared successfully'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in clear-knowledge-base:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
