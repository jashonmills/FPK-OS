
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
  const epubRef = useRef<any>(null);

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

      // For now, show a placeholder reader since we don't have real EPUB files
      // In a real implementation, this would use epub.js:
      /*
      const ePub = (await import('epubjs')).default;
      const epubBook = ePub(book.epub_url);
      epubRef.current = epubBook;
      
      const rendition = epubBook.renderTo(readerRef.current!, {
        width: '100%',
        height: '100%',
        flow: 'paginated'
      });
      
      await rendition.display();
      */
      
      // Placeholder content
      if (readerRef.current) {
        readerRef.current.innerHTML = `
          <div class="p-8 max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-4">${book.title}</h1>
            <p class="text-lg text-muted-foreground mb-6">by ${book.author}</p>
            <div class="prose prose-lg">
              <p>This is a preview of the EPUB reader. In a full implementation, this would display the actual book content using EPUB.js.</p>
              <p>${book.description || 'No description available.'}</p>
              <p>This book covers topics related to: ${book.subjects.join(', ')}</p>
              <p>The reader would provide full navigation, text reflow, and accessibility features for a complete reading experience.</p>
            </div>
          </div>
        `;
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load EPUB');
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    // In real implementation: epubRef.current?.rendition.prev()
    console.log('Previous page');
  };

  const handleNextPage = () => {
    // In real implementation: epubRef.current?.rendition.next()
    console.log('Next page');
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    
    // In real implementation: update rendition font size
    if (readerRef.current) {
      readerRef.current.style.fontSize = `${newSize}px`;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
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
                <div className="text-center">
                  <p className="text-destructive mb-4">Error loading book: {error}</p>
                  <Button onClick={loadEPUB}>Try Again</Button>
                </div>
              </div>
            )}

            <div
              ref={readerRef}
              className={`w-full h-full overflow-auto ${getAccessibilityClasses('container')}`}
              style={{ fontSize: `${fontSize}px` }}
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
        </div>

        {/* Table of Contents Modal */}
        {showTOC && (
          <Dialog open={showTOC} onOpenChange={setShowTOC}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Table of Contents</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Table of contents would be populated from EPUB metadata in a full implementation.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EPUBReader;
