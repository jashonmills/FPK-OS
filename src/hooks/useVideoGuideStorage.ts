import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useVideoGuideStorage = () => {
  const [hasSeenVideo, setHasSeenVideo] = useLocalStorage('signup-video-guide-seen', false);
  const [shouldShowAuto, setShouldShowAuto] = useState(false);

  // Check if we should show the modal automatically
  useEffect(() => {
    if (!hasSeenVideo) {
      setShouldShowAuto(true);
    }
  }, [hasSeenVideo]);

  const markVideoAsSeen = () => {
    setHasSeenVideo(true);
    setShouldShowAuto(false);
  };

  const showManually = () => {
    setShouldShowAuto(true);
  };

  return {
    hasSeenVideo,
    shouldShowAuto,
    markVideoAsSeen,
    showManually,
  };
};