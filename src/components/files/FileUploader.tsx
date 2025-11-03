import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  customName?: string;
}

export const FileUploader = ({ open, onOpenChange, folderId }: FileUploaderProps) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: UploadFile) => {
      const { file } = uploadFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          folder_id: folderId,
          name: uploadFile.customName || file.name,
          storage_path: fileName,
          file_type: file.type,
          file_size: file.size,
          uploader_id: user!.id,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files'] });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploadFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Start uploading each file
    newUploadFiles.forEach(uploadFile => {
      setUploadFiles(prev =>
        prev.map(f => f.file === uploadFile.file ? { ...f, status: 'uploading' as const } : f)
      );

      uploadMutation.mutate(uploadFile, {
        onSuccess: () => {
          setUploadFiles(prev =>
            prev.map(f => f.file === uploadFile.file ? { ...f, status: 'complete' as const, progress: 100 } : f)
          );
        },
        onError: (error: Error) => {
          setUploadFiles(prev =>
            prev.map(f => f.file === uploadFile.file ? { ...f, status: 'error' as const, error: error.message } : f)
          );
          toast({
            title: 'Upload failed',
            description: `Failed to upload ${uploadFile.file.name}`,
            variant: 'destructive',
          });
        },
      });
    });
  }, [folderId, user, uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (file: File) => {
    setUploadFiles(prev => prev.filter(f => f.file !== file));
  };

  const updateFileName = (file: File, newName: string) => {
    setUploadFiles(prev =>
      prev.map(f => f.file === file ? { ...f, customName: newName } : f)
    );
  };

  const isAllComplete = uploadFiles.length > 0 && uploadFiles.every(f => f.status === 'complete');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg">Drop files here...</p>
          ) : (
            <>
              <p className="text-lg mb-2">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground">or click to browse (max 20MB per file)</p>
            </>
          )}
        </div>

        {uploadFiles.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadFiles.map((uploadFile, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  {uploadFile.status === 'pending' ? (
                    <input
                      type="text"
                      value={uploadFile.customName || uploadFile.file.name}
                      onChange={(e) => updateFileName(uploadFile.file, e.target.value)}
                      className="text-sm font-medium w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none"
                      placeholder="File name"
                    />
                  ) : (
                    <p className="text-sm font-medium truncate">
                      {uploadFile.customName || uploadFile.file.name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-1 flex-1" />
                    )}
                    {uploadFile.status === 'complete' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {uploadFile.status === 'error' && (
                      <p className="text-xs text-destructive">{uploadFile.error}</p>
                    )}
                  </div>
                </div>
                {uploadFile.status !== 'complete' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {isAllComplete && (
            <Button onClick={() => {
              setUploadFiles([]);
              onOpenChange(false);
            }}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
