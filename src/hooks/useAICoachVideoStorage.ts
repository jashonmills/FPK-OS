import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useAICoachVideoStorage() {
  const [hasSeenVideo, setHasSeenVideo] = useLocalStorage('ai-coach-video-guide-seen', false);

  const shouldShowAuto = () => {
    return !hasSeenVideo;
  };

  const markVideoAsSeen = () => {
    setHasSeenVideo(true);
  };

  const showManually = () => {
    // This doesn't change the storage state, just allows manual opening
    return true;
  };

  return {
    hasSeenVideo,
    shouldShowAuto,
    markVideoAsSeen,
    showManually
  };
}