import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // This is a placeholder - in production, you'd have a separate FAQ table
  // For now, we'll use public_articles with schema_type='FAQPage'
  const { data: faqItems } = useQuery({
    queryKey: ['faq-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_articles')
        .select('*')
        .eq('schema_type', 'FAQPage')
        .eq('is_published', true);
      if (error) throw error;
      
      // Parse FAQ items from content (assuming JSON structure)
      return data.flatMap(article => {
        try {
          const parsed = JSON.parse(article.content);
          return parsed.items?.map((item: any) => ({
            id: `${article.id}-${item.question}`,
            question: item.question,
            answer: item.answer,
            category: article.category_id || 'General',
            keywords: article.keywords || [],
          })) || [];
        } catch {
          return [];
        }
      });
    },
  });

  const categories = faqItems
    ? Array.from(new Set(faqItems.map((item: FAQItem) => item.category)))
    : [];

  const filteredFAQs = faqItems?.filter((item: FAQItem) => {
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const faqSchema = filteredFAQs?.map((item: FAQItem) => ({
    question: item.question,
    answer: item.answer,
  })) || [];

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions | FPK-X.com"
        description="Find answers to common questions about neurodiversity support, IEPs, special education, autism, ADHD, and using the FPK-X.com platform."
        keywords={['FAQ', 'questions', 'IEP help', 'special education', 'neurodiversity support']}
      />
      <SchemaMarkup
        schema={[
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: '/' },
              { name: 'FAQ', url: '/faq' },
            ],
          },
          {
            type: 'FAQPage',
            items: faqSchema,
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about supporting neurodivergent children
            </p>
          </header>

          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {filteredFAQs && filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((item: FAQItem) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory
                  ? 'No questions found matching your search.'
                  : 'No FAQ items available yet.'}
              </p>
            </div>
          )}

          <div className="mt-16 p-6 bg-card border rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Didn't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-4">
              Browse our comprehensive guides or contact our support team.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/guides"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors"
              >
                Browse Guides
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
