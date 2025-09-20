
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import ErrorBoundaryUnified from '@/components/ErrorBoundaryUnified';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { OrgProvider } from '@/components/organizations/OrgContext';
import { OrgThemeProvider } from '@/components/theme/OrgThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { initializeNavigation } from '@/utils/navigation';

const DashboardLayout: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Initialize global navigation for class components
  useEffect(() => {
    initializeNavigation(navigate);
  }, [navigate]);
  return (
    <ErrorBoundaryUnified>
      <VoiceSettingsProvider>
        <GamificationProvider>
          <OrgProvider>
            <OrgThemeProvider>
              <SidebarProvider>
                <div 
                  className="min-h-screen flex w-full overflow-x-hidden"
                  style={{
                    backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                  }}
                >
                  <AppSidebar />
                  <div className={cn(
                    "flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 viewport-constrain",
                    isMobile && isChatOpen && "brightness-50 pointer-events-none"
                  )}>
                    <GlobalHeader />
                    <main className="flex-1 mobile-scroll-container overflow-x-hidden">
                      <div className={cn(
                        "w-full h-full mobile-container viewport-constrain",
                        isMobile ? "px-3 py-3 pb-20" : "px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 pr-16 sm:pr-0"
                      )}>
                        <ErrorBoundaryUnified resetOnPropsChange={true}>
                          <div className="mobile-content-width">
                            <Outlet />
                          </div>
                        </ErrorBoundaryUnified>
                      </div>
                    </main>
                  </div>
                  <GlobalChatWidget onOpenChange={setIsChatOpen} />
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
