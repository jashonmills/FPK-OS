
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAccessibility } from '@/hooks/useAccessibility';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { getAccessibilityClasses } = useAccessibility();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${getAccessibilityClasses('container')}`}>
        <AppSidebar />
        <main className="flex-1">
          <div className={`border-b px-6 py-4 ${getAccessibilityClasses('card')}`}>
            <div className="flex items-center">
              <SidebarTrigger className="hover:text-primary" />
            </div>
          </div>
          <div className="overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
