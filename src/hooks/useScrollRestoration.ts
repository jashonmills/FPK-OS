import { useEffect } from 'react';

export function useScrollRestoration(storageKey: string) {
  useEffect(() => {
    // Restore scroll position on mount
    const savedScrollY = sessionStorage.getItem(storageKey);
    if (savedScrollY) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      });
    }

    // Save scroll position before unmount or route change
    const saveScrollPosition = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    // Save on route change
    const handleBeforeUnload = () => saveScrollPosition();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Save on scroll (debounced)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 200);
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
      saveScrollPosition();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(scrollTimeout);
    };
  }, [storageKey]);
}