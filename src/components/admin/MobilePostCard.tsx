import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MobilePostCardProps {
  post: {
    id: string;
    title: string;
    status: string;
    author_name?: string;
    updated_at?: string;
    views_count?: number;
  };
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getStatusBadgeColor: (status: string) => string;
}

export function MobilePostCard({ 
  post, 
  onView, 
  onEdit, 
  onDelete,
  getStatusBadgeColor 
}: MobilePostCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        <h3 className="font-semibold text-base leading-tight line-clamp-2">
          {post.title}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(post.status)}`}>
            {post.status}
          </span>
          
          {post.views_count !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {post.views_count}
            </span>
          )}
        </div>

        {(post.author_name || post.updated_at) && (
          <p className="text-xs text-muted-foreground">
            {post.author_name && <span>{post.author_name}</span>}
            {post.author_name && post.updated_at && <span> • </span>}
            {post.updated_at && format(new Date(post.updated_at), 'MMM d, yyyy')}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[44px]"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[44px]"
          onClick={onEdit}
        >
          <FileEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] px-3"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
