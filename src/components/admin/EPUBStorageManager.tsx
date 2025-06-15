
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Download, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';

interface DownloadResult {
  bookId: string;
  title: string;
  status: 'success' | 'failed' | 'pending';
  error?: string;
  storageUrl?: string;
}

const EPUBStorageManager: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<DownloadResult[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const { toast } = useToast();
  const { books, refetch } = usePublicDomainBooks();

  // Filter books by download status
  const pendingBooks = books.filter(book => book.download_status === 'pending' || !book.download_status);
  const downloadingBooks = books.filter(book => book.download_status === 'downloading');
  const completedBooks = books.filter(book => book.download_status === 'completed');
  const failedBooks = books.filter(book => book.download_status === 'failed');

  const triggerBulkDownload = async () => {
    const booksToDownload = selectedBooks.length > 0 
      ? books.filter(book => selectedBooks.includes(book.id))
      : pendingBooks;

    if (booksToDownload.length === 0) {
      toast({
        title: "No books to download",
        description: "All books are already in storage or downloading",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    try {
      console.log('🚀 Starting bulk EPUB download for', booksToDownload.length, 'books');

      const { data, error } = await supabase.functions.invoke('epub-ingestion', {
        body: {
          gutenbergIds: booksToDownload.map(book => book.gutenberg_id),
          batchSize: 5,
          forceRedownload: true
        }
      });

      if (error) {
        console.error('❌ Bulk download error:', error);
        throw error;
      }

      console.log('✅ Bulk download response:', data);
      setResults(data.results || []);
      setProgress(100);

      await refetch();

      toast({
        title: "Download completed",
        description: `Processed ${booksToDownload.length} books. Check results below.`,
      });

    } catch (error) {
      console.error('❌ Download error:', error);
      toast({
        title: "Download failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedBooks([]);
    }
  };

  const retryFailedDownloads = async () => {
    if (failedBooks.length === 0) {
      toast({
        title: "No failed downloads",
        description: "There are no failed downloads to retry",
      });
      return;
    }

    setSelectedBooks(failedBooks.map(book => book.id));
    await triggerBulkDownload();
  };

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'downloading':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      downloading: 'secondary',
      failed: 'destructive',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status || 'pending'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBooks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBooks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Downloading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadingBooks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedBooks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Download Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            EPUB Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={triggerBulkDownload}
              disabled={isProcessing || (selectedBooks.length === 0 && pendingBooks.length === 0)}
              className="flex items-center gap-2"
            >
              <Download className={`h-4 w-4 ${isProcessing ? 'animate-pulse' : ''}`} />
              {selectedBooks.length > 0 
                ? `Download Selected (${selectedBooks.length})` 
                : `Download Pending (${pendingBooks.length})`
              }
            </Button>
            
            <Button
              onClick={retryFailedDownloads}
              disabled={isProcessing || failedBooks.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Failed ({failedBooks.length})
            </Button>
            
            <Button
              onClick={() => setSelectedBooks([])}
              disabled={selectedBooks.length === 0}
              variant="outline"
            >
              Clear Selection
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Processing downloads... This may take several minutes.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book List */}
      <Card>
        <CardHeader>
          <CardTitle>All Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => toggleBookSelection(book.id)}
                    disabled={book.download_status === 'completed' || book.download_status === 'downloading'}
                    className="rounded"
                  />
                  <div>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {book.author} • ID: {book.gutenberg_id}
                    </div>
                    {book.download_error_message && (
                      <div className="text-xs text-red-600 mt-1">
                        {book.download_error_message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(book.download_status || 'pending')}
                  {getStatusBadge(book.download_status || 'pending')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Download Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : result.status === 'failed' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span>{result.title}</span>
                  {result.error && (
                    <span className="text-red-600">- {result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EPUBStorageManager;
