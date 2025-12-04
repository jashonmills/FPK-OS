
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, Calendar, Loader2 } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';

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
  
  const {
    isConnected,
    isConnecting,
    connectCalendar,
    disconnectCalendar,
    checkConnection,
  } = useGoogleCalendarSync();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="google_calendar" className={textClasses}>{renderText(t('integrations.googleCalendar'))}</Label>
              {isConnected && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Connected
                </span>
              )}
            </div>
            <p className={`text-sm text-gray-500 ${textClasses} mb-2`}>
              {isConnected 
                ? 'Sync your goals and study sessions to Google Calendar'
                : renderText(t('integrations.googleDesc'))
              }
            </p>
            {isConnected ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectCalendar}
                  className="text-red-600 hover:text-red-700"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={connectCalendar}
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            )}
          </div>
          <Switch
            id="google_calendar"
            checked={isConnected && formData.calendar_sync.google}
            onCheckedChange={(checked) => {
              if (isConnected) {
                onCalendarSyncChange('google', checked);
              } else {
                connectCalendar();
              }
            }}
            disabled={!isConnected}
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
