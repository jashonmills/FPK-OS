
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, CheckCircle } from 'lucide-react';
import { useAccessibility } from '@/components/AccessibilityProvider';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AccessibilitySettingsProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ profile, onUpdate }) => {
  const { updateSettings, settings } = useAccessibility();

  const handleFontFamilyChange = (value: string) => {
    updateSettings({ fontFamily: value });
    onUpdate({ font_family: value });
  };

  const handleColorContrastChange = (value: string) => {
    updateSettings({ colorContrast: value });
    onUpdate({ color_contrast: value });
  };

  const handleComfortModeChange = (value: string) => {
    updateSettings({ comfortMode: value });
    onUpdate({ comfort_mode: value });
  };

  const handleTextSizeChange = (value: number[]) => {
    const size = value[0];
    updateSettings({ textSize: size });
    onUpdate({ text_size: size });
  };

  const handleLineSpacingChange = (value: number[]) => {
    const spacing = value[0];
    updateSettings({ lineSpacing: spacing });
    onUpdate({ line_spacing: spacing });
  };

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          Accessibility & Display
          <div className="flex items-center gap-1 ml-auto text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Live Preview Active</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Font Family</Label>
          <Select
            value={settings.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System Default</SelectItem>
              <SelectItem value="OpenDyslexic">OpenDyslexic (Dyslexia-Friendly)</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Changes apply immediately across the entire app
          </p>
        </div>

        <div>
          <Label>Color Contrast</Label>
          <RadioGroup
            value={settings.colorContrast}
            onValueChange={handleColorContrastChange}
            className="flex gap-6 mt-2"
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

        <div>
          <Label>Comfort Mode</Label>
          <RadioGroup
            value={settings.comfortMode}
            onValueChange={handleComfortModeChange}
            className="flex gap-6 mt-2"
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
              <RadioGroupItem value="Focus" id="focus" />
              <Label htmlFor="focus">Focus Mode</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Text Size: {['Small', 'Medium', 'Large', 'Extra Large', 'Maximum'][(settings.textSize || 2) - 1]}</Label>
          <Slider
            value={[settings.textSize]}
            onValueChange={handleTextSizeChange}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
            <span>XL</span>
            <span>Max</span>
          </div>
        </div>

        <div>
          <Label>Line Spacing: {['Compact', 'Comfortable', 'Airy', 'Extra Airy'][(settings.lineSpacing || 2) - 1]}</Label>
          <Slider
            value={[settings.lineSpacing]}
            onValueChange={handleLineSpacingChange}
            min={1}
            max={4}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Compact</span>
            <span>Comfortable</span>
            <span>Airy</span>
            <span>Extra</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> All changes are applied instantly and saved automatically. 
            Your preferences will persist across all devices and sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
