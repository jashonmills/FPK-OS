import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function GenerateBackgrounds() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-course-backgrounds');

      if (error) throw error;

      setResults(data);
      toast.success('Course backgrounds generated successfully!');
    } catch (error: any) {
      console.error('Error generating backgrounds:', error);
      toast.error(error.message || 'Failed to generate backgrounds');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Course Backgrounds</CardTitle>
          <CardDescription>
            Use AI to generate background images for ELT and Interactive Science courses
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
                Generating Images...
              </>
            ) : (
              'Generate Background Images'
            )}
          </Button>

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
