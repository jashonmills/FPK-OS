
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        {type === 'video' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            className="w-full h-auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
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
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}
        
        {/* Controls */}
        <div className="p-4 bg-background">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={progress}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime((progress[0] / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => skip(-10)}
                disabled={!duration}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                disabled={!duration}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => skip(10)}
                disabled={!duration}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={changePlaybackRate}
                className="text-xs"
              >
                {playbackRate}x
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
              
              {type === 'video' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={enterFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaPlayer;
