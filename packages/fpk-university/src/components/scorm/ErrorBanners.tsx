import React from 'react';
import { AlertCircle, X, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ContentTypeIssueBannerProps {
  error: string;
  onGenerate?: () => void;
  onDismiss: () => void;
}

export const ContentTypeIssueBanner: React.FC<ContentTypeIssueBannerProps> = ({
  error,
  onGenerate,
  onDismiss
}) => {
  const is404 = error.includes('404') || error.toLowerCase().includes('not found');
  
  return (
    <Alert className="mb-4 border-yellow-400 bg-yellow-50">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-start justify-between">
        <div className="flex-1">
          <strong className="text-yellow-800">Content Issue:</strong>
          <span className="ml-2 text-yellow-700">{error}</span>
          {is404 && (
            <p className="mt-2 text-sm text-yellow-600">
              The SCORM content files may need to be generated or extracted.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {is404 && onGenerate && (
            <Button
              size="sm"
              onClick={onGenerate}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate Content
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

interface RuntimeIssueBannerProps {
  error: string;
  diagnostics?: string[];
  onDismiss: () => void;
}

export const RuntimeIssueBanner: React.FC<RuntimeIssueBannerProps> = ({
  error,
  diagnostics,
  onDismiss
}) => {
  const { toast } = useToast();
  
  const copyDiagnostics = () => {
    const diagnosticText = [
      `Runtime Error: ${error}`,
      ...(diagnostics || []),
      `Timestamp: ${new Date().toISOString()}`
    ].join('\n');
    
    navigator.clipboard.writeText(diagnosticText);
    toast({
      title: "Diagnostics Copied",
      description: "Error diagnostics have been copied to clipboard",
    });
  };

  return (
    <Alert className="mb-4 border-red-400 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-start justify-between">
        <div className="flex-1">
          <strong className="text-red-800">Runtime Issue:</strong>
          <span className="ml-2 text-red-700">{error}</span>
          {diagnostics && diagnostics.length > 0 && (
            <details className="mt-2">
              <summary className="text-sm cursor-pointer text-red-600">
                View Diagnostics
              </summary>
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {diagnostics.map((diag, index) => (
                  <li key={index}>{diag}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {diagnostics && (
            <Button
              size="sm"
              variant="outline"
              onClick={copyDiagnostics}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Diagnostics
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};