
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GoalReminder {
  id: string;
  user_id: string;
  goal_id: string | null;
  reminder_type: 'daily' | 'weekly' | 'custom' | 'deadline';
  reminder_time: string | null;
  reminder_days: number[] | null;
  is_active: boolean;
  message: string | null;
  next_reminder_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalReminderInsert {
  goal_id?: string;
  reminder_type: 'daily' | 'weekly' | 'custom' | 'deadline';
  reminder_time?: string;
  reminder_days?: number[];
  is_active?: boolean;
  message?: string;
  next_reminder_at?: string;
}

export const useGoalReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<GoalReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchReminders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goal_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching goal reminders:', error);
        return;
      }

      setReminders(data || []);
    } catch (err) {
      console.error('❌ Error in fetchReminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async (reminderData: GoalReminderInsert): Promise<GoalReminder | null> => {
    if (!user?.id) return null;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('goal_reminders')
        .insert({
          ...reminderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating reminder:', error);
        return null;
      }

      const newReminder = data as GoalReminder;
      setReminders(prev => [newReminder, ...prev]);
      return newReminder;
    } catch (err) {
      console.error('❌ Error in createReminder:', err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateReminder = async (id: string, updates: Partial<GoalReminderInsert>): Promise<void> => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('goal_reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating reminder:', error);
        return;
      }

      const updatedReminder = data as GoalReminder;
      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? updatedReminder : reminder
      ));
    } catch (err) {
      console.error('❌ Error in updateReminder:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteReminder = async (id: string): Promise<void> => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('goal_reminders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting reminder:', error);
        return;
      }

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    } catch (err) {
      console.error('❌ Error in deleteReminder:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [user?.id]);

  return {
    reminders,
    loading,
    saving,
    createReminder,
    updateReminder,
    deleteReminder,
    refetchReminders: fetchReminders
  };
};
