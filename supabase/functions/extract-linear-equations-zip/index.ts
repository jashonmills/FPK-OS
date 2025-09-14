import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting zip extraction process...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download the zip file from storage
    const { data: zipData, error: downloadError } = await supabase.storage
      .from('course-files')
      .download('interactive_linear_equations_course_clean.zip');

    if (downloadError) {
      console.error('Error downloading zip:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download zip file', details: downloadError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Successfully downloaded zip file, size:', zipData.size);

    // Convert blob to array buffer for zip processing
    const zipArrayBuffer = await zipData.arrayBuffer();
    
    // For now, let's return the zip file info and structure
    // We'll examine the contents in the frontend and then create the components
    const response = {
      success: true,
      message: 'Zip file downloaded successfully',
      zipSize: zipData.size,
      zipType: zipData.type,
      // We need to examine the zip contents to understand the structure
      nextSteps: 'Ready to extract and examine zip contents'
    };

    console.log('Extraction process completed:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Extraction failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to extract zip file', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});