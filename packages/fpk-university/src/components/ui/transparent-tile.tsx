import React from 'react';
import { cn } from '@/lib/utils';

interface TransparentTileProps {
  children: React.ReactNode;
  className?: string;
}

export function TransparentTile({ children, className }: TransparentTileProps) {
  return (
    <div
      className={cn(
        // Use semantic tokens and mobile-first responsive design
        "org-tile backdrop-blur-sm rounded-lg border mobile-card-padding mobile-safe-text",
        className
      )}
    >
      {children}
    </div>
  );
}