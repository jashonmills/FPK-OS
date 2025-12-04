import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { familyId, studentId } = await req.json();

    if (!familyId) {
      throw new Error('familyId is required');
    }

    console.log(`Starting re-analysis for family ${familyId}`);

    // Fetch all documents eligible for re-analysis (completed or failed)
    const { data: documents, error: fetchError } = await supabase
      .from('bedrock_documents')
      .select('id, file_name, file_path, status')
      .eq('family_id', familyId)
      .in('status', ['completed', 'failed'])
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching documents:', fetchError);
      throw fetchError;
    }

    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No documents to re-analyze',
          total: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${documents.length} documents to re-analyze`);

    // Update all documents to 'analyzing' status immediately
    const documentIds = documents.map(d => d.id);
    const { error: updateError } = await supabase
      .from('bedrock_documents')
      .update({ status: 'analyzing', analyzed_at: null, error_message: null })
      .in('id', documentIds);

    if (updateError) {
      console.error('Error updating document statuses:', updateError);
      throw updateError;
    }

    // Background task to analyze all documents
    const analyzeDocuments = async () => {
      console.log(`Background task: Analyzing ${documents.length} documents`);
      
      for (const doc of documents) {
        try {
          console.log(`Invoking bedrock-analyze for ${doc.file_name}`);
          
          const { error: analyzeError } = await supabase.functions.invoke('bedrock-analyze', {
            headers: {
              Authorization: authHeader  // Pass user's auth token
            },
            body: {
              document_id: doc.id,     // Use snake_case
              family_id: familyId,
              student_id: studentId,
            }
          });

          if (analyzeError) {
            console.error(`Error analyzing ${doc.file_name}:`, analyzeError);
            // Update document with error
            await supabase
              .from('bedrock_documents')
              .update({ 
                status: 'failed', 
                error_message: analyzeError.message || 'Analysis failed' 
              })
              .eq('id', doc.id);
          } else {
            console.log(`Successfully triggered analysis for ${doc.file_name}`);
          }
        } catch (error) {
          console.error(`Exception analyzing ${doc.file_name}:`, error);
          await supabase
            .from('bedrock_documents')
            .update({ 
              status: 'failed', 
              error_message: error instanceof Error ? error.message : 'Analysis failed' 
            })
            .eq('id', doc.id);
        }

        // Small delay between analyses to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Background task: All documents processed');
    };

    // Start background task without awaiting
    // @ts-ignore - EdgeRuntime is available in Deno Deploy
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-ignore
      EdgeRuntime.waitUntil(analyzeDocuments());
    } else {
      // Fallback for local development
      analyzeDocuments().catch(err => console.error('Background task error:', err));
    }

    // Return immediate response
    const estimatedMinutes = Math.ceil(documents.length * 2); // 2 minutes per document estimate
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Re-analysis started for ${documents.length} documents`,
        total: documents.length,
        estimatedMinutes,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Re-analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
