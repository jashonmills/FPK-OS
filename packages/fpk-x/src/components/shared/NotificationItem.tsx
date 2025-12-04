import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const actorName = notification.actor_profile?.full_name || 
                    notification.actor_profile?.display_name || 
                    'Someone';
  
  const getMessage = () => {
    const entityName = notification.entity_type.replace(/_/g, ' ');
    
    switch (notification.notification_type) {
      case 'mention':
        return `mentioned you in ${entityName}`;
      case 'reply':
        return `replied to your comment on ${entityName}`;
      case 'comment':
        return `commented on ${entityName}`;
      default:
        return `interacted with ${entityName}`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors text-left border-b last:border-b-0",
        !notification.is_read && "bg-accent/20"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={notification.actor_profile?.avatar_url || undefined} />
        <AvatarFallback className="text-xs">
          {actorName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{actorName}</span>
          {' '}
          <span className="text-muted-foreground">{getMessage()}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      {!notification.is_read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
      )}
    </button>
  );
}
