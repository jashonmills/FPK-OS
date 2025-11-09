import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollaborativeResponsePlayerProps {
  audioPlaylist: string[];
  groupId: string;
  autoPlayEnabled?: boolean;
}

export function CollaborativeResponsePlayer({ 
  audioPlaylist, 
  groupId, 
  autoPlayEnabled = false 
}: CollaborativeResponsePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStoppedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Auto-play effect (fires once when audio is ready and autoplay is enabled)
  useEffect(() => {
    if (autoPlayEnabled && 
        !hasAutoPlayed && 
        audioPlaylist.length > 0 && 
        audioPlaylist.every(url => url && url.length > 0) &&
        !isPlaying) {
      console.log('[Unified Player] 🔊 Auto-playing collaborative response');
      setHasAutoPlayed(true);
      playSequentially();
    }
  }, [autoPlayEnabled, audioPlaylist, hasAutoPlayed, isPlaying]);

  const stopPlayback = () => {
    isStoppedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTrackIndex(0);
  };

  const playSequentially = async () => {
    if (audioPlaylist.length === 0) {
      console.warn('No audio URLs in playlist');
      return;
    }

    isStoppedRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < audioPlaylist.length; i++) {
      if (isStoppedRef.current) break;

      setCurrentTrackIndex(i);
      
      try {
        await playAudioFile(audioPlaylist[i]);
        
        // Add 750ms pause between tracks (except after the last one)
        if (i < audioPlaylist.length - 1 && !isStoppedRef.current) {
          await new Promise(resolve => setTimeout(resolve, 750));
        }
      } catch (error) {
        console.error('Error playing audio track:', error);
        // Continue to next track even if one fails
      }
    }

    // Playback completed
    if (!isStoppedRef.current) {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
    }
  };

  const playAudioFile = (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (isStoppedRef.current) {
        resolve();
        return;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        audioRef.current = null;
        resolve();
      };

      audio.onerror = (error) => {
        console.error('Audio playback error for URL:', audioUrl, error);
        audioRef.current = null;
        resolve(); // Continue even if one fails
      };

      audio.play().catch((error) => {
        console.error('Audio play failed:', error);
        audioRef.current = null;
        resolve();
      });
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playSequentially();
    }
  };

  const getSpeakerLabel = () => {
    if (!isPlaying) return null;
    
    const speakers = ['Al', 'Betty'];
    if (currentTrackIndex < speakers.length) {
      return `Playing: ${speakers[currentTrackIndex]}`;
    }
    return 'Playing...';
  };

  const hasAudio = audioPlaylist.length > 0 && audioPlaylist.every(url => url && url.length > 0);

  // Log playlist info for debugging
  useEffect(() => {
    if (hasAudio) {
      console.log('[Unified Player] 📻 Audio playlist loaded:', {
        groupId,
        audioCount: audioPlaylist.length,
        audioUrls: audioPlaylist.map(url => url?.substring(0, 50) + '...')
      });
    }
  }, [audioPlaylist, groupId, hasAudio]);

  if (!hasAudio) {
    return null; // Don't render if no audio available
  }

  return (
    <div className="flex items-center justify-between gap-3 mb-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
        {isPlaying && getSpeakerLabel() && (
          <span className="text-xs text-muted-foreground animate-pulse">
            {getSpeakerLabel()}
          </span>
        )}
      </div>
      
      <button
        onClick={handlePlayPause}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
          "hover:bg-muted/50 active:scale-95",
          isPlaying 
            ? "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" 
            : "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
        )}
        title={isPlaying ? "Stop playback" : "Play collaborative response"}
      >
        {isPlaying ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium">Stop</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium">Play All</span>
          </>
        )}
      </button>
    </div>
  );
}
