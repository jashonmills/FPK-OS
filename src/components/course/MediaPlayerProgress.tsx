
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface MediaPlayerProgressProps {
  progress: number[];
  duration: number;
  onProgressChange: (value: number[]) => void;
}

const MediaPlayerProgress: React.FC<MediaPlayerProgressProps> = ({
  progress,
  duration,
  onProgressChange
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-4">
      <Slider
        value={progress}
        onValueChange={onProgressChange}
        max={100}
        step={0.1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{formatTime((progress[0] / 100) * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default MediaPlayerProgress;
