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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/**
 * Personal Dashboard Layout - For personal/learner dashboard routes
 * Does NOT include OrgProvider to avoid context conflicts
 */
export function PersonalDashboardLayout() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Initialize global navigation for class components
  useEffect(() => {
    initializeNavigation(navigate);
  }, [navigate]);

  return (
    <ErrorBoundaryUnified>
      <VoiceSettingsProvider>
        <GamificationProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full viewport-constrain">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                <PersonalGlobalHeader />
                <main 
                  className="flex-1 mobile-scroll-container overflow-x-hidden"
                  style={{
                    backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: isMobile ? 'scroll' : 'fixed'
                  }}
                >
                  <div className={cn(
                    "w-full h-full mobile-container viewport-constrain",
                    isMobile ? "p-3 pb-20" : "p-4 sm:p-6 lg:p-8"
                  )}>
                    <div className="mobile-content-width">
                      <Outlet />
                    </div>
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