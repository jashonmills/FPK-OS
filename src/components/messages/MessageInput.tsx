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
    <div className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <MentionTextarea
          placeholder="Type a message... @mention or #channel (Shift+Enter for new line)"
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          minHeight="min-h-[60px]"
          className="max-h-32 resize-none pr-10"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 bottom-2 h-8 w-8 p-0"
          type="button"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-[60px] w-[60px]"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
