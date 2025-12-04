/**
 * Keyboard Shortcut Hint Banner
 * Shows at bottom of screen to inform users about help keyboard shortcut
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KeyboardShortcutHint() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenHint, setHasSeenHint] = useState(false);

  useEffect(() => {
    // Check if user has already seen this hint
    const seen = localStorage.getItem('keyboard-help-hint-seen');
    if (!seen) {
      // Show hint after 5 seconds on first visit
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    setHasSeenHint(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('keyboard-help-hint-seen', 'true');
    setHasSeenHint(true);
  };

  if (hasSeenHint || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
        <HelpCircle className="h-5 w-5 text-primary" />
        <div className="text-sm">
          <span className="font-medium">Tip:</span> Press{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">?</kbd>
          {' '}or{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+/</kbd>
          {' '}to open the Platform Guide
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
