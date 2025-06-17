
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Eye, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface AccessibilitySettingsProps {
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorContrast: string;
  comfortMode: string;
  speechToTextEnabled: boolean;
  onChange: (key: string, value: any) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  fontFamily,
  textSize,
  lineSpacing,
  colorContrast,
  comfortMode,
  speechToTextEnabled,
  onChange
}) => {
  const { t } = useTranslation('settings');

  const getTextSizeLabel = (value: number) => {
    const labels = [
      t('accessibility.extraSmall'),
      t('accessibility.small'), 
      t('accessibility.medium'),
      t('accessibility.large'),
      t('accessibility.extraLarge')
    ];
    return labels[value - 1] || t('accessibility.medium');
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = [
      t('accessibility.compact'),
      t('accessibility.tight'),
      t('accessibility.normal'),
      t('accessibility.relaxed'),
      t('accessibility.loose')
    ];
    return labels[value - 1] || t('accessibility.normal');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          {t('accessibility.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Family */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>{t('accessibility.fontFamily')}</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('accessibility.fontHelp')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={fontFamily}
            onValueChange={(value) => onChange('font_family', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="System">{t('accessibility.systemFont')}</SelectItem>
              <SelectItem value="OpenDyslexic">OpenDyslexic</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Cursive">Cursive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Contrast */}
        <div className="space-y-3">
          <Label>{t('accessibility.colorContrast')}</Label>
          <RadioGroup
            value={colorContrast}
            onValueChange={(value) => onChange('color_contrast', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Standard" id="standard" />
              <Label htmlFor="standard">{t('accessibility.standard')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High" id="high" />
              <Label htmlFor="high">{t('accessibility.highContrast')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Comfort Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>{t('accessibility.comfortMode')}</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('accessibility.comfortHelp')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <RadioGroup
            value={comfortMode}
            onValueChange={(value) => onChange('comfort_mode', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Normal" id="normal" />
              <Label htmlFor="normal">{t('accessibility.normal')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Low-Stimulus" id="low-stimulus" />
              <Label htmlFor="low-stimulus">{t('accessibility.lowStimulus')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Focus Mode" id="focus" />
              <Label htmlFor="focus">{t('accessibility.focusMode')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Text Size */}
        <div className="space-y-3">
          <Label>{t('accessibility.textSize')}: {getTextSizeLabel(textSize)}</Label>
          <Slider
            value={[textSize]}
            onValueChange={([value]) => onChange('text_size', value)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{t('accessibility.extraSmall')}</span>
            <span>{t('accessibility.small')}</span>
            <span>{t('accessibility.medium')}</span>
            <span>{t('accessibility.large')}</span>
            <span>{t('accessibility.extraLarge')}</span>
          </div>
        </div>

        {/* Line Spacing */}
        <div className="space-y-3">
          <Label>{t('accessibility.lineSpacing')}: {getLineSpacingLabel(lineSpacing)}</Label>
          <Slider
            value={[lineSpacing]}
            onValueChange={([value]) => onChange('line_spacing', value)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{t('accessibility.compact')}</span>
            <span>{t('accessibility.tight')}</span>
            <span>{t('accessibility.normal')}</span>
            <span>{t('accessibility.relaxed')}</span>
            <span>{t('accessibility.loose')}</span>
          </div>
        </div>

        <Separator />

        {/* Speech to Text */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="speech_to_text">{t('accessibility.speechToText')}</Label>
            <p className="text-sm text-gray-500">{t('accessibility.speechToTextDesc')}</p>
          </div>
          <Switch
            id="speech_to_text"
            checked={speechToTextEnabled}
            onCheckedChange={(checked) => onChange('speech_to_text_enabled', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
