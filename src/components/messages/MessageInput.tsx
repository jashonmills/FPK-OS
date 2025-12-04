import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { MentionTextarea } from '@/components/mentions/MentionTextarea';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <MentionTextarea
          placeholder="Type a message... (Shift+Enter for new line)"
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          minHeight="min-h-[48px]"
          className="max-h-32 resize-none pr-10 border-input bg-background"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 bottom-2 h-7 w-7 p-0"
          type="button"
        >
          <Smile className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-12 w-12 flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
