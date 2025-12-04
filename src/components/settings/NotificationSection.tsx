
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';

interface NotificationSectionProps {
  formData: {
    push_notifications_enabled: boolean;
    email_notifications: {
      new_courses: boolean;
      weekly_summary: boolean;
      ai_prompts: boolean;
    };
    app_reminders: {
      study_streak: boolean;
      module_nudges: boolean;
    };
  };
  onFormChange: (key: string, value: string | number | boolean) => void;
  onEmailNotificationChange: (key: string, value: boolean) => void;
  onAppReminderChange: (key: string, value: boolean) => void;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  formData,
  onFormChange,
  onEmailNotificationChange,
  onAppReminderChange
}) => {
  const { t, renderText } = useGlobalTranslation('settings');
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
            <Bell className="h-5 w-5 text-amber-600" />
            {renderText(t('notifications.emailTitle'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new_courses" className={textClasses}>{renderText(t('notifications.newCourses'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.newCoursesDesc'))}</p>
            </div>
            <Switch
              id="new_courses"
              checked={formData.email_notifications.new_courses}
              onCheckedChange={(checked) => onEmailNotificationChange('new_courses', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly_summary" className={textClasses}>{renderText(t('notifications.weeklySum'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.weeklySumDesc'))}</p>
            </div>
            <Switch
              id="weekly_summary"
              checked={formData.email_notifications.weekly_summary}
              onCheckedChange={(checked) => onEmailNotificationChange('weekly_summary', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai_prompts" className={textClasses}>{renderText(t('notifications.aiPrompts'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.aiPromptsDesc'))}</p>
            </div>
            <Switch
              id="ai_prompts"
              checked={formData.email_notifications.ai_prompts}
              onCheckedChange={(checked) => onEmailNotificationChange('ai_prompts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
        <CardHeader>
          <CardTitle className={textClasses}>{renderText(t('notifications.appTitle'))}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_notifications" className={textClasses}>{renderText(t('notifications.pushNotifications'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.pushNotificationsDesc'))}</p>
            </div>
            <Switch
              id="push_notifications"
              checked={formData.push_notifications_enabled}
              onCheckedChange={(checked) => onFormChange('push_notifications_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="study_streak" className={textClasses}>{renderText(t('notifications.studyStreak'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.studyStreakDesc'))}</p>
            </div>
            <Switch
              id="study_streak"
              checked={formData.app_reminders.study_streak}
              onCheckedChange={(checked) => onAppReminderChange('study_streak', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="module_nudges" className={textClasses}>{renderText(t('notifications.moduleNudges'))}</Label>
              <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.moduleNudgesDesc'))}</p>
            </div>
            <Switch
              id="module_nudges"
              checked={formData.app_reminders.module_nudges}
              onCheckedChange={(checked) => onAppReminderChange('module_nudges', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSection;
