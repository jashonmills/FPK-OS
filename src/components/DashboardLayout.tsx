
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';
import GlobalHeader from '@/components/GlobalHeader';
import DualLanguageText from '@/components/DualLanguageText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

const DashboardContent = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  
  // Apply accessibility classes to the entire dashboard
  const dashboardClasses = getAccessibilityClasses('container');
  console.log('🏠 DashboardLayout: Applied classes:', dashboardClasses);
  
  return (
    <div className={`min-h-screen flex w-full ${dashboardClasses} accessibility-mobile-override`}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header that spans full width */}
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className={`flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 ${getAccessibilityClasses('container')}`}>
            {/* Left side - Sidebar trigger and brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger className="hover:text-primary h-8 w-8 sm:h-auto sm:w-auto" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 fpk-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">FPK</span>
                </div>
                <span className={`font-semibold text-base sm:text-lg ${getAccessibilityClasses('text')}`}>
                  <DualLanguageText translationKey="common.learnerPortal" />
                </span>
              </div>
              {/* Mobile brand */}
              <div className="sm:hidden flex items-center gap-2">
                <div className="w-6 h-6 fpk-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">FPK</span>
                </div>
                <span className={`font-semibold text-sm ${getAccessibilityClasses('text')}`}>
                  Learner Portal
                </span>
              </div>
            </div>

            {/* Header content from GlobalHeader - Hidden on mobile */}
            <div className="flex-1 max-w-sm mx-3 sm:mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground">
                  🔍
                </div>
                <input
                  placeholder="Search courses, goals..."
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-muted/50 border border-input rounded-md text-xs sm:text-sm ${getAccessibilityClasses('text')}`}
                />
              </div>
            </div>

            {/* Right side - Notifications, Language switcher and user menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications */}
              <NotificationDropdown />
              
              {/* Language Switcher - Hidden on mobile */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              
              <span className={`text-xs sm:text-sm text-muted-foreground hidden sm:inline ${getAccessibilityClasses('text')}`}>
                <DualLanguageText translationKey="common.userMenu" />
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content area with accessibility classes */}
        <main className={`flex-1 overflow-auto ${dashboardClasses} accessibility-mobile-override`}>
          <Outlet />
        </main>
      </div>

      {/* Global Chat Widget */}
      <GlobalChatWidget />
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;
