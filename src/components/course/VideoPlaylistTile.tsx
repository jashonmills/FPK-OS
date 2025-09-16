import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Maximize2 } from 'lucide-react';
import MediaPlayerDisplay from './MediaPlayerDisplay';

interface VideoPlaylistTileProps {
  videoUrl: string;
  title: string;
  onExpand: () => void;
  isCurrentMain?: boolean;
}

const VideoPlaylistTile: React.FC<VideoPlaylistTileProps> = ({
  videoUrl,
  title,
  onExpand,
  isCurrentMain = false
}) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    // Optional: Set initial volume lower for tile playback
    if (mediaRef.current) {
      mediaRef.current.volume = 0.7;
    }
  };

  return (
    <Card className={`bg-white/40 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 ${
      isCurrentMain ? 'ring-2 ring-primary/50' : ''
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Video Player */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <MediaPlayerDisplay
              type="video"
              src={videoUrl}
              title={title}
              mediaRef={mediaRef}
              onTimeUpdate={() => {}}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnterFullscreen={() => {}}
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={togglePlay}
                  className="bg-white/90 hover:bg-white text-black shadow-lg"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onExpand}
                  className="bg-white/90 hover:bg-white text-black shadow-lg"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Title and Expand Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white drop-shadow-sm">{title}</h3>
            {isCurrentMain && (
              <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
                Main
              </span>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExpand}
            className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Maximize2 className="h-3 w-3 mr-2" />
            View in Main Player
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlaylistTile;