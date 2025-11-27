import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function GenerateBackgrounds() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults(null);
    setAllResults([]);
    
    let startIndex = 0;
    let hasMore = true;
    const batchSize = 4;
    const accumulated: any[] = [];

    try {
      while (hasMore) {
        console.log(`Generating batch starting at index ${startIndex}`);
        
        const { data, error } = await supabase.functions.invoke('regenerate-course-images', {
          body: { batchSize, startIndex }
        });

        if (error) throw error;

        accumulated.push(...(data.results || []));
        setAllResults([...accumulated]);
        setProgress({ 
          current: data.summary.processed, 
          total: data.summary.totalCourses 
        });

        hasMore = data.summary.hasMore;
        startIndex = data.summary.nextIndex;

        toast.success(data.message);

        // Small delay between batches
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setResults({ 
        message: `All images generated successfully! (${accumulated.length} total)`,
        results: accumulated 
      });
      toast.success('All course images generated!');
    } catch (error: any) {
      console.error('Error regenerating images:', error);
      toast.error(error.message || 'Failed to regenerate images');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Regenerate Course Images</CardTitle>
          <CardDescription>
            Generate all 19 course background images using Lovable AI (Nano Banana model). Processing in batches of 4 to avoid timeouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Images... {progress.total > 0 && `(${progress.current}/${progress.total})`}
              </>
            ) : (
              'Regenerate All Course Images'
            )}
          </Button>

          {isGenerating && progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {allResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Generated Images ({allResults.length}):</h3>
              {allResults.map((result: any) => (
                <Card key={result.courseId}>
                  <CardContent className="pt-4">
                    <p className="font-medium">{result.courseId}</p>
                    {result.success ? (
                      <>
                        <p className="text-sm text-muted-foreground mt-2">
                          ✅ {result.filename}
                        </p>
                        <a 
                          href={result.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 block"
                        >
                          View Image →
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-destructive mt-2">
                        ❌ {result.error}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              {results.results?.map((result: any) => (
                <Card key={result.courseId}>
                  <CardContent className="pt-6">
                    <p className="font-medium">{result.courseId}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      File: {result.filename}
                    </p>
                    <a 
                      href={result.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 block"
                    >
                      View Image →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
