/**
 * Sticky media toolbar for persistent playback controls
 * Shows mini-player when content is scrolled out of view
 */

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StickyMediaToolbarProps {
  isVisible: boolean;
  isPlaying: boolean;
  title?: string;
  progress: number;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onMinimize?: () => void;
  className?: string;
}

export const StickyMediaToolbar: React.FC<StickyMediaToolbarProps> = ({
  isVisible,
  isPlaying,
  title,
  progress,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  onMinimize,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 bg-background border-t border-border",
      "transition-all duration-300 ease-in-out",
      "shadow-lg",
      className
    )}>
      {/* Media Title */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">
          {title || 'Media Player'}
        </h4>
        <Progress value={progress} className="h-1 mt-1" />
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipBack}
          className="h-8 w-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePlay}
          className="h-8 w-8"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipForward}
          className="h-8 w-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        {onMinimize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StickyMediaToolbar;