
import React from 'react';
import { useOptimizedAccessibility } from '@/hooks/useOptimizedAccessibility';
import AccessibilityErrorBoundary from '@/components/accessibility/AccessibilityErrorBoundary';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProviderContent: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { error } = useOptimizedAccessibility();

  if (error) {
    console.warn('Accessibility Provider Error:', error);
  }

  return <>{children}</>;
};

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  return (
    <AccessibilityErrorBoundary>
      <AccessibilityProviderContent>
        {children}
      </AccessibilityProviderContent>
    </AccessibilityErrorBoundary>
  );
};

export default AccessibilityProvider;
