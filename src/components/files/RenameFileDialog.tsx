import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface RenameFileDialogProps {
  fileId: string | null;
  currentName: string;
  onClose: () => void;
}

export const RenameFileDialog = ({ fileId, currentName, onClose }: RenameFileDialogProps) => {
  const [newName, setNewName] = useState(currentName);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!fileId) return;
      
      const { error } = await supabase
        .from('project_files')
        .update({ name })
        .eq('id', fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files'] });
      toast({
        title: 'Success',
        description: 'File renamed successfully',
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== currentName) {
      renameMutation.mutate(newName.trim());
    }
  };

  return (
    <Dialog open={!!fileId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!newName.trim() || newName === currentName || renameMutation.isPending}
            >
              Rename
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
