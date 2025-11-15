import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BatchExtractTriggerProps {
  clientId: string;
  onComplete?: () => void;
}

export const BatchExtractTrigger = ({ clientId, onComplete }: BatchExtractTriggerProps) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleExtractMetrics = async () => {
    setIsExtracting(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-extract-metrics', {
        body: { client_id: clientId }
      });

      if (error) throw error;

      // Handle the case where no documents need extraction
      if (data.processed === 0 || data.total === 0) {
        toast({
          title: "No Documents to Process",
          description: "All documents have already been extracted, or no documents are available.",
        });
        setResults({
          total: 0,
          successful: 0,
          failed: 0,
          errors: []
        });
        return;
      }

      setResults(data);

      if (data.successful > 0) {
        toast({
          title: "Extraction Complete",
          description: `Successfully extracted metrics from ${data.successful} of ${data.total} documents.`,
        });
        
        // Trigger refresh in parent component
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      } else if (data.failed > 0) {
        toast({
          title: "Extraction Failed",
          description: "All documents failed to extract. Check the error details below.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Batch extraction error:', error);
      toast({
        title: "Extraction Error",
        description: error instanceof Error ? error.message : "Failed to extract metrics",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-secondary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          AI Metric Extraction
        </CardTitle>
        <CardDescription>
          Extract structured metrics and insights from uploaded documents using AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleExtractMetrics} 
          disabled={isExtracting}
          size="lg"
          className="w-full"
        >
          {isExtracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Documents...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Extract Metrics from Documents
            </>
          )}
        </Button>

        {isExtracting && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Analyzing documents and extracting structured data. This may take a few minutes...
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-2xl font-bold text-foreground">{results.total}</div>
                <div className="text-xs text-muted-foreground">Total Documents</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{results.successful}</span>
                </div>
                <div className="text-xs text-muted-foreground">Successful</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-2xl font-bold text-destructive">{results.failed}</span>
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Errors:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
