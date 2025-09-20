import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import PersonalGlobalHeader from '@/components/PersonalGlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import ErrorBoundaryUnified from '@/components/ErrorBoundaryUnified';
import { initializeNavigation } from '@/utils/navigation';

/**
 * Personal Dashboard Layout - For personal/learner dashboard routes
 * Does NOT include OrgProvider to avoid context conflicts
 */
export function PersonalDashboardLayout() {
  const navigate = useNavigate();

  // Initialize global navigation for class components
  useEffect(() => {
    initializeNavigation(navigate);
  }, [navigate]);

  return (
    <ErrorBoundaryUnified>
      <VoiceSettingsProvider>
        <GamificationProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <PersonalGlobalHeader />
                <main 
                  className="flex-1 overflow-y-auto bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/lovable-uploads/96c1eb71-eb9e-463d-bacd-5fcdfb5e1e65.png')`
                  }}
                >
                  <div className="w-full h-full p-4 sm:p-6 lg:p-8">
                    <Outlet />
                  </div>
                </main>
              </div>
            </div>
            <GlobalChatWidget />
          </SidebarProvider>
        </GamificationProvider>
      </VoiceSettingsProvider>
    </ErrorBoundaryUnified>
  );
}