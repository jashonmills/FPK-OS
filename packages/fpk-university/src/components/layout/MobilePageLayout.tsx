/**
 * Mobile-First Page Layout Component
 * Standardizes mobile-responsive page layouts across the application
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContextualHelpButton } from '@/components/common/ContextualHelpButton';
import { Menu } from 'lucide-react';

interface MobilePageLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'full-width';
  padding?: 'default' | 'compact' | 'large';
}

export const MobilePageLayout: React.FC<MobilePageLayoutProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'default'
}) => {
  const isMobile = useIsMobile();

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'mobile-container py-2 sm:py-4';
      case 'full-width':
        return 'w-full px-2 py-2 sm:px-4 sm:py-4';
      default:
        return 'mobile-page-container';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'compact':
        return 'mobile-section-spacing';
      case 'large':
        return 'space-y-6 sm:space-y-8 md:space-y-10';
      default:
        return 'mobile-section-spacing';
    }
  };

  return (
    <div className={cn(getVariantClasses(), className)}>
      <div className={getPaddingClasses()}>
        {children}
      </div>
    </div>
  );
};

interface MobileCardLayoutProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export const MobileCardLayout: React.FC<MobileCardLayoutProps> = ({
  children,
  className,
  interactive = false
}) => {
  return (
    <div
      className={cn(
        'mobile-card mobile-card-padding mobile-safe-text',
        interactive && 'mobile-card-interactive',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileButtonGroupProps {
  children: ReactNode;
  className?: string;
  stacked?: boolean;
  fullWidth?: boolean;
}

export const MobileButtonGroup: React.FC<MobileButtonGroupProps> = ({
  children,
  className,
  stacked = false,
  fullWidth = false
}) => {
  const isMobile = useIsMobile();
  const shouldStack = stacked || isMobile;

  return (
    <div
      className={cn(
        'flex gap-2',
        shouldStack ? 'flex-col' : 'flex-col sm:flex-row sm:gap-3',
        fullWidth && 'w-full',
        '[&>*]:flex-1',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileSectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  helpSection?: string; // For contextual help deep linking
  showMenuButton?: boolean;
  onMenuToggle?: () => void;
}

export const MobileSectionHeader: React.FC<MobileSectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
  helpSection,
  showMenuButton,
  onMenuToggle
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn('mobile-stack', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="mobile-stack flex-1">
          <div className="flex items-center gap-3">
            {isMobile && showMenuButton && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h1 className="mobile-heading-xl mobile-safe-text">{title}</h1>
            {helpSection && (
              <ContextualHelpButton section={helpSection} size="icon" variant="ghost" />
            )}
          </div>
          {subtitle && (
            <p className="mobile-text-base text-muted-foreground mobile-safe-text">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePageLayout;