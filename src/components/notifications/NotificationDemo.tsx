
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers';

const NotificationDemo = () => {
  const {
    triggerGoalCompletion,
    triggerStudyStreak,
    triggerAchievement,
    triggerCourseReminder,
    triggerAIInsight
  } = useNotificationTriggers();

  const demoNotifications = [
    {
      label: 'Goal Milestone',
      action: () => triggerGoalCompletion('Learn React', 75),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Study Streak',
      action: () => triggerStudyStreak(7),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      label: 'Achievement',
      action: () => triggerAchievement('First Note Created'),
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      label: 'Course Reminder',
      action: () => triggerCourseReminder('JavaScript Fundamentals', 'js-101'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'AI Insight',
      action: () => triggerAIInsight('Based on your study patterns, you learn best in the morning. Try scheduling important sessions before 10 AM!'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">🔔 Test Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {demoNotifications.map((demo, index) => (
          <Button
            key={index}
            onClick={demo.action}
            className={`w-full text-white ${demo.color}`}
            size="sm"
          >
            {demo.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
