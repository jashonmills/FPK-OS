import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentName: string;
  errorMessage: string;
  retryCount: number;
  onRetry: (docId: string) => void;
}

export function AnalysisErrorModal({ 
  open, 
  onOpenChange, 
  documentId,
  documentName,
  errorMessage, 
  retryCount, 
  onRetry 
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Analysis Failed: {documentName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm font-semibold mb-2 text-destructive">Error Details:</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
          
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground">
              This document has failed {retryCount} time(s) automatically.
            </p>
          )}
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm font-semibold mb-2">Common Solutions:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>Insufficient credits:</strong> Purchase more AI credits in Settings</li>
              <li><strong>Document too large:</strong> Split document into files under 100 pages</li>
              <li><strong>Rate limit:</strong> Wait a few minutes and retry</li>
              <li><strong>Network error:</strong> Check your connection and retry</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={() => {
              onRetry(documentId);
              onOpenChange(false);
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
