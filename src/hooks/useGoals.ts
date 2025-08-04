
import { useState, useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  category: string;
  target_date?: string;
  created_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          title: 'Complete React Course',
          status: 'active',
          progress: 65,
          category: 'Programming',
          target_date: '2024-12-31',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          title: 'Read 5 Books',
          status: 'active',
          progress: 40,
          category: 'Reading',
          target_date: '2024-11-30',
          created_at: '2024-01-01'
        }
      ]);
      setLoading(false);
      setError(null);
    }, 1000);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { goals, loading, error, refetch };
};
