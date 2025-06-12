import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Clock, Calendar } from 'lucide-react';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';

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
  // UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', region: 'UTC' },
  
  // United States
  { value: 'America/New_York', label: 'Eastern Time (New York)', region: 'United States' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)', region: 'United States' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)', region: 'United States' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)', region: 'United States' },
  { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)', region: 'United States' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)', region: 'United States' },
  
  // Ireland & UK
  { value: 'Europe/Dublin', label: 'Ireland Time (Dublin)', region: 'Ireland' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (London)', region: 'United Kingdom' },
  
  // Europe
  { value: 'Europe/Paris', label: 'Central European Time (Paris)', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin)', region: 'Europe' },
  { value: 'Europe/Rome', label: 'Central European Time (Rome)', region: 'Europe' },
  { value: 'Europe/Madrid', label: 'Central European Time (Madrid)', region: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Central European Time (Amsterdam)', region: 'Europe' },
  { value: 'Europe/Stockholm', label: 'Central European Time (Stockholm)', region: 'Europe' },
  { value: 'Europe/Warsaw', label: 'Central European Time (Warsaw)', region: 'Europe' },
  
  // Asia
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)', region: 'Asia' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time (Seoul)', region: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time', region: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore Time', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (Mumbai)', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai)', region: 'Asia' },
  
  // Australia & Oceania
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)', region: 'Australia' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time (Melbourne)', region: 'Australia' },
  { value: 'Australia/Perth', label: 'Australian Western Time (Perth)', region: 'Australia' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)', region: 'New Zealand' },
  
  // Americas (Others)
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)', region: 'Canada' },
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)', region: 'Canada' },
  { value: 'America/Mexico_City', label: 'Central Time (Mexico City)', region: 'Mexico' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time (São Paulo)', region: 'Brazil' },
  { value: 'America/Buenos_Aires', label: 'Argentina Time (Buenos Aires)', region: 'Argentina' },
];

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  primaryLanguage,
  dualLanguageEnabled,
  timeFormat,
  dateFormat,
  timezone,
  onChange
}) => {
  const { t } = useDualLanguage();

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

    try {
      const time = now.toLocaleTimeString('en-US', timeOptions);
      const date = dateFormat === 'US' 
        ? now.toLocaleDateString('en-US', dateOptions)
        : now.toLocaleDateString('en-GB', dateOptions);
      
      return `${date} ${time}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid timezone';
    }
  };

  const groupedTimezones = TIMEZONES.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = [];
    }
    acc[tz.region].push(tz);
    return acc;
  }, {} as Record<string, typeof TIMEZONES>);

  const handleDualLanguageToggle = (enabled: boolean) => {
    console.log('LanguageSettings: Toggling dual language to:', enabled);
    
    // Update form data
    onChange('dual_language_enabled', enabled);
    
    // Update localStorage immediately for sync
    localStorage.setItem('fpk-dual-language', enabled.toString());
    
    // Dispatch events for component sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'fpk-dual-language',
      newValue: enabled.toString(),
      oldValue: localStorage.getItem('fpk-dual-language')
    }));

    window.dispatchEvent(new CustomEvent('dual-language-change', {
      detail: {
        key: 'fpk-dual-language',
        newValue: enabled.toString()
      }
    }));
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <DualLanguageText translationKey="settings.language.title" fallback="Language & Localization" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>
            <DualLanguageText translationKey="settings.language.primaryLanguage" fallback="Primary Language" />
          </Label>
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
            <Label htmlFor="dual-language">
              <DualLanguageText translationKey="settings.language.dualLanguageMode" fallback="Dual Language Mode" />
            </Label>
            <p className="text-sm text-gray-500">
              <DualLanguageText translationKey="settings.language.dualLanguageDescription" fallback="Show content in Primary + English side-by-side" />
            </p>
          </div>
          <Switch
            id="dual-language"
            checked={dualLanguageEnabled}
            onCheckedChange={handleDualLanguageToggle}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <DualLanguageText translationKey="settings.language.timeFormat" fallback="Time Format" />
          </Label>
          <RadioGroup value={timeFormat} onValueChange={(value) => onChange('time_format', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="12h" />
              <Label htmlFor="12h">
                <DualLanguageText translationKey="settings.language.12hour" fallback="12-hour (AM/PM)" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h">
                <DualLanguageText translationKey="settings.language.24hour" fallback="24-hour" />
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <DualLanguageText translationKey="settings.language.dateFormat" fallback="Date Format" />
          </Label>
          <RadioGroup value={dateFormat} onValueChange={(value) => onChange('date_format', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="US" id="us-date" />
              <Label htmlFor="us-date">
                <DualLanguageText translationKey="settings.language.usDate" fallback="US (MM/DD/YYYY)" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="International" id="intl-date" />
              <Label htmlFor="intl-date">
                <DualLanguageText translationKey="settings.language.intlDate" fallback="International (DD/MM/YYYY)" />
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>
            <DualLanguageText translationKey="settings.language.timezone" fallback="Timezone" />
          </Label>
          <Select value={timezone} onValueChange={(value) => onChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {Object.entries(groupedTimezones).map(([region, timezones]) => (
                <div key={region}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                    {region}
                  </div>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>
              <DualLanguageText translationKey="settings.language.preview" fallback="Preview" />:
            </strong> {formatCurrentTime()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
