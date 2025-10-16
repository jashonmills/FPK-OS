import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { topic, categorySlug, authorId, count = 1 } = await req.json();

    console.log(`Generating ${count} articles for topic: ${topic}, category: ${categorySlug}`);

    // Get category
    const { data: category, error: catError } = await supabase
      .from('article_categories')
      .select('id, name')
      .eq('slug', categorySlug)
      .single();

    if (catError) throw new Error(`Category not found: ${catError.message}`);

    // Query knowledge base for relevant documents
    const { data: kbDocs, error: kbError } = await supabase
      .from('knowledge_base')
      .select('source_name, content, url, metadata')
      .or(`source_name.ilike.%${topic}%,content.ilike.%${topic}%`)
      .limit(10);

    if (kbError) throw new Error(`KB query failed: ${kbError.message}`);
    if (!kbDocs || kbDocs.length === 0) {
      throw new Error('No relevant knowledge base content found');
    }

    console.log(`Found ${kbDocs.length} relevant KB documents`);

    const articlesGenerated = [];

    for (let i = 0; i < count; i++) {
      // Prepare context for AI
      const kbContext = kbDocs.map((doc, idx) => 
        `Source ${idx + 1} (${doc.source_name}):\n${doc.content.substring(0, 2000)}`
      ).join('\n\n---\n\n');

      const systemPrompt = `You are an expert content writer specializing in neurodiversity, special education, IEP planning, autism, and ADHD support. 

Your task is to synthesize the provided knowledge base content into a comprehensive, SEO-optimized article for parents and educators.

Requirements:
- Write in a warm, empathetic, professional tone
- Use evidence-based information from the sources
- Include practical action steps
- Make it accessible for parents without special education backgrounds
- Optimize for SEO with natural keyword usage
- Structure with clear headings (H2, H3)
- Include specific examples and scenarios
- Cite key sources inline when referencing specific guidance

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "Engaging, SEO-optimized title under 60 characters",
  "slug": "url-friendly-slug",
  "meta_description": "Compelling description under 160 characters with primary keyword",
  "excerpt": "2-3 sentence summary of the article",
  "content": "Full article content in markdown format with ## headings, bullet points, etc.",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "reading_time_minutes": estimated_reading_time_as_number
}`;

      const userPrompt = `Topic: ${topic}
Category: ${category.name}

Based on the following knowledge base content, write a comprehensive guide article:

${kbContext}

Focus on providing actionable insights that parents and educators can implement immediately.`;

      // Call Lovable AI
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-pro',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        throw new Error(`AI API error: ${errorText}`);
      }

      const aiData = await aiResponse.json();
      const articleContent = aiData.choices[0].message.content;

      // Parse JSON response
      let articleData;
      try {
        // Clean the response - remove markdown code blocks if present
        const cleanedContent = articleContent.replace(/```json\n?|\n?```/g, '').trim();
        articleData = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', articleContent);
        throw new Error(`Failed to parse article JSON: ${parseError.message}`);
      }

      // Insert article
      const { data: article, error: insertError } = await supabase
        .from('public_articles')
        .insert({
          title: articleData.title,
          slug: articleData.slug + (i > 0 ? `-${i + 1}` : ''),
          content: articleData.content,
          excerpt: articleData.excerpt,
          meta_description: articleData.meta_description,
          category_id: category.id,
          author_id: authorId,
          published: true,
          published_at: new Date().toISOString(),
          reading_time_minutes: articleData.reading_time_minutes,
          keywords: articleData.keywords,
          metadata: {
            generated_from_kb: true,
            sources: kbDocs.slice(0, 3).map(d => ({ name: d.source_name, url: d.url })),
            topic: topic
          }
        })
        .select()
        .single();

      if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

      articlesGenerated.push(article);
      console.log(`Generated article: ${article.title}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        articles: articlesGenerated,
        count: articlesGenerated.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating articles:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
