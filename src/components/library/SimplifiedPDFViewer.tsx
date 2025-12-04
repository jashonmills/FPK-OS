
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { usePDFUrlProcessor } from '@/hooks/usePDFUrlProcessor';
import PDFLoadingProgress from './PDFLoadingProgress';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFLoadingState {
  stage: 'initializing' | 'validating' | 'loading' | 'rendering' | 'ready' | 'error';
  message: string;
  progress: number;
  error?: string;
  retryCount: number;
}

interface SimplifiedPDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const SimplifiedPDFViewer: React.FC<SimplifiedPDFViewerProps> = ({ fileUrl, fileName, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loadingState, setLoadingState] = useState<PDFLoadingState>({
    stage: 'initializing',
    message: 'Initializing PDF viewer...',
    progress: 0,
    retryCount: 0
  });
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const { toast } = useToast();
  const { findWorkingUrl } = usePDFUrlProcessor();

  // PDF.js options
  const pdfOptions = React.useMemo(() => ({
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
    workerSrc: '/pdfjs/pdf.worker.min.js',
  }), []);

  // Initialize PDF loading
  useEffect(() => {
    const initializePDF = async () => {
      try {
        setLoadingState({
          stage: 'initializing',
          message: 'Setting up PDF viewer...',
          progress: 10,
          retryCount: 0
        });

        setLoadingState(prev => ({
          ...prev,
          stage: 'validating',
          message: 'Finding accessible PDF URL...',
          progress: 30
        }));

        const workingUrl = await findWorkingUrl(fileUrl);

        if (!workingUrl) {
          throw new Error('File is not accessible through any URL variant');
        }

        setProcessedUrl(workingUrl);
        setLoadingState(prev => ({
          ...prev,
          stage: 'loading',
          message: 'Loading PDF document...',
          progress: 50
        }));

        console.log('✅ PDF initialization complete, using URL:', workingUrl.substring(0, 100) + '...');

      } catch (error) {
        console.error('❌ PDF initialization failed:', error);
        setLoadingState(prev => ({
          ...prev,
          stage: 'error',
          message: 'Failed to initialize PDF viewer',
          error: error instanceof Error ? error.message : 'Unknown error',
          progress: 0
        }));
      }
    };

    initializePDF();
  }, [fileUrl, findWorkingUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', { numPages, fileName });
    
    setNumPages(numPages);
    setLoadingState({
      stage: 'ready',
      message: 'PDF ready',
      progress: 100,
      retryCount: 0
    });
    
    toast({
      title: "PDF Loaded",
      description: `Successfully loaded ${fileName} with ${numPages} pages.`,
    });
  };

  const onDocumentLoadProgress = ({ loaded, total }: { loaded: number; total: number }) => {
    if (total > 0) {
      const downloadProgress = (loaded / total) * 100;
      // Simple progress from 50% to 90%, then jump to 100% on success
      const progressValue = 50 + (downloadProgress * 0.4); // 50% to 90%
      setLoadingState(prev => ({
        ...prev,
        stage: 'loading',
        message: `Loading PDF... ${Math.round(downloadProgress)}%`,
        progress: Math.min(progressValue, 90)
      }));
    }
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PDF loading error:', error);
    
    let errorMessage = `Failed to load PDF: ${error.message}`;
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Network error - file may not be accessible';
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = 'Invalid PDF file format';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Access blocked by browser security';
    }
    
    setLoadingState(prev => ({
      ...prev,
      stage: 'error',
      message: 'Failed to load PDF',
      error: errorMessage,
      progress: 0
    }));
    
    toast({
      title: "PDF Error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const handleRetry = () => {
    setLoadingState({
      stage: 'initializing',
      message: 'Retrying PDF load...',
      progress: 0,
      retryCount: 0
    });
    setProcessedUrl('');
    window.location.reload();
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = processedUrl || fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  };

  const openInNewTab = () => {
    window.open(processedUrl || fileUrl, '_blank');
  };

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.25));

  const progressPercentage = numPages > 0 ? (pageNumber / numPages) * 100 : 0;

  // Show loading/error state
  if (loadingState.stage !== 'ready') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle>PDF Viewer</DialogTitle>
          <DialogDescription>
            <PDFLoadingProgress
              fileName={fileName}
              loadingState={loadingState}
              onRetry={handleRetry}
              onDownload={downloadFile}
              onOpenDirect={openInNewTab}
              onClose={onClose}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  // Main PDF viewer
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTitle className="sr-only">PDF Viewer: {fileName}</DialogTitle>
      <DialogDescription className="sr-only">
        Simplified PDF viewer for {fileName}
      </DialogDescription>
      
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
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
                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 0.25}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
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
                onLoadProgress={onDocumentLoadProgress}
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
                  
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
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
                Simplified PDF Viewer • Fixed loading system
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimplifiedPDFViewer;
