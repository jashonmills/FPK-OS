
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
  X 
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
  const epubRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);

  useEffect(() => {
    loadEPUB();
    return () => {
      // Cleanup EPUB instance
      if (epubRef.current) {
        epubRef.current.destroy();
      }
    };
  }, [book.epub_url]);

  const loadEPUB = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📖 Loading EPUB for:', book.title);

      // Dynamic import of epub.js
      const ePub = (await import('epubjs')).default;
      
      // Create proxy URL for CORS handling using our Supabase edge function
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      
      // Create EPUB book instance
      const epubBook = ePub(proxyUrl);
      epubRef.current = epubBook;

      // Wait for book to be ready
      await epubBook.ready;

      // Load navigation/TOC
      await epubBook.loaded.navigation;
      setToc(epubBook.navigation.toc || []);

      if (readerRef.current) {
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

        // Display first page
        await rendition.display();

        // Track location changes
        rendition.on('relocated', (location: any) => {
          setCurrentLocation(location.start.cfi);
        });

        console.log('✅ EPUB loaded successfully');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      setError(err instanceof Error ? err.message : 'Failed to load EPUB');
      setIsLoading(false);
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
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className={getAccessibilityClasses('text')}>Loading book...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center max-w-md p-6">
                  <p className="text-destructive mb-4">Error loading book: {error}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    There might be an issue with the EPUB file or network connection.
                  </p>
                  <div className="space-x-2">
                    <Button onClick={loadEPUB} variant="outline">Try Again</Button>
                    <Button onClick={onClose}>Close</Button>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={readerRef}
              className={`w-full h-full ${getAccessibilityClasses('container')}`}
            />
          </div>

          {/* Navigation Footer */}
          <div className="flex-shrink-0 p-4 border-t">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onClose}>
                <Home className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrevPage} disabled={isLoading || !!error}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline" onClick={handleNextPage} disabled={isLoading || !!error}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
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
