import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationProfile {
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Notification {
  id: string;
  recipient_user_id: string;
  actor_user_id: string;
  discussion_id: string;
  notification_type: 'mention' | 'reply' | 'comment';
  entity_type: string;
  entity_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  actor_profile?: NotificationProfile;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications with actor profile data
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: notificationData, error: notificationError } = await supabase
        .from('team_discussion_notifications')
        .select('*')
        .eq('recipient_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationError) throw notificationError;
      if (!notificationData) return [];

      // Fetch profiles for all actor_user_ids
      const actorIds = [...new Set(notificationData.map(n => n.actor_user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, avatar_url')
        .in('id', actorIds);

      // Merge profiles with notifications
      const notificationsWithProfiles = notificationData.map(notification => ({
        ...notification,
        actor_profile: profiles?.find(p => p.id === notification.actor_user_id) || null
      }));

      return notificationsWithProfiles as Notification[];
    },
    enabled: !!user?.id,
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('team_discussion_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('team_discussion_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('recipient_user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_discussion_notifications',
          filter: `recipient_user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Fetch the actor profile for the new notification
          const { data: actorProfile } = await supabase
            .from('profiles')
            .select('full_name, display_name, avatar_url')
            .eq('id', payload.new.actor_user_id)
            .single();

          const actorName = actorProfile?.full_name || actorProfile?.display_name || 'Someone';
          
          // Show toast notification
          if (payload.new.notification_type === 'mention') {
            toast.info(`${actorName} mentioned you in a discussion`);
          } else if (payload.new.notification_type === 'reply') {
            toast.info(`${actorName} replied to your comment`);
          } else {
            toast.info(`${actorName} added a new comment`);
          }

          // Refresh notifications
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: (notificationId: string) => markAsReadMutation.mutate(notificationId),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
  };
}
