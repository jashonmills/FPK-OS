import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ClearTestDataButton = () => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      console.log('🧹 Starting complete data clear for family...');

      // Get current user's family
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: membership } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!membership) throw new Error('No family membership found');

      const { data, error } = await supabase.functions.invoke('clear-family-data', {
        body: { family_id: membership.family_id }
      });

      if (error) throw error;

      console.log('✅ Clear results:', data);
      
      toast.success('All data cleared successfully', {
        description: `Deleted: ${data.results.documents_deleted} docs, ${data.results.chat_conversations_deleted} chats, ${data.results.ai_insights_deleted} insights, ${data.results.storage_files_deleted} files, ${data.results.duplicate_students_deleted} duplicate students. Profile and 1 student retained.`
      });

      // Reload to home to show fresh state
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error(error instanceof Error ? error.message : "Failed to clear data");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Complete Fresh Start
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Complete Database Reset</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="font-semibold text-destructive">This will permanently delete ALL of your data:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All uploaded documents and files</li>
              <li>All AI insights and analysis</li>
              <li>All logs (educator, parent, incident, sleep)</li>
              <li>All chat conversations and messages</li>
              <li>All goals and progress tracking</li>
              <li>All team discussions and notes</li>
              <li>All error logs and diagnostics</li>
              <li>Duplicate student profiles</li>
            </ul>
            <p className="font-semibold text-green-600">What will remain:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Your profile</li>
              <li>One student profile</li>
              <li>Family membership</li>
            </ul>
            <p className="font-bold mt-2 text-destructive">This action cannot be undone!</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearData}
            disabled={isClearing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isClearing ? "Clearing..." : "Yes, Clear Everything"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
