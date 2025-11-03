import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VersionHistoryProps {
  pageId: string;
}

export const VersionHistory = ({ pageId }: VersionHistoryProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: versions } = useQuery({
    queryKey: ['doc-page-versions', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_page_versions')
        .select('*, editor:editor_id(full_name)')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionContent: any) => {
      const { error } = await supabase
        .from('doc_pages')
        .update({
          content: versionContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc-page', pageId] });
      toast({
        title: 'Version restored',
        description: 'The page has been restored to this version',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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
        {versions.map((version, index) => (
          <div
            key={version.id}
            className="text-sm border rounded-lg p-3 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    Version {versions.length - index}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => restoreMutation.mutate(version.content)}
                disabled={restoreMutation.isPending}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>By {(version.editor as any)?.full_name || 'Unknown'}</p>
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
