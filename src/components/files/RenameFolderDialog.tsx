import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RenameFolderDialogProps {
  folderId: string | null;
  currentName: string;
  onClose: () => void;
}

export const RenameFolderDialog = ({ folderId, currentName, onClose }: RenameFolderDialogProps) => {
  const [newName, setNewName] = useState(currentName);
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!folderId) throw new Error('No folder selected');

      const { error } = await supabase
        .from('file_folders')
        .update({ name })
        .eq('id', folderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-folders'] });
      toast.success('Folder renamed successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to rename folder');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== currentName) {
      renameMutation.mutate(newName.trim());
    }
  };

  return (
    <Dialog open={!!folderId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!newName.trim() || newName === currentName || renameMutation.isPending}
            >
              {renameMutation.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};