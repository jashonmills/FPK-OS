import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TagEditor } from './TagEditor';
import { VersionHistory } from './VersionHistory';
import { LinkedDocuments } from '@/components/docs/LinkedDocuments';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, HardDrive } from 'lucide-react';
import { format } from 'date-fns';

interface FileMetadataProps {
  fileId: string;
}

export const FileMetadata = ({ fileId }: FileMetadataProps) => {
  const { data: file } = useQuery({
    queryKey: ['file-metadata', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_files')
        .select('*, uploader:profiles!uploader_id(full_name)')
        .eq('id', fileId)
        .single();

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

  if (!file) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">File Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Uploaded by</p>
              <p className="font-medium">{(file.uploader as any)?.full_name || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Uploaded</p>
              <p className="font-medium">
                {format(new Date(file.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <HardDrive className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Size</p>
              <p className="font-medium">{formatFileSize(file.file_size)}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <TagEditor fileId={fileId} />

      <Separator />

      <LinkedDocuments fileId={fileId} />

      <Separator />

      <VersionHistory fileId={fileId} />
    </div>
  );
};
