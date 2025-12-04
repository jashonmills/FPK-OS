import React from 'react';
import { Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { cn } from '@/lib/utils';

const SPEED_PRESETS = [0.8, 1.0, 1.1, 1.25, 1.5];

interface SpeedControlProps {
  compact?: boolean;
}

export function SpeedControl({ compact = false }: SpeedControlProps) {
  const { settings, updateSettings } = useVoiceSettings();
  const currentSpeed = settings.rate;

  const cycleSpeed = () => {
    const currentIndex = SPEED_PRESETS.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
    const nextSpeed = SPEED_PRESETS[nextIndex];
    
    console.log(`[Speed Control] Changing speed: ${currentSpeed}x → ${nextSpeed}x`);
    updateSettings({ rate: nextSpeed });
  };

  const getSpeedLabel = () => {
    return `${currentSpeed}x`;
  };

  const getSpeedColor = () => {
    if (currentSpeed < 1.0) return 'text-blue-600';
    if (currentSpeed === 1.0) return 'text-gray-600';
    return 'text-orange-600';
  };

  return (
    <Button
      variant="ghost"
      size={compact ? "sm" : "default"}
      onClick={cycleSpeed}
      className={cn(
        "flex items-center gap-1.5 font-mono font-semibold transition-colors",
        getSpeedColor(),
        compact ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm"
      )}
      title={`Current speed: ${getSpeedLabel()}. Click to cycle.`}
    >
      <Gauge className={compact ? "w-3 h-3" : "w-4 h-4"} />
      <span>{getSpeedLabel()}</span>
    </Button>
  );
}
