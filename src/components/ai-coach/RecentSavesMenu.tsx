
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface RecentSave {
  id: string;
  title: string;
  savedAt: string;
  hasFlashcards?: boolean;
}

interface RecentSavesMenuProps {
  onOpenNote?: (noteId: string) => void;
}

const RecentSavesMenu: React.FC<RecentSavesMenuProps> = ({
  onOpenNote
}) => {
  const { notes, isLoading } = useNotes();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recentSaves, setRecentSaves] = useState<RecentSave[]>([]);

  // Filter and format recent AI Insights notes
  useEffect(() => {
    if (notes) {
      const aiInsightsNotes = notes
        .filter(note => note.tags?.includes('AI Insights'))
        .slice(0, 5) // Get the 5 most recent
        .map(note => ({
          id: note.id,
          title: note.title,
          savedAt: note.created_at,
          hasFlashcards: note.tags?.some(tag => tag.toLowerCase().includes('flashcard')) || false
        }));
      
      setRecentSaves(aiInsightsNotes);
    }
  }, [notes]);

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

  const handleOpenNote = (noteId: string) => {
    if (onOpenNote) {
      onOpenNote(noteId);
    } else {
      // Use React Router navigation instead of window.location.href
      navigate(`/dashboard/learner/notes?noteId=${noteId}`);
    }
    
    toast({
      title: "Opening note",
      description: "Navigating to your saved note...",
    });
  };

  if (isLoading || recentSaves.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
          title="Recent Saves"
          aria-label="View recent saves"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border shadow-lg z-50">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Recent AI Insights
        </div>
        <DropdownMenuSeparator />
        
        {recentSaves.slice(0, 3).map((save) => (
          <DropdownMenuItem
            key={save.id}
            onClick={() => handleOpenNote(save.id)}
            className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
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
            <DropdownMenuItem 
              className="text-center text-sm text-muted-foreground cursor-pointer"
              onClick={() => navigate('/dashboard/learner/notes?filter=ai-insights')}
            >
              +{recentSaves.length - 3} more in Notes
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentSavesMenu;
