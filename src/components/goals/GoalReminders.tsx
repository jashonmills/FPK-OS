
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, CheckCircle, Lightbulb } from 'lucide-react';

const GoalReminders = () => {
  const reminders = [
    {
      id: 1,
      type: 'daily',
      title: 'Daily Check-in',
      message: 'Review your progress and update your goals',
      time: '9:00 AM',
      active: true
    },
    {
      id: 2,
      type: 'weekly',
      title: 'Weekly Goal Review',
      message: 'Time to assess your weekly goals and plan ahead',
      time: 'Every Sunday',
      active: true
    },
    {
      id: 3,
      type: 'motivational',
      title: 'Motivational Boost',
      message: 'You\'re doing great! Keep pushing towards your goals',
      time: 'Random',
      active: false
    }
  ];

  const tips = [
    "Break large goals into smaller, manageable tasks",
    "Set specific deadlines to maintain momentum",
    "Celebrate small wins along the way",
    "Review and adjust your goals regularly"
  ];

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
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {reminder.type === 'daily' && <Calendar className="h-4 w-4 text-blue-600" />}
                  {reminder.type === 'weekly' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                  {reminder.type === 'motivational' && <Lightbulb className="h-4 w-4 text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{reminder.title}</p>
                  <p className="text-xs text-gray-500">{reminder.message}</p>
                  <p className="text-xs text-blue-600">{reminder.time}</p>
                </div>
              </div>
              <Badge variant={reminder.active ? "default" : "secondary"}>
                {reminder.active ? "On" : "Off"}
              </Badge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            Manage Reminders
          </Button>
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
