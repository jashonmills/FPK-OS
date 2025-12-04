/**
 * Mobile-Safe UI Components
 * Pre-configured components that handle mobile responsiveness automatically
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Mobile-safe button with proper touch targets and text handling
 */
interface MobileSafeButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const MobileSafeButton: React.FC<MobileSafeButtonProps> = ({
  children,
  className,
  size,
  ...props
}) => {
  return (
    <Button
      {...props}
      size={size || 'default'}
      className={cn('mobile-safe-text', className)}
    >
      <span className="truncate flex items-center gap-2">
        {children}
      </span>
    </Button>
  );
};

/**
 * Mobile-safe input with proper sizing
 */
export const MobileSafeInput: React.FC<React.ComponentProps<"input">> = ({
  className,
  ...props
}) => {
  return (
    <Input
      {...props}
      className={cn('mobile-input mobile-safe-text', className)}
    />
  );
};

/**
 * Mobile-responsive form row
 */
interface MobileFormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileFormRow: React.FC<MobileFormRowProps> = ({
  children,
  className
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'flex gap-2',
      isMobile ? 'flex-col' : 'flex-row items-center',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Mobile-safe text wrapper that handles overflow
 */
interface MobileSafeTextProps {
  children: React.ReactNode;
  className?: string;
  truncate?: boolean;
}

export const MobileSafeText: React.FC<MobileSafeTextProps> = ({
  children,
  className,
  truncate = false
}) => {
  return (
    <span className={cn(
      'mobile-safe-text',
      truncate && 'truncate',
      className
    )}>
      {children}
    </span>
  );
};

/**
 * Mobile-responsive icon button wrapper
 */
interface MobileIconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label?: string;
  showLabelOnMobile?: boolean;
}

export const MobileIconButton: React.FC<MobileIconButtonProps> = ({
  icon,
  label,
  showLabelOnMobile = false,
  className,
  ...props
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      {...props}
      size={isMobile ? 'default' : props.size || 'default'}
      className={cn('mobile-touch-target', className)}
    >
      <span className="flex items-center gap-2">
        <span className="flex-shrink-0">{icon}</span>
        {label && (showLabelOnMobile || !isMobile) && (
          <MobileSafeText truncate>{label}</MobileSafeText>
        )}
      </span>
    </Button>
  );
};

/**
 * Mobile-responsive action bar for cards/sections
 */
interface MobileActionBarProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  children,
  className,
  fullWidth = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'flex gap-2',
      isMobile || fullWidth ? 'flex-col' : 'flex-row',
      '[&>*]:flex-1',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Mobile-responsive grid container
 */
interface MobileGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 }
}) => {
  const { mobile = 1, tablet = 2, desktop = 3 } = columns;
  
  return (
    <div className={cn(
      `grid gap-3 sm:gap-4 lg:gap-6`,
      `grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`,
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Mobile-safe card with proper spacing and overflow handling
 */
interface MobileSafeCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  compact?: boolean;
}

export const MobileSafeCard: React.FC<MobileSafeCardProps> = ({
  children,
  className,
  interactive = false,
  compact = false
}) => {
  return (
    <div className={cn(
      'mobile-card mobile-safe-text',
      compact ? 'mobile-card-compact' : 'mobile-card-padding',
      interactive && 'mobile-card-interactive',
      className
    )}>
      {children}
    </div>
  );
};

export default {
  Button: MobileSafeButton,
  Input: MobileSafeInput,
  FormRow: MobileFormRow,
  Text: MobileSafeText,
  IconButton: MobileIconButton,
  ActionBar: MobileActionBar,
  Grid: MobileGrid,
  Card: MobileSafeCard,
};