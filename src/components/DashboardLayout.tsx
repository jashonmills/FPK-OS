
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';

const DashboardLayout = () => {
  return (
    <ErrorBoundary>
      <VoiceSettingsProvider>
        <GamificationProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset className="flex flex-col">
                <GlobalHeader />
                <main className="flex-1 bg-gray-50 mobile-scroll-container">
                  <div className="w-full h-full mobile-container py-3 sm:py-4 md:py-6 lg:py-8">
                    <ErrorBoundary>
                      <Outlet />
                    </ErrorBoundary>
                  </div>
                </main>
              </SidebarInset>
              <GlobalChatWidget />
            </div>
          </SidebarProvider>
        </GamificationProvider>
      </VoiceSettingsProvider>
    </ErrorBoundary>
  );
};

export default DashboardLayout;
