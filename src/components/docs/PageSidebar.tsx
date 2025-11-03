import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VersionHistory } from './VersionHistory';
import { Separator } from '@/components/ui/separator';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface PageSidebarProps {
  pageId: string;
}

export const PageSidebar = ({ pageId }: PageSidebarProps) => {
  const { data: page } = useQuery({
    queryKey: ['page-sidebar', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_pages')
        .select('*, author:author_id(full_name), space:doc_spaces(name)')
        .eq('id', pageId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!page) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Page Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Created by</p>
              <p className="font-medium">{(page.author as any)?.full_name || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(page.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Last updated</p>
              <p className="font-medium">
                {format(new Date(page.updated_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-sm text-muted-foreground">
          Space: <span className="font-medium text-foreground">{(page.space as any)?.name}</span>
        </p>
      </div>

      <Separator />

      <VersionHistory pageId={pageId} />
    </div>
  );
};
