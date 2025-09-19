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
        "bg-orange-500/70 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50",
        className
      )}
    >
      {children}
    </div>
  );
}