
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';

const DashboardLayout = () => {
  return (
    <VoiceSettingsProvider>
      <GamificationProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full overflow-x-hidden">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
              <GlobalHeader />
              <main className="flex-1 bg-gray-50 overflow-x-hidden">
                <div className="w-full h-full overflow-x-hidden">
                  <Outlet />
                </div>
              </main>
            </div>
            <GlobalChatWidget />
          </div>
        </SidebarProvider>
      </GamificationProvider>
    </VoiceSettingsProvider>
  );
};

export default DashboardLayout;
