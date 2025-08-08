/**
 * Performance-optimized provider architecture
 * Combines related providers to reduce nesting and improve performance
 */

import React, { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/hooks/useAuth';
import { ConsentProvider } from '@/hooks/useConsent';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import AccessibilityProvider from '@/components/AccessibilityProvider';
import i18n from '@/i18n';
import { logger } from '@/utils/logger';

interface AppProvidersProps {
  children: ReactNode;
}

// Create optimized query client with better defaults
const createQueryClient = () => {
  logger.performance('Creating optimized QueryClient');
  
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

// Memoized query client to prevent recreation
const queryClient = createQueryClient();

/**
 * Core Data Providers - Authentication and API
 * These providers handle the core data layer
 */
const CoreDataProviders: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConsentProvider>
          {children}
        </ConsentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
});

/**
 * User Experience Providers - UI and Interaction
 * These providers handle user experience and interaction states
 */
const UserExperienceProviders: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  return (
    <GamificationProvider>
      <VoiceSettingsProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AccessibilityProvider>
      </VoiceSettingsProvider>
    </GamificationProvider>
  );
});

/**
 * Internationalization Provider - Localization
 * Separate provider for i18n to optimize bundle splitting
 */
const InternationalizationProvider: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
});

/**
 * Router Provider - Navigation
 * Separate provider for routing to optimize performance
 */
const RouterProvider: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
});

/**
 * Combined App Providers
 * Optimized provider composition with proper memoization
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <CoreDataProviders>
      <InternationalizationProvider>
        <UserExperienceProviders>
          <RouterProvider>
            {memoizedChildren}
          </RouterProvider>
        </UserExperienceProviders>
      </InternationalizationProvider>
    </CoreDataProviders>
  );
};

export default AppProviders;