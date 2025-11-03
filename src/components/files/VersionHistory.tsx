import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface VersionHistoryProps {
  fileId: string;
}

export const VersionHistory = ({ fileId }: VersionHistoryProps) => {
  const { data: versions } = useQuery({
    queryKey: ['file-versions', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_versions')
        .select('*, uploader:uploader_id(full_name)')
        .eq('file_id', fileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDownloadVersion = async (storagePath: string, versionNumber: number) => {
    const { data, error } = await supabase.storage
      .from('project-files')
      .download(storagePath);

    if (error) {
      console.error('Download error:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `version-${versionNumber}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!versions || versions.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-3">Version History</h3>
        <p className="text-sm text-muted-foreground">No previous versions</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Version History</h3>
      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className="text-sm border rounded-lg p-3 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Version {version.version_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleDownloadVersion(version.storage_path, version.version_number)
                }
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>By {(version.uploader as any)?.full_name || 'Unknown'}</p>
              <p>{formatFileSize(version.file_size)}</p>
              {version.version_notes && (
                <p className="italic">{version.version_notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
