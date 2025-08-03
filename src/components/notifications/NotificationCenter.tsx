import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Bell, Check, X, Target, TrendingUp, Trophy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read_status: boolean;
  action_url?: string;
  metadata?: any;
  created_at: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const { t } = useDualLanguage();
  const analytics = useAnalyticsPublisher();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read_status).length;

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read_status: true } : n)
      );

      // Track analytics
      analytics.publishEvent('notification_read', { 
        notificationId,
        type: notifications.find(n => n.id === notificationId)?.type 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('user_id', user.id)
        .eq('read_status', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
      toast({ title: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline_reminder': return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'progress_nudge': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'weekly_review': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const channel = supabase
      .channel('notifications_changes')
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
          
          // Show toast for new notifications
          toast({
            title: 'New notification',
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date().getTime();
    const notificationTime = new Date(dateString).getTime();
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>
            <DualLanguageText translationKey="notifications.title" fallback="Notifications" />
          </span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-6 px-2"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <DualLanguageText translationKey="notifications.empty" fallback="No notifications yet" />
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id}
              className={`p-3 cursor-pointer ${!notification.read_status ? 'bg-blue-50/50' : ''}`}
              onClick={() => !notification.read_status && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read_status ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>
                {!notification.read_status && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground">
              <DualLanguageText translationKey="notifications.viewAll" fallback="View all notifications" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;