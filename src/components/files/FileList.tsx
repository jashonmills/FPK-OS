import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { File } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files', folderId, filters],
    queryFn: async () => {
      let query = supabase
        .from('project_files')
        .select('*, uploader:uploader_id(full_name)')
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Uploaded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map(file => (
          <TableRow
            key={file.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onSelectFile(file.id)}
          >
            <TableCell className="font-medium">{file.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {file.file_type.split('/')[1]?.toUpperCase()}
            </TableCell>
            <TableCell>{formatFileSize(file.file_size)}</TableCell>
            <TableCell>{(file.uploader as any)?.full_name || 'Unknown'}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
