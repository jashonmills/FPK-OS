import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Database, ArrowRight, Users } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlogPosts';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface EnhancedAIBlogWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedAIBlogWizard({ open, onOpenChange }: EnhancedAIBlogWizardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [topic, setTopic] = useState('');
  const [personalInsights, setPersonalInsights] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [includeKB, setIncludeKB] = useState(true);

  const { data: categories } = useBlogCategories();
  const { data: authors } = useBlogAuthors();

  const handleGenerate = async () => {
    if (!topic || !categoryId || !authorId) {
      toast({
        title: 'Missing information',
        description: 'Please provide a topic, category, and author',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('semantic-blog-generation', {
        body: {
          topic,
          category_id: categoryId,
          author_id: authorId,
          personal_insights: personalInsights || null,
          include_kb: includeKB,
        },
      });

      if (error) throw error;

      toast({
        title: 'Blog post generated!',
        description: includeKB && data.kb_integrated
          ? `Created draft using ${data.sources_used} knowledge base sources`
          : 'Created draft successfully',
      });

      // Navigate to editor with slug
      navigate(`/dashboard/admin/blog/edit/${data.post.slug}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setTopic('');
      setPersonalInsights('');
      setCategoryId('');
      setAuthorId('');
      setIncludeKB(true);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            AI Blog Generator with Knowledge Base
          </DialogTitle>
          <DialogDescription>
            Generate evidence-based blog posts powered by your knowledge base
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., IEP accommodations for ADHD students"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              What subject do you want to cover?
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Select value={authorId} onValueChange={setAuthorId} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    <div className="flex items-center gap-2">
                      {author.display_name}
                      {author.is_ai_author && <Sparkles className="h-3 w-3 text-primary" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              AI-authored posts will display an AI badge. Select a human author to publish under their name.
            </p>
          </div>

          {/* Personal Insights */}
          <div className="space-y-2">
            <Label htmlFor="insights">Personal Insights (Optional)</Label>
            <Textarea
              id="insights"
              placeholder="Add your own perspective, experiences, or specific points you want to emphasize..."
              value={personalInsights}
              onChange={(e) => setPersonalInsights(e.target.value)}
              disabled={isGenerating}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Your personal insights will be woven into the AI-generated content
            </p>
          </div>

          {/* Knowledge Base Integration */}
          <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/50">
            <Checkbox
              id="include-kb"
              checked={includeKB}
              onCheckedChange={(checked) => setIncludeKB(checked as boolean)}
              disabled={isGenerating}
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="include-kb" className="cursor-pointer font-medium">
                <Database className="h-4 w-4 inline mr-2" />
                Use Knowledge Base
              </Label>
              <p className="text-sm text-muted-foreground">
                AI will search your knowledge base for relevant academic papers, clinical guidelines, 
                and institutional resources to create evidence-based content with proper citations.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic || !categoryId || !authorId}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Blog Post...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Blog Post
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This may take 30-60 seconds. Searching knowledge base and generating content...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
