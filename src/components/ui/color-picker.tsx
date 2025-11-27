import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presets?: Array<{ name: string; value: string; hex: string }>;
  label?: string;
  className?: string;
}

export function ColorPicker({ 
  color, 
  onChange, 
  presets = [], 
  label = "Color",
  className = ""
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: { value: string }) => {
    onChange(preset.value);
    setCustomColor(preset.value);
    setIsOpen(false);
  };

  const handleCustomColorChange = (value: string) => {
    setCustomColor(value);
    onChange(value);
  };

  return (
    <div className={className}>
      {label && <Label className="text-sm font-medium mb-2 block">{label}</Label>}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div 
              className="w-4 h-4 rounded mr-2 border"
              style={{ 
                backgroundColor: color.includes('hsl') ? `hsl(${color})` : color 
              }}
            />
            <Palette className="w-4 h-4 mr-2" />
            {color || 'Select color...'}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {presets.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Presets</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors ${
                        color === preset.value ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div
                        className="w-full h-6 rounded mb-2"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <div className="text-xs font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="custom-color" className="text-sm font-medium">
                Custom Color (HSL format)
              </Label>
              <Input
                id="custom-color"
                placeholder="e.g. 280 100% 70%"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use HSL format without "hsl()" wrapper. Example: 280 100% 70%
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}