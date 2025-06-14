
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  List, 
  Minus, 
  Plus, 
  Settings,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface EPUBReaderProps {
  book: PublicDomainBook;
  onClose: () => void;
}

const EPUBReader: React.FC<EPUBReaderProps> = ({ book, onClose }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const readerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [showTOC, setShowTOC] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [toc, setToc] = useState<any[]>([]);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const epubRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);

  useEffect(() => {
    loadEPUB();
    return () => {
      // Cleanup EPUB instance
      if (epubRef.current) {
        try {
          epubRef.current.destroy();
        } catch (err) {
          console.log('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [book.epub_url]);

  const loadEPUB = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Initializing...');

      console.log('📖 Loading EPUB for:', book.title, 'URL:', book.epub_url);

      // Validate EPUB URL
      if (!book.epub_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      
      // Dynamic import of epub.js
      const ePub = (await import('epubjs')).default;
      
      // Create proxy URL for CORS handling using our Supabase edge function
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      
      console.log('🔗 Using proxy URL:', proxyUrl);
      
      setLoadingStep('Creating EPUB instance...');
      
      // Create EPUB book instance
      const epubBook = ePub(proxyUrl);
      epubRef.current = epubBook;

      setLoadingStep('Downloading book content...');

      // Set up error handler for the book
      epubBook.ready.catch((err: any) => {
        console.error('❌ EPUB ready error:', err);
        throw err;
      });

      // Wait for book to be ready with a longer timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Book loading timed out after 30 seconds')), 30000)
      );

      await Promise.race([epubBook.ready, timeoutPromise]);
      console.log('✅ EPUB book ready');

      setLoadingStep('Loading table of contents...');

      // Load navigation/TOC
      try {
        await epubBook.loaded.navigation;
        setToc(epubBook.navigation.toc || []);
        console.log('📚 TOC loaded:', epubBook.navigation.toc?.length || 0, 'items');
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents:', navError);
        setToc([]);
      }

      if (!readerRef.current) {
        throw new Error('Reader container not available');
      }

      setLoadingStep('Preparing reader...');

      // Create rendition
      const rendition = epubBook.renderTo(readerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'paginated',
        spread: 'none'
      });
      renditionRef.current = rendition;

      // Set initial font size
      rendition.themes.fontSize(`${fontSize}px`);

      setLoadingStep('Rendering first page...');

      // Display first page
      await rendition.display();
      console.log('📄 First page displayed');

      // Track location changes
      rendition.on('relocated', (location: any) => {
        setCurrentLocation(location.start.cfi);
      });

      // Handle rendition errors
      rendition.on('error', (err: any) => {
        console.error('❌ Rendition error:', err);
      });

      setIsLoading(false);
      setLoadingStep('');
      console.log('✅ EPUB loaded successfully');

    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
      
      // Provide more specific error messages
      if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        setError('The book is taking too long to download. This may be due to the book size or network conditions. Please try again.');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Could not download the book file. Please check your internet connection and try again.');
      } else if (errorMessage.includes('CORS')) {
        setError('There was a network configuration issue. Please try again.');
      } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        setError('The book file could not be found. This book may not be available in EPUB format.');
      } else {
        setError(`Unable to load "${book.title}": ${errorMessage}`);
      }
      
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const handleNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}px`);
    }
  };

  const handleTOCItemClick = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
      setShowTOC(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoadingStep('Retrying...');
    loadEPUB();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogDescription className="sr-only">
          EPUB reader for {book.title} by {book.author}
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className={`text-lg ${getAccessibilityClasses('text')}`}>
                {book.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isLoading && !error && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setShowTOC(true)}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFontSizeChange(-2)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">{fontSize}px</span>
                    <Button variant="ghost" size="sm" onClick={() => handleFontSizeChange(2)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Reader Content */}
          <div className="flex-1 relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center max-w-md p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
                  <h3 className={`text-lg font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
                    Loading "{book.title}"
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {loadingStep}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please wait while we download and prepare your book...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center max-w-lg p-6">
                  <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4">Unable to Load Book</h3>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    This could be due to network connectivity, server availability, or book file issues.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={onClose}>
                      Back to Library
                    </Button>
                  </div>
                  <div className="mt-6 p-3 bg-muted rounded text-xs text-muted-foreground">
                    <p><strong>Book:</strong> {book.title}</p>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Gutenberg ID:</strong> #{book.gutenberg_id}</p>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={readerRef}
              className={`w-full h-full ${getAccessibilityClasses('container')} ${isLoading || error ? 'hidden' : ''}`}
            />
          </div>

          {/* Navigation Footer */}
          {!isLoading && !error && (
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onClose}>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handlePrevPage}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" onClick={handleNextPage}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table of Contents Modal */}
        {showTOC && (
          <Dialog open={showTOC} onOpenChange={setShowTOC}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Table of Contents</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {toc.length > 0 ? (
                  toc.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleTOCItemClick(item.href)}
                      className="block w-full text-left p-2 hover:bg-muted rounded"
                    >
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No table of contents available for this book.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EPUBReader;
