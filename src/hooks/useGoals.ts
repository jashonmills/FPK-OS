
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
  completed_at?: string;
  priority: 'low' | 'medium' | 'high';
  milestones?: any;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

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
          created_at: '2024-01-01',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Read 5 Books',
          status: 'active',
          progress: 40,
          category: 'Reading',
          target_date: '2024-11-30',
          created_at: '2024-01-01',
          priority: 'medium'
        }
      ]);
      setLoading(false);
      setError('');
    }, 1000);
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'created_at'>) => {
    setSaving(true);
    try {
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      setError('Failed to create goal');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    setSaving(true);
    try {
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      ));
    } catch (err) {
      setError('Failed to update goal');
    } finally {
      setSaving(false);
    }
  };

  const deleteGoal = async (id: string) => {
    setSaving(true);
    try {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      setError('Failed to delete goal');
    } finally {
      setSaving(false);
    }
  };

  const completeGoal = async (id: string) => {
    await updateGoal(id, { 
      status: 'completed', 
      progress: 100, 
      completed_at: new Date().toISOString() 
    });
  };

  const updateMilestone = async (goalId: string, milestoneId: string, completed: boolean) => {
    // Implementation for milestone updates
    console.log('Updating milestone:', { goalId, milestoneId, completed });
  };

  useEffect(() => {
    refetch();
  }, []);

  return { 
    goals, 
    loading, 
    saving, 
    error, 
    refetch, 
    createGoal, 
    updateGoal, 
    deleteGoal, 
    completeGoal,
    updateMilestone 
  };
};
