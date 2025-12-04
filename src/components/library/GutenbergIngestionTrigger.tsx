
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, BookOpen, Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface IngestionResult {
  total_processed: number;
  successful_insertions: number;
  errors: number;
  books_inserted: number;
  message: string;
}

const GutenbergIngestionTrigger: React.FC = () => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [result, setResult] = useState<IngestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerIngestion = async () => {
    setIsIngesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Triggering Project Gutenberg ingestion...');
      
      const { data, error } = await supabase.functions.invoke('gutenberg-ingestion', {
        body: {}
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
      toast({
        title: "Ingestion Complete!",
        description: `Successfully added ${data.books_inserted} new Project Gutenberg titles`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Ingestion Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Project Gutenberg Collection Expansion
        </CardTitle>
        <CardDescription>
          Add 30 carefully selected Project Gutenberg titles (IDs 31-60) to your public domain collection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && !error && (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This will add the following classic titles:</p>
            <ul className="text-xs grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
              <li>• The Wind in the Willows</li>
              <li>• Black Beauty</li>
              <li>• Swiss Family Robinson</li>
              <li>• Twenty Thousand Leagues</li>
              <li>• Journey to Center of Earth</li>
              <li>• Adventures of Sherlock Holmes</li>
              <li>• And 24 more educational classics...</li>
            </ul>
          </div>
        )}

        {isIngesting && (
          <div className="space-y-3">
            <Progress value={undefined} className="w-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4 animate-spin" />
              Fetching metadata from Gutendx API and adding books...
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Ingestion Completed Successfully!</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Books Added:</span>
                <span className="ml-2">{result.books_inserted}</span>
              </div>
              <div>
                <span className="font-medium">Total Processed:</span>
                <span className="ml-2">{result.total_processed}</span>
              </div>
              <div>
                <span className="font-medium">Successful:</span>
                <span className="ml-2">{result.successful_insertions}</span>
              </div>
              <div>
                <span className="font-medium">Errors:</span>
                <span className="ml-2">{result.errors}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Ingestion Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <Button 
          onClick={triggerIngestion} 
          disabled={isIngesting || !!result}
          className="w-full"
        >
          {isIngesting ? (
            <>
              <Download className="h-4 w-4 mr-2 animate-spin" />
              Adding Books...
            </>
          ) : result ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Books Added Successfully
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Add 30 Project Gutenberg Titles
            </>
          )}
        </Button>

        {result && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            New books are now available in your Public Domain Collection below
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GutenbergIngestionTrigger;
