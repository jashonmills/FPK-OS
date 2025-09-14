import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import MediaPlayerDisplay from './MediaPlayerDisplay';

interface CourseOverviewVideoProps {
  videoUrl: string;
  title?: string;
}

const CourseOverviewVideo: React.FC<CourseOverviewVideoProps> = ({
  videoUrl,
  title = "Course Introduction Video"
}) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleFullscreen = () => {
    if (mediaRef.current?.requestFullscreen) {
      mediaRef.current.requestFullscreen();
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <PlayCircle className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <MediaPlayerDisplay
            type="video"
            src={videoUrl}
            title={title}
            mediaRef={mediaRef}
            onTimeUpdate={() => {}}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnterFullscreen={handleFullscreen}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseOverviewVideo;