
import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAccessibility } from '@/hooks/useAccessibility';
import GlobalHeader from '@/components/GlobalHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardContent = ({ children }: DashboardLayoutProps) => {
  const { getAccessibilityClasses } = useAccessibility();
  const { state } = useSidebar();
  
  return (
    <div className={`min-h-screen flex w-full ${getAccessibilityClasses('container')}`}>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Responsive Global Header */}
        <div className={`
          sticky top-0 z-50 w-full 
          transition-all duration-200 ease-linear
          ${state === "collapsed" 
            ? "ml-0" 
            : "ml-0 md:ml-[var(--sidebar-width)]"
          }
        `}>
          <GlobalHeader />
        </div>
        
        {/* Main content area */}
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
