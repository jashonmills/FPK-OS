import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  topic: string;
  categorySlug: string;
  authorId: string;
  count?: number;
  articleType?: 'pillar' | 'cluster' | 'faq';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { topic, categorySlug, authorId, count = 1, articleType = 'cluster' }: GenerateRequest = await req.json();

    console.log('Generating articles:', { topic, categorySlug, count, articleType });

    // Get the AI Assistant author if authorId not provided
    let finalAuthorId = authorId;
    if (!finalAuthorId) {
      const { data: aiAuthor } = await supabase
        .from('article_authors')
        .select('id')
        .eq('slug', 'fpx-ai-assistant')
        .single();
      
      if (aiAuthor) {
        finalAuthorId = aiAuthor.id;
      }
    }

    // Get category
    const { data: category, error: categoryError } = await supabase
      .from('article_categories')
      .select('id, name')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !category) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    // Query knowledge base for relevant content
    const { data: kbChunks, error: kbError } = await supabase
      .from('kb_chunks')
      .select('chunk_text, kb_id, knowledge_base(source_name)')
      .limit(50);

    if (kbError) {
      console.error('Error fetching KB chunks:', kbError);
    }

    const knowledgeContext = kbChunks
      ?.map((chunk: any) => `[${chunk.knowledge_base?.source_name}]: ${chunk.chunk_text}`)
      .join('\n\n')
      .slice(0, 20000) || 'No knowledge base content available.';

    console.log(`Retrieved ${kbChunks?.length || 0} knowledge base chunks`);

    const generatedArticles = [];

    for (let i = 0; i < count; i++) {
      let systemPrompt = '';
      let userPrompt = '';
      let targetWordCount = 0;

      if (articleType === 'pillar') {
        targetWordCount = 3000;
        systemPrompt = `You are an expert content writer specializing in neurodiversity, special education, and evidence-based practices. Create comprehensive, authoritative pillar pages that serve as ultimate resources.`;
        
        userPrompt = `Create a COMPREHENSIVE PILLAR PAGE about "${topic}" in the ${category.name} category.

KNOWLEDGE BASE CONTEXT:
${knowledgeContext}

REQUIREMENTS:
- Target length: 3,000+ words
- This must be the DEFINITIVE guide on this topic
- Include 8-12 major sections with H2 headings
- Each section should have 2-4 subsections with H3 headings
- Cite research and evidence from the knowledge base
- Include practical examples and case studies
- Add actionable takeaways in each section
- Write in markdown format with proper heading hierarchy
- Use bullet points and numbered lists where appropriate
- Be authoritative but accessible to parents and educators

STRUCTURE:
1. Introduction (300-400 words) - Hook + Overview
2. Background & Context (400-500 words)
3. Core Concepts (500-600 words per major concept, 3-4 concepts)
4. Evidence-Based Strategies (600-800 words)
5. Implementation Guide (500-600 words)
6. Common Challenges & Solutions (400-500 words)
7. Advanced Topics (400-500 words)
8. Resources & Next Steps (200-300 words)

Focus on depth, accuracy, and practical utility. This should be THE resource people bookmark and share.`;

      } else if (articleType === 'faq') {
        targetWordCount = 1500;
        systemPrompt = `You are an expert in neurodiversity and special education. Create comprehensive FAQ pages that answer common questions with detailed, evidence-based responses.`;
        
        userPrompt = `Create a COMPREHENSIVE FAQ PAGE about "${topic}" in the ${category.name} category.

KNOWLEDGE BASE CONTEXT:
${knowledgeContext}

REQUIREMENTS:
- Create 10-15 frequently asked questions and answers
- Each answer should be 100-150 words
- Questions should progress from basic to advanced
- Cite research and evidence where applicable
- Format in markdown with H2 for questions and paragraphs for answers
- Include practical examples
- Address common misconceptions
- Link concepts to broader topics

QUESTION TYPES TO COVER:
1. Definition/What is... (2-3 questions)
2. Why/How does... (2-3 questions)
3. What are the signs/symptoms... (1-2 questions)
4. How do I/parents/educators... (3-4 questions)
5. When should... (1-2 questions)
6. What research shows... (1-2 questions)
7. Common misconceptions (1-2 questions)

Make it scannable, searchable, and comprehensive.`;

      } else {
        // Cluster article (default)
        targetWordCount = 1000;
        systemPrompt = `You are an expert content writer specializing in neurodiversity, special education, and evidence-based practices. Create focused, actionable cluster articles that dive deep into specific subtopics.`;
        
        userPrompt = `Create a FOCUSED CLUSTER ARTICLE about "${topic}" in the ${category.name} category.

KNOWLEDGE BASE CONTEXT:
${knowledgeContext}

REQUIREMENTS:
- Target length: 800-1,200 words
- Focus on ONE specific aspect or strategy
- Include 4-6 H2 sections
- Cite research and evidence from the knowledge base
- Include 1-2 practical examples or case studies
- Provide 3-5 actionable takeaways
- Write in markdown format
- Be specific and actionable

STRUCTURE:
1. Introduction (100-150 words) - Problem statement + Preview
2. Background/Context (150-200 words)
3. Core Strategy/Concept (300-400 words)
4. Implementation Steps (200-300 words)
5. Real-World Example (150-200 words)
6. Common Pitfalls & Tips (100-150 words)
7. Key Takeaways (50-100 words)

Focus on depth in one area rather than breadth. Be practical and actionable.`;
      }

      // Call Lovable AI for content generation
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        
        // Provide user-friendly error messages
        if (response.status === 402) {
          throw new Error('Insufficient AI credits. Please add credits to your Lovable workspace to continue generating articles.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`AI generation failed: ${errorText || 'Unknown error'}`);
        }
      }

      const aiData = await response.json();
      const generatedContent = aiData.choices[0].message.content;

      console.log(`Generated ${articleType} article (${generatedContent.length} chars)`);

      // Extract title from content (first H1 or use topic)
      const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : topic;
      
      // Remove the title from content if it was extracted
      const contentWithoutTitle = titleMatch 
        ? generatedContent.replace(/^#\s+.+$/m, '').trim()
        : generatedContent;

      // Generate slug
      const baseSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      const slug = i > 0 ? `${baseSlug}-${i + 1}` : baseSlug;

      // Generate excerpt (first 160 chars of content)
      const excerptText = contentWithoutTitle
        .replace(/[#*_`\[\]]/g, '')
        .trim()
        .slice(0, 160)
        .replace(/\s+\S*$/, '...');

      // Generate meta description
      const metaDescription = excerptText;

      // Extract keywords from title and content
      const keywords = [
        ...title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4),
        topic.toLowerCase(),
        category.name.toLowerCase()
      ].slice(0, 10);

      // Calculate reading time
      const wordCount = contentWithoutTitle.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      // Insert article into database
      const { data: article, error: insertError } = await supabase
        .from('public_articles')
        .insert({
          title,
          slug,
          description: excerptText,
          excerpt: excerptText,
          content: contentWithoutTitle,
          category_id: category.id,
          author_id: finalAuthorId,
          meta_title: `${title} | ${category.name} Guide`,
          meta_description: metaDescription,
          keywords,
          reading_time_minutes: readingTime,
          is_published: false, // Draft by default
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting article:', insertError);
        throw insertError;
      }

      generatedArticles.push(article);
      console.log(`Created article: ${title} (${slug})`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: generatedArticles.length,
        articles: generatedArticles.map(a => ({ id: a.id, title: a.title, slug: a.slug })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-articles-from-kb:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
