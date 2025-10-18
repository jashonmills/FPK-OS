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

    // Generate blog post using Lovable AI with structured outputs
    const systemPrompt = `You are an expert neurodiversity content writer specializing in autism, ADHD, and learning differences. 

Generate a comprehensive, evidence-based blog post that is:
- Written in an accessible, empathetic tone
- Backed by research and credible sources
- Includes practical strategies and real-world examples
- Optimized for SEO with proper structure
- 1500-2500 words in length

Include:
1. Clear H2 and H3 headings in the content
2. Bullet points and numbered lists
3. A Key Takeaways section
4. An FAQ section at the end (3-5 questions)
5. Inline source citations like [Source: Name]`;

    const userPrompt = `Topic: ${topic}
    
${personal_insights ? `Personal Insights from Author:\n${personal_insights}\n\n` : ''}

${context ? `Research Context from Knowledge Base:\n${context}\n\n` : ''}

Generate a complete, publication-ready blog post.`;

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
        temperature: 0.7,
        max_tokens: 3500,
        tools: [{
          type: 'function',
          function: {
            name: 'create_blog_post',
            description: 'Create a structured blog post with all required fields',
            parameters: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'SEO-optimized title (50-60 characters)'
                },
                meta_title: {
                  type: 'string',
                  description: 'Meta title for search engines (50-60 characters)'
                },
                meta_description: {
                  type: 'string',
                  description: 'Compelling meta description (150-160 characters)'
                },
                excerpt: {
                  type: 'string',
                  description: 'Engaging 2-sentence summary'
                },
                content: {
                  type: 'string',
                  description: 'Full blog post in markdown format with H2/H3 headings, lists, and citations'
                },
                focus_keyword: {
                  type: 'string',
                  description: 'Primary keyword for SEO'
                },
                sources_cited: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of sources used'
                }
              },
              required: ['title', 'meta_title', 'meta_description', 'excerpt', 'content', 'focus_keyword', 'sources_cited']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'create_blog_post' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`Failed to generate blog content: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    // Extract structured output from tool call
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', JSON.stringify(aiData.choices[0].message));
      throw new Error('AI did not return structured blog post data');
    }
    
    const generatedContent = JSON.parse(toolCall.function.arguments);
    console.log('Successfully extracted structured blog post');

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate slug from title
    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create blog post draft
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: generatedContent.title,
        slug,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        meta_title: generatedContent.meta_title,
        meta_description: generatedContent.meta_description,
        focus_keyword: generatedContent.focus_keyword,
        author_id: user.id,
        status: 'draft',
        published_at: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting blog post:', insertError);
      throw insertError;
    }

    console.log('Blog post created successfully:', newPost.id);

    // If category_id provided, link it via junction table
    if (category_id && newPost) {
      const { error: categoryError } = await supabase
        .from('blog_post_categories')
        .insert({
          post_id: newPost.id,
          category_id: category_id,
        });

      if (categoryError) {
        console.error('Error linking category:', categoryError);
        // Don't throw - post was created successfully
      } else {
        console.log('Category linked successfully');
      }
    }

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
