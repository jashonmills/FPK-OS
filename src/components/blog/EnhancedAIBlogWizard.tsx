import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Database, ArrowRight, Users, TrendingUp } from 'lucide-react';
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
  const [progressStep, setProgressStep] = useState<string>('');
  
  // Form state
  const [topic, setTopic] = useState('');
  const [personalInsights, setPersonalInsights] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [includeKB, setIncludeKB] = useState(true);
  const [includeSocial, setIncludeSocial] = useState(false);

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
    setProgressStep('Initializing...');

    try {
      // Simulate progress steps
      if (includeKB || includeSocial) {
        setTimeout(() => setProgressStep(includeKB ? 'Searching knowledge base...' : 'Gathering social intelligence...'), 500);
        setTimeout(() => setProgressStep('Analyzing relevant sources...'), 5000);
      }
      setTimeout(() => setProgressStep('Generating blog content...'), 15000);
      setTimeout(() => setProgressStep('Optimizing for SEO...'), 35000);
      setTimeout(() => setProgressStep('Finalizing draft...'), 55000);

      // Create a timeout promise that will reject after 90 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 90 seconds. Please try again with a simpler topic or without knowledge base integration.')), 90000)
      );

      // Create the generation request promise
      const generatePromise = supabase.functions.invoke('semantic-blog-generation', {
        body: {
          topic,
          category_id: categoryId,
          author_id: authorId,
          personal_insights: personalInsights || null,
          include_kb: includeKB,
          include_social: includeSocial,
        },
      });

      // Race between the two promises
      const result = await Promise.race([generatePromise, timeoutPromise]) as any;
      
      if (result.error) {
        console.error('Generation error details:', result.error);
        throw result.error;
      }

      const { data, error } = result;

      if (error) throw error;

      setProgressStep('Complete!');
      
      let description = 'Created draft successfully';
      if (includeKB && data.kb_integrated && includeSocial && data.social_integrated) {
        description = `Created draft using ${data.sources_used} knowledge base sources and social intelligence`;
      } else if (includeKB && data.kb_integrated) {
        description = `Created draft using ${data.sources_used} knowledge base sources`;
      } else if (includeSocial && data.social_integrated) {
        description = 'Created draft using social & media intelligence';
      }
      
      toast({
        title: 'Blog post generated!',
        description,
      });

      // Navigate to editor with slug
      navigate(`/dashboard/admin/blog/edit/${data.post.slug}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Generation error:', error);
      
      let errorMessage = 'Failed to generate blog post. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
          errorMessage = 'Request timed out. Try with a simpler topic or disable knowledge base integration.';
        } else if (error.message.includes('handshake')) {
          errorMessage = 'Connection error. The server may be overloaded. Please try again in a moment.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Failed to process AI response. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Generation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setProgressStep('');
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setTopic('');
      setPersonalInsights('');
      setCategoryId('');
      setAuthorId('');
      setIncludeKB(true);
      setIncludeSocial(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Social Intelligence Integration */}
          <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/50">
            <Checkbox
              id="include-social"
              checked={includeSocial}
              onCheckedChange={(checked) => setIncludeSocial(checked as boolean)}
              disabled={isGenerating}
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="include-social" className="cursor-pointer font-medium">
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Include Social & Media Trends
              </Label>
              <p className="text-sm text-muted-foreground">
                AI will analyze trending discussions on Reddit, YouTube videos, and TED Talks 
                to make your content more timely and engaging. Your post will reference 
                real community conversations and key influencers.
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
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{progressStep}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This can take 60-90 seconds for complex topics
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                {includeKB && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>Searching through knowledge base for relevant sources</span>
                  </div>
                )}
                {includeSocial && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Gathering insights from YouTube, Reddit, and TED</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
