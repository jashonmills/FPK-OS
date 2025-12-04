import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Send, X, Smile, AtSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/useMessages';
import { MentionSelector } from './MentionSelector';
import { useOrgMembersForMention } from '@/hooks/useOrgMembersForMention';

interface MessageComposerProps {
  conversationId: string;
  orgId: string;
  replyingTo: Message | null;
  onCancelReply: () => void;
  onSendMessage: (content: string, mentionedUserIds?: string[]) => Promise<void>;
}

export function MessageComposer({
  conversationId,
  orgId,
  replyingTo,
  onCancelReply,
  onSendMessage
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<{ id: string; name: string }[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { members } = useOrgMembersForMention(orgId, mentionQuery);

  // Handle content change and detect @mentions
  const handleContentChange = (value: string) => {
    setContent(value);
    
    // Detect @ symbol for mentions
    const textarea = textareaRef.current;
    if (textarea) {
      const pos = textarea.selectionStart;
      setCursorPosition(pos);
      
      // Check if we're typing a mention
      const textBeforeCursor = value.substring(0, pos);
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
      
      if (mentionMatch) {
        setMentionQuery(mentionMatch[1]);
        setShowMentions(true);
      } else {
        setShowMentions(false);
        setMentionQuery('');
      }
    }
  };

  // Handle mention selection
  const handleSelectMention = (user: { id: string; full_name: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    
    // Replace the @query with the mention
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const newTextBefore = textBeforeCursor.replace(/@(\w*)$/, `@${user.full_name} `);
      setContent(newTextBefore + textAfterCursor);
      
      // Add to mentioned users if not already
      if (!mentionedUsers.find(u => u.id === user.id)) {
        setMentionedUsers(prev => [...prev, { id: user.id, name: user.full_name }]);
      }
    }
    
    setShowMentions(false);
    setMentionQuery('');
    textarea.focus();
  };

  // Handle send
  const handleSend = async () => {
    if (!content.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendMessage(content, mentionedUsers.map(u => u.id));
      setContent('');
      setMentionedUsers([]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowMentions(false);
      if (replyingTo) {
        onCancelReply();
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [content]);

  return (
    <div className="border-t border-border/50 p-4 bg-background/80 backdrop-blur-sm">
      {/* Reply preview */}
      {replyingTo && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-muted/50 rounded-lg">
          <div className="flex-1 text-sm">
            <span className="text-muted-foreground">Replying to </span>
            <span className="font-medium">{replyingTo.sender?.full_name}</span>
            <p className="text-muted-foreground truncate">{replyingTo.content}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelReply}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mentioned users badges */}
      {mentionedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {mentionedUsers.map(user => (
            <Badge key={user.id} variant="secondary" className="text-xs">
              @{user.name}
              <button 
                onClick={() => setMentionedUsers(prev => prev.filter(u => u.id !== user.id))}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="relative flex items-end gap-2">
        {/* Mention selector popup */}
        {showMentions && members.length > 0 && (
          <MentionSelector
            members={members}
            onSelect={handleSelectMention}
            onClose={() => setShowMentions(false)}
          />
        )}

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (@ to mention)"
            className="min-h-[44px] max-h-[150px] resize-none pr-12"
            rows={1}
          />
          
          {/* Action buttons inside textarea */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => {
                const textarea = textareaRef.current;
                if (textarea) {
                  const pos = textarea.selectionStart;
                  const newContent = content.substring(0, pos) + '@' + content.substring(pos);
                  setContent(newContent);
                  setCursorPosition(pos + 1);
                  setShowMentions(true);
                  setMentionQuery('');
                  // Set cursor position after state update
                  setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(pos + 1, pos + 1);
                  }, 0);
                }
              }}
            >
              <AtSign className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSend} 
          disabled={!content.trim() || isSending}
          size="icon"
          className="h-11 w-11 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-[10px] text-muted-foreground mt-1">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
}
