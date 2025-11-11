import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Music, Volume2 } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import MediaPlayerProgress from '@/components/course/MediaPlayerProgress';
import MediaPlayerVolume from '@/components/course/MediaPlayerVolume';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileAwareAudioPlayer } from '@/utils/mobileAudioPlayer';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

interface LessonAudioPlayerProps {
  audioUrl?: string;
  lessonTitle: string;
  lessonNumber: number;
  totalLessons: number;
  contentRef: React.RefObject<HTMLElement>;
  className?: string;
}

/**
 * Smart Lesson Audio Player
 * - If audioUrl provided: Plays MP3 file from Supabase
 * - If no audioUrl: Falls back to Text-to-Speech
 */
const LessonAudioPlayer: React.FC<LessonAudioPlayerProps> = ({
  audioUrl,
  lessonTitle,
  lessonNumber,
  totalLessons,
  contentRef,
  className = ""
}) => {
  // If no audioUrl, fall back to TTS
  if (!audioUrl) {
    return (
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={lessonNumber}
        totalLessons={totalLessons}
        contentRef={contentRef}
        className={className}
      />
    );
  }

  // MP3 Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { settings, updateSettings } = useVoiceSettings();
  const mobilePlayer = useRef(new MobileAwareAudioPlayer());

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress([progressPercent]);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress([0]);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  // Update playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = parseFloat(playbackSpeed);
    }
  }, [playbackSpeed]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    // Enable interaction on first click
    if (!settings.hasInteracted) {
      updateSettings({ hasInteracted: true });
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress([0]);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (value[0] > 0) {
      setIsMuted(false);
    }
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Listen to Lesson</span>
              <Badge variant="outline" className="ml-2 text-xs">
                MP3 Narration
              </Badge>
            </div>
          </div>
          {!settings.hasInteracted && (
            <Badge variant="outline" className="text-xs">
              Click to enable
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <MediaPlayerProgress
          progress={progress}
          duration={duration}
          onProgressChange={handleProgressChange}
        />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlayPause}
              variant={isPlaying ? "default" : "default"}
              className={isPlaying ? "" : "fpk-gradient text-white"}
              disabled={!settings.hasInteracted}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button
              onClick={handleStop}
              variant="outline"
              disabled={!isPlaying}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Control */}
            <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>

            {/* Volume Control */}
            <MediaPlayerVolume
              isMuted={isMuted}
              volume={volume}
              onToggleMute={handleToggleMute}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>

        {/* Usage Hint */}
        {!settings.hasInteracted && (
          <div className="text-xs text-muted-foreground text-center">
            Click anywhere on the page first to enable audio playback
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonAudioPlayer;
