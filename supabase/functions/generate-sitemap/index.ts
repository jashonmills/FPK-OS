import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = supabaseUrl.replace('.supabase.co', '.lovable.app').replace('https://pnxwemmpxldriwaomiey', 'https://id-preview--761aedbe-4e02-497f-b3ed-780208aaf069');

    // Fetch all published articles
    const { data: articles, error: articlesError } = await supabase
      .from('public_articles')
      .select('slug, updated_at, category:article_categories(slug)')
      .eq('is_published', true);

    if (articlesError) throw articlesError;

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('article_categories')
      .select('slug, updated_at');

    if (categoriesError) throw categoriesError;

    // Build sitemap XML
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: 'guides', priority: '0.9', changefreq: 'weekly' },
      { url: 'faq', priority: '0.8', changefreq: 'weekly' },
      { url: 'pricing', priority: '0.8', changefreq: 'monthly' },
      { url: 'terms-of-service', priority: '0.3', changefreq: 'yearly' },
      { url: 'privacy-policy', priority: '0.3', changefreq: 'yearly' },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Add category pages
    if (categories) {
      for (const category of categories) {
        const categoryDate = new Date(category.updated_at);
        const lastmod = categoryDate.toISOString().split('T')[0];
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/guides/${category.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    }

    // Add article pages
    if (articles) {
      for (const article of articles) {
        const category = Array.isArray(article.category) ? article.category[0] : article.category;
        const categorySlug = category?.slug || 'general';
        const articleDate = new Date(article.updated_at);
        const lastmod = articleDate.toISOString().split('T')[0];
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/guides/${categorySlug}/${article.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      }
    }

    xml += '</urlset>';

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
