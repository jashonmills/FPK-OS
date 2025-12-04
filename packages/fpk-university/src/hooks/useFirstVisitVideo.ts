import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useFirstVisitVideo(storageKey: string) {
  const [hasSeenVideo, setHasSeenVideo] = useLocalStorage(storageKey, false);

  const shouldShowAuto = () => {
    return !hasSeenVideo;
  };

  const markVideoAsSeen = () => {
    setHasSeenVideo(true);
  };

  return {
    hasSeenVideo,
    shouldShowAuto,
    markVideoAsSeen
  };
}