
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAccessibility } from '@/hooks/useAccessibility';
import GlobalHeader from '@/components/GlobalHeader';
import DualLanguageText from '@/components/DualLanguageText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import GlobalChatWidget from '@/components/GlobalChatWidget';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

const DashboardContent = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const { state } = useSidebar();
  
  // Apply accessibility classes to the entire dashboard
  const dashboardClasses = getAccessibilityClasses('container');
  console.log('🏠 DashboardLayout: Applied classes:', dashboardClasses);
  
  return (
    <div className={`min-h-screen flex w-full ${dashboardClasses} accessibility-mobile-override`}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header that spans full width */}
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className={`flex h-16 items-center justify-between px-4 ${getAccessibilityClasses('container')}`}>
            {/* Left side - Sidebar trigger and brand */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:text-primary" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FPK</span>
                </div>
                <span className={`font-semibold text-lg ${getAccessibilityClasses('text')}`}>
                  <DualLanguageText translationKey="common.learnerPortal" />
                </span>
              </div>
            </div>

            {/* Header content from GlobalHeader */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                  🔍
                </div>
                <input
                  placeholder="Search courses, goals..."
                  className={`w-full pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-md text-sm ${getAccessibilityClasses('text')}`}
                />
              </div>
            </div>

            {/* Right side - Notifications, Language switcher and user menu */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <NotificationDropdown />
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              <span className={`text-sm text-muted-foreground ${getAccessibilityClasses('text')}`}>
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
