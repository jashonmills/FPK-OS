
import React, { useEffect } from 'react';

interface EPUBReaderNavigationProps {
  isLoading: boolean;
  error: any;
  isNavigating: boolean;
  isInitialized: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onClose: () => void;
  readerRef: React.RefObject<HTMLDivElement>;
}

export const EPUBReaderNavigation: React.FC<EPUBReaderNavigationProps> = ({
  isLoading,
  error,
  isNavigating,
  isInitialized,
  onPrevPage,
  onNextPage,
  onClose,
  readerRef
}) => {
  // Add keyboard navigation
  useEffect(() => {
    if (isLoading || error || !isInitialized) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isNavigating) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          onPrevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          onNextPage();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, error, isNavigating, onPrevPage, onNextPage, onClose, isInitialized]);

  // Add touch/swipe navigation
  useEffect(() => {
    if (!readerRef.current || isLoading || error || !isInitialized) return;

    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY || isNavigating) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          onNextPage();
        } else {
          onPrevPage();
        }
      }
      
      startX = 0;
      startY = 0;
    };

    const container = readerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLoading, error, isNavigating, onPrevPage, onNextPage, isInitialized]);

  return null; // This component only handles navigation logic
};
