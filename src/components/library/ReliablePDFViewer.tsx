import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home, RefreshCw, AlertTriangle, Download, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface ReliablePDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

interface PDFLoadingState {
  stage: 'initializing' | 'validating' | 'loading' | 'rendering' | 'ready' | 'error';
  message: string;
  progress: number;
  error?: string;
  retryCount: number;
}

const ReliablePDFViewer: React.FC<ReliablePDFViewerProps> = ({ fileUrl, fileName, onClose }) => {
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
  const [fallbackOptions, setFallbackOptions] = useState<string[]>([]);
  const { toast } = useToast();

  // PDF.js options with local worker
  const pdfOptions = React.useMemo(() => ({
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
    workerSrc: '/pdfjs/pdf.worker.min.js',
  }), []);

  // Process and validate PDF URL
  const processFileUrl = useCallback(async (url: string): Promise<string[]> => {
    console.log('🔍 Processing PDF URL:', url.substring(0, 100) + '...');
    
    const urlVariants: string[] = [];
    
    // If it's a Supabase storage URL, create multiple variants
    if (url.includes('supabase') && url.includes('storage')) {
      // Original URL
      urlVariants.push(url);
      
      // Add public access variant
      const publicUrl = url.replace('/storage/v1/object/', '/storage/v1/object/public/');
      if (publicUrl !== url) {
        urlVariants.push(publicUrl);
      }
      
      // Try with signed URL if authenticated
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          // Extract bucket and path from URL
          const urlParts = url.split('/storage/v1/object/');
          if (urlParts.length > 1) {
            const [, pathPart] = urlParts;
            const pathSegments = pathPart.split('/');
            if (pathSegments.length >= 2) {
              const bucket = pathSegments[0];
              const filePath = pathSegments.slice(1).join('/');
              
              const { data: signedUrlData } = await supabase.storage
                .from(bucket)
                .createSignedUrl(filePath, 3600); // 1 hour
              
              if (signedUrlData?.signedUrl) {
                urlVariants.push(signedUrlData.signedUrl);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Could not create signed URL:', error);
      }
    } else {
      urlVariants.push(url);
    }
    
    console.log('📄 Generated URL variants:', urlVariants.length);
    return urlVariants;
  }, []);

  // Test URL accessibility
  const testUrlAccessibility = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      console.log(`🌐 URL test result for ${url.substring(0, 50)}...:`, {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      });
      
      return response.ok;
    } catch (error) {
      console.warn(`❌ URL test failed for ${url.substring(0, 50)}...:`, error);
      return false;
    }
  };

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

        // Process URL variants
        setLoadingState(prev => ({
          ...prev,
          stage: 'validating',
          message: 'Preparing PDF file access...',
          progress: 30
        }));

        const urlVariants = await processFileUrl(fileUrl);
        setFallbackOptions(urlVariants);

        // Test each URL variant
        let workingUrl = '';
        for (const variant of urlVariants) {
          setLoadingState(prev => ({
            ...prev,
            message: `Testing file access (${urlVariants.indexOf(variant) + 1}/${urlVariants.length})...`,
            progress: 30 + (urlVariants.indexOf(variant) / urlVariants.length) * 30
          }));

          const isAccessible = await testUrlAccessibility(variant);
          if (isAccessible) {
            workingUrl = variant;
            break;
          }
        }

        if (!workingUrl) {
          throw new Error('File is not accessible through any URL variant');
        }

        setProcessedUrl(workingUrl);
        setLoadingState(prev => ({
          ...prev,
          stage: 'loading',
          message: 'Loading PDF document...',
          progress: 70
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
  }, [fileUrl, processFileUrl]);

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
      // Map download progress from 70% to 98% to avoid getting stuck
      const progressValue = 70 + (downloadProgress * 0.28); // 70% + (0-100% * 0.28) = 70-98%
      setLoadingState(prev => ({
        ...prev,
        stage: 'rendering',
        message: `Loading PDF... ${Math.round(downloadProgress)}%`,
        progress: Math.min(progressValue, 98)
      }));
    }
  };

  const onDocumentLoadError = async (error: Error) => {
    console.error('❌ PDF loading error:', error);
    
    const currentRetryCount = loadingState.retryCount;
    const maxRetries = fallbackOptions.length - 1;
    
    let errorMessage = `Failed to load PDF: ${error.message}`;
    let canRetry = currentRetryCount < maxRetries;
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Network error - file may not be accessible';
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = 'Invalid PDF file format';
      canRetry = false;
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Access blocked - trying alternative method...';
    }
    
    if (canRetry && fallbackOptions.length > currentRetryCount + 1) {
      const nextUrl = fallbackOptions[currentRetryCount + 1];
      console.log(`🔄 Retrying with fallback URL (${currentRetryCount + 1}/${maxRetries}):`, nextUrl.substring(0, 100) + '...');
      
      setProcessedUrl(nextUrl);
      setLoadingState(prev => ({
        ...prev,
        stage: 'loading',
        message: `Retrying with alternative access method (${currentRetryCount + 1}/${maxRetries})...`,
        progress: 70,
        retryCount: currentRetryCount + 1
      }));
      return;
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
    
    // Restart the initialization process
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
            <div className="space-y-4 p-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">{fileName}</h3>
                
                {loadingState.stage === 'error' ? (
                  <div className="space-y-4">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                    <div className="space-y-2">
                      <p className="text-destructive font-medium">{loadingState.message}</p>
                      {loadingState.error && (
                        <p className="text-sm text-muted-foreground">{loadingState.error}</p>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Tried {loadingState.retryCount + 1} access method(s)
                      </Badge>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={handleRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadFile}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={openInNewTab}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Direct
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-sm">{loadingState.message}</p>
                      <Progress value={loadingState.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {loadingState.progress.toFixed(0)}% complete
                      </p>
                      {loadingState.retryCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Using method {loadingState.retryCount + 1}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
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
        Reliable PDF viewer for {fileName}
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
                <Button variant="ghost" size="sm" onClick={downloadFile}>
                  <Download className="h-4 w-4" />
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
                Reliable PDF Viewer • Enhanced loading system active
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReliablePDFViewer;
