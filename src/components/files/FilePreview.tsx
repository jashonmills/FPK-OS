import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileMetadata } from './FileMetadata';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FilePreviewProps {
  fileId: string | null;
  onClose: () => void;
}

export const FilePreview = ({ fileId, onClose }: FilePreviewProps) => {
  const { data: file } = useQuery({
    queryKey: ['file-preview', fileId],
    queryFn: async () => {
      if (!fileId) return null;

      const { data, error } = await supabase
        .from('project_files')
        .select('*, uploader:uploader_id(full_name)')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!fileId,
  });

  const handleDownload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('project-files')
      .download(file.storage_path);

    if (error) {
      console.error('Download error:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPreview = () => {
    if (!file) return null;

    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(file.storage_path);

    if (file.file_type.startsWith('image/')) {
      return (
        <img
          src={data.publicUrl}
          alt={file.name}
          className="max-w-full max-h-[60vh] object-contain mx-auto"
        />
      );
    }

    if (file.file_type.startsWith('video/')) {
      return (
        <video
          src={data.publicUrl}
          controls
          className="max-w-full max-h-[60vh] mx-auto"
        />
      );
    }

    if (file.file_type.startsWith('audio/')) {
      return (
        <audio src={data.publicUrl} controls className="w-full" />
      );
    }

    if (file.file_type === 'application/pdf') {
      return (
        <iframe
          src={data.publicUrl}
          className="w-full h-[60vh]"
          title={file.name}
        />
      );
    }

    if (file.file_type.startsWith('text/')) {
      return (
        <iframe
          src={data.publicUrl}
          className="w-full h-[60vh] border rounded"
          title={file.name}
        />
      );
    }

    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Preview not available for this file type</p>
        <Button onClick={handleDownload} className="mt-4">
          <Download className="h-4 w-4 mr-2" />
          Download to view
        </Button>
      </div>
    );
  };

  if (!fileId || !file) return null;

  return (
    <Dialog open={!!fileId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{file.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex-1 flex overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 p-6 overflow-auto">
            {renderPreview()}
          </div>

          {/* Metadata Sidebar */}
          <div className="w-80 border-l overflow-y-auto">
            <FileMetadata fileId={fileId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
