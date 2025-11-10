import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { parseCourseJSON } from '@/lib/courseJSONParser';

interface JSONViewerProps {
  fileUrl: string;
}

export const JSONViewer: React.FC<JSONViewerProps> = ({ fileUrl }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  
  useEffect(() => {
    const loadJSON = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(fileUrl);
        const rawText = await response.text();
        
        console.log('[JSONViewer] Raw content preview:', rawText.substring(0, 200));
        
        // Parse and format the JSON
        const parsed = parseCourseJSON(rawText);
        setContent(parsed.formatted);
        if (parsed.title) {
          setTitle(parsed.title);
        }
      } catch (err) {
        console.error('Error loading JSON:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJSON();
  }, [fileUrl]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Parsing JSON content...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <p className="text-red-600 font-semibold mb-2">Error Loading JSON</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto">
        {title && (
          <div className="mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Structured Course Content</p>
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </ScrollArea>
  );
};
