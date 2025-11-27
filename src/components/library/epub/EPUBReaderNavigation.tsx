
import React, { useEffect } from 'react';
import { useCleanup } from '@/utils/cleanupManager';

interface EPUBReaderNavigationProps {
  isLoading: boolean;
  error: string | null;
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
  const cleanup = useCleanup('EPUBReaderNavigation');
  // Add keyboard navigation that doesn't interfere with scrolling
  useEffect(() => {
    if (isLoading || error || !isInitialized) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isNavigating) return;
      
      // Only handle navigation keys, not scroll-related keys
      switch (event.key) {
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          onPrevPage();
          break;
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          onNextPage();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        // Allow arrow up/down and space for scrolling within content
        // Don't prevent these events
      }
    };

    cleanup.addEventListener(document, 'keydown', handleKeyDown);
  }, [isLoading, error, isNavigating, onPrevPage, onNextPage, onClose, isInitialized]);

  // Add enhanced touch/swipe navigation that respects scrolling
  useEffect(() => {
    if (!readerRef.current || isLoading || error || !isInitialized) return;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const deltaX = Math.abs(startX - currentX);
      const deltaY = Math.abs(startY - currentY);
      
      // Detect if user is scrolling vertically
      if (deltaY > deltaX && deltaY > 10) {
        isScrolling = true;
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY || isNavigating || isScrolling) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // Only trigger page navigation for horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          onNextPage();
        } else {
          onPrevPage();
        }
      }
      
      startX = 0;
      startY = 0;
      isScrolling = false;
    };

    const container = readerRef.current;
    cleanup.addEventListener(container, 'touchstart', handleTouchStart);
    cleanup.addEventListener(container, 'touchmove', handleTouchMove);
    cleanup.addEventListener(container, 'touchend', handleTouchEnd);
  }, [isLoading, error, isNavigating, onPrevPage, onNextPage, isInitialized]);

  return null; // This component only handles navigation logic
};
