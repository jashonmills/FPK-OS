/**
 * Hook for managing media playback progress with persistence
 * Stores and restores playback position per course/module
 */

import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { logger } from '@/utils/logger';

interface MediaProgressData {
  currentTime: number;
  duration: number;
  completed: boolean;
  lastUpdated: number;
}

interface UseMediaProgressProps {
  mediaId: string; // Unique identifier (courseId-moduleId)
  onProgressUpdate?: (progress: MediaProgressData) => void;
}

export const useMediaProgress = ({ mediaId, onProgressUpdate }: UseMediaProgressProps) => {
  const [savedProgress, setSavedProgress] = useState<MediaProgressData | null>(null);

  // Load saved progress from localStorage
  useEffect(() => {
    if (!mediaId) return;
    
    try {
      const saved = safeLocalStorage.getItem<string>(`media-progress-${mediaId}`, { fallbackValue: null });
      if (saved) {
        const progressData = JSON.parse(saved) as MediaProgressData;
        setSavedProgress(progressData);
        logger.debug(`Loaded saved progress for ${mediaId}`, 'MEDIA', progressData);
      }
    } catch (error) {
      logger.warn(`Error loading media progress for ${mediaId}`, 'MEDIA', error);
    }
  }, [mediaId]);

  // Save progress to localStorage
  const saveProgress = useCallback((currentTime: number, duration: number, completed = false) => {
    if (!mediaId || duration === 0) return;

    const progressData: MediaProgressData = {
      currentTime,
      duration,
      completed,
      lastUpdated: Date.now()
    };

    try {
      safeLocalStorage.setItem(`media-progress-${mediaId}`, JSON.stringify(progressData));
      setSavedProgress(progressData);
      onProgressUpdate?.(progressData);
      
      // Only log significant progress updates (every 30 seconds or completion)
      if (completed || Math.floor(currentTime) % 30 === 0) {
        logger.debug(`Saved progress for ${mediaId}`, 'MEDIA', {
          progress: `${Math.floor((currentTime / duration) * 100)}%`,
          time: `${Math.floor(currentTime)}s / ${Math.floor(duration)}s`,
          completed
        });
      }
    } catch (error) {
      logger.warn('Error saving media progress', 'MEDIA', error);
    }
  }, [mediaId, onProgressUpdate]);

  // Get resume time (with 5-second buffer to avoid jumping)
  const getResumeTime = useCallback(() => {
    if (!savedProgress || savedProgress.completed) return 0;
    
    // Resume 5 seconds before last position
    const resumeTime = Math.max(0, savedProgress.currentTime - 5);
    return resumeTime;
  }, [savedProgress]);

  // Mark as completed
  const markCompleted = useCallback(() => {
    if (!savedProgress) return;
    
    saveProgress(savedProgress.currentTime, savedProgress.duration, true);
  }, [savedProgress, saveProgress]);

  // Clear saved progress
  const clearProgress = useCallback(() => {
    if (!mediaId) return;
    
    try {
      safeLocalStorage.removeItem(`media-progress-${mediaId}`);
      setSavedProgress(null);
      logger.debug(`Cleared progress for ${mediaId}`, 'MEDIA');
    } catch (error) {
      logger.warn('Error clearing media progress', 'MEDIA', error);
    }
  }, [mediaId]);

  return {
    savedProgress,
    saveProgress,
    getResumeTime,
    markCompleted,
    clearProgress
  };
};