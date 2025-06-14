
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import { GamificationProvider } from '@/contexts/GamificationContext';

const DashboardLayout = () => {
  return (
    <GamificationProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <GlobalHeader />
            <main className="flex-1 overflow-auto bg-gray-50">
              <Outlet />
            </main>
          </div>
          <GlobalChatWidget />
        </div>
      </SidebarProvider>
    </GamificationProvider>
  );
};

export default DashboardLayout;
