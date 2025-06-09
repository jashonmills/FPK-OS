
import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAccessibility } from '@/hooks/useAccessibility';
import GlobalHeader from '@/components/GlobalHeader';
import DualLanguageText from '@/components/DualLanguageText';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardContent = ({ children }: DashboardLayoutProps) => {
  const { getAccessibilityClasses } = useAccessibility();
  const { state } = useSidebar();
  
  return (
    <div className={`min-h-screen flex w-full ${getAccessibilityClasses('container')}`}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header that spans full width */}
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Left side - Sidebar trigger and brand */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:text-primary" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FPK</span>
                </div>
                <span className="font-semibold text-lg">
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
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-md text-sm"
                />
              </div>
            </div>

            {/* Right side - placeholder for now */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <DualLanguageText translationKey="common.userMenu" />
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content area - no padding, direct adjacency to sidebar */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;
