import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackMetadataProps {
  message: string;
}

interface ParsedMetadata {
  page?: string;
  timestamp?: string;
  browser?: string;
  viewport?: string;
  user?: string;
  [key: string]: string | undefined;
}

const FeedbackMetadata: React.FC<FeedbackMetadataProps> = ({ message }) => {
  const extractMetadata = (message: string): ParsedMetadata => {
    const metadata: ParsedMetadata = {};
    
    // Extract page information
    const pageMatch = message.match(/Page: ([^\s]+)/);
    if (pageMatch) {
      metadata.page = pageMatch[1];
    }
    
    // Extract timestamp
    const timestampMatch = message.match(/Timestamp: ([^\s]+)/);
    if (timestampMatch) {
      metadata.timestamp = timestampMatch[1];
    }
    
    // Extract browser information
    const browserMatch = message.match(/Browser: ([^V]+?)(?:\s+Viewport|$)/);
    if (browserMatch) {
      metadata.browser = browserMatch[1].trim();
    }
    
    // Extract viewport
    const viewportMatch = message.match(/Viewport: (\d+x\d+)/);
    if (viewportMatch) {
      metadata.viewport = viewportMatch[1];
    }
    
    // Extract user
    const userMatch = message.match(/User: ([^\s]+)/);
    if (userMatch) {
      metadata.user = userMatch[1];
    }
    
    return metadata;
  };

  const copyMetadata = () => {
    const metadata = extractMetadata(message);
    const metadataText = Object.entries(metadata)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(metadataText);
    toast.success('Metadata copied to clipboard');
  };

  const metadata = extractMetadata(message);
  const hasMetadata = Object.values(metadata).some(value => value);

  if (!hasMetadata) {
    return (
      <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
        No additional context metadata available.
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-muted/30 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Technical Context</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyMetadata}
          className="h-6 px-2"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        {metadata.page && (
          <div className="flex items-start">
            <span className="font-medium min-w-20">Page:</span>
            <span className="text-muted-foreground font-mono">{metadata.page}</span>
          </div>
        )}
        
        {metadata.timestamp && (
          <div className="flex items-start">
            <span className="font-medium min-w-20">Time:</span>
            <span className="text-muted-foreground">
              {new Date(metadata.timestamp.replace('Z', '')).toLocaleString()}
            </span>
          </div>
        )}
        
        {metadata.viewport && (
          <div className="flex items-start">
            <span className="font-medium min-w-20">Viewport:</span>
            <span className="text-muted-foreground">{metadata.viewport}</span>
          </div>
        )}
        
        {metadata.browser && (
          <div className="flex items-start">
            <span className="font-medium min-w-20">Browser:</span>
            <span className="text-muted-foreground text-xs break-all">
              {metadata.browser}
            </span>
          </div>
        )}
        
        {metadata.user && (
          <div className="flex items-start">
            <span className="font-medium min-w-20">User ID:</span>
            <span className="text-muted-foreground font-mono text-xs">{metadata.user}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackMetadata;