
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Download, CheckCircle, XCircle } from 'lucide-react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';

const EPUBIngestionManager: React.FC = () => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  const { books, refetch } = usePublicDomainBooks();

  const triggerIngestion = async () => {
    setIsIngesting(true);
    setProgress(0);
    setResults(null);

    try {
      // Get Gutenberg IDs from our database
      const gutenbergIds = books.map(book => book.gutenberg_id);
      
      if (gutenbergIds.length === 0) {
        throw new Error('No books found in database to process');
      }

      toast({
        title: "Starting EPUB Ingestion",
        description: `Processing ${gutenbergIds.length} books...`,
      });

      console.log('🔄 Starting ingestion with Gutenberg IDs:', gutenbergIds);

      const { data, error } = await supabase.functions.invoke('epub-ingestion', {
        body: {
          gutenbergIds: gutenbergIds,
          batchSize: 3 // Process 3 books at a time
        }
      });

      if (error) {
        console.error('❌ Ingestion error:', error);
        throw error;
      }

      console.log('✅ Ingestion response:', data);
      setResults(data);
      setProgress(100);

      // Refresh the books data to show updated download status
      await refetch();

      toast({
        title: "Ingestion Complete",
        description: `Successfully processed ${data.summary.successful}/${data.summary.total} books`,
      });

    } catch (error) {
      console.error('❌ Ingestion error:', error);
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
          This will make books load faster for users by serving them from local storage.
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Current Status:</div>
          <div className="text-xs text-muted-foreground space-y-1">
            {books.map(book => (
              <div key={book.id} className="flex justify-between">
                <span>"{book.title}" (ID: {book.gutenberg_id})</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  book.download_status === 'completed' ? 'bg-green-100 text-green-800' :
                  book.download_status === 'downloading' ? 'bg-blue-100 text-blue-800' :
                  book.download_status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {book.download_status || 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={triggerIngestion}
            disabled={isIngesting || books.length === 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isIngesting ? 'animate-spin' : ''}`} />
            {isIngesting ? 'Processing...' : 'Start Ingestion'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {books.length} books in database
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
