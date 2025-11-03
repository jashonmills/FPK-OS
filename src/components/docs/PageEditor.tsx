import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Save, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface PageEditorProps {
  pageId: string;
}

export const PageEditor = ({ pageId }: PageEditorProps) => {
  const [content, setContent] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: page, isLoading } = useQuery({
    queryKey: ['doc-page', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (page) {
      setContent(page.content);
      setHasChanges(false);
    }
  }, [page]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('doc_pages')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc-page', pageId] });
      queryClient.invalidateQueries({ queryKey: ['doc-page-versions', pageId] });
      setHasChanges(false);
      toast({
        title: 'Saved',
        description: 'Your changes have been saved',
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

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      saveMutation.mutate();
    }
  };

  if (isLoading || !page) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading page...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            Last updated {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};
