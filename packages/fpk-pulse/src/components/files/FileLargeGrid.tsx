import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Image as ImageIcon, Music, Video, Archive, File, MoreVertical, Pencil, FolderInput, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RenameFileDialog } from './RenameFileDialog';
import { MoveFileDialog } from './MoveFileDialog';
import { useToast } from '@/hooks/use-toast';

interface FileLargeGridProps {
  folderId: string | null;
  filters: {
    fileTypes: string[];
    tags: string[];
    dateRange: { start: Date; end: Date } | null;
    uploaderId: string | null;
  };
  onSelectFile: (fileId: string) => void;
}

export const FileLargeGrid = ({ folderId, filters, onSelectFile }: FileLargeGridProps) => {
  const [renameFile, setRenameFile] = useState<{ id: string; name: string } | null>(null);
  const [moveFile, setMoveFile] = useState<{ id: string; name: string; folderId: string | null } | null>(null);
  const [deleteFile, setDeleteFile] = useState<{ id: string; name: string; storagePath: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files-large', folderId, filters],
    queryFn: async () => {
      let query = supabase
        .from('project_files')
        .select('*, profiles!uploader_id(full_name)')
        .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
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

      // Client-side filtering: Filter by file type prefixes
      let filteredData = data || [];
      if (filters.fileTypes.length > 0) {
        filteredData = filteredData.filter(file => 
          filters.fileTypes.some(prefix => file.file_type.startsWith(prefix))
        );
      }

      // Generate signed URLs for image files
      const filesWithUrls = await Promise.all(
        filteredData.map(async (file) => {
          if (file.file_type.startsWith('image/')) {
            const { data: signedData } = await supabase.storage
              .from('project-files')
              .createSignedUrl(file.storage_path, 3600);
            
            return { ...file, thumbnail_url: signedData?.signedUrl };
          }
          return file;
        })
      );

      return filesWithUrls;
    },
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-24 w-24 text-muted-foreground" />;
    if (fileType.startsWith('video/')) return <Video className="h-24 w-24 text-muted-foreground" />;
    if (fileType.startsWith('audio/')) return <Music className="h-24 w-24 text-muted-foreground" />;
    if (fileType.includes('text') || fileType.includes('pdf')) return <FileText className="h-24 w-24 text-muted-foreground" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-24 w-24 text-muted-foreground" />;
    return <File className="h-24 w-24 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getThumbnail = (file: any) => {
    return file.thumbnail_url;
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="w-full h-48 mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <File className="h-12 w-12 mb-4 opacity-50" />
        <p>No files found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <Card
            key={file.id}
            className="group overflow-hidden hover:shadow-lg transition-shadow relative"
          >
            <div className="aspect-video relative bg-muted cursor-pointer" onClick={() => onSelectFile(file.id)}>
              {getThumbnail(file) ? (
                <img
                  src={getThumbnail(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getFileIcon(file.file_type)}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-base flex-1 cursor-pointer" onClick={() => onSelectFile(file.id)}>{file.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
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
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{formatFileSize(file.file_size)}</p>
                <p>{formatDate(file.created_at)}</p>
                {file.profiles?.full_name && (
                  <p className="truncate">Uploaded by {file.profiles.full_name}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

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
