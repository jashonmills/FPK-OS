import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { isPDFWorkerReady, reconfigurePDFWorker, validateWorkerAccess } from '@/utils/pdfWorkerConfig';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, fileName, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [workerStatus, setWorkerStatus] = useState<string>('checking');
  const { toast } = useToast();

  // Enhanced worker initialization and validation
  useEffect(() => {
    const initializeWorker = async () => {
      console.log('🚀 Initializing PDF worker for:', fileName);
      
      // Step 1: Check if worker is configured
      if (!isPDFWorkerReady()) {
        console.log('🔧 Worker not ready, reconfiguring...');
        reconfigurePDFWorker();
        setWorkerStatus('reconfigured');
      } else {
        setWorkerStatus('ready');
      }
      
      // Step 2: Validate worker accessibility
      try {
        const isAccessible = await validateWorkerAccess();
        if (!isAccessible) {
          console.warn('⚠️ Worker not accessible, attempting reconfiguration...');
          reconfigurePDFWorker();
          setWorkerStatus('fallback');
        }
      } catch (error) {
        console.error('❌ Worker validation failed:', error);
        setWorkerStatus('error');
      }
      
      console.log('✅ Worker initialization complete, status:', workerStatus);
    };
    
    initializeWorker();
  }, [fileName]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', { 
      numPages, 
      fileName, 
      workerStatus,
      fileUrl: fileUrl.substring(0, 50) + '...'
    });
    
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    
    toast({
      title: "PDF Loaded",
      description: `Successfully loaded ${fileName} with ${numPages} pages.`,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PDF loading error:', {
      error: error.message,
      fileName,
      workerStatus,
      fileUrl: fileUrl.substring(0, 50) + '...',
      stack: error.stack
    });
    
    setIsLoading(false);
    
    let errorMessage = "Failed to load PDF file.";
    
    if (error.message.includes('worker') || error.message.includes('Worker')) {
      errorMessage = "PDF processing engine error. The worker failed to initialize properly.";
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMessage = "Network error. Please check your connection and try again.";
    } else if (error.message.includes('Invalid PDF') || error.message.includes('PDF')) {
      errorMessage = "Invalid or corrupted PDF file.";
    } else if (error.message.includes('CORS')) {
      errorMessage = "Access denied. The PDF file cannot be loaded due to security restrictions.";
    }
    
    setError(errorMessage);
    
    toast({
      title: "PDF Error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying PDF load with enhanced diagnostics');
    setError(null);
    setIsLoading(true);
    setNumPages(0);
    setPageNumber(1);
    
    // Force worker reconfiguration
    reconfigurePDFWorker();
    
    // Wait a moment for worker to initialize
    setTimeout(() => {
      console.log('🔄 Retry attempt initiated');
    }, 500);
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const progressPercentage = numPages > 0 ? (pageNumber / numPages) * 100 : 0;

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (event.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [pageNumber, numPages, onClose]);

  if (error) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle>PDF Viewer Error</DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-destructive">{error}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Worker Status: {workerStatus}</p>
                  <p>File: {fileName}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogTitle className="sr-only">PDF Viewer: {fileName}</DialogTitle>
        <DialogDescription className="sr-only">
          PDF viewer for {fileName}. Use arrow keys to navigate pages.
        </DialogDescription>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">{fileName}</h2>
                {!isLoading && numPages > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Page {pageNumber} of {numPages}</span>
                      <span>{progressPercentage.toFixed(1)}% complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5 bg-muted" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 2.0}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Loading PDF...</p>
                        <p className="text-xs text-muted-foreground">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Worker: {workerStatus}</p>
                      </div>
                    </div>
                  </div>
                }
                options={{
                  cMapUrl: `https://unpkg.com/pdfjs-dist@4.4.168/cmaps/`,
                  cMapPacked: true,
                  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@4.4.168/standard_fonts/`,
                }}
              >
                {numPages > 0 && (
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    loading={
                      <div className="flex items-center justify-center h-96 w-64">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    }
                  />
                )}
              </Document>
            </div>
          </div>

          {/* Footer Navigation */}
          {!isLoading && numPages > 0 && (
            <div className="flex-shrink-0 p-4 border-t bg-background">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Library</span>
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={goToPrevPage} 
                    disabled={pageNumber <= 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
                    Page {pageNumber} of {numPages}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={goToNextPage} 
                    disabled={pageNumber >= numPages}
                    className="flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Use arrow keys to navigate • Press ESC to close
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
