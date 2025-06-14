import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read_status: boolean;
  action_url?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read_status).length || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Error loading notifications",
        description: "Failed to load your notifications.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read_status: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read_status', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, read_status: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Create notification (for system use)
  const createNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'read_status' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          ...notification
        })
        .select()
        .single();

      if (error) throw error;

      // Show toast for immediate feedback
      toast({
        title: notification.title,
        description: notification.message,
      });

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Set up real-time subscription with proper pattern
  useEffect(() => {
    if (!user) return;

    // If we've already created & subscribed, do nothing
    if (channelRef.current) return;

    loadNotifications();

    // Create the channel with unique name
    const channelName = `notifications-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      );

    // Subscribe once and only set ref after successful subscription
    channel.subscribe().then(status => {
      if (status === 'SUBSCRIBED') {
        channelRef.current = channel;
        console.log('✅ Successfully subscribed to notifications channel');
      } else {
        console.error('❌ Failed to subscribe to notifications channel:', status);
      }
    });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-subscriptions

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
  };
};
