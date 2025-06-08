
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Clock, Calendar } from 'lucide-react';

interface LanguageSettingsProps {
  primaryLanguage: string;
  dualLanguageEnabled: boolean;
  timeFormat: string;
  dateFormat: string;
  timezone: string;
  onChange: (key: string, value: any) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
];

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  primaryLanguage,
  dualLanguageEnabled,
  timeFormat,
  dateFormat,
  timezone,
  onChange
}) => {
  const formatCurrentTime = () => {
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12h',
      timeZone: timezone,
    };
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: dateFormat === 'US' ? 'numeric' : '2-digit',
      day: dateFormat === 'US' ? 'numeric' : '2-digit',
      timeZone: timezone,
    };

    const time = now.toLocaleTimeString('en-US', timeOptions);
    const date = dateFormat === 'US' 
      ? now.toLocaleDateString('en-US', dateOptions)
      : now.toLocaleDateString('en-GB', dateOptions);
    
    return `${date} ${time}`;
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Language & Localization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Primary Language</Label>
          <Select value={primaryLanguage} onValueChange={(value) => onChange('primary_language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.name}>
                  {lang.native} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dual-language">Dual Language Mode</Label>
            <p className="text-sm text-gray-500">Show content in Primary + English side-by-side</p>
          </div>
          <Switch
            id="dual-language"
            checked={dualLanguageEnabled}
            onCheckedChange={(checked) => onChange('dual_language_enabled', checked)}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Format
          </Label>
          <RadioGroup value={timeFormat} onValueChange={(value) => onChange('time_format', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="12h" />
              <Label htmlFor="12h">12-hour (AM/PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h">24-hour</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Format
          </Label>
          <RadioGroup value={dateFormat} onValueChange={(value) => onChange('date_format', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="US" id="us-date" />
              <Label htmlFor="us-date">US (MM/DD/YYYY)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="International" id="intl-date" />
              <Label htmlFor="intl-date">International (DD/MM/YYYY)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={timezone} onValueChange={(value) => onChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Preview:</strong> {formatCurrentTime()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
