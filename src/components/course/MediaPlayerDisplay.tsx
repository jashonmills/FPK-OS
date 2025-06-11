
import React from 'react';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPlayerDisplayProps {
  type: 'video' | 'audio';
  src: string;
  title?: string;
  captions?: string;
  mediaRef: React.RefObject<HTMLVideoElement | HTMLAudioElement>;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnterFullscreen: () => void;
}

const MediaPlayerDisplay: React.FC<MediaPlayerDisplayProps> = ({
  type,
  src,
  title,
  captions,
  mediaRef,
  onTimeUpdate,
  onLoadedMetadata,
  onPlay,
  onPause,
  onEnterFullscreen
}) => {
  return (
    <div className="relative">
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className="w-full h-auto"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
        >
          {captions && <track kind="subtitles" src={captions} srcLang="en" label="English" />}
        </video>
      ) : (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">{title || 'Audio Content'}</h3>
          <div className="text-sm opacity-80">🎵 Audio Player</div>
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onPlay={onPlay}
            onPause={onPause}
            className="hidden"
          />
        </div>
      )}
      
      {type === 'video' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEnterFullscreen}
          className="absolute bottom-2 right-2"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MediaPlayerDisplay;
