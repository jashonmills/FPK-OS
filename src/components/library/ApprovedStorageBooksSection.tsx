import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Grid, List, Loader2, ChevronDown, ChevronRight, RotateCcw, Upload, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OptimizedPDFViewer from '@/components/library/OptimizedPDFViewer';
import { useToast } from '@/hooks/use-toast';
import { useAccessibility } from '@/hooks/useAccessibility';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

interface Book {
  id: string;
  title: string;
  author?: string;
  file_name?: string;
  file_size?: number;
  file_url?: string;
  download_url?: string;
  created_at?: string;
}

interface ApprovedStorageBooksProps {
  books: Book[];
  isLoading?: boolean;
  error?: string | null;
  parentViewMode?: 'grid' | 'list';
}

const ApprovedStorageBooksSection: React.FC<ApprovedStorageBooksProps> = ({ books, isLoading, error, parentViewMode }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();
  const cleanup = useCleanup('ApprovedStorageBooksSection');

  // Collapsible state with localStorage persistence - defaulting to closed
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = safeLocalStorage.getItem<string>('communityLibrary-expanded', {
      fallbackValue: 'false',
      logErrors: false
    });
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  // Use parent viewMode or fallback to localStorage
  const [localViewMode, setLocalViewMode] = useState<'list' | 'grid'>(() => {
    const saved = safeLocalStorage.getItem<string>('communityLibrary-viewMode', {
      fallbackValue: parentViewMode,
      logErrors: false
    });
    return (saved as 'list' | 'grid') || parentViewMode;
  });

  const viewMode = parentViewMode || localViewMode;

  // Persist state changes to localStorage
  useEffect(() => {
    safeLocalStorage.setItem('communityLibrary-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    safeLocalStorage.setItem('communityLibrary-viewMode', viewMode);
  }, [viewMode]);

  const handlePDFOpen = async (book: Book) => {
    console.log('📖 Opening PDF with optimized viewer:', book.file_name);
    setValidatingPDF(book.id);
    
    try {
      await new Promise(resolve => {
        cleanup.setTimeout(() => resolve(undefined), 500);
      });
      setSelectedPDF(book);
      
      toast({
        title: "PDF Loading",
        description: `Opening ${book.file_name}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open PDF viewer",
        variant: "destructive",
      });
    } finally {
      setValidatingPDF(null);
    }
  };

  const handleDownload = async (book: Book) => {
    try {
      const response = await fetch(book.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = book.file_name || 'download.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading ${book.file_name}...`,
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download the file",
        variant: "destructive",
      });
    }
  };

  // Render PDF viewer modal
  if (selectedPDF) {
    return (
      <OptimizedPDFViewer
        fileUrl={selectedPDF.file_url}
        fileName={selectedPDF.file_name}
        onClose={() => setSelectedPDF(null)}
      />
    );
  }

  const renderBookCard = (book: Book) => (
    <Card key={book.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-primary/60" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
                {book.title || book.file_name}
              </h3>
              <p className={`text-xs text-muted-foreground line-clamp-1 mb-2 ${getAccessibilityClasses('text')}`}>
                {book.author || 'Community Upload'}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  Community Library
                </Badge>
                {book.file_size && (
                  <Badge variant="outline" className="text-xs">
                    {(book.file_size / (1024 * 1024)).toFixed(1)} MB
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-auto">
            <Button
              variant="default"
              size="sm"
              onClick={() => handlePDFOpen(book)}
              disabled={validatingPDF === book.id}
              className="flex-1"
            >
              {validatingPDF === book.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(book)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBookList = (book: Book) => (
    <div key={book.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-10 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center flex-shrink-0">
        <FileText className="h-5 w-5 text-primary/60" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
          {book.title || book.file_name}
        </h3>
        <p className={`text-xs text-muted-foreground line-clamp-1 ${getAccessibilityClasses('text')}`}>
          {book.author || 'Community Upload'}
        </p>
        <div className="flex gap-1 mt-1">
          <Badge variant="secondary" className="text-xs">Community</Badge>
          {book.file_size && (
            <Badge variant="outline" className="text-xs">
              {(book.file_size / (1024 * 1024)).toFixed(1)} MB
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => handlePDFOpen(book)}
          disabled={validatingPDF === book.id}
        >
          {validatingPDF === book.id ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          Read
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(book)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Community Library
                {books?.length > 0 && (
                  <Badge variant="secondary">{books.length}</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-16 bg-muted rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                          <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Error loading community books</p>
              </div>
            ) : books?.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No approved books available yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {books?.length || 0} books available
                  </p>
                  <Select value={viewMode} onValueChange={(value: 'list' | 'grid') => setLocalViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <Grid className="h-4 w-4" />
                          Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          List
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {books?.map(renderBookCard)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {books?.map(renderBookList)}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ApprovedStorageBooksSection;