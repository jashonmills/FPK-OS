import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import MediaPlayerDisplay from './MediaPlayerDisplay';
import MediaPlayerControls from './MediaPlayerControls';

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
  const [playbackRate, setPlaybackRate] = useState(1);

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
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSkip = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += seconds;
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = nextRate;
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
        <div className="space-y-4">
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
          
          <div className="flex justify-center">
            <MediaPlayerControls
              isPlaying={isPlaying}
              duration={duration}
              playbackRate={playbackRate}
              onTogglePlay={togglePlay}
              onSkip={handleSkip}
              onChangePlaybackRate={changePlaybackRate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseOverviewVideo;