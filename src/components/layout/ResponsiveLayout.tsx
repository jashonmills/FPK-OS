/**
 * Responsive 4-column layout system for course content
 * Desktop: 3-column content + 1-column sidebar
 * Mobile: 1-column stacked layout
 */

import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  stickyToolbar?: ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  stickyToolbar,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sticky Toolbar */}
      {stickyToolbar && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          {stickyToolbar}
        </div>
      )}

      {/* Main Layout Container */}
      <div className={cn(
        "flex w-full",
        isMobile ? "flex-col" : "flex-row"
      )}>
        {/* Content Area - 3 columns on desktop, full width on mobile */}
        <main className={cn(
          "flex-1 min-w-0", // min-w-0 prevents flex item overflow
          isMobile ? "w-full" : "w-3/4 pr-4"
        )}>
          <div className={cn(
            "w-full",
            isMobile ? "px-4 py-2" : "px-6 py-4"
          )}>
            {children}
          </div>
        </main>

        {/* Sidebar - 1 column on desktop, stacked on mobile */}
        {sidebar && (
          <aside className={cn(
            "flex-shrink-0",
            isMobile 
              ? "w-full border-t border-border bg-muted/50" 
              : "w-1/4 border-l border-border"
          )}>
            <div className={cn(
              isMobile ? "px-4 py-3" : "px-4 py-4"
            )}>
              {sidebar}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ResponsiveLayout;