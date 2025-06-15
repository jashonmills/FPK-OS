
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Clock, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecentSave {
  id: string;
  title: string;
  savedAt: string;
  hasFlashcards?: boolean;
}

interface RecentSavesMenuProps {
  recentSaves: RecentSave[];
  onOpenNote: (noteId: string) => void;
}

const RecentSavesMenu: React.FC<RecentSavesMenuProps> = ({
  recentSaves,
  onOpenNote
}) => {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMs = now.getTime() - saved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (recentSaves.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-white hover:bg-white/20"
          title="Recent Saves"
          aria-label="View recent saves"
        >
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Recent Saves
        </div>
        <DropdownMenuSeparator />
        
        {recentSaves.slice(0, 3).map((save) => (
          <DropdownMenuItem
            key={save.id}
            onClick={() => onOpenNote(save.id)}
            className="flex flex-col items-start p-3 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="font-medium truncate text-sm">
                  {save.title}
                </span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </div>
            
            <div className="flex items-center justify-between w-full mt-1">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(save.savedAt)}
              </span>
              {save.hasFlashcards && (
                <Badge variant="outline" className="text-xs py-0 px-1">
                  Flashcards
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        {recentSaves.length > 3 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground">
              +{recentSaves.length - 3} more in Notes
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentSavesMenu;
