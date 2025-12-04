
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, CheckCircle, Lightbulb, Settings } from 'lucide-react';
import { useGoalReminders } from '@/hooks/useGoalReminders';
import ReminderManagement from './ReminderManagement';

const GoalReminders = () => {
  const { reminders, loading } = useGoalReminders();
  const [showManagement, setShowManagement] = React.useState(false);

  const activeReminders = reminders.filter(r => r.is_active);

  const tips = [
    "Break large goals into smaller, manageable tasks",
    "Set specific deadlines to maintain momentum",
    "Celebrate small wins along the way",
    "Review and adjust your goals regularly"
  ];

  if (showManagement) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Reminder Management</h3>
          <Button
            variant="outline"
            onClick={() => setShowManagement(false)}
          >
            Back to Overview
          </Button>
        </div>
        <ReminderManagement />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Goal Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : activeReminders.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No active reminders</p>
              <Button
                onClick={() => setShowManagement(true)}
                size="sm"
                className="fpk-gradient text-white"
              >
                Set Up Reminders
              </Button>
            </div>
          ) : (
            <>
              {activeReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {reminder.reminder_type === 'daily' && <Calendar className="h-4 w-4 text-blue-600" />}
                      {reminder.reminder_type === 'weekly' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      {reminder.reminder_type === 'deadline' && <Bell className="h-4 w-4 text-blue-600" />}
                      {reminder.reminder_type === 'custom' && <Settings className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1)} Reminder
                      </p>
                      <p className="text-xs text-gray-500">
                        {reminder.message || `${reminder.reminder_type} goal check-in`}
                      </p>
                      {reminder.reminder_time && (
                        <p className="text-xs text-blue-600">{reminder.reminder_time}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowManagement(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage All Reminders ({reminders.length})
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="fpk-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Goal Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-700">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalReminders;
