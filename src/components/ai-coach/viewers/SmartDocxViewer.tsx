import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JSONViewer } from './JSONViewer';

interface SmartDocxViewerProps {
  fileUrl: string;
}

export const SmartDocxViewer: React.FC<SmartDocxViewerProps> = ({ fileUrl }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActuallyJSON, setIsActuallyJSON] = useState(false);
  
  useEffect(() => {
    const loadDocx = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the file once
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        console.log('[SmartDocxViewer] File loaded, checking content type');
        
        // Read as text to check if it's JSON
        const textContent = await blob.text();
        const trimmedContent = textContent.trim();
        
        console.log('[SmartDocxViewer] First 100 chars:', trimmedContent.substring(0, 100));
        
        // Check if content is actually JSON
        if ((trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) && 
            (trimmedContent.endsWith('}') || trimmedContent.endsWith(']'))) {
          try {
            JSON.parse(trimmedContent);
            console.log('[SmartDocxViewer] Content is valid JSON, delegating to JSONViewer');
            setIsActuallyJSON(true);
            setIsLoading(false);
            return;
          } catch {
            console.log('[SmartDocxViewer] Looks like JSON but invalid, continuing with DOCX parsing');
          }
        }
        
        // If not JSON, proceed with DOCX parsing - convert blob to arrayBuffer
        const mammoth = await import('mammoth');
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
        
        if (result.messages.length > 0) {
          console.warn('DOCX conversion warnings:', result.messages);
        }
      } catch (err) {
        console.error('Error loading DOCX:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocx();
  }, [fileUrl]);
  
  // If content is actually JSON, render JSONViewer
  if (isActuallyJSON) {
    return <JSONViewer fileUrl={fileUrl} />;
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
  
  return (
    <ScrollArea className="h-full">
      <div 
        className="p-6 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </ScrollArea>
  );
};
