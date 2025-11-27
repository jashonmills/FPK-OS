
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
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

interface AccessibilitySettingsProps {
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorContrast: string;
  comfortMode: string;
  speechToTextEnabled: boolean;
  onChange: (key: string, value: string | number | boolean) => void;
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
  const { t, renderText } = useGlobalTranslation('settings');

  const getTextSizeLabel = (value: number) => {
    const labels = [
      'Extra Small',
      'Small', 
      'Medium',
      'Large',
      'Extra Large'
    ];
    return labels[value - 1] || 'Medium';
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = [
      'Compact',
      'Tight',
      'Normal',
      'Relaxed',
      'Loose'
    ];
    return labels[value - 1] || 'Normal';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          {renderText(t('accessibility.title'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Family */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>{renderText(t('accessibility.fontFamily'))}</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{renderText(t('accessibility.fontHelp'))}</p>
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
              <SelectItem value="System">{renderText(t('accessibility.systemFont'))}</SelectItem>
              <SelectItem value="OpenDyslexic">OpenDyslexic</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Cursive">Cursive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Contrast */}
        <div className="space-y-3">
          <Label>{renderText(t('accessibility.colorContrast'))}</Label>
          <RadioGroup
            value={colorContrast}
            onValueChange={(value) => onChange('color_contrast', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Standard" id="standard" />
              <Label htmlFor="standard">{renderText(t('accessibility.standard'))}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High" id="high" />
              <Label htmlFor="high">{renderText(t('accessibility.highContrast'))}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Comfort Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>{renderText(t('accessibility.comfortMode'))}</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{renderText(t('accessibility.comfortHelp'))}</p>
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
              <Label htmlFor="normal">{renderText(t('accessibility.normal'))}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Low-Stimulus" id="low-stimulus" />
              <Label htmlFor="low-stimulus">{renderText(t('accessibility.lowStimulus'))}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Focus Mode" id="focus" />
              <Label htmlFor="focus">{renderText(t('accessibility.focusMode'))}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Text Size */}
        <div className="space-y-3">
          <Label>{renderText(t('accessibility.textSize'))}: {getTextSizeLabel(textSize)}</Label>
          <Slider
            value={[textSize]}
            onValueChange={([value]) => onChange('text_size', value)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Extra Small</span>
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
            <span>Extra Large</span>
          </div>
        </div>

        {/* Line Spacing */}
        <div className="space-y-3">
          <Label>{renderText(t('accessibility.lineSpacing'))}: {getLineSpacingLabel(lineSpacing)}</Label>
          <Slider
            value={[lineSpacing]}
            onValueChange={([value]) => onChange('line_spacing', value)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Compact</span>
            <span>Tight</span>
            <span>Normal</span>
            <span>Relaxed</span>
            <span>Loose</span>
          </div>
        </div>

        <Separator />

        {/* Speech to Text */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="speech_to_text">{renderText(t('accessibility.speechToText'))}</Label>
            <p className="text-sm text-gray-500">{renderText(t('accessibility.speechToTextDesc'))}</p>
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
