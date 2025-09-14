import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { visualType, lessonId, context } = await req.json();
    console.log('Generating visual aid:', { visualType, lessonId, context });

    // Define visual aid prompts based on type and lesson content
    const visualPrompts = {
      'balance-scale': `Create a clean, educational illustration of a mathematical balance scale showing algebraic equation equality. The scale has ${context || 'x + 3'} on the left side and ${context?.split('=')[1] || '8'} on the right side. Modern flat design with blue and orange colors. Mathematical symbols are clear and readable. Background is white. Ultra high resolution.`,
      
      'step-by-step': `Create an educational diagram showing step-by-step algebraic equation solving for ${context || 'x + 3 = 8'}. Show 3 steps with arrows between them: original equation, isolation step, and final answer. Clean mathematical typography with highlighting for each step. Blue accent colors on white background. Professional textbook style. Ultra high resolution.`,
      
      'number-line': `Create a mathematical number line visualization from -10 to +10 with clear integer markings. Highlight the solution ${context || '5'} with a bright blue circle. Include arrows showing direction and movement. Clean, minimalist educational design with dark text on light background. Grid lines visible. Ultra high resolution.`,
      
      'real-world': `Create an illustration showing practical application of linear equations in ${context || 'everyday life'}. Show a simple scenario like calculating costs, distances, or time. Include mathematical notation overlay. Friendly, approachable cartoon style with educational elements. Bright, engaging colors. Ultra high resolution.`,
      
      'concept-overview': `Create a comprehensive visual overview of linear equations showing key concepts: variables, constants, operations, and equality. Include visual metaphors like balance scales, puzzle pieces, or building blocks. Educational infographic style with clear labels and arrows. Professional blue and green color scheme. Ultra high resolution.`,
      
      'algebraic-tiles': `Create educational algebra tiles visualization showing mathematical expressions using colored rectangular blocks. Show positive and negative tiles in different colors (blue for positive, red for negative). Demonstrate ${context || 'x + 3'} using visual blocks. Clean, geometric educational design. Ultra high resolution.`
    };

    const prompt = visualPrompts[visualType as keyof typeof visualPrompts] || visualPrompts['concept-overview'];

    console.log('Using prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image generated successfully');

    // Convert base64 to blob for storage
    const base64Data = data.data[0].b64_json;
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `course-visual-${visualType}-${lessonId || 'general'}-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('course-images')
      .getPublicUrl(fileName);

    console.log('Visual aid uploaded successfully:', urlData.publicUrl);

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl: urlData.publicUrl,
      fileName: fileName,
      visualType: visualType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-course-visuals function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});