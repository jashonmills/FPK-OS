import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from '@/components/ui/avatar-with-initials';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    profiles: {
      full_name: string;
      avatar_url?: string | null;
    };
  };
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className="flex gap-3 group">
      <UserAvatar
        fullName={message.profiles.full_name}
        avatarUrl={message.profiles.avatar_url}
        size={36}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm">{message.profiles.full_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
};
