import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MyTasksButtonProps {
  active: boolean;
  onClick: () => void;
}

export const MyTasksButton = ({ active, onClick }: MyTasksButtonProps) => {
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyTasksCount();
    }
  }, [user]);

  const fetchMyTasksCount = async () => {
    if (!user) return;

    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .or(`assignee_id.eq.${user.id},created_by.eq.${user.id}`)
      .neq('status', 'done');

    setCount(taskCount || 0);
  };

  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="gap-1 md:gap-2 relative flex-1 md:flex-none"
    >
      <User className="h-4 w-4" />
      <span className="text-xs md:text-sm">My Tasks</span>
      {count > 0 && (
        <Badge 
          variant="secondary" 
          className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
};
