import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

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
  actor_profile?: {
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: notificationsData, error } = await supabase
        .from('team_discussion_notifications')
        .select('*')
        .eq('recipient_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      if (!notificationsData) return [];

      // Fetch actor profiles separately
      const actorIds = [...new Set(notificationsData.map(n => n.actor_user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, avatar_url')
        .in('id', actorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return notificationsData.map(notification => ({
        ...notification,
        actor_profile: profileMap.get(notification.actor_user_id),
      })) as Notification[];
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
      toast({
        title: "All notifications marked as read",
      });
    },
  });

  // Real-time subscription to new notifications
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
        (payload) => {
          // Invalidate query to fetch new notification with profile data
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // Show toast notification
          const newNotification = payload.new as Notification;
          const notificationType = newNotification.notification_type;
          
          let message = 'New comment';
          if (notificationType === 'mention') {
            message = 'You were mentioned';
          } else if (notificationType === 'reply') {
            message = 'Someone replied to your comment';
          }
          
          toast({
            title: message,
            description: `Check your notifications`,
          });
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
