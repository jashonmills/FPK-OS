import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { unzip } from 'https://deno.land/x/zip@v1.2.5/mod.ts';

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
    const zipUint8Array = new Uint8Array(zipArrayBuffer);
    
    // Extract zip contents
    console.log('Extracting zip contents...');
    const extractedFiles = await unzip(zipUint8Array);
    
    // Process the extracted files to understand structure
    const fileStructure: Record<string, any> = {};
    const lessonComponents: Record<string, string> = {};
    
    for (const [filePath, fileData] of Object.entries(extractedFiles)) {
      console.log('Processing file:', filePath);
      
      // Decode file content if it's text
      if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
        const textContent = new TextDecoder().decode(fileData);
        lessonComponents[filePath] = textContent;
        
        // Store basic info about the file
        fileStructure[filePath] = {
          type: 'component',
          size: fileData.length,
          hasContent: textContent.length > 0
        };
      } else {
        // For non-text files, just store metadata
        fileStructure[filePath] = {
          type: 'binary',
          size: fileData.length
        };
      }
    }

    const response = {
      success: true,
      message: 'Zip file extracted successfully',
      zipSize: zipData.size,
      fileCount: Object.keys(extractedFiles).length,
      fileStructure,
      lessonComponents,
      extractedFiles: Object.keys(extractedFiles)
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