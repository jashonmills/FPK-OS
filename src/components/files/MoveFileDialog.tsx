import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MoveFileDialogProps {
  fileId: string | null;
  fileName: string;
  currentFolderId: string | null;
  onClose: () => void;
}

export const MoveFileDialog = ({ fileId, fileName, currentFolderId, onClose }: MoveFileDialogProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: folders } = useQuery({
    queryKey: ['file-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const moveMutation = useMutation({
    mutationFn: async (folderId: string | null) => {
      if (!fileId) return;
      
      const { error } = await supabase
        .from('project_files')
        .update({ folder_id: folderId })
        .eq('id', fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files'] });
      toast({
        title: 'Success',
        description: 'File moved successfully',
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

  const handleMove = () => {
    if (selectedFolderId !== currentFolderId) {
      moveMutation.mutate(selectedFolderId);
    }
  };

  return (
    <Dialog open={!!fileId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Moving: <span className="font-medium">{fileName}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="folder">Destination Folder</Label>
            <Select
              value={selectedFolderId || 'root'}
              onValueChange={(value) => setSelectedFolderId(value === 'root' ? null : value)}
            >
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root (No Folder)</SelectItem>
                {folders?.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleMove}
              disabled={selectedFolderId === currentFolderId || moveMutation.isPending}
            >
              Move
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
