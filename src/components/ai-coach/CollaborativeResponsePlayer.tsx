import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileAwareAudioPlayer } from '@/utils/mobileAudioPlayer';
import { isMobileBrowser } from '@/utils/mobileAudioUtils';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

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
  const audioPlayerRef = useRef<MobileAwareAudioPlayer>(new MobileAwareAudioPlayer());
  const isStoppedRef = useRef(false);
  const { settings } = useVoiceSettings();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioPlayerRef.current.stop();
    };
  }, []);

  // Auto-play effect (fires once when audio is ready and autoplay is enabled)
  useEffect(() => {
    // MOBILE FIX: Don't auto-play until user has interacted
    if (isMobileBrowser() && !settings.hasInteracted) {
      console.log('[CollaborativePlayer] Waiting for user interaction on mobile');
      return;
    }
    
    if (autoPlayEnabled && 
        !hasAutoPlayed && 
        audioPlaylist.length > 0 && 
        audioPlaylist.every(url => url && url.length > 0) &&
        !isPlaying) {
      console.log('[Unified Player] 🔊 Auto-playing collaborative response');
      setHasAutoPlayed(true);
      playSequentially();
    }
  }, [autoPlayEnabled, audioPlaylist, hasAutoPlayed, isPlaying, settings.hasInteracted]);

  const stopPlayback = () => {
    isStoppedRef.current = true;
    audioPlayerRef.current.stop();
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

  const playAudioFile = async (audioUrl: string): Promise<void> => {
    if (isStoppedRef.current) return;

    const success = await audioPlayerRef.current.play(audioUrl, {
      hasUserInteracted: settings.hasInteracted,
      onEnded: () => {
        // Will be handled by the sequential player
      },
      onError: (error) => {
        console.error('[CollaborativePlayer] Mobile audio error:', error);
      }
    });

    if (!success && isMobileBrowser()) {
      console.error('[CollaborativePlayer] Mobile playback failed - user may need to interact');
    }
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
    <div className="space-y-2">
      {/* Mobile interaction prompt */}
      {isMobileBrowser() && !settings.hasInteracted && (
        <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <span>📱</span>
          <span>Tap to enable audio playback</span>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-3">
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
    </div>
  );
}
