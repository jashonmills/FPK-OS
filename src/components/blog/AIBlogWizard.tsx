import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlogPosts';
import { useAIKnowledgeSources } from '@/hooks/useAIKnowledgeSources';
import { useAIGeneration } from '@/hooks/useAIGeneration';

interface AIBlogWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WizardStep = 'topic' | 'sources' | 'outline' | 'generating';

export function AIBlogWizard({ open, onOpenChange }: AIBlogWizardProps) {
  const [step, setStep] = useState<WizardStep>('topic');
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [generatedOutline, setGeneratedOutline] = useState<any>(null);
  const [generationHistoryId, setGenerationHistoryId] = useState<string | null>(null);

  const { data: categories } = useBlogCategories();
  const { data: sources } = useAIKnowledgeSources(categoryId);
  const { generateOutline, generateDraft, isGenerating } = useAIGeneration();

  const handleNext = () => {
    if (step === 'topic' && topic && keyword && categoryId) {
      setStep('sources');
    }
  };

  const handleGenerateOutline = async () => {
    setStep('generating');
    try {
      const result = await generateOutline.mutateAsync({
        topic,
        keyword,
        category_id: categoryId,
        source_urls: selectedSources
      });
      setGeneratedOutline(result.outline);
      setGenerationHistoryId(result.generation_history_id);
      setStep('outline');
    } catch (error) {
      setStep('sources');
    }
  };

  const handleGenerateDraft = async () => {
    if (!generatedOutline || !generationHistoryId) return;
    setStep('generating');
    await generateDraft.mutateAsync({
      topic,
      keyword,
      outline_json: generatedOutline,
      source_urls: selectedSources,
      generation_history_id: generationHistoryId
    });
    // Will auto-navigate on success
  };

  const handleStartOver = () => {
    setStep('topic');
    setTopic('');
    setKeyword('');
    setCategoryId('');
    setSelectedSources([]);
    setGeneratedOutline(null);
    setGenerationHistoryId(null);
  };

  const handleSourceToggle = (url: string) => {
    setSelectedSources(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  // Auto-select all sources when they load
  useState(() => {
    if (sources && sources.length > 0 && selectedSources.length === 0) {
      setSelectedSources(sources.map(s => s.url));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            AI Blog Generator
          </DialogTitle>
        </DialogHeader>

        {step === 'topic' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Post Topic / Title</Label>
              <Input
                id="topic"
                placeholder="e.g., Understanding ADHD in Children"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">Primary SEO Keyword</Label>
              <Input
                id="keyword"
                placeholder="e.g., ADHD in children"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Primary Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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

            <Button
              onClick={handleNext}
              disabled={!topic || !keyword || !categoryId}
              className="w-full"
            >
              Next: Select Sources
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'sources' && (
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Research Sources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the sources the AI should use for research. All are pre-approved and selected by default.
              </p>
              
              {sources && sources.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedSources.includes(source.url)}
                        onCheckedChange={() => handleSourceToggle(source.url)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{source.source_name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {source.url}
                        </div>
                        {source.description && (
                          <div className="text-sm mt-1">{source.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No research sources available for this category. Please add sources in the AI Knowledge Base.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('topic')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleGenerateOutline}
                disabled={selectedSources.length === 0 || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Outline...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Outline
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'outline' && generatedOutline && (
          <div className="space-y-4 py-4">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div>
                <h3 className="font-semibold text-lg mb-2">Generated Outline</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Title</div>
                    <div className="font-semibold text-lg">{generatedOutline.title}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Meta Title ({generatedOutline.meta_title.length} chars)
                    </div>
                    <div>{generatedOutline.meta_title}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Meta Description ({generatedOutline.meta_description.length} chars)
                    </div>
                    <div>{generatedOutline.meta_description}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Structure</div>
                    <div className="space-y-2">
                      {generatedOutline.sections?.map((section: any, idx: number) => (
                        <div key={idx} className="pl-4 border-l-2 border-primary/30">
                          <div className="font-medium">## {section.heading}</div>
                          {section.subsections?.map((sub: any, subIdx: number) => (
                            <div key={subIdx} className="pl-4 text-sm text-muted-foreground">
                              ### {sub.heading}
                            </div>
                          ))}
                        </div>
                      ))}
                      {generatedOutline.conclusion && (
                        <div className="pl-4 border-l-2 border-primary/30">
                          <div className="font-medium">## Conclusion</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleStartOver}>
                Start Over
              </Button>
              <Button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Draft...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Full Draft
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-pink-500" />
            <h3 className="text-lg font-semibold mb-2">
              {generatedOutline ? 'Generating Full Draft...' : 'Generating Outline...'}
            </h3>
            <p className="text-muted-foreground">
              This may take up to 90 seconds. Please don't close this window.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
