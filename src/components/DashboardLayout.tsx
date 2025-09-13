
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import ErrorBoundaryUnified from '@/components/ErrorBoundaryUnified';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { OrgProvider } from '@/components/organizations/OrgContext';
import { OrgThemeProvider } from '@/components/theme/OrgThemeProvider';

const DashboardLayout: React.FC = () => {
  return (
    <ErrorBoundaryUnified>
      <VoiceSettingsProvider>
        <GamificationProvider>
          <OrgProvider>
            <OrgThemeProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full overflow-x-hidden">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                    <GlobalHeader />
                    <main className="flex-1 bg-gray-50 mobile-scroll-container">
                      <div className="w-full h-full mobile-container pb-28 sm:pb-0 pr-16 sm:pr-0 py-3 sm:py-4 md:py-6 lg:py-8">
                        <ErrorBoundaryUnified resetOnPropsChange={true}>
                          <Outlet />
                        </ErrorBoundaryUnified>
                      </div>
                    </main>
                  </div>
                  <GlobalChatWidget />
                </div>
              </SidebarProvider>
            </OrgThemeProvider>
          </OrgProvider>
        </GamificationProvider>
      </VoiceSettingsProvider>
    </ErrorBoundaryUnified>
  );
};

export default DashboardLayout;
