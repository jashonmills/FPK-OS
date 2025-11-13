import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface V3Document {
  id: string;
  file_name: string;
  category: string | null;
  status: string;
  is_classified: boolean;
  error_message?: string | null;
}

interface V3AnalyzeButtonProps {
  document: V3Document;
  onAnalysisStarted?: () => void;
}

export const V3AnalyzeButton = ({ document, onAnalysisStarted }: V3AnalyzeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  // Don't show button if not classified
  if (!document.is_classified) {
    return null;
  }

  const isAnalyzing = document.status === 'analyzing' || document.status === 'extracting';
  const isCompleted = document.status === 'completed';
  const isFailed = document.status === 'failed';

  const handleAnalyze = async () => {
    // Show confirmation for re-analysis
    if (isCompleted) {
      setShowConfirmDialog(true);
      return;
    }

    // Proceed directly for first-time analysis or retry
    await startAnalysis();
  };

  const startAnalysis = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const { data, error } = await supabase.functions.invoke('v3-analyze-document', {
        body: { document_id: document.id }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Analysis failed to start');
      }

      toast({
        title: "Analysis Started",
        description: `${document.file_name} is being analyzed. This may take 2-3 minutes.`,
      });

      onAnalysisStarted?.();
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || 'Failed to start document analysis',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonConfig = () => {
    if (isAnalyzing) {
      return {
        icon: Loader2,
        label: 'Analyzing...',
        variant: 'secondary' as const,
        disabled: true,
        className: 'cursor-not-allowed'
      };
    }

    if (isFailed) {
      return {
        icon: AlertCircle,
        label: 'Retry Analysis',
        variant: 'destructive' as const,
        disabled: false,
        className: ''
      };
    }

    if (isCompleted) {
      return {
        icon: RefreshCw,
        label: 'Re-analyze',
        variant: 'outline' as const,
        disabled: false,
        className: ''
      };
    }

    // Default: first-time analysis
    return {
      icon: Brain,
      label: 'Analyze Document',
      variant: 'default' as const,
      disabled: false,
      className: ''
    };
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <>
      <Button
        size="sm"
        variant={config.variant}
        onClick={handleAnalyze}
        disabled={config.disabled || isLoading}
        className={config.className}
      >
        <Icon className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
        {config.label}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-analyze Document?</AlertDialogTitle>
            <AlertDialogDescription>
              This document has already been analyzed. Re-analyzing will use AI credits and may update the extracted data with our latest models.
              <br /><br />
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startAnalysis}>
              Re-analyze
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
