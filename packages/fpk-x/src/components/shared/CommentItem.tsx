import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Reply, Check, X } from 'lucide-react';

interface Discussion {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  mentioned_user_ids: string[];
  profiles?: {
    display_name: string | null;
  };
}

interface CommentItemProps {
  discussion: Discussion;
  onReply: () => void;
  familyId: string;
  compact?: boolean;
  isReply?: boolean;
}

export function CommentItem({ 
  discussion, 
  onReply, 
  familyId,
  compact = false,
  isReply = false 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(discussion.content);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwnComment = user?.id === discussion.user_id;
  const displayName = discussion.profiles?.display_name || 'Unknown User';

  // Update comment mutation
  const updateMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const { error } = await supabase
        .from('team_discussions')
        .update({ 
          content: newContent,
          edited_at: new Date().toISOString(),
        })
        .eq('id', discussion.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-discussions'] });
      setIsEditing(false);
      toast.success('Comment updated');
    },
    onError: (error) => {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    },
  });

  // Delete (soft delete) mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('team_discussions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', discussion.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-discussions'] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    },
  });

  const handleSaveEdit = () => {
    if (!editedContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    updateMutation.mutate(editedContent);
  };

  const handleCancelEdit = () => {
    setEditedContent(discussion.content);
    setIsEditing(false);
  };

  // Highlight @mentions in content
  const renderContent = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a mention
        return (
          <span key={index} className="text-primary font-medium">
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex gap-3">
      <Avatar className={compact ? 'h-7 w-7' : 'h-8 w-8'}>
        <AvatarFallback className={compact ? 'text-xs' : ''}>
          {displayName[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
              {displayName}
            </span>
            <time className={`text-muted-foreground ${compact ? 'text-[10px]' : 'text-xs'}`}>
              {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
            </time>
            {discussion.edited_at && (
              <span className={`text-muted-foreground italic ${compact ? 'text-[10px]' : 'text-xs'}`}>
                (edited)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReply}
                className={compact ? 'h-6 px-2 text-xs' : 'h-7 px-2'}
              >
                <Reply className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
              </Button>
            )}
            
            {isOwnComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={compact ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'}
                  >
                    <MoreVertical className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteMutation.mutate()}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={compact ? 'text-xs min-h-[60px]' : 'text-sm'}
              rows={3}
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-muted-foreground whitespace-pre-wrap break-words ${compact ? 'text-xs' : 'text-sm'}`}>
            {renderContent(discussion.content)}
          </p>
        )}
      </div>
    </div>
  );
}
