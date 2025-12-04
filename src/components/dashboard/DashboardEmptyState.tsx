import { EmptyState } from '@/components/shared/EmptyState';
import { Home, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={Home}
      title="Welcome to Your CNS Dashboard!"
      description="This is your command center. Once you start logging behaviors, sleep patterns, and other events, this is where you'll see trends and get a daily snapshot of your child's progress."
      actionLabel="Log Your First Entry"
      onAction={() => navigate('/activity-log')}
    />
  );
};
