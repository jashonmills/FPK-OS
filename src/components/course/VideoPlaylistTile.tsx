import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface VideoPlaylistTileProps {
  videoUrl: string;
  title: string;
  onWatch: () => void;
  isCurrentMain?: boolean;
}

const VideoPlaylistTile: React.FC<VideoPlaylistTileProps> = ({
  videoUrl,
  title,
  onWatch,
  isCurrentMain = false
}) => {
  return (
    <Card className={`bg-white/40 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
      isCurrentMain ? 'ring-2 ring-primary/50' : ''
    }`} onClick={onWatch}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Video Preview Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
            <video 
              src={videoUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-white text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium">Click to Watch</p>
              </div>
            </div>
          </div>
          
          {/* Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white drop-shadow-sm">{title}</h3>
            {isCurrentMain && (
              <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
                Currently Playing
              </span>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onWatch();
            }}
            className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Eye className="h-3 w-3 mr-2" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlaylistTile;