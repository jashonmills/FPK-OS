/**
 * Mobile layout utility components and helpers
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Wrapper component that applies mobile-safe constraints
 */
export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const isMobile = useIsMobile();
  
  const paddingClasses = {
    none: '',
    sm: isMobile ? 'p-2' : 'p-3',
    md: isMobile ? 'p-3' : 'p-4 sm:p-6',
    lg: isMobile ? 'p-4' : 'p-6 sm:p-8'
  };

  return (
    <div className={cn(
      'mobile-container viewport-constrain',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

interface MobileButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  stacked?: boolean;
}

/**
 * Button group that stacks on mobile
 */
export const MobileButtonGroup: React.FC<MobileButtonGroupProps> = ({
  children,
  className = '',
  stacked = true
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      'flex gap-2',
      isMobile && stacked ? 'flex-col' : 'flex-row',
      'mobile-button-group',
      className
    )}>
      {children}
    </div>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  compactPadding?: boolean;
}

/**
 * Card component optimized for mobile
 */
export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  compactPadding = false
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      'bg-card text-card-foreground rounded-lg border shadow-sm',
      compactPadding 
        ? (isMobile ? 'p-3' : 'p-4') 
        : (isMobile ? 'p-4' : 'p-6'),
      'mobile-card-container',
      className
    )}>
      {children}
    </div>
  );
};

interface MobileGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

/**
 * Responsive grid that adjusts for mobile
 */
export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  columns = 3,
  className = ''
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
  };

  return (
    <div className={cn(
      gridClasses[columns as keyof typeof gridClasses] || gridClasses[3],
      'mobile-responsive-grid',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Hook for mobile-aware responsive values
 */
export const useMobileResponsive = () => {
  const isMobile = useIsMobile();

  return {
    isMobile,
    spacing: isMobile ? 'space-y-3' : 'space-y-4 md:space-y-6',
    padding: isMobile ? 'p-3' : 'p-4 sm:p-6',
    text: {
      title: isMobile ? 'text-lg font-bold' : 'text-xl sm:text-2xl font-bold',
      subtitle: isMobile ? 'text-sm' : 'text-base',
      body: isMobile ? 'text-sm' : 'text-base'
    },
    button: {
      size: isMobile ? 'sm' : 'default',
      className: isMobile ? 'h-10 px-4 text-sm' : ''
    }
  };
};