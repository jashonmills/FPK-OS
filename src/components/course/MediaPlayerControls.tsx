
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPlayerControlsProps {
  isPlaying: boolean;
  duration: number;
  playbackRate: number;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onChangePlaybackRate: () => void;
}

const MediaPlayerControls: React.FC<MediaPlayerControlsProps> = ({
  isPlaying,
  duration,
  playbackRate,
  onTogglePlay,
  onSkip,
  onChangePlaybackRate
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSkip(-10)}
        disabled={!duration}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onTogglePlay}
        disabled={!duration}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSkip(10)}
        disabled={!duration}
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onChangePlaybackRate}
        className="text-xs"
      >
        {playbackRate}x
      </Button>
    </div>
  );
};

export default MediaPlayerControls;
