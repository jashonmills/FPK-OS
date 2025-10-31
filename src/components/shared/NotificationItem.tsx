import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Notification } from '@/hooks/useNotifications';
import { getEntityDisplayName } from '@/utils/notificationNavigation';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, AtSign, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const actorName = 
    notification.actor_profile?.full_name || 
    notification.actor_profile?.display_name || 
    'Someone';

  const getNotificationIcon = () => {
    switch (notification.notification_type) {
      case 'mention':
        return <AtSign className="h-4 w-4 text-primary" />;
      case 'reply':
        return <Reply className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNotificationMessage = () => {
    const entityName = getEntityDisplayName(notification.entity_type);
    
    switch (notification.notification_type) {
      case 'mention':
        return `mentioned you in ${entityName}`;
      case 'reply':
        return `replied to your comment on ${entityName}`;
      case 'comment':
        return `commented on ${entityName}`;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors border-b last:border-0 text-left",
        !notification.is_read && "bg-primary/5"
      )}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      )}
      
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={notification.actor_profile?.avatar_url || undefined} />
        <AvatarFallback>{actorName[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {getNotificationIcon()}
          <p className="text-sm font-medium truncate">
            <span className="font-semibold">{actorName}</span>{' '}
            <span className="font-normal text-muted-foreground">{getNotificationMessage()}</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </button>
  );
}
