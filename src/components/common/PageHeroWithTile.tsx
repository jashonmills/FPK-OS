import React from 'react';
import { cn } from '@/lib/utils';
import { PageHelpTrigger } from './PageHelpTrigger';

interface PageHeroWithTileProps {
  title: string;
  subtitle?: string;
  onHelpClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeroWithTile({ 
  title, 
  subtitle, 
  onHelpClick,
  className,
  children 
}: PageHeroWithTileProps) {
  return (
    <div className={cn("pt-24 pb-8", className)}>
      <div className="bg-background/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-border/20 shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold text-foreground text-center">
            {title}
          </h1>
          {onHelpClick && (
            <PageHelpTrigger onOpen={onHelpClick} />
          )}
        </div>
        {subtitle && (
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
