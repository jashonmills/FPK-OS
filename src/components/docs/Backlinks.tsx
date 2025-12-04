import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, CheckSquare, FolderOpen, Link2 } from 'lucide-react';

interface BacklinksProps {
  pageId: string;
}

export const Backlinks = ({ pageId }: BacklinksProps) => {
  const navigate = useNavigate();

  const { data: backlinks } = useQuery({
    queryKey: ['backlinks', pageId],
    queryFn: async () => {
      // Get mentions of this page in other pages
      const { data: pageMentions, error: pageError } = await supabase
        .from('doc_mentions')
        .select('page:doc_pages!doc_mentions_page_id_fkey(id, title)')
        .eq('entity_id', pageId)
        .eq('entity_type', 'page');

      // Get tasks linking to this page
      const { data: taskLinks, error: taskError } = await supabase
        .from('task_document_links')
        .select('task:tasks(id, title, status)')
        .eq('page_id', pageId);

      if (pageError || taskError) throw pageError || taskError;

      return {
        pages: pageMentions || [],
        tasks: taskLinks || [],
      };
    },
  });

  const totalBacklinks = (backlinks?.pages?.length || 0) + (backlinks?.tasks?.length || 0);

  if (totalBacklinks === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Backlinks
        </h3>
        <p className="text-sm text-muted-foreground">No pages or tasks link to this document</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        Backlinks ({totalBacklinks})
      </h3>

      <div className="space-y-3">
        {backlinks?.pages && backlinks.pages.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">PAGES</p>
            <div className="space-y-1">
              {backlinks.pages.map((mention) => {
                const page = mention.page as any;
                return (
                  <Button
                    key={page.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-2"
                    onClick={() => navigate(`/docs?page=${page.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span className="text-sm truncate">{page.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {backlinks?.tasks && backlinks.tasks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">TASKS</p>
            <div className="space-y-1">
              {backlinks.tasks.map((link) => {
                const task = link.task as any;
                return (
                  <Button
                    key={task.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-2"
                    onClick={() => navigate(`/kanban?task=${task.id}`)}
                  >
                    <CheckSquare className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                    <div className="flex-1 text-left overflow-hidden">
                      <span className="text-sm truncate block">{task.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
