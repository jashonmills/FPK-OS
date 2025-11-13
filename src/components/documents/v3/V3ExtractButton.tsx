import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface V3Document {
  id: string;
  file_name: string;
  status: string;
  extracted_content?: string | null;
}

interface V3ExtractButtonProps {
  document: V3Document;
  onExtractionStarted?: () => void;
}

export const V3ExtractButton = ({ document, onExtractionStarted }: V3ExtractButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Only show if document needs extraction
  const needsExtraction = !document.extracted_content || document.extracted_content.trim().length < 50;
  const isExtracting = document.status === 'extracting';

  if (!needsExtraction && !isExtracting) {
    return null;
  }

  const handleExtract = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('v3-extract-text', {
        body: { document_id: document.id }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Text extraction failed');
      }

      toast({
        title: "Extraction Complete",
        description: `Extracted ${data.extracted_length} characters from ${document.file_name}`,
      });

      onExtractionStarted?.();
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: error.message || 'Failed to extract text from document',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isExtracting ? 'secondary' : 'outline'}
      onClick={handleExtract}
      disabled={isLoading || isExtracting}
    >
      {isExtracting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Extracting...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Extract Text
        </>
      )}
    </Button>
  );
};
