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

    const systemPrompt = `You are an expert SEO specialist. Your goal: generate metadata that scores 75+/100.

SCORING BREAKDOWN (14 total checks, need 10+ to pass):
✓ Guaranteed passes (if you follow rules): 5 checks
- Keyword in title (use exact phrase from title)
- Keyword in meta description (put in first 15 words)
- Meta title length (50-58 chars)
- Meta description length (145-155 chars)
- Keyword density (ensure 0.5-2.5%)

CRITICAL RULES:
1. Focus Keyword: Extract THE MOST important 2-3 words from title
   - Must appear EXACTLY in the title
   - Choose words users would search for
   - Example: "AI in Education" NOT "AI in Education Revolutionary"

2. Meta Title (50-58 characters):
   - Start with focus keyword
   - Add value proposition
   - Must be 50-58 chars (count carefully!)
   - Example: "AI in Education: Transform Learning & Teaching Today"

3. Meta Description (145-155 characters):
   - First 15 words MUST include focus keyword
   - Highlight key benefit
   - Include action word
   - Must be 145-155 chars (count carefully!)
   - Example: "AI in Education is revolutionizing classrooms worldwide. Discover how teachers use artificial intelligence to personalize learning and boost student engagement."

VALIDATION CHECKLIST:
- [ ] Focus keyword is 2-3 words that appear in title exactly
- [ ] Meta title starts with focus keyword
- [ ] Meta title is 50-58 characters
- [ ] Meta description mentions focus keyword in first sentence
- [ ] Meta description is 145-155 characters
- [ ] Both are compelling and actionable

Respond with ONLY valid JSON (no markdown):
{
  "focusKeyword": "exact 2-3 words from title",
  "metaTitle": "50-58 char title with keyword first",
  "metaDescription": "145-155 char description with keyword in first 15 words"
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

    // Validate that focus keyword appears in the original title
    const keywordInTitle = title.toLowerCase().includes(seoData.focusKeyword.toLowerCase());
    if (!keywordInTitle) {
      console.warn(`Focus keyword "${seoData.focusKeyword}" not found in title "${title}"`);
    }

    // Validate character lengths
    const titleLength = seoData.metaTitle.length;
    const descLength = seoData.metaDescription.length;
    
    console.log('SEO Validation:', {
      focusKeyword: seoData.focusKeyword,
      keywordInTitle,
      titleLength,
      descLength,
      titleValid: titleLength >= 50 && titleLength <= 58,
      descValid: descLength >= 145 && descLength <= 155,
      titleInRange: titleLength >= 30 && titleLength <= 60,
      descInRange: descLength >= 120 && descLength <= 160
    });

    // Strict length validation for optimal scoring
    if (titleLength < 50 || titleLength > 58) {
      console.warn(`Meta title length ${titleLength} is outside optimal range (50-58 chars)`);
    }
    
    if (descLength < 145 || descLength > 155) {
      console.warn(`Meta description length ${descLength} is outside optimal range (145-155 chars)`);
    }

    // Hard truncate only if exceeding absolute maximums (shouldn't happen with good prompts)
    if (titleLength > 60) {
      console.warn(`Meta title too long (${titleLength}), truncating to 60 chars`);
      seoData.metaTitle = seoData.metaTitle.substring(0, 57) + '...';
    }
    
    if (descLength > 160) {
      console.warn(`Meta description too long (${descLength}), truncating to 160 chars`);
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
