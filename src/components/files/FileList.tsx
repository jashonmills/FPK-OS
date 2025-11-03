import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { File, MoreVertical, Pencil, FolderInput, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RenameFileDialog } from './RenameFileDialog';
import { MoveFileDialog } from './MoveFileDialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface FileListProps {
  folderId: string | null;
  filters: {
    fileTypes: string[];
    tags: string[];
    dateRange: { start: Date; end: Date } | null;
    uploaderId: string | null;
  };
  onSelectFile: (fileId: string) => void;
}

export const FileList = ({ folderId, filters, onSelectFile }: FileListProps) => {
  const [renameFile, setRenameFile] = useState<{ id: string; name: string } | null>(null);
  const [moveFile, setMoveFile] = useState<{ id: string; name: string; folderId: string | null } | null>(null);
  const [deleteFile, setDeleteFile] = useState<{ id: string; name: string; storagePath: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files', folderId, filters],
    queryFn: async () => {
        let query = supabase
          .from('project_files')
          .select('*, uploader:profiles!uploader_id(full_name)')
          .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
      }

      if (filters.fileTypes.length > 0) {
        query = query.in('file_type', filters.fileTypes);
      }

      if (filters.uploaderId) {
        query = query.eq('uploader_id', filters.uploaderId);
      }

      if (filters.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const deleteMutation = useMutation({
    mutationFn: async (file: { id: string; storagePath: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([file.storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files'] });
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      setDeleteFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading files...</div>;
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <File className="h-12 w-12 mb-4 opacity-50" />
        <p>No files in this folder</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <TableRow
              key={file.id}
              className="hover:bg-accent"
            >
              <TableCell className="font-medium cursor-pointer" onClick={() => onSelectFile(file.id)}>{file.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {file.file_type.split('/')[1]?.toUpperCase()}
              </TableCell>
              <TableCell>{formatFileSize(file.file_size)}</TableCell>
              <TableCell>{(file.uploader as any)?.full_name || 'Unknown'}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setRenameFile({ id: file.id, name: file.name })}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMoveFile({ id: file.id, name: file.name, folderId: file.folder_id })}>
                      <FolderInput className="h-4 w-4 mr-2" />
                      Move to...
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteFile({ id: file.id, name: file.name, storagePath: file.storage_path })}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RenameFileDialog
        fileId={renameFile?.id || null}
        currentName={renameFile?.name || ''}
        onClose={() => setRenameFile(null)}
      />

      <MoveFileDialog
        fileId={moveFile?.id || null}
        fileName={moveFile?.name || ''}
        currentFolderId={moveFile?.folderId || null}
        onClose={() => setMoveFile(null)}
      />

      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteFile?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFile && deleteMutation.mutate({ id: deleteFile.id, storagePath: deleteFile.storagePath })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
