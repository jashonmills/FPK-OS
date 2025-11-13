import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface V3DeleteButtonProps {
  documentId: string;
  documentName: string;
  onDeleted?: () => void;
}

export function V3DeleteButton({ documentId, documentName, onDeleted }: V3DeleteButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('v3-delete-document', {
        body: { document_id: documentId }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Document deleted successfully');
        onDeleted?.();
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document: ' + error.message);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to permanently delete <strong>{documentName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                This will remove:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>The document file from storage</li>
                <li>All extracted metrics</li>
                <li>All AI-generated insights</li>
                <li>All progress tracking data</li>
              </ul>
              <p className="text-destructive font-medium pt-2">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Document'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
