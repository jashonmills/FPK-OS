import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OUTLINE_SYSTEM_PROMPT = `You are an expert educational content strategist specializing in special education, neurodiversity, and accessible learning. Your task is to create structured, SEO-optimized blog post outlines based on authoritative research.

Key Principles:
- Focus on actionable, practical information
- Use empathetic, strength-based language
- Structure for readability (short paragraphs, clear hierarchy)
- Integrate SEO keyword naturally
- Base all content on provided research sources`;

const DRAFT_SYSTEM_PROMPT = `You are an expert content writer for FPK University, an educational platform focused on special education, neurodiversity, and accessible learning. You write in a warm, evidence-based, and empowering tone that resonates with parents, educators, and therapists.

Writing Guidelines:
- Tone: Empathetic, authoritative, hopeful, conversational
- Style: Clear, accessible language (8th-9th grade reading level)
- Structure: Short paragraphs (3-4 sentences), frequent subheadings
- Evidence: Cite research naturally, no formal citations needed
- SEO: Natural keyword integration, no keyword stuffing
- Format: Full Markdown with proper heading hierarchy (H2, H3)
- Length: Comprehensive but not excessive (1500-2500 words)`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { mode, topic, keyword, category_id, source_urls, outline_json, generation_history_id } = await req.json();

    if (mode === 'outline') {
      return await generateOutline(supabaseClient, user.id, topic, keyword, category_id, source_urls);
    } else if (mode === 'draft') {
      return await generateDraft(supabaseClient, user.id, topic, keyword, outline_json, source_urls, generation_history_id);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid mode' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateOutline(supabaseClient: any, userId: string, topic: string, keyword: string, categoryId: string, sourceUrls: string[]) {
  const startTime = Date.now();
  
  // Create history record
  const { data: historyRecord, error: historyError } = await supabaseClient
    .from('ai_generation_history')
    .insert({
      user_id: userId,
      generation_mode: 'outline',
      topic,
      focus_keyword: keyword,
      category_id: categoryId,
      sources_used: sourceUrls,
      status: 'in_progress'
    })
    .select()
    .single();

  if (historyError) {
    throw new Error(`Failed to create history record: ${historyError.message}`);
  }

  try {
    // Scrape sources
    const researchContext = await scrapeAllSources(sourceUrls);
    
    // Build prompt
    const userPrompt = `
Topic: ${topic}
SEO Keyword: ${keyword}
Target Audience: Parents, educators, therapists working with neurodivergent learners

Research Sources Summary:
${researchContext.substring(0, 15000)} // Limit to ~15k chars

Create a detailed blog post outline in JSON format with:
1. An engaging, SEO-optimized title (under 60 characters)
2. Meta title (optimized for search, under 60 characters)
3. Meta description (compelling, includes keyword, under 160 characters)
4. 4-6 main H2 sections
5. 2-4 H3 subsections under each H2
6. Key points to cover in each subsection
7. A conclusion section

Ensure the outline:
- Naturally incorporates "${keyword}" and related terms
- Follows logical information architecture
- Balances practical tips with evidence-based insights
- Addresses common questions and pain points
- Includes a clear call-to-action in conclusion

Return ONLY valid JSON matching this structure:
{
  "title": "string",
  "meta_title": "string",
  "meta_description": "string",
  "sections": [
    {
      "heading": "string",
      "subsections": [
        { "heading": "string", "key_points": ["string"] }
      ]
    }
  ],
  "conclusion": "string"
}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: OUTLINE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const outlineText = aiData.choices[0].message.content;
    
    // Parse JSON from response (handle markdown code blocks)
    let outlineJson;
    try {
      const jsonMatch = outlineText.match(/```json\n([\s\S]*?)\n```/) || outlineText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : outlineText;
      outlineJson = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    // Update history
    const duration = Date.now() - startTime;
    await supabaseClient
      .from('ai_generation_history')
      .update({
        status: 'completed',
        outline_json: outlineJson,
        completed_at: new Date().toISOString(),
        total_duration_ms: duration
      })
      .eq('id', historyRecord.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        outline: outlineJson,
        generation_history_id: historyRecord.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    await supabaseClient
      .from('ai_generation_history')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', historyRecord.id);
    throw error;
  }
}

async function generateDraft(supabaseClient: any, userId: string, topic: string, keyword: string, outlineJson: any, sourceUrls: string[], generationHistoryId: string) {
  const startTime = Date.now();

  try {
    // Scrape sources
    const researchContext = await scrapeAllSources(sourceUrls);
    
    // Build prompt
    const userPrompt = `
Write a complete blog post following this approved outline:

${JSON.stringify(outlineJson, null, 2)}

SEO Keyword: ${keyword}

Research Context (use ONLY this information):
${researchContext.substring(0, 20000)} // Limit to ~20k chars

Requirements:
1. Write the COMPLETE blog post in full Markdown format
2. YOU MUST complete the ENTIRE article including ALL sections from the outline
3. DO NOT stop mid-sentence, mid-paragraph, or mid-section under ANY circumstances
4. The article MUST end with a proper conclusion section
5. After the conclusion, you MUST include the META_TITLE and META_DESCRIPTION lines
6. Use proper heading hierarchy (## for H2, ### for H3)
7. Naturally integrate the keyword "${keyword}" and related terms (aim for 1-2% density)
8. Include specific, actionable advice
9. Add transition sentences between sections
10. Write an engaging introduction that hooks the reader
11. Create a conclusion with a clear call-to-action
12. Use bullet points and numbered lists where appropriate
13. Add emphasis with **bold** for key terms (sparingly)
14. Maintain empathetic, strength-based language throughout

Do NOT include:
- Formal citations or references section
- Generic filler content
- Information not supported by the research context
- More than 3 levels of headings

Start your response with the blog post content in Markdown. After the full post, on separate lines, provide:
META_TITLE: [optimized title under 60 characters]
META_DESCRIPTION: [compelling description under 160 characters including keyword]`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: DRAFT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 32000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const fullResponse = aiData.choices[0].message.content;
    
    console.log('AI response finish reason:', aiData.choices[0].finish_reason);
    
    // Check if response was truncated
    if (aiData.choices[0].finish_reason === 'length') {
      console.warn('WARNING: AI response was truncated due to length limit');
      throw new Error('Blog post generation was incomplete. Please try again or reduce the outline complexity.');
    }
    
    // Validate completion
    const hasMetaTitle = fullResponse.includes('META_TITLE:');
    const hasMetaDescription = fullResponse.includes('META_DESCRIPTION:');
    const wordCount = fullResponse.split(/\s+/).length;
    
    console.log(`Generated blog post: ${wordCount} words, has meta: ${hasMetaTitle && hasMetaDescription}`);
    
    if (!hasMetaTitle || !hasMetaDescription) {
      console.error('Incomplete response - missing meta tags');
      throw new Error('Blog post generation incomplete - missing meta tags. Please try again.');
    }
    
    if (wordCount < 1000) {
      console.error(`Response too short: ${wordCount} words`);
      throw new Error(`Blog post generation incomplete - only ${wordCount} words generated. Please try again.`);
    }
    
    // Parse response
    const metaTitleMatch = fullResponse.match(/META_TITLE:\s*(.+)/);
    const metaDescMatch = fullResponse.match(/META_DESCRIPTION:\s*(.+)/);
    
    const content = fullResponse.split(/META_TITLE:/)[0].trim();
    const metaTitle = metaTitleMatch ? metaTitleMatch[1].trim().substring(0, 60) : outlineJson.meta_title;
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim().substring(0, 160) : outlineJson.meta_description;

    // Generate slug
    const baseSlug = outlineJson.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // Check for unique slug
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await supabaseClient
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate metrics
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    // Create blog post
    const { data: post, error: postError } = await supabaseClient
      .from('blog_posts')
      .insert({
        title: outlineJson.title,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        content,
        excerpt: metaDescription,
        focus_keyword: keyword,
        author_id: userId,
        status: 'draft',
        word_count: wordCount,
        read_time_minutes: readTime,
        seo_score: 70, // Initial estimate
        created_by: userId
      })
      .select()
      .single();

    if (postError) {
      throw new Error(`Failed to create blog post: ${postError.message}`);
    }

    // Update history
    const duration = Date.now() - startTime;
    await supabaseClient
      .from('ai_generation_history')
      .update({
        status: 'completed',
        post_id: post.id,
        completed_at: new Date().toISOString(),
        total_duration_ms: duration
      })
      .eq('id', generationHistoryId);

    return new Response(
      JSON.stringify({ 
        success: true,
        slug: post.slug,
        post_id: post.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    if (generationHistoryId) {
      await supabaseClient
        .from('ai_generation_history')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', generationHistoryId);
    }
    throw error;
  }
}

async function scrapeAllSources(sourceUrls: string[]): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  const results = await Promise.allSettled(
    sourceUrls.map(async (url) => {
      const response = await fetch(`${supabaseUrl}/functions/v1/scrape-and-cache-source`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ source_url: url })
      });
      
      if (!response.ok) {
        console.warn(`Failed to scrape ${url}: ${response.status}`);
        return '';
      }
      
      const data = await response.json();
      return data.content || '';
    })
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => (r as any).value)
    .join('\n\n---\n\n')
    .substring(0, 25000); // Limit total context
}
