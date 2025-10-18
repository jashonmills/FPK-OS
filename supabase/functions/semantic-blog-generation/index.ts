import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  topic: string;
  category_id: string;
  personal_insights?: string;
  include_kb: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { topic, category_id, personal_insights, include_kb } = await req.json() as RequestBody;

    console.log('Generating blog with semantic search:', { topic, include_kb });

    let context = '';
    let sources: any[] = [];

    // If knowledge base integration is enabled, perform semantic search
    if (include_kb) {
      // Generate embedding for the topic using OpenAI
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: topic,
          model: 'text-embedding-3-small',
        }),
      });

      if (!embeddingResponse.ok) {
        const errorText = await embeddingResponse.text();
        console.error('Embedding API error:', errorText);
        throw new Error(`Failed to generate topic embedding: ${embeddingResponse.status} ${errorText}`);
      }

      const embeddingData = await embeddingResponse.json();
      const queryEmbedding = embeddingData.data[0].embedding;

      // Perform vector similarity search
      const { data: relevantChunks, error: searchError } = await supabase.rpc('search_kb_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 20,
      });

      if (searchError) {
        console.error('Error searching embeddings:', searchError);
      } else if (relevantChunks && relevantChunks.length > 0) {
        // Get unique document IDs
        const documentIds = [...new Set(relevantChunks.map((c: any) => c.document_id))];

        // Fetch full document details
        const { data: documents, error: docsError } = await supabase
          .from('kb_documents')
          .select('*')
          .in('id', documentIds);

        if (!docsError && documents) {
          sources = documents;
          
          // Build context from documents
          context = documents
            .map((doc: any) => {
              const relevantChunk = relevantChunks.find((c: any) => c.document_id === doc.id);
              return `
Source: ${doc.title} (${doc.source_name})
Type: ${doc.document_type}
URL: ${doc.source_url || 'N/A'}
Published: ${doc.publication_date || 'N/A'}
Focus Areas: ${doc.focus_areas?.join(', ') || 'N/A'}

Content Excerpt:
${relevantChunk?.chunk_text || doc.content?.substring(0, 2000)}
---`;
            })
            .join('\n\n');

          console.log(`Found ${documents.length} relevant documents from knowledge base`);
        }
      }
    }

    // Generate blog post using Lovable AI
    const systemPrompt = `You are an expert neurodiversity content writer specializing in autism, ADHD, and learning differences. 

Your task is to generate a comprehensive, evidence-based blog post that is:
- Written in an accessible, empathetic tone
- Backed by research and credible sources
- Includes practical strategies and real-world examples
- Optimized for SEO, GEO (Generative Engine Optimization), and AIO (AI-Optimized Content)
- Structured with proper H2 and H3 headings
- 1500-2500 words in length

For SEO/GEO/AIO optimization, ensure:
1. Clear section summaries at the beginning of major sections
2. Bullet points and numbered lists for easy scanning
3. Key takeaways in a highlighted box
4. FAQ section at the end (3-5 questions)
5. Inline source citations [Source: Name]
6. Related terms and synonyms throughout

Return the response as a JSON object with:
{
  "title": "SEO-optimized title (50-60 chars)",
  "meta_title": "Meta title for search engines (50-60 chars)",
  "meta_description": "Compelling meta description (150-160 chars)",
  "excerpt": "Engaging 2-sentence summary",
  "content": "Full blog post in markdown format with H2/H3 headings",
  "focus_keyword": "Primary keyword for SEO",
  "sources_cited": ["Source 1", "Source 2"]
}`;

    const userPrompt = `Topic: ${topic}
    
${personal_insights ? `Personal Insights from Author:\n${personal_insights}\n\n` : ''}

${context ? `Research Context from Knowledge Base:\n${context}\n\n` : ''}

Generate a complete, publication-ready blog post following the guidelines above.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`Failed to generate blog content: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    let rawContent = aiData.choices[0].message.content;
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      rawContent = jsonMatch[1];
    }
    
    const generatedContent = JSON.parse(rawContent);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create blog post draft
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: generatedContent.title,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        meta_title: generatedContent.meta_title,
        meta_description: generatedContent.meta_description,
        focus_keyword: generatedContent.focus_keyword,
        category_id,
        author_id: user.id,
        status: 'draft',
        published_at: null,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('Blog post created successfully:', newPost.id);

    return new Response(
      JSON.stringify({
        success: true,
        post: newPost,
        sources_used: sources.length,
        kb_integrated: include_kb && sources.length > 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in semantic-blog-generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
