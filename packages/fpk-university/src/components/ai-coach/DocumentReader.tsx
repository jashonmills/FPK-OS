import React, { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedPDFViewer from '@/components/library/OptimizedPDFViewer';
import InlinePDFViewer from '@/components/library/InlinePDFViewer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JSONViewer } from './viewers/JSONViewer';
import { SmartDocxViewer } from './viewers/SmartDocxViewer';

interface DocumentReaderProps {
  document: {
    id: string;
    title: string;
    file_name: string;
    file_url: string;
    file_type: string;
  };
  onClose: () => void;
  mode?: 'inline' | 'modal'; // Default: inline for embedded viewing
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({ document, onClose, mode = 'inline' }) => {
  const getFileExtension = () => {
    const fileName = document.file_name || '';
    return fileName.split('.').pop()?.toLowerCase() || '';
  };
  
  const renderContent = () => {
    const extension = getFileExtension();
    const mimeType = document.file_type?.toLowerCase() || '';
    const fileName = document.file_name?.toLowerCase() || '';
    const title = document.title?.toLowerCase() || '';
    
    console.log('[DocumentReader] File detection:', { extension, mimeType, fileName, title });
    
    // PDF Files - use inline or modal based on mode
    if (extension === 'pdf' || mimeType.includes('pdf')) {
      if (mode === 'inline') {
        return (
          <div className="h-full w-full">
            <InlinePDFViewer
              fileUrl={document.file_url}
              fileName={document.file_name}
              onClose={onClose}
            />
          </div>
        );
      } else {
        return (
          <div className="h-full w-full">
            <OptimizedPDFViewer
              fileUrl={document.file_url}
              fileName={document.file_name}
              onClose={onClose}
            />
          </div>
        );
      }
    }
    
    // JSON Files - Smart detection
    // Check extension, mime type, filename, or title for JSON indicators
    if (extension === 'json' || 
        mimeType.includes('json') || 
        mimeType.includes('application/json') ||
        fileName.includes('json') ||
        title.includes('json')) {
      console.log('[DocumentReader] Rendering as JSON');
      return <JSONViewer fileUrl={document.file_url} />;
    }
    
    // DOCX Files - Use smart viewer that detects JSON
    if (extension === 'docx' || mimeType.includes('wordprocessingml')) {
      return <SmartDocxViewer fileUrl={document.file_url} />;
    }
    
    // TXT Files
    if (extension === 'txt' || mimeType.includes('text/plain')) {
      return <TextViewer fileUrl={document.file_url} />;
    }
    
    // Fallback for unsupported types
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Preview Not Available
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          File type: {extension.toUpperCase()}
        </p>
        <Button
          onClick={() => window.open(document.file_url, '_blank')}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download File
        </Button>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden shadow-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {document.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {document.file_name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Document Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

// Text Viewer Component
const TextViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [content, setContent] = useState<string>('Loading...');
  
  React.useEffect(() => {
    fetch(fileUrl)
      .then(res => res.text())
      .then(setContent)
      .catch(err => setContent(`Error loading file: ${err.message}`));
  }, [fileUrl]);
  
  return (
    <ScrollArea className="h-full">
      <pre className="p-6 text-sm font-mono whitespace-pre-wrap">
        {content}
      </pre>
    </ScrollArea>
  );
};

// DOCX Viewer Component
const DocxViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  React.useEffect(() => {
    const loadDocx = async () => {
      try {
        setIsLoading(true);
        const mammoth = await import('mammoth');
        
        // Fetch the DOCX file
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Convert to HTML
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
