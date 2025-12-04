/**
 * UI Polish Provider - Ensures consistent spacing and responsive behavior
 * Provides global UI polish utilities and responsive container patterns
 */

import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface UIPolishProviderProps {
  children: ReactNode;
}

interface PolishedContainerProps {
  children: ReactNode;
  variant?: 'page' | 'card' | 'section' | 'content';
  className?: string;
}

interface PolishedSpacingProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal' | 'both';
  className?: string;
}

// Main provider component
export const UIPolishProvider: React.FC<UIPolishProviderProps> = ({ children }) => {
  return (
    <div className="ui-polish-provider">
      {children}
    </div>
  );
};

// Polished container with consistent spacing patterns
export const PolishedContainer: React.FC<PolishedContainerProps> = ({
  children,
  variant = 'content',
  className
}) => {
  const isMobile = useIsMobile();

  const getVariantClasses = () => {
    const base = isMobile ? 'px-4' : 'px-6';
    
    switch (variant) {
      case 'page':
        return cn(
          base,
          isMobile ? 'py-4' : 'py-6',
          'max-w-7xl mx-auto'
        );
      case 'card':
        return cn(
          isMobile ? 'p-4' : 'p-6',
          'bg-card rounded-lg border'
        );
      case 'section':
        return cn(
          base,
          isMobile ? 'py-6' : 'py-8'
        );
      case 'content':
        return cn(
          base,
          isMobile ? 'py-3' : 'py-4'
        );
      default:
        return base;
    }
  };

  return (
    <div className={cn(getVariantClasses(), className)}>
      {children}
    </div>
  );
};

// Consistent spacing component
export const PolishedSpacing: React.FC<PolishedSpacingProps> = ({
  children,
  size = 'md',
  direction = 'vertical',
  className
}) => {
  const isMobile = useIsMobile();

  const getSpacingClasses = () => {
    const spacingMap = {
      xs: isMobile ? 'gap-2' : 'gap-3',
      sm: isMobile ? 'gap-3' : 'gap-4',
      md: isMobile ? 'gap-4' : 'gap-6',
      lg: isMobile ? 'gap-6' : 'gap-8',
      xl: isMobile ? 'gap-8' : 'gap-12'
    };

    const directionClass = direction === 'horizontal' 
      ? 'flex flex-row' 
      : direction === 'both' 
        ? 'grid gap-4' 
        : 'flex flex-col';

    return cn(directionClass, spacingMap[size]);
  };

  return (
    <div className={cn(getSpacingClasses(), className)}>
      {children}
    </div>
  );
};

// Responsive text sizing
export const PolishedText: React.FC<{
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  className?: string;
}> = ({ children, variant = 'body', className }) => {
  const isMobile = useIsMobile();

  const getTextClasses = () => {
    const variants = {
      h1: isMobile ? 'text-2xl font-bold' : 'text-4xl font-bold',
      h2: isMobile ? 'text-xl font-semibold' : 'text-2xl font-semibold',
      h3: isMobile ? 'text-lg font-semibold' : 'text-xl font-semibold',
      h4: isMobile ? 'text-base font-medium' : 'text-lg font-medium',
      body: isMobile ? 'text-sm' : 'text-base',
      caption: isMobile ? 'text-xs' : 'text-sm'
    };

    return variants[variant];
  };

  const Tag = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Tag className={cn(getTextClasses(), className)}>
      {children}
    </Tag>
  );
};

export default UIPolishProvider;