
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';

interface IntegrationSectionProps {
  formData: {
    calendar_sync: {
      google: boolean;
      outlook: boolean;
    };
  };
  onCalendarSyncChange: (key: string, value: boolean) => void;
}

const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  formData,
  onCalendarSyncChange
}) => {
  const { t, renderText } = useGlobalTranslation('settings');
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
    <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
          <Link className="h-5 w-5 text-blue-600" />
          {renderText(t('integrations.title'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="google_calendar" className={textClasses}>{renderText(t('integrations.googleCalendar'))}</Label>
            <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('integrations.googleDesc'))}</p>
          </div>
          <Switch
            id="google_calendar"
            checked={formData.calendar_sync.google}
            onCheckedChange={(checked) => onCalendarSyncChange('google', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="outlook_calendar" className={textClasses}>{renderText(t('integrations.outlookCalendar'))}</Label>
            <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('integrations.outlookDesc'))}</p>
          </div>
          <Switch
            id="outlook_calendar"
            checked={formData.calendar_sync.outlook}
            onCheckedChange={(checked) => onCalendarSyncChange('outlook', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationSection;
