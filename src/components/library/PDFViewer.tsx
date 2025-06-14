
import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// More robust PDF.js worker setup with multiple fallbacks
const setupPDFWorker = () => {
  const workerUrls = [
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  ];

  let workerSetup = false;
  
  for (const url of workerUrls) {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = url;
      workerSetup = true;
      console.log('📄 PDF.js worker configured with:', url);
      break;
    } catch (error) {
      console.warn('⚠️ Failed to set worker URL:', url, error);
    }
  }
  
  if (!workerSetup) {
    console.error('❌ All PDF.js worker URLs failed to configure');
  }
  
  return workerSetup;
};

// Initialize worker on component load
const workerReady = setupPDFWorker();

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
  const [retryCount, setRetryCount] = useState<number>(0);
  const [workerError, setWorkerError] = useState<boolean>(false);
  const { toast } = useToast();

  // Memoize PDF options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/standard_fonts/`,
    httpHeaders: {
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: false,
    disableAutoFetch: false,
    disableStream: false,
  }), []);

  // Enhanced URL processing with validation and encoding
  const processedUrl = useMemo(() => {
    try {
      let url = fileUrl.trim();
      
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Validate URL format
      const urlObj = new URL(url);
      
      // Encode the URL properly while preserving the structure
      const encodedPath = urlObj.pathname.split('/').map(segment => 
        segment ? encodeURIComponent(decodeURIComponent(segment)) : segment
      ).join('/');
      
      const finalUrl = `${urlObj.origin}${encodedPath}${urlObj.search}${urlObj.hash}`;
      
      console.log('📄 Processing PDF URL:', {
        original: fileUrl,
        processed: finalUrl,
        fileName
      });
      
      return finalUrl;
    } catch (error) {
      console.error('❌ Invalid PDF URL format:', error);
      toast({
        title: "Invalid PDF URL",
        description: "The PDF file URL is not valid. Please check the file.",
        variant: "destructive"
      });
      return fileUrl; // Fallback to original URL
    }
  }, [fileUrl, fileName, toast]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', { numPages, fileName });
    setNumPages(numPages);
    setIsLoading(false);
    setRetryCount(0);
    setWorkerError(false);
    
    toast({
      title: "PDF Loaded",
      description: `Successfully loaded ${fileName} with ${numPages} pages.`,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PDF loading error:', {
      error: error.message,
      fileName,
      url: processedUrl,
      retryCount,
      workerReady
    });
    
    setIsLoading(false);
    
    // Check if it's a worker-related error
    if (error.message.includes('worker') || error.message.includes('Worker')) {
      setWorkerError(true);
    }
    
    // Detailed error analysis
    let errorMessage = "Failed to load PDF file.";
    let errorDetails = "";
    
    if (error.message.includes('worker') || error.message.includes('Worker')) {
      errorMessage = "PDF worker error";
      errorDetails = "There was an issue with the PDF processing engine.";
    } else if (error.message.includes('CORS')) {
      errorMessage = "Cross-origin error loading PDF";
      errorDetails = "The PDF file cannot be loaded due to security restrictions.";
    } else if (error.message.includes('network')) {
      errorMessage = "Network error loading PDF";
      errorDetails = "Please check your internet connection and try again.";
    } else if (error.message.includes('InvalidPDFException')) {
      errorMessage = "Invalid PDF file";
      errorDetails = "The file appears to be corrupted or not a valid PDF.";
    } else if (error.message.includes('PasswordException')) {
      errorMessage = "Password protected PDF";
      errorDetails = "This PDF is password protected and cannot be viewed.";
    }
    
    toast({
      title: errorMessage,
      description: errorDetails,
      variant: "destructive"
    });
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying PDF load, attempt:', retryCount + 1);
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setWorkerError(false);
    
    // Add delay for retry with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Re-setup worker on retry
    const workerSetupSuccess = setupPDFWorker();
    if (!workerSetupSuccess) {
      setWorkerError(true);
      setIsLoading(false);
      toast({
        title: "Worker Setup Failed",
        description: "Unable to configure PDF processing engine. Please try refreshing the page.",
        variant: "destructive"
      });
      return;
    }
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const progressPercentage = numPages > 0 ? (pageNumber / numPages) * 100 : 0;

  // Enhanced loading component
  const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
          <p className="text-xs text-muted-foreground">{fileName}</p>
          {retryCount > 0 && (
            <p className="text-xs text-yellow-600">Retry attempt {retryCount}</p>
          )}
          {!workerReady && (
            <p className="text-xs text-red-600">PDF engine setup in progress...</p>
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced error component with retry option
  const ErrorComponent = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <p className="text-destructive mb-2">Failed to load PDF</p>
        <p className="text-sm text-muted-foreground mb-4">
          There was a problem loading {fileName}
        </p>
        {workerError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <p className="text-xs text-yellow-800">
              PDF processing engine issue detected. This may be due to browser restrictions or network connectivity.
            </p>
          </div>
        )}
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleRetry} disabled={retryCount >= 3}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryCount >= 3 ? 'Max retries reached' : 'Retry'}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        {retryCount >= 3 && (
          <p className="text-xs text-muted-foreground mt-2">
            Please try refreshing the page or check if the file exists.
          </p>
        )}
      </div>
    </div>
  );

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
              {processedUrl && workerReady && (
                <Document
                  file={processedUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={<LoadingComponent />}
                  error={<ErrorComponent />}
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
                      onLoadError={(error) => {
                        console.error('❌ Page loading error:', error);
                      }}
                    />
                  )}
                </Document>
              )}
              
              {!workerReady && (
                <div className="flex items-center justify-center h-96 w-64">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Setting up PDF engine...</p>
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Setup
                    </Button>
                  </div>
                </div>
              )}
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
