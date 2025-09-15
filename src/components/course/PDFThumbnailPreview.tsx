import React, { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedPDFViewer from '@/components/library/EnhancedPDFViewer';
import { useToast } from '@/hooks/use-toast';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFThumbnailPreviewProps {
  pdfUrl: string;
  fileName: string;
  title: string;
  moduleReference: string;
  className?: string;
}

export const PDFThumbnailPreview: React.FC<PDFThumbnailPreviewProps> = ({
  pdfUrl,
  fileName,
  title,
  moduleReference,
  className = ""
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleThumbnailClick = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

  const handleOpenInNewTab = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    toast({
      title: 'PDF Opened',
      description: `${fileName} opened in new tab for reference`,
      duration: 3000,
    });
  }, [pdfUrl, fileName, toast]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleOpenInNewTab(e);
  }, [handleOpenInNewTab]);

  return (
    <>
      <div className={`group cursor-pointer ${className}`}>
        <div className="space-y-3">
          {/* Title and Module Reference */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{moduleReference}</p>
          </div>

          {/* PDF Thumbnail Container */}
          <div 
            className="relative bg-white border-2 border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 aspect-[3/4] group-hover:scale-[1.02]"
            onClick={handleThumbnailClick}
            onContextMenu={handleContextMenu}
          >
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                <Eye className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm">Preview unavailable</span>
                <span className="text-xs">Click to view PDF</span>
              </div>
            )}

            {/* PDF Thumbnail */}
            <Document
              file={pdfUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading=""
              error=""
            >
              {!hasError && (
                <Page
                  pageNumber={1}
                  width={300}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading=""
                  error=""
                />
              )}
            </Document>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <span className="text-sm font-medium text-foreground">Click to view</span>
              </div>
            </div>

            {/* Open in New Tab Button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
              onClick={handleOpenInNewTab}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleThumbnailClick}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              New Tab
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {isViewerOpen && (
        <EnhancedPDFViewer
          fileUrl={pdfUrl}
          fileName={fileName}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  );
};

export default PDFThumbnailPreview;