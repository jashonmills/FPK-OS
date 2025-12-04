
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus, Trash2, Edit3, Clock } from 'lucide-react';
import { useGoalReminders, type GoalReminderInsert, type GoalReminder } from '@/hooks/useGoalReminders';
import { useGoals } from '@/hooks/useGoals';
import { useToast } from '@/hooks/use-toast';

const ReminderManagement = () => {
  const { reminders, loading, createReminder, updateReminder, deleteReminder } = useGoalReminders();
  const { goals } = useGoals();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoalReminderInsert>({
    reminder_type: 'daily',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReminder) {
      await updateReminder(editingReminder, formData);
      setEditingReminder(null);
      toast({
        title: "Reminder Updated",
        description: "Your reminder has been updated successfully.",
      });
    } else {
      await createReminder(formData);
      setShowCreateForm(false);
      toast({
        title: "Reminder Created",
        description: "Your reminder has been created successfully.",
      });
    }
    
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(id);
    toast({
      title: "Reminder Deleted",
      description: "Your reminder has been deleted.",
    });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateReminder(id, { is_active: isActive });
    toast({
      title: isActive ? "Reminder Enabled" : "Reminder Disabled",
      description: `Your reminder has been ${isActive ? 'enabled' : 'disabled'}.`,
    });
  };

  const resetForm = () => {
    setFormData({
      reminder_type: 'daily',
      is_active: true,
    });
  };

  const startEdit = (reminder: GoalReminder) => {
    setEditingReminder(reminder.id);
    setFormData({
      goal_id: reminder.goal_id || undefined,
      reminder_type: reminder.reminder_type,
      reminder_time: reminder.reminder_time || undefined,
      reminder_days: reminder.reminder_days || undefined,
      is_active: reminder.is_active,
      message: reminder.message || undefined,
    });
    setShowCreateForm(true);
  };

  const getGoalTitle = (goalId: string | null) => {
    if (!goalId) return 'All Goals';
    const goal = goals.find(g => g.id === goalId);
    return goal?.title || 'Unknown Goal';
  };

  const getReminderTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'custom': return 'Custom';
      case 'deadline': return 'Deadline';
      default: return type;
    }
  };

  if (loading) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Reminder Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Reminder Management
          </CardTitle>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="sm"
            className="fpk-gradient text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCreateForm && (
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="goal">Goal (Optional)</Label>
                    <Select value={formData.goal_id || 'all'} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, goal_id: value === 'all' ? undefined : value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal or leave blank for all goals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Goals</SelectItem>
                        {goals.map(goal => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Reminder Type</Label>
                    <Select value={formData.reminder_type} onValueChange={(value: GoalReminderInsert['reminder_type']) => 
                      setFormData(prev => ({ ...prev, reminder_type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time">Reminder Time</Label>
                    <Input
                      type="time"
                      value={formData.reminder_time || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        reminder_time: e.target.value 
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Custom Message (Optional)</Label>
                    <Textarea
                      placeholder="Enter a custom reminder message..."
                      value={formData.message || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        message: e.target.value 
                      }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingReminder(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="fpk-gradient text-white">
                    {editingReminder ? 'Update' : 'Create'} Reminder
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No reminders set up yet</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                size="sm"
                className="fpk-gradient text-white"
              >
                Create Your First Reminder
              </Button>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">
                        {getReminderTypeLabel(reminder.reminder_type)} Reminder
                      </p>
                      <Badge variant={reminder.is_active ? "default" : "secondary"}>
                        {reminder.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      Goal: {getGoalTitle(reminder.goal_id)}
                    </p>
                    {reminder.reminder_time && (
                      <p className="text-xs text-gray-500">
                        Time: {reminder.reminder_time}
                      </p>
                    )}
                    {reminder.message && (
                      <p className="text-xs text-gray-600 mt-1">
                        "{reminder.message}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.is_active}
                    onCheckedChange={(checked) => handleToggleActive(reminder.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(reminder)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderManagement;
