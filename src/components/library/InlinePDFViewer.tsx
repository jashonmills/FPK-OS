import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home, RefreshCw, AlertTriangle, RotateCcw, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { initializePDFWorker, reinitializeWorker } from '@/utils/pdfWorkerConfig';
import { useCleanup } from '@/utils/cleanupManager';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface InlinePDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const InlinePDFViewer: React.FC<InlinePDFViewerProps> = ({ fileUrl, fileName, onClose }) => {
  const cleanup = useCleanup('InlinePDFViewer');
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_RETRIES = 3;
  const LOADING_TIMEOUT = 45000;

  // Initialize PDF worker
  useEffect(() => {
    initializePDFWorker().then(success => {
      if (!success) {
        console.warn('⚠️ PDF worker initialization failed, will retry on document load');
      }
    }).catch(error => {
      console.error('❌ PDF worker initialization error:', error);
    });
  }, []);

  const pdfOptions = React.useMemo(() => ({
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    disableWorker: false,
    enableXfa: false,
    disableRange: false,
    disableStream: false,
    withCredentials: false
  }), []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', { numPages, fileName });
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
    setLoadingProgress(100);
    
    toast({
      title: "PDF Loaded",
      description: `Successfully loaded ${fileName} with ${numPages} pages.`,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PDF loading error:', error);
    setIsLoading(false);
    setLoadingProgress(0);
    
    const errorMessage = error.message || String(error);
    let suggestion = '';
    
    if (errorMessage.includes('pdf.worker.mjs') || errorMessage.includes('module specifier')) {
      suggestion = 'PDF worker initialization failed. Attempting to reload...';
      reinitializeWorker().then(() => {
        setTimeout(() => {
          if (retryCount < MAX_RETRIES) {
            retryLoading();
          }
        }, 500);
      });
    }
    
    setError(`Failed to load PDF: ${errorMessage}${suggestion ? ` ${suggestion}` : ''}`);
    
    toast({
      title: "PDF Error",
      description: suggestion || `Failed to load ${fileName}`,
      variant: "destructive"
    });
  };

  const retryLoading = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsLoading(true);
      setLoadingProgress(0);
      setNumPages(0);
      setPageNumber(1);
      
      reinitializeWorker().catch(error => {
        console.error('❌ PDF worker reinitialization failed:', error);
      });
      
      toast({
        title: "Retrying...",
        description: `Attempting to reload PDF (${retryCount + 1}/${MAX_RETRIES})`,
      });
    }
  }, [retryCount, toast]);

  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, numPages));
    setPageNumber(newPage);
  }, [numPages]);

  const goToPrevPage = useCallback(() => goToPage(pageNumber - 1), [pageNumber, goToPage]);
  const goToNextPage = useCallback(() => goToPage(pageNumber + 1), [pageNumber, goToPage]);
  
  const zoomIn = useCallback(() => setScale(prev => Math.min(prev + 0.25, 3.0)), []);
  const zoomOut = useCallback(() => setScale(prev => Math.max(prev - 0.25, 0.5)), []);
  const resetZoom = useCallback(() => setScale(1.0), []);
  const rotateDocument = useCallback(() => setRotation(prev => (prev + 90) % 360), []);

  const downloadPDF = useCallback(() => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }, [fileUrl, fileName]);

  const progressPercentage = numPages > 0 ? (pageNumber / numPages) * 100 : 0;

  if (error) {
    return (
      <div className="border rounded-lg bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">PDF Viewer Error</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <div className="text-destructive text-center">{error}</div>
          <div className="text-xs text-muted-foreground">File: {fileName}</div>
          <div className="flex gap-2">
            {retryCount < MAX_RETRIES && (
              <Button variant="default" size="sm" onClick={retryLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry ({retryCount + 1}/{MAX_RETRIES})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-background shadow-md overflow-hidden" style={{ maxHeight: '600px' }}>
      {/* Compact Header with Controls */}
      <div className="flex-shrink-0 p-3 border-b bg-muted/50">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold truncate flex-1">{fileName}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isLoading && numPages > 0 && (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Page {pageNumber} of {numPages}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1 bg-muted mb-3" />
            
            {/* Compact Toolbar */}
            <div className="flex items-center justify-between gap-2">
              {/* Navigation */}
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={pageNumber === 1}
                      >
                        <Home className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>First Page</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs px-2">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={rotateDocument}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rotate</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={downloadPDF}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PDF Content Area */}
      <ScrollArea className="flex-1" style={{ height: '480px' }}>
        <div className="flex items-center justify-center p-4" ref={containerRef}>
          {isLoading ? (
            <div className="space-y-4 w-full max-w-2xl">
              <Skeleton className="h-[600px] w-full" />
              <div className="text-center text-sm text-muted-foreground">
                Loading PDF... {loadingProgress > 0 && `${loadingProgress}%`}
              </div>
            </div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={pdfOptions}
              loading={
                <div className="flex flex-col items-center gap-4 py-8">
                  <Skeleton className="h-[600px] w-[450px]" />
                  <p className="text-sm text-muted-foreground">Loading PDF...</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={<Skeleton className="h-[600px] w-[450px]" />}
              />
            </Document>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default InlinePDFViewer;
