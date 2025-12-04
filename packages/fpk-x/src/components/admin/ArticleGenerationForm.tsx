import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

export function ArticleGenerationForm() {
  const [topic, setTopic] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [articleType, setArticleType] = useState<'pillar' | 'cluster' | 'faq'>('cluster');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: authors } = useQuery({
    queryKey: ['article-authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_authors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleGenerate = async () => {
    if (!topic || !categorySlug || !authorId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-articles-from-kb', {
        body: { topic, categorySlug, authorId, count, articleType },
      });

      if (error) throw error;

      toast.success(`Generated ${data.count} article(s) successfully!`);
      setTopic('');
    } catch (error) {
      console.error('Error generating articles:', error);
      toast.error('Failed to generate articles');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Article Generator
        </CardTitle>
        <CardDescription>
          Generate SEO-optimized articles from your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <Input
            id="topic"
            placeholder="e.g., ABA Therapy for Early Intervention"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={categorySlug} onValueChange={setCategorySlug}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Select value={authorId} onValueChange={setAuthorId}>
            <SelectTrigger id="author">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name} {author.credentials && `(${author.credentials})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Article Type</Label>
          <Select value={articleType} onValueChange={(v) => setArticleType(v as any)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cluster">Cluster Article (800-1200 words)</SelectItem>
              <SelectItem value="pillar">Pillar Page (3000+ words)</SelectItem>
              <SelectItem value="faq">FAQ Page (10-15 Q&As)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="count">Number of Articles</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="5"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Articles
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
