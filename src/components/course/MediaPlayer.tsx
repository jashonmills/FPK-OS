
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MediaPlayerDisplay from './MediaPlayerDisplay';
import MediaPlayerProgress from './MediaPlayerProgress';
import MediaPlayerControls from './MediaPlayerControls';
import MediaPlayerVolume from './MediaPlayerVolume';
import { useMediaProgress } from '@/hooks/useMediaProgress';
import { useMediaAnalytics } from '@/hooks/useMediaAnalytics';
import { useAnalytics } from '@/hooks/useAnalytics';

interface MediaPlayerProps {
  src: string;
  type: 'video' | 'audio';
  title?: string;
  captions?: string;
  mediaId: string; // Unique identifier for progress tracking
  courseId?: string;
  moduleId?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  src, 
  type, 
  title, 
  captions,
  mediaId,
  courseId,
  moduleId,
  onProgress,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [progress, setProgress] = useState([0]);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasResumed, setHasResumed] = useState(false);
  
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  
  // Progress tracking and analytics
  const { savedProgress, saveProgress, getResumeTime, markCompleted } = useMediaProgress({
    mediaId,
    onProgressUpdate: (progressData) => {
      if (progressData.completed) {
        onComplete?.();
      }
    }
  });
  
  const { trackPlay, trackPause, trackSeek, trackSpeedChange, trackCompletion } = useMediaAnalytics({
    mediaId,
    courseId,
    moduleId
  });

  const { trackMediaInteraction, trackModuleCompleted } = useAnalytics({
    courseId,
    moduleId
  });

  // Resume from saved position on first load
  useEffect(() => {
    if (!mediaRef.current || !duration || hasResumed) return;
    
    const resumeTime = getResumeTime();
    if (resumeTime > 0) {
      console.log(`⏭️ Resuming from ${Math.floor(resumeTime)}s`);
      mediaRef.current.currentTime = resumeTime;
      setHasResumed(true);
    }
  }, [duration, getResumeTime, hasResumed]);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
      trackPause(mediaRef.current.currentTime, duration);
      trackMediaInteraction('pause', type, mediaRef.current.currentTime);
    } else {
      mediaRef.current.play();
      trackPlay(mediaRef.current.currentTime, duration);
      trackMediaInteraction('play', type, mediaRef.current.currentTime);
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
    
    const oldTime = mediaRef.current.currentTime;
    const newProgress = value[0];
    const newTime = (newProgress / 100) * duration;
    
    setProgress([newProgress]);
    mediaRef.current.currentTime = newTime;
    
    // Track seek event
    trackSeek(oldTime, newTime, duration);
    trackMediaInteraction('seek', type, newTime);
  };

  const handleTimeUpdate = () => {
    if (!mediaRef.current) return;
    
    const currentTime = mediaRef.current.currentTime;
    const currentProgress = (currentTime / duration) * 100;
    setProgress([currentProgress]);
    onProgress?.(currentProgress);
    
    // Save progress every 5 seconds
    if (Math.floor(currentTime) % 5 === 0) {
      saveProgress(currentTime, duration);
    }
    
    // Check for completion (95% threshold)
    if (currentProgress >= 95 && !savedProgress?.completed) {
      markCompleted();
      trackCompletion(duration);
      trackModuleCompleted(currentTime);
    }
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
    
    // Track speed change
    trackSpeedChange(mediaRef.current.currentTime, duration, nextRate);
    trackMediaInteraction('speed_change', type, mediaRef.current.currentTime);
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
