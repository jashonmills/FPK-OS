import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { File, FileImage, FileText, FileVideo, FileAudio, FileCode } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileGridProps {
  folderId: string | null;
  filters: {
    fileTypes: string[];
    tags: string[];
    dateRange: { start: Date; end: Date } | null;
    uploaderId: string | null;
  };
  onSelectFile: (fileId: string) => void;
}

export const FileGrid = ({ folderId, filters, onSelectFile }: FileGridProps) => {
  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files', folderId, filters],
    queryFn: async () => {
      let query = supabase
        .from('project_files')
        .select('*, file_tags:file_tag_assignments(tag:file_tags(name))')
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('video/')) return FileVideo;
    if (fileType.startsWith('audio/')) return FileAudio;
    if (fileType.includes('text') || fileType.includes('pdf')) return FileText;
    if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('typescript')) return FileCode;
    return File;
  };

  const getThumbnail = (file: any) => {
    if (file.file_type.startsWith('image/')) {
      const { data } = supabase.storage
        .from('project-files')
        .getPublicUrl(file.storage_path);
      return data.publicUrl;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="aspect-square animate-pulse bg-muted" />
        ))}
      </div>
    );
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map(file => {
        const Icon = getFileIcon(file.file_type);
        const thumbnail = getThumbnail(file);

        return (
          <Card
            key={file.id}
            className={cn(
              'aspect-square cursor-pointer hover:bg-accent transition-colors',
              'flex flex-col items-center justify-center p-4 group'
            )}
            onClick={() => onSelectFile(file.id)}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={file.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <Icon className="h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            <p className="mt-2 text-sm font-medium truncate w-full text-center">
              {file.name}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
