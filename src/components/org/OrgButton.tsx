import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * OrgButton - Standardized button component for organization pages
 * Ensures proper text contrast on dark/purple backgrounds by using !important
 * to override the org-tile color inheritance rules
 */
export const OrgButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    // For dark variants (default/primary), force white text with !important
    const isDarkVariant = variant === "default" || variant === "destructive";
    
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          isDarkVariant && "[&]:!text-white [&_*]:!text-white hover:[&]:!text-white hover:[&_*]:!text-white",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

OrgButton.displayName = "OrgButton";
