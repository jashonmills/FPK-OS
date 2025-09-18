
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { pdfWorkerManager } from '@/utils/enhancedPdfWorkerConfig';
import { EnhancedPDFLoader, PDFLoadingProgress } from '@/utils/enhancedPdfUtils';
import UnifiedLoadingProgress from './UnifiedLoadingProgress';
import { useCleanup } from '@/utils/cleanupManager';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface EnhancedPDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({ fileUrl, fileName, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const cleanup = useCleanup('EnhancedPDFViewer');
  const [validationProgress, setValidationProgress] = useState<PDFLoadingProgress | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const { toast } = useToast();

  // Enhanced PDF options
  const pdfOptions = React.useMemo(() => ({
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/standard_fonts/`,
  }), []);

  useEffect(() => {
    const initializeAndValidate = async () => {
      console.log('🔍 Enhanced PDF Viewer initializing:', fileName);
      
      // Ensure PDF worker is ready
      const workerReady = await pdfWorkerManager.initialize();
      if (!workerReady) {
        setValidationError('PDF worker failed to initialize. Please refresh the page.');
        setIsValidating(false);
        return;
      }

      // Validate and process the PDF URL
      const loader = new EnhancedPDFLoader(setValidationProgress);
      const result = await loader.validateAndLoad(fileUrl);

      if (!result.isValid) {
        setValidationError(result.error || 'PDF validation failed');
        setIsValidating(false);
        return;
      }

      setProcessedUrl(result.processedUrl!);
      setIsValidating(false);
      setValidationProgress(null);

      toast({
        title: "PDF Ready",
        description: `${fileName} has been validated and is ready to view.`,
      });
    };

    initializeAndValidate();
  }, [fileUrl, fileName, toast]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ Enhanced PDF loaded successfully:', { 
      numPages, 
      fileName,
      workerStatus: pdfWorkerManager.getStatus()
    });
    
    setNumPages(numPages);
    
    toast({
      title: "PDF Loaded",
      description: `Successfully loaded ${fileName} with ${numPages} pages.`,
    });
  };

  const onDocumentLoadError = async (error: Error) => {
    console.error('❌ Enhanced PDF loading error:', error);
    
    let errorMessage = "Failed to load PDF file.";
    
    if (error.message.includes('worker')) {
      errorMessage = "PDF worker issue. Attempting to fix...";
      const workerFixed = await pdfWorkerManager.reinitialize();
      if (!workerFixed) {
        errorMessage = "PDF worker configuration failed. Please refresh the page.";
      }
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMessage = "Network error loading PDF. Please check your connection.";
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = "Invalid or corrupted PDF file.";
    }
    
    toast({
      title: "PDF Error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const progressPercentage = numPages > 0 ? (pageNumber / numPages) * 100 : 0;

  // Keyboard navigation
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

    if (!isValidating && !validationError) {
      const listenerId = cleanup.addEventListener(document, 'keydown', handleKeyPress);
      return () => {
        // Cleanup handled by useCleanup hook
      };
    }
  }, [pageNumber, numPages, onClose, isValidating, validationError, cleanup]);

  // Show validation/loading state
  if (isValidating || validationError) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
          <DialogTitle className="sr-only">PDF Viewer: {fileName}</DialogTitle>
          <DialogDescription className="sr-only">
            Enhanced PDF viewer for {fileName}
          </DialogDescription>
          
          <UnifiedLoadingProgress
            title={fileName}
            progress={validationProgress}
            error={validationError}
            onRetry={() => window.location.reload()}
            onCancel={onClose}
            type="pdf"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogTitle className="sr-only">Enhanced PDF Viewer: {fileName}</DialogTitle>
        <DialogDescription className="sr-only">
          Enhanced PDF viewer for {fileName}. Use arrow keys to navigate pages.
        </DialogDescription>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">{fileName}</h2>
                {numPages > 0 && (
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
                file={processedUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Rendering PDF...</div>
                        <div className="text-xs text-muted-foreground">{fileName}</div>
                      </div>
                    </div>
                  </div>
                }
                options={pdfOptions}
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
          {numPages > 0 && (
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
                Use arrow keys to navigate • Press ESC to close • Enhanced loading system active
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPDFViewer;
