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

interface SelectedBook {
  id: string;
  title?: string;
  author?: string;
  file_name?: string;
  file_url?: string;
  file_size?: number;
}

interface UserUploadsSectionProps {
  viewMode?: 'grid' | 'list';
}

const UserUploadsSection: React.FC<UserUploadsSectionProps> = ({ viewMode: parentViewMode }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [selectedPDF, setSelectedPDF] = useState<SelectedBook | null>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();
  const cleanup = useCleanup('UserUploadsSection');

  // Collapsible state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = safeLocalStorage.getItem<string>('userUploads-expanded', {
      fallbackValue: 'true',
      logErrors: false
    });
    try {
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  
  // Use parent viewMode or fallback to localStorage
  const [localViewMode, setLocalViewMode] = useState<'list' | 'grid'>(() => {
    const saved = safeLocalStorage.getItem<string>('userUploads-viewMode', {
      fallbackValue: parentViewMode,
      logErrors: false
    });
    try {
      return (saved as 'list' | 'grid') || parentViewMode;
    } catch {
      return parentViewMode;
    }
  });

  const viewMode = parentViewMode || localViewMode;

  // Persist state changes to localStorage
  useEffect(() => {
    safeLocalStorage.setItem('userUploads-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Persist view mode changes
  useEffect(() => {
    if (!parentViewMode) {
      safeLocalStorage.setItem('userUploads-viewMode', localViewMode);
    }
  }, [localViewMode, parentViewMode]);

  const handlePDFOpen = async (book: SelectedBook) => {
    console.log('📖 Opening PDF with simplified viewer:', book.file_name);
    console.log('📖 PDF URL:', book.file_url);
    
    setValidatingPDF(book.id);
    
    try {
      // Brief validation delay to show loading state
      await new Promise(resolve => {
        cleanup.setTimeout(() => resolve(undefined), 300);
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

  const handleDownload = async (book: SelectedBook) => {
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

  const renderBookCard = (book: SelectedBook) => (
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
                {book.author || 'Your Upload'}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  Personal Library
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

  const renderBookList = (book: SelectedBook) => (
    <div key={book.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-10 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center flex-shrink-0">
        <FileText className="h-5 w-5 text-primary/60" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
          {book.title || book.file_name}
        </h3>
        <p className={`text-xs text-muted-foreground line-clamp-1 ${getAccessibilityClasses('text')}`}>
          {book.author || 'Your Upload'}
        </p>
        <div className="flex gap-1 mt-1">
          <Badge variant="secondary" className="text-xs">Personal</Badge>
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
                <Upload className="h-5 w-5 text-green-600" />
                Your Library
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
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your personal library will appear here when you upload books</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default UserUploadsSection;