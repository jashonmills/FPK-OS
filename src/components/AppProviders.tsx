import React, { ReactNode } from 'react';
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
import { BaseError } from '@/types/errors';

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
        retry: (failureCount, error: BaseError) => {
          // Don't retry on 4xx errors
          if (error?.status && error.status >= 400 && error.status < 500) {
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
 * Simplified App Providers
 * Removed complex memoization to fix React context issues
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConsentProvider>
          <GamificationProvider>
            <VoiceSettingsProvider>
              <AccessibilityProvider>
                <TooltipProvider>
                  <I18nextProvider i18n={i18n}>
                    <BrowserRouter>
                      {children}
                    </BrowserRouter>
                  </I18nextProvider>
                </TooltipProvider>
              </AccessibilityProvider>
            </VoiceSettingsProvider>
          </GamificationProvider>
        </ConsentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;