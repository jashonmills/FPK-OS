import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSONViewer } from './JSONViewer';
import { useVirtualPagination } from '@/hooks/useVirtualPagination';

interface SmartDocxViewerProps {
  fileUrl: string;
}

export const SmartDocxViewer: React.FC<SmartDocxViewerProps> = ({ fileUrl }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActuallyJSON, setIsActuallyJSON] = useState(false);
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const loadDocx = async () => {
      try {
        setIsLoading(true);
        
        // Fetch and parse DOCX first
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const mammoth = await import('mammoth');
        
        // Extract TEXT (not HTML) to check for JSON
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        const textContent = textResult.value.trim();
        
        console.log('[SmartDocxViewer] Extracted text, first 200 chars:', textContent.substring(0, 200));
        
        // Check if extracted text is valid JSON
        if ((textContent.startsWith('{') || textContent.startsWith('[')) && 
            (textContent.endsWith('}') || textContent.endsWith(']'))) {
          try {
            JSON.parse(textContent);
            console.log('[SmartDocxViewer] Content is valid JSON, delegating to JSONViewer');
            
            // Create a blob URL with the JSON text for JSONViewer
            const jsonBlob = new Blob([textContent], { type: 'application/json' });
            const blobUrl = URL.createObjectURL(jsonBlob);
            setJsonUrl(blobUrl);
            setIsActuallyJSON(true);
            setIsLoading(false);
            return;
          } catch (e) {
            console.log('[SmartDocxViewer] Not valid JSON, rendering as DOCX');
          }
        }
        
        // If not JSON, convert to HTML for display
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(htmlResult.value);
        
        if (htmlResult.messages.length > 0) {
          console.warn('DOCX conversion warnings:', htmlResult.messages);
        }
      } catch (err) {
        console.error('Error loading DOCX:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocx();
    
    // Cleanup blob URL on unmount
    return () => {
      if (jsonUrl) {
        URL.revokeObjectURL(jsonUrl);
      }
    };
  }, [fileUrl, jsonUrl]);
  
  // If content is actually JSON, render JSONViewer with the blob URL
  if (isActuallyJSON && jsonUrl) {
    return <JSONViewer fileUrl={jsonUrl} />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Converting document...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <p className="text-red-600 font-semibold mb-2">Error Loading Document</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  
  // Use virtual pagination for the HTML content
  const { 
    pages, 
    currentPage, 
    totalPages, 
    nextPage, 
    previousPage, 
    canGoNext, 
    canGoPrevious 
  } = useVirtualPagination(htmlContent, {
    pageHeight: 850,
    minElementsPerPage: 2
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page Content Area */}
      <ScrollArea className="flex-1">
        <div 
          className="p-6 prose prose-sm max-w-none min-h-[600px]"
          dangerouslySetInnerHTML={{ __html: pages[currentPage] || '' }}
        />
      </ScrollArea>
      
      {/* Pagination Control Bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={!canGoPrevious}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(((currentPage + 1) / totalPages) * 100)}% complete)
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!canGoNext}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
