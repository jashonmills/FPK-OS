import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const CleanupDuplicateStudentsButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    try {
      setIsLoading(true);
      console.log('🧹 Starting duplicate student cleanup...');

      const { data, error } = await supabase.functions.invoke('cleanup-duplicate-students');

      if (error) throw error;

      console.log('Cleanup results:', data);
      
      toast.success('Cleanup completed successfully', {
        description: `Deleted ${data.results.metrics_deleted} metrics, deactivated ${data.results.students_deactivated} students, removed ${data.results.goals_deleted} goals and ${data.results.insights_deleted} insights.`
      });

      // Reload the page to reflect changes
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Cleanup error:', error);
      toast.error('Cleanup failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCleanup} 
      variant="destructive"
      disabled={isLoading}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isLoading ? 'Cleaning up...' : 'Clean Up Duplicate Students'}
    </Button>
  );
};
