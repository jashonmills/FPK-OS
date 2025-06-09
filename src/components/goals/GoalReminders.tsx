
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DualLanguageText from '@/components/DualLanguageText';
import { Bell, Calendar, BookOpen, Flame, Target } from 'lucide-react';
import { useXPTracking } from '@/hooks/useXPTracking';

interface Reminder {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export const GoalReminders = () => {
  const { addXP } = useXPTracking();

  const reminders: Reminder[] = [
    {
      id: '1',
      title: 'goals.reminders.dailyCheckIn',
      description: 'goals.reminderDescriptions.dailyCheckIn',
      action: 'goals.reminderActions.checkIn',
      icon: <Bell className="h-4 w-4" />,
      priority: 'high'
    },
    {
      id: '2',
      title: 'goals.reminders.weeklyReview',
      description: 'goals.reminderDescriptions.weeklyReview',
      action: 'goals.reminderActions.review',
      icon: <Calendar className="h-4 w-4" />,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'goals.reminders.studyReminder',
      description: 'goals.reminderDescriptions.studyReminder',
      action: 'goals.reminderActions.study',
      icon: <BookOpen className="h-4 w-4" />,
      priority: 'high'
    },
    {
      id: '4',
      title: 'goals.reminders.streakReminder',
      description: 'goals.reminderDescriptions.streakReminder',
      action: 'goals.reminderActions.maintain',
      icon: <Flame className="h-4 w-4" />,
      priority: 'high'
    },
    {
      id: '5',
      title: 'goals.reminders.goalReview',
      description: 'goals.reminderDescriptions.goalReview',
      action: 'goals.reminderActions.update',
      icon: <Target className="h-4 w-4" />,
      priority: 'low'
    }
  ];

  const handleReminderAction = async (reminder: Reminder) => {
    // Award XP for taking action on reminders
    const xpAmount = reminder.priority === 'high' ? 25 : reminder.priority === 'medium' ? 15 : 10;
    await addXP(xpAmount, `Completed: ${reminder.title}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <DualLanguageText translationKey="goals.sections.reminders" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className={`border ${getPriorityColor(reminder.priority)}`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={`${getPriorityTextColor(reminder.priority)} mt-1`}>
                  {reminder.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm mb-1 ${getPriorityTextColor(reminder.priority)}`}>
                    <DualLanguageText translationKey={reminder.title} />
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    <DualLanguageText translationKey={reminder.description} />
                  </p>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs"
                    onClick={() => handleReminderAction(reminder)}
                  >
                    <DualLanguageText translationKey={reminder.action} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="text-center py-2">
          <p className="text-xs text-gray-500">
            Complete reminders to earn bonus XP!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
