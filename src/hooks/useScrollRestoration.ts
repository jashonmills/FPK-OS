import { useEffect } from 'react';
import { safeSessionStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

export function useScrollRestoration(storageKey: string) {
  const cleanup = useCleanup('useScrollRestoration');
  
  useEffect(() => {
    // Restore scroll position on mount
    const savedScrollY = safeSessionStorage.getItem<string>(storageKey, {
      fallbackValue: null,
      logErrors: false
    });
    if (savedScrollY) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      });
    }

    // Save scroll position before unmount or route change
    const saveScrollPosition = () => {
      safeSessionStorage.setItem(storageKey, String(window.scrollY), { logErrors: false });
    };

    // Save on route change
    const handleBeforeUnload = () => saveScrollPosition();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Save on scroll (debounced)
    let scrollTimeout: string | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        cleanup.cleanup(scrollTimeout);
      }
      scrollTimeout = cleanup.setTimeout(saveScrollPosition, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Save on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveScrollPosition();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (scrollTimeout) {
        cleanup.cleanup(scrollTimeout);
      }
      // Save final position
      saveScrollPosition();
    };
  }, [storageKey, cleanup]);
}