import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare content preview (first 500 words)
    const contentPreview = content 
      ? content.split(/\s+/).slice(0, 500).join(' ')
      : '';

    const systemPrompt = `You are an SEO expert. Generate SEO metadata that will score 90+/100 on SEO analyzers.

CRITICAL RULES - MUST FOLLOW EXACTLY:
1. Focus keyword: Extract the MOST relevant 2-4 word phrase from the title. Must be complete, never truncated.
   - Example: "grounding techniques neurodivergent" NOT "grounding techniques neur"

2. Meta title: Create a compelling title that is EXACTLY 55-60 characters (including spaces).
   - MUST include focus keyword at the beginning
   - MUST be under 60 characters total
   - Count every character carefully
   - Must be engaging and click-worthy

3. Meta description: Write a persuasive description that is EXACTLY 150-155 characters (including spaces).
   - MUST include focus keyword naturally
   - MUST be under 155 characters total
   - Count every character carefully
   - Include a clear call-to-action
   - Must be compelling and actionable

CHARACTER COUNT IS CRITICAL. If your response exceeds limits, regenerate shorter versions.

Respond ONLY with valid JSON in this exact format:
{
  "focusKeyword": "complete keyword phrase",
  "metaTitle": "Exact 55-60 char title with keyword",
  "metaDescription": "Exact 150-155 char description with keyword and CTA"
}`;

    const userPrompt = `Title: ${title}${contentPreview ? `\n\nContent Preview: ${contentPreview}` : ''}`;

    console.log('Calling Lovable AI for SEO generation...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate SEO metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No AI response received');
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let seoData;
    try {
      // Extract JSON from response (handle markdown code blocks if present)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
      seoData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the response structure
    if (!seoData.focusKeyword || !seoData.metaTitle || !seoData.metaDescription) {
      console.error('Invalid SEO data structure:', seoData);
      return new Response(
        JSON.stringify({ error: 'Invalid SEO data structure' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate character lengths
    const titleLength = seoData.metaTitle.length;
    const descLength = seoData.metaDescription.length;
    
    console.log('SEO Validation:', {
      focusKeyword: seoData.focusKeyword,
      titleLength,
      descLength,
      titleValid: titleLength <= 60,
      descValid: descLength <= 160
    });

    // Auto-truncate if needed (with ellipsis)
    if (titleLength > 60) {
      console.warn(`Meta title too long (${titleLength}), truncating`);
      seoData.metaTitle = seoData.metaTitle.substring(0, 57) + '...';
    }
    
    if (descLength > 160) {
      console.warn(`Meta description too long (${descLength}), truncating`);
      seoData.metaDescription = seoData.metaDescription.substring(0, 157) + '...';
    }

    console.log('Successfully generated SEO metadata');
    return new Response(
      JSON.stringify(seoData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-seo-metadata:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
