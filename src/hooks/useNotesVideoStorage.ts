import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useNotesVideoStorage() {
  const [hasSeenVideo, setHasSeenVideo] = useLocalStorage('notes_intro_seen', false);

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