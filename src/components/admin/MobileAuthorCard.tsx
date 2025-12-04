import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Sparkles } from 'lucide-react';

interface MobileAuthorCardProps {
  author: {
    id: string;
    display_name: string;
    avatar_url?: string;
    credentials?: string;
    bio?: string;
    is_ai_author?: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function MobileAuthorCard({ author, onEdit, onDelete }: MobileAuthorCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        {author.avatar_url && (
          <img
            src={author.avatar_url}
            alt={author.display_name}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-base leading-tight">
            {author.display_name}
          </h3>
          
          {author.credentials && (
            <p className="text-xs text-muted-foreground">
              {author.credentials}
            </p>
          )}

          {author.is_ai_author !== undefined && (
            <div className="pt-1">
              {author.is_ai_author ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  AI Assistant
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border">
                  Human
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {author.bio && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {author.bio}
        </p>
      )}

      <div className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[44px]"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[44px]"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
          Delete
        </Button>
      </div>
    </div>
  );
}
