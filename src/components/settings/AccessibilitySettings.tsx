
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
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AccessibilitySettingsProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ profile, onUpdate }) => {
  const getTextSizeLabel = (value: number) => {
    const labels = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
    return labels[value - 1] || 'Medium';
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = ['Compact', 'Tight', 'Normal', 'Relaxed', 'Loose'];
    return labels[value - 1] || 'Normal';
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          Accessibility & Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Family */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Font Family</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose a font that's comfortable for reading. OpenDyslexic is designed for dyslexia.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={profile.font_family || 'System'}
            onValueChange={(value) => onUpdate({ font_family: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System Default</SelectItem>
              <SelectItem value="OpenDyslexic">OpenDyslexic</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Cursive">Cursive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Contrast */}
        <div className="space-y-3">
          <Label>Color Contrast</Label>
          <RadioGroup
            value={profile.color_contrast || 'Standard'}
            onValueChange={(value) => onUpdate({ color_contrast: value })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High" id="high" />
              <Label htmlFor="high">High Contrast</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Comfort Mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Comfort Mode</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust the interface to reduce distractions and improve focus.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <RadioGroup
            value={profile.comfort_mode || 'Normal'}
            onValueChange={(value) => onUpdate({ comfort_mode: value })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Normal" id="normal" />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Low-Stimulus" id="low-stimulus" />
              <Label htmlFor="low-stimulus">Low-Stimulus</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Focus Mode" id="focus" />
              <Label htmlFor="focus">Focus Mode</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Text Size */}
        <div className="space-y-3">
          <Label>Text Size: {getTextSizeLabel(profile.text_size || 3)}</Label>
          <Slider
            value={[profile.text_size || 3]}
            onValueChange={([value]) => onUpdate({ text_size: value })}
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
          <Label>Line Spacing: {getLineSpacingLabel(profile.line_spacing || 3)}</Label>
          <Slider
            value={[profile.line_spacing || 3]}
            onValueChange={([value]) => onUpdate({ line_spacing: value })}
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
            <Label htmlFor="speech_to_text">Speech to Text</Label>
            <p className="text-sm text-gray-500">Enable voice input for accessibility</p>
          </div>
          <Switch
            id="speech_to_text"
            checked={profile.speech_to_text_enabled || false}
            onCheckedChange={(checked) => onUpdate({ speech_to_text_enabled: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
