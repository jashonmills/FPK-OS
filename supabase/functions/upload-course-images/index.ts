import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Course image data (SVG images)
    const courseImages = {
      'learning-state-course.jpg': await generateCourseImage('Learning State', '#8B5CF6'),
      'el-spelling-course.jpg': await generateCourseImage('EL Spelling', '#EC4899'), 
      'algebra-pathfinder-course.jpg': await generateCourseImage('Algebra Pathfinder', '#F97316')
    };

    const results = [];

    for (const [filename, imageData] of Object.entries(courseImages)) {
      console.log(`Uploading ${filename}...`);
      
        const { data, error } = await supabase.storage
          .from('home-page')
          .upload(filename, imageData, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/svg+xml'
          });

      if (error) {
        console.error(`Error uploading ${filename}:`, error);
        results.push({ filename, success: false, error: error.message });
      } else {
        console.log(`Successfully uploaded ${filename}`);
        results.push({ filename, success: true, path: data.path });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Course images upload completed',
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload function error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateCourseImage(title: string, color: string): Promise<Uint8Array> {
  // Create an SVG image with gradient background and title
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad)" rx="8" />
    <rect x="20" y="20" width="360" height="260" fill="rgba(255,255,255,0.1)" rx="4" />
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">${title}</text>
    <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.8)">Course</text>
    <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)" />
    <circle cx="350" cy="250" r="15" fill="rgba(255,255,255,0.2)" />
  </svg>`;

  // Convert SVG to PNG using a simple approach
  // Note: This is a simplified conversion - in production you'd use proper image processing
  const encoder = new TextEncoder();
  const svgBytes = encoder.encode(svgContent);
  
  // For now, return the SVG as bytes (browsers can render SVG directly)
  return svgBytes;
}