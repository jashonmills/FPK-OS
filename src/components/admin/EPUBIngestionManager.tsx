
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Download, CheckCircle, XCircle } from 'lucide-react';

const EPUBIngestionManager: React.FC = () => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Curated list of Gutenberg IDs for educational books
  const curatedGutenbergIds = [1, 2, 3, 4, 5, 6, 7, 8]; // Matches our current test data

  const triggerIngestion = async () => {
    setIsIngesting(true);
    setProgress(0);
    setResults(null);

    try {
      toast({
        title: "Starting EPUB Ingestion",
        description: `Processing ${curatedGutenbergIds.length} books...`,
      });

      const { data, error } = await supabase.functions.invoke('epub-ingestion', {
        body: {
          gutenbergIds: curatedGutenbergIds,
          batchSize: 3 // Process 3 books at a time
        }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      setProgress(100);

      toast({
        title: "Ingestion Complete",
        description: `Successfully processed ${data.summary.successful}/${data.summary.total} books`,
      });

    } catch (error) {
      console.error('Ingestion error:', error);
      toast({
        title: "Ingestion Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          EPUB Ingestion Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Download and store EPUB files from Project Gutenberg into Supabase Storage.
          This will make books load faster for users.
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={triggerIngestion}
            disabled={isIngesting}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isIngesting ? 'animate-spin' : ''}`} />
            {isIngesting ? 'Processing...' : 'Start Ingestion'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {curatedGutenbergIds.length} books in queue
          </div>
        </div>

        {isIngesting && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-muted-foreground">
              Processing books... This may take several minutes.
            </div>
          </div>
        )}

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingestion Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.summary.successful}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {results.summary.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {results.summary.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Detailed Results:</div>
                {results.summary.results.map((result: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {result.status === 'fulfilled' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Book ID {result.gutenbergId}</span>
                    {result.error && (
                      <span className="text-red-600">- {result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default EPUBIngestionManager;
