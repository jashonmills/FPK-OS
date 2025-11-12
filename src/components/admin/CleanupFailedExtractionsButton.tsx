import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CleanupFailedExtractionsButton = () => {
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      console.log('🧹 Starting cleanup of failed text extractions...');

      const { data, error } = await supabase.functions.invoke('cleanup-failed-extractions');

      if (error) throw error;

      if (data.cleaned === 0) {
        toast.info('No stuck extractions found', {
          description: 'All documents are processing normally'
        });
      } else {
        toast.success(`Cleaned up ${data.cleaned} stuck extraction(s)`, {
          description: 'Documents with failed text extraction have been removed'
        });
      }

      console.log('✅ Cleanup results:', data);
    } catch (error) {
      console.error('Error cleaning up failed extractions:', error);
      toast.error(error instanceof Error ? error.message : "Failed to clean up extractions");
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleCleanup}
      disabled={isCleaning}
    >
      <FileX className="h-4 w-4 mr-2" />
      {isCleaning ? "Cleaning..." : "Cleanup Failed Extractions"}
    </Button>
  );
};
