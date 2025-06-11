
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MediaPlayerDisplay from './MediaPlayerDisplay';
import MediaPlayerProgress from './MediaPlayerProgress';
import MediaPlayerControls from './MediaPlayerControls';
import MediaPlayerVolume from './MediaPlayerVolume';

interface MediaPlayerProps {
  src: string;
  type: 'video' | 'audio';
  title?: string;
  captions?: string;
  onProgress?: (progress: number) => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  src, 
  type, 
  title, 
  captions, 
  onProgress 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [progress, setProgress] = useState([0]);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!mediaRef.current) return;
    
    mediaRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!mediaRef.current) return;
    
    const newVolume = value[0];
    setVolume([newVolume]);
    mediaRef.current.volume = newVolume / 100;
  };

  const handleProgressChange = (value: number[]) => {
    if (!mediaRef.current) return;
    
    const newProgress = value[0];
    setProgress([newProgress]);
    mediaRef.current.currentTime = (newProgress / 100) * duration;
  };

  const handleTimeUpdate = () => {
    if (!mediaRef.current) return;
    
    const currentProgress = (mediaRef.current.currentTime / duration) * 100;
    setProgress([currentProgress]);
    onProgress?.(currentProgress);
  };

  const handleLoadedMetadata = () => {
    if (!mediaRef.current) return;
    setDuration(mediaRef.current.duration);
  };

  const skip = (seconds: number) => {
    if (!mediaRef.current) return;
    mediaRef.current.currentTime += seconds;
  };

  const changePlaybackRate = () => {
    if (!mediaRef.current) return;
    
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    setPlaybackRate(nextRate);
    mediaRef.current.playbackRate = nextRate;
  };

  const enterFullscreen = () => {
    if (type === 'video' && mediaRef.current) {
      if (mediaRef.current.requestFullscreen) {
        mediaRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <MediaPlayerDisplay
          type={type}
          src={src}
          title={title}
          captions={captions}
          mediaRef={mediaRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnterFullscreen={enterFullscreen}
        />
        
        <div className="p-4 bg-background">
          <MediaPlayerProgress
            progress={progress}
            duration={duration}
            onProgressChange={handleProgressChange}
          />
          
          <div className="flex items-center justify-between">
            <MediaPlayerControls
              isPlaying={isPlaying}
              duration={duration}
              playbackRate={playbackRate}
              onTogglePlay={togglePlay}
              onSkip={skip}
              onChangePlaybackRate={changePlaybackRate}
            />
            
            <MediaPlayerVolume
              isMuted={isMuted}
              volume={volume}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaPlayer;
