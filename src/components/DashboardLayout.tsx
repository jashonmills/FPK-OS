
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header that extends to sidebar edge */}
        <div className="sticky top-0 z-50 w-full">
          <div className={`
            transition-all duration-200 ease-linear
            ${state === "expanded" 
              ? "pl-[var(--sidebar-width)]" 
              : "pl-0"
            }
          `}>
            <GlobalHeader />
          </div>
        </div>
        
        {/* Main content area */}
        <main className={`
          flex-1 overflow-auto transition-all duration-200 ease-linear
          ${state === "expanded" 
            ? "pl-[var(--sidebar-width)]" 
            : "pl-0"
          }
        `}>
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
