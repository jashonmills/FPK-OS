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
            <div className="relative h-screen flex w-full viewport-constrain overflow-hidden">
              {/* Background image layer */}
              <div className="fixed inset-0 z-0">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: isMobile ? 'scroll' : 'fixed'
                  }}
                />
                {/* Dark mode overlay */}
                <div className="absolute inset-0 bg-black dark-mode-overlay" />
              </div>

              {/* Main content with higher z-index */}
              <AppSidebar />
              <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
                <PersonalGlobalHeader />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                  <div className={cn(
                    "w-full min-h-full mobile-container",
                    isMobile ? "p-3 pb-20 pt-20" : "p-4 sm:p-6 lg:p-8 pt-20"
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