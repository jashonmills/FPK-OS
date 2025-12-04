import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, FileText, CheckCircle2, Circle, Clock } from 'lucide-react';

interface MentionHoverCardProps {
  entityId: string;
  entityType: string;
  children: React.ReactNode;
}

export const MentionHoverCard = ({ entityId, entityType, children }: MentionHoverCardProps) => {
  const { data } = useQuery({
    queryKey: ['mention-preview', entityId, entityType],
    queryFn: async () => {
      if (entityType === 'user') {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, title')
          .eq('id', entityId)
          .single();
        if (error) throw error;
        return { type: 'user', ...data };
      }
      
      if (entityType === 'task') {
        const { data, error } = await supabase
          .from('tasks')
          .select('title, status, priority, due_date')
          .eq('id', entityId)
          .single();
        if (error) throw error;
        return { type: 'task', ...data };
      }
      
      if (entityType === 'page') {
        const { data, error } = await supabase
          .from('doc_pages')
          .select('title, updated_at, author:profiles!author_id(full_name)')
          .eq('id', entityId)
          .single();
        if (error) throw error;
        return { type: 'page', ...data };
      }
      
      return null;
    },
    enabled: !!entityId,
  });

  const getStatusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    if (status === 'in_progress') return <Clock className="h-3 w-3 text-blue-500" />;
    return <Circle className="h-3 w-3 text-muted-foreground" />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'backlog': 'Backlog',
      'todo': 'To Do',
      'in_progress': 'In Progress',
      'review': 'Review',
      'done': 'Done',
    };
    return labels[status] || status;
  };

  if (!data) return <>{children}</>;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        {data.type === 'user' && 'full_name' in data && (
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {data.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{data.full_name}</h4>
              <p className="text-xs text-muted-foreground">{data.email}</p>
              {data.title && (
                <p className="text-xs text-muted-foreground">{data.title}</p>
              )}
            </div>
          </div>
        )}
        
        {data.type === 'task' && 'status' in data && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              {getStatusIcon(data.status)}
              <div className="flex-1">
                <h4 className="text-sm font-semibold line-clamp-2">{data.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getStatusLabel(data.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {data.priority}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {data.type === 'page' && 'author' in data && (
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-sm font-semibold line-clamp-2">{data.title}</h4>
              <p className="text-xs text-muted-foreground">
                By {(data.author as any)?.full_name || 'Unknown'}
              </p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
