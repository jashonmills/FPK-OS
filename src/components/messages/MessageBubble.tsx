import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { MessageContent } from './MessageContent';
import { UserProfileCard } from '@/components/profile/UserProfileCard';
import { TimezoneTimestamp } from '@/components/ui/timezone-timestamp';

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
  const { user } = useAuth();

  const { data: viewerProfile } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('timezone')
        .eq('id', user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: senderProfile } = useQuery({
    queryKey: ['profile', message.sender_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('timezone')
        .eq('id', message.sender_id)
        .maybeSingle();
      return data;
    },
  });

  return (
    <div className="flex gap-3 group">
      <UserProfileCard userId={message.sender_id}>
        <button type="button" className="cursor-pointer">
          <UserAvatar
            fullName={message.profiles.full_name}
            avatarUrl={message.profiles.avatar_url}
            size={36}
          />
        </button>
      </UserProfileCard>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm">{message.profiles.full_name}</span>
          <TimezoneTimestamp
            date={message.created_at}
            viewerTimezone={viewerProfile?.timezone || 'America/New_York'}
            posterTimezone={senderProfile?.timezone}
            posterName={message.profiles.full_name}
          />
        </div>
        <MessageContent content={message.content} />
      </div>
    </div>
  );
};
