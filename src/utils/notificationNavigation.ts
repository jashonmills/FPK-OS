import { Notification } from '@/hooks/useNotifications';

export function getNotificationUrl(notification: Notification): string {
  const { entity_type, entity_id, discussion_id } = notification;
  
  switch (entity_type) {
    case 'goal':
      return `/goals/${entity_id}?highlight=${discussion_id}`;
    case 'document':
      return `/documents?view=${entity_id}&highlight=${discussion_id}`;
    case 'incident_log':
    case 'educator_log':
    case 'parent_log':
      return `/activity-log?highlight=${discussion_id}`;
    case 'assessment':
      return `/assessments?highlight=${discussion_id}`;
    case 'chart':
      return `/analytics?highlight=${discussion_id}`;
    case 'student':
      return `/overview?highlight=${discussion_id}`;
    case 'dashboard':
      return `/dashboard?tab=discussion&highlight=${discussion_id}`;
    default:
      return '/dashboard';
  }
}

export function getEntityDisplayName(entityType: string): string {
  const displayNames: Record<string, string> = {
    goal: 'Goal',
    document: 'Document',
    incident_log: 'Incident Log',
    educator_log: 'Educator Log',
    parent_log: 'Parent Log',
    assessment: 'Assessment',
    chart: 'Chart',
    student: 'Student Profile',
    dashboard: 'Family Discussion',
  };

  return displayNames[entityType] || 'Discussion';
}
