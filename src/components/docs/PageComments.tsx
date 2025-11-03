import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MentionTextarea } from '@/components/mentions/MentionTextarea';
import { MessageCircle, Check, MoreVertical, Trash2, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageCommentsProps {
  pageId: string;
}

interface Comment {
  id: string;
  page_id: string;
  user_id: string;
  content: string;
  highlighted_text: string | null;
  parent_comment_id: string | null;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
  replies?: Comment[];
}

export const PageComments = ({ pageId }: PageCommentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['page-comments', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doc_page_comments')
        .select('*, profiles!user_id(full_name, email)')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Build comment tree
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      (data as any[]).forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      (data as any[]).forEach(comment => {
        const commentNode = commentMap.get(comment.id)!;
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentNode);
          }
        } else {
          rootComments.push(commentNode);
        }
      });

      return rootComments;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { error } = await supabase
        .from('doc_page_comments')
        .insert({
          page_id: pageId,
          user_id: user!.id,
          content,
          parent_comment_id: parentId || null,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-comments'] });
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      toast({
        title: 'Success',
        description: 'Comment added',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    },
  });

  const toggleResolveMutation = useMutation({
    mutationFn: async ({ commentId, resolved }: { commentId: string; resolved: boolean }) => {
      const { error } = await supabase
        .from('doc_page_comments')
        .update({
          resolved: !resolved,
          resolved_by: !resolved ? user!.id : null,
          resolved_at: !resolved ? new Date().toISOString() : null,
        })
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-comments'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('doc_page_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-comments'] });
      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    },
  });

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const profile = comment.profiles as any;
    const canDelete = user?.id === comment.user_id;

    return (
      <div key={comment.id} className={isReply ? 'ml-8 mt-3' : ''}>
        <div className="border rounded-lg p-3 bg-card">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{profile?.full_name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
              {comment.resolved && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Check className="h-3 w-3" />
                  Resolved
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isReply && (
                  <DropdownMenuItem
                    onClick={() => toggleResolveMutation.mutate({ commentId: comment.id, resolved: comment.resolved })}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {comment.resolved ? 'Unresolve' : 'Resolve'}
                  </DropdownMenuItem>
                )}
                {!isReply && (
                  <DropdownMenuItem onClick={() => setReplyingTo(comment.id)}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {comment.highlighted_text && (
            <div className="mb-2 p-2 bg-accent/50 rounded text-sm italic border-l-2 border-primary">
              "{comment.highlighted_text}"
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

          {replyingTo === comment.id && (
            <div className="mt-3 pt-3 border-t">
              <MentionTextarea
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Write a reply... Type @ to mention someone"
                minHeight="min-h-[60px]"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (replyContent.trim()) {
                      addCommentMutation.mutate({ content: replyContent, parentId: comment.id });
                    }
                  }}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 mt-2">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  const activeComments = comments?.filter(c => !c.resolved) || [];
  const resolvedComments = comments?.filter(c => c.resolved) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Comments ({comments?.length || 0})
        </h3>
      </div>

      <Tabs defaultValue="active" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="active" className="flex-1">
            Active ({activeComments.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1">
            Resolved ({resolvedComments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : activeComments.length > 0 ? (
              <div className="space-y-3">
                {activeComments.map(comment => renderComment(comment))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active comments
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="resolved" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            {resolvedComments.length > 0 ? (
              <div className="space-y-3 opacity-60">
                {resolvedComments.map(comment => renderComment(comment))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No resolved comments
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <MentionTextarea
          value={newComment}
          onChange={setNewComment}
          placeholder="Add a comment... Type @ to mention someone"
          minHeight="min-h-[80px]"
        />
        <Button
          className="w-full mt-2"
          onClick={() => {
            if (newComment.trim()) {
              addCommentMutation.mutate({ content: newComment });
            }
          }}
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
};
