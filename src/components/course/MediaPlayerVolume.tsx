
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MediaPlayerVolumeProps {
  isMuted: boolean;
  volume: number[];
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
}

const MediaPlayerVolume: React.FC<MediaPlayerVolumeProps> = ({
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      
      <Slider
        value={volume}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-20"
      />
    </div>
  );
};

export default MediaPlayerVolume;
