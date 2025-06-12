
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
    <Card className="fpk-enhanced-card">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <DualLanguageText translationKey="settings.language.title" fallback="Language & Localization" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <Label>
            <DualLanguageText translationKey="settings.language.primaryLanguage" fallback="Primary Language" />
          </Label>
          <Select value={primaryLanguage} onValueChange={(value) => onChange('primary_language', value)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.name} className="hover:bg-accent">
                  {lang.native} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-border/20">
          <div>
            <Label htmlFor="dual-language" className="font-medium">
              <DualLanguageText translationKey="settings.language.dualLanguageMode" fallback="Dual Language Mode" />
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              <DualLanguageText translationKey="settings.language.dualLanguageDescription" fallback="Show content in Primary + English side-by-side" />
            </p>
          </div>
          <Switch
            id="dual-language"
            checked={dualLanguageEnabled}
            onCheckedChange={handleDualLanguageToggle}
          />
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-medium">
            <Clock className="h-4 w-4 text-primary" />
            <DualLanguageText translationKey="settings.language.timeFormat" fallback="Time Format" />
          </Label>
          <RadioGroup value={timeFormat} onValueChange={(value) => onChange('time_format', value)} className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="12h" id="12h" />
              <Label htmlFor="12h" className="cursor-pointer">
                <DualLanguageText translationKey="settings.language.12hour" fallback="12-hour (AM/PM)" />
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h" className="cursor-pointer">
                <DualLanguageText translationKey="settings.language.24hour" fallback="24-hour" />
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            <DualLanguageText translationKey="settings.language.dateFormat" fallback="Date Format" />
          </Label>
          <RadioGroup value={dateFormat} onValueChange={(value) => onChange('date_format', value)} className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="US" id="us-date" />
              <Label htmlFor="us-date" className="cursor-pointer">
                <DualLanguageText translationKey="settings.language.usDate" fallback="US (MM/DD/YYYY)" />
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="International" id="intl-date" />
              <Label htmlFor="intl-date" className="cursor-pointer">
                <DualLanguageText translationKey="settings.language.intlDate" fallback="International (DD/MM/YYYY)" />
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="font-medium">
            <DualLanguageText translationKey="settings.language.timezone" fallback="Timezone" />
          </Label>
          <Select value={timezone} onValueChange={(value) => onChange('timezone', value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="max-h-96 bg-background border shadow-lg z-50">
              {Object.entries(groupedTimezones).map(([region, timezones]) => (
                <div key={region}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-accent/30 sticky top-0">
                    {region}
                  </div>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="hover:bg-accent pl-4">
                      {tz.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-foreground">
            <strong>
              <DualLanguageText translationKey="settings.language.preview" fallback="Preview" />:
            </strong> <span className="text-primary font-mono">{formatCurrentTime()}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
