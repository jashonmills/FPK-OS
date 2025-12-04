import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/ui/avatar-with-initials';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, Phone, Briefcase } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { getCurrentTimeInTimezone } from '@/lib/timezones';
import { useNavigate } from 'react-router-dom';

interface UserProfileCardProps {
  userId: string;
  children: React.ReactNode;
}

export const UserProfileCard = ({ userId, children }: UserProfileCardProps) => {
  const navigate = useNavigate();
  const [localTime, setLocalTime] = useState<string>('');

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, title, phone_number, timezone, email')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Update local time every minute
  useEffect(() => {
    if (!profile?.timezone) return;

    const updateTime = () => {
      setLocalTime(getCurrentTimeInTimezone(profile.timezone));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [profile?.timezone]);

  const handleSendMessage = async () => {
    if (!userId) return;

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_dm_conversation',
        {
          user1_id: currentUser.user.id,
          user2_id: userId,
        }
      );

      if (error) throw error;
      navigate(`/messages?conversation=${conversationId}`);
    } catch (error) {
      console.error('Error creating DM:', error);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <UserAvatar
              avatarUrl={profile?.avatar_url}
              fullName={profile?.full_name || profile?.email || 'User'}
              size={64}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base truncate">
                {profile?.full_name || 'User'}
              </h4>
              {profile?.title && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Briefcase className="h-3 w-3" />
                  <span className="truncate">{profile.title}</span>
                </div>
              )}
              {profile?.email && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {profile.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {profile?.timezone && localTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Local Time:</span>
                <span className="text-muted-foreground">{localTime}</span>
              </div>
            )}

            {profile?.phone_number && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile.phone_number}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSendMessage}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
