import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { FileText, FileImage, FileVideo, FileAudio, File } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  const { data: files, isLoading } = useQuery({
    queryKey: ['files-large', folderId, filters, user?.id],
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

      // Generate signed URLs for image files
      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          if (file.file_type.startsWith('image/')) {
            const { data: signedData } = await supabase.storage
              .from('project-files')
              .createSignedUrl(file.storage_path, 3600);
            
            return { ...file, thumbnailUrl: signedData?.signedUrl };
          }
          return file;
        })
      );

      return filesWithUrls;
    },
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('video/')) return FileVideo;
    if (fileType.startsWith('audio/')) return FileAudio;
    if (fileType.includes('text') || fileType.includes('document')) return FileText;
    return File;
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
    return file.thumbnailUrl || null;
  };

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
        No files found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file) => {
        const thumbnail = getThumbnail(file);
        const Icon = getFileIcon(file.file_type);

        return (
          <Card
            key={file.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectFile(file.id)}
          >
            <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon className="w-24 h-24 text-muted-foreground" />
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(file.file_size)}</span>
                <span>{formatDate(file.created_at)}</span>
              </div>
              {file.uploader?.full_name && (
                <p className="text-xs text-muted-foreground">
                  By {file.uploader.full_name}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
