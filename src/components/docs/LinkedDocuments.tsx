import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, Plus, X } from 'lucide-react';
import { DocumentPicker } from './DocumentPicker';
import { useNavigate } from 'react-router-dom';

interface LinkedDocumentsProps {
  taskId?: string;
  fileId?: string;
}

export const LinkedDocuments = ({ taskId, fileId }: LinkedDocumentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPicker, setShowPicker] = useState(false);

  const { data: linkedDocs } = useQuery({
    queryKey: ['linked-documents', taskId, fileId],
    queryFn: async () => {
      if (taskId) {
        const { data, error } = await supabase
          .from('task_document_links')
          .select('id, page:doc_pages(id, title, space:doc_spaces(name))')
          .eq('task_id', taskId);
        
        if (error) throw error;
        return data;
      }
      // Future: handle fileId with file_document_links table
      return [];
    },
  });

  const linkMutation = useMutation({
    mutationFn: async ({ pageId }: { pageId: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      if (taskId) {
        const { error } = await supabase
          .from('task_document_links')
          .insert({
            task_id: taskId,
            page_id: pageId,
            created_by: user.id,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-documents'] });
      toast({
        title: 'Success',
        description: 'Document linked successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to link document',
        variant: 'destructive',
      });
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('task_document_links')
        .delete()
        .eq('id', linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-documents'] });
      toast({
        title: 'Success',
        description: 'Document unlinked',
      });
    },
  });

  const handleSelect = (pageId: string, pageTitle: string) => {
    linkMutation.mutate({ pageId });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium">📄 Linked Documents</label>
        <Button
          onClick={() => setShowPicker(true)}
          variant="outline"
          size="sm"
          className="h-7 gap-1"
        >
          <Plus className="h-3 w-3" />
          Link
        </Button>
      </div>

      {linkedDocs && linkedDocs.length > 0 ? (
        <div className="space-y-2">
          {linkedDocs.map((link) => {
            const page = link.page as any;
            return (
              <div
                key={link.id}
                className="flex items-start gap-2 p-2 rounded-md border bg-card hover:bg-accent/50 transition-colors group"
              >
                <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/docs?page=${page.id}`)}
                    className="text-sm font-medium hover:underline text-left w-full truncate"
                  >
                    {page.title}
                  </button>
                  <p className="text-xs text-muted-foreground truncate">
                    {page.space?.name || 'Unknown Space'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => unlinkMutation.mutate(link.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No linked documents</p>
      )}

      <DocumentPicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onSelect={handleSelect}
      />
    </div>
  );
};
