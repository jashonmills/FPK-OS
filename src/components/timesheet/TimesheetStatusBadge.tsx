import { Badge } from '@/components/ui/badge';
import { Clock, Send, CheckCircle, XCircle, DollarSign } from 'lucide-react';

type TimesheetStatus = 'open' | 'submitted' | 'approved' | 'rejected' | 'paid';

interface TimesheetStatusBadgeProps {
  status: TimesheetStatus;
  className?: string;
}

export const TimesheetStatusBadge = ({ status, className }: TimesheetStatusBadgeProps) => {
  const config = {
    open: {
      label: 'Open',
      icon: Clock,
      variant: 'default' as const,
      className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    },
    submitted: {
      label: 'Submitted',
      icon: Send,
      variant: 'secondary' as const,
      className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      variant: 'default' as const,
      className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      variant: 'destructive' as const,
      className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    },
    paid: {
      label: 'Paid',
      icon: DollarSign,
      variant: 'outline' as const,
      className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[status];

  return (
    <Badge className={`${badgeClassName} ${className || ''}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
};
