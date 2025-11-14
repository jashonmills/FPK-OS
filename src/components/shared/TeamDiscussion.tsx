import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { MentionInput } from './MentionInput';

type EntityType = 'goal' | 'document' | 'incident_log' | 'educator_log' | 'parent_log' | 'assessment' | 'chart' | 'student' | 'dashboard';

interface TeamDiscussionProps {
  entityType: EntityType;
  entityId: string;
  familyId: string;
  title?: string;
  placeholder?: string;
  compact?: boolean;
  noPadding?: boolean;
}

interface Discussion {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  mentioned_user_ids: string[];
  attachments: any[];
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  profiles?: {
    display_name: string | null;
  } | null;
}

export function TeamDiscussion({ 
  entityType, 
  entityId, 
  familyId,
  title = "Team Discussion",
  placeholder = "Share an update, ask a question, or discuss...",
  compact = false,
  noPadding = false
}: TeamDiscussionProps) {
  const [newComment, setNewComment] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const commentEndRef = useRef<HTMLDivElement>(null);

  // Fetch discussions with user profiles
  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ['team-discussions', entityType, entityId],
    queryFn: async () => {
      // First get discussions
      const { data: discussionsData, error: discussionsError } = await supabase
        .from('team_discussions')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (discussionsError) throw discussionsError;

      // Get unique user IDs
      const userIds = [...new Set(discussionsData.map(d => d.user_id))];

      // Fetch profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Map profiles to discussions
      const profilesMap = new Map(profilesData.map(p => [p.id, p]));
      
      return discussionsData.map(d => ({
        ...d,
        profiles: profilesMap.get(d.user_id) || null,
      })) as Discussion[];
    },
    enabled: !!entityId && !!familyId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!entityId || !entityType) return;

    const channel = supabase
      .channel(`discussion-${entityType}-${entityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_discussions',
          filter: `entity_type=eq.${entityType},entity_id=eq.${entityId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['team-discussions', entityType, entityId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'team_discussions',
          filter: `entity_type=eq.${entityType},entity_id=eq.${entityId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['team-discussions', entityType, entityId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityType, entityId, queryClient]);

  // Post comment mutation
  const postCommentMutation = useMutation({
    mutationFn: async ({ content, mentionedUserIds, parentId }: { 
      content: string; 
      mentionedUserIds: string[];
      parentId: string | null;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('team_discussions')
        .insert({
          family_id: familyId,
          entity_type: entityType,
          entity_id: entityId,
          user_id: user.id,
          content,
          mentioned_user_ids: mentionedUserIds,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-discussions', entityType, entityId] });
      setNewComment('');
      setMentionedUsers([]);
      setReplyingTo(null);
      toast.success('Comment posted');
      
      // Scroll to latest comment
      setTimeout(() => {
        commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    },
  });

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    await postCommentMutation.mutateAsync({
      content: newComment,
      mentionedUserIds: mentionedUsers,
      parentId: replyingTo,
    });
  };

  // Group discussions into threads
  const topLevelDiscussions = discussions.filter(d => !d.parent_id);
  const getReplies = (parentId: string) => 
    discussions.filter(d => d.parent_id === parentId);

  if (isLoading) {
    return (
      <Card className={compact ? 'shadow-sm' : ''}>
        <CardHeader className={compact ? 'pb-3' : ''}>
          <CardTitle className={compact ? 'text-base' : 'flex items-center gap-2'}>
            {!compact && <MessageSquare className="h-5 w-5" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'shadow-sm' : ''}>
      <CardHeader className={noPadding ? 'pt-0' : compact ? 'pb-3' : ''}>
        <CardTitle className={compact ? 'text-base' : 'flex items-center gap-2'}>
          {!compact && <MessageSquare className="h-5 w-5" />}
          {title}
        </CardTitle>
        {!compact && (
          <CardDescription>
            Collaborate with your team on strategies and progress
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        {topLevelDiscussions.length > 0 ? (
          <div className={`space-y-4 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
            {topLevelDiscussions.map((discussion) => (
              <div key={discussion.id} className="space-y-2">
                <CommentItem 
                  discussion={discussion}
                  onReply={() => setReplyingTo(discussion.id)}
                  familyId={familyId}
                  compact={compact}
                />
                
                {/* Threaded Replies */}
                {getReplies(discussion.id).length > 0 && (
                  <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
                    {getReplies(discussion.id).map((reply) => (
                      <CommentItem 
                        key={reply.id}
                        discussion={reply}
                        onReply={() => setReplyingTo(discussion.id)}
                        familyId={familyId}
                        compact={compact}
                        isReply
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={commentEndRef} />
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the conversation!
            </p>
          </div>
        )}

        {/* Add Comment Form */}
        <div className="space-y-3 pt-4 border-t">
          {replyingTo && (
            <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
              <span>Replying to comment...</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </Button>
            </div>
          )}
          
          <MentionInput
            value={newComment}
            onChange={setNewComment}
            onMentionedUsersChange={setMentionedUsers}
            placeholder={placeholder}
            familyId={familyId}
            compact={compact}
          />
          
          <Button 
            onClick={handleSubmit} 
            disabled={postCommentMutation.isPending || !newComment.trim()}
            className="w-full sm:w-auto"
            size={compact ? 'sm' : 'default'}
          >
            {postCommentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {replyingTo ? 'Post Reply' : 'Post Comment'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
