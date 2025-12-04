import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User } from 'lucide-react';
import { useOrgNoteReplies } from '@/hooks/useOrgNoteReplies';
import { OrgNote } from '@/hooks/useOrgNotes';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OrgNoteDetailModalProps {
  note: OrgNote | null;
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export default function OrgNoteDetailModal({ note, isOpen, onClose, studentName }: OrgNoteDetailModalProps) {
  const [replyContent, setReplyContent] = useState('');
  const { replies, isLoading, createReply, isCreatingReply } = useOrgNoteReplies(note?.id || '');

  // Fetch user profiles for reply authors
  const { data: profiles = {} } = useQuery({
    queryKey: ['note-reply-profiles', replies.map(r => r.user_id)],
    queryFn: async () => {
      if (replies.length === 0) return {};
      
      const userIds = [...new Set(replies.map(r => r.user_id))];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, display_name')
        .in('id', userIds);

      if (error) throw error;

      return data.reduce((acc, profile) => {
        acc[profile.id] = profile.full_name || profile.display_name || 'Unknown User';
        return acc;
      }, {} as Record<string, string>);
    },
    enabled: replies.length > 0,
  });

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    
    createReply(replyContent, {
      onSuccess: () => {
        setReplyContent('');
      },
    });
  };

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{note.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{note.category}</Badge>
            {studentName && <Badge variant="secondary">Student: {studentName}</Badge>}
            <Badge variant={note.is_private ? 'destructive' : 'default'}>
              {note.is_private ? 'Private' : 'Shared'}
            </Badge>
            <Badge variant="outline">{format(new Date(note.created_at), 'MMM dd, yyyy')}</Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Original Note Content */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Original Note</p>
            <p className="whitespace-pre-wrap">{note.content}</p>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="font-semibold mb-2">Conversation ({replies.length})</h3>
            
            <ScrollArea className="flex-1 pr-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : replies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No replies yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {profiles[reply.user_id] || 'Loading...'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(reply.created_at), 'MMM dd, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Reply Input */}
          <div className="space-y-2 border-t pt-4">
            <Textarea
              placeholder="Type your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitReply} 
                disabled={isCreatingReply || !replyContent.trim()}
              >
                {isCreatingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
